const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');

const app = express();
const PORT = 3000;

// IP du miner : env MINER_IP ou fichier data/config.json
function getMinerIp() {
  if (process.env.MINER_IP) return process.env.MINER_IP.trim();
  try {
    const p = path.join(__dirname, 'data', 'config.json');
    if (fs.existsSync(p)) {
      const j = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (j.minerIp) return j.minerIp.trim();
    }
  } catch (_) {}
  return '192.168.1.37';
}

// Normalise la réponse /api/system/info : alias snake_case → camelCase pour que le dashboard reçoive toujours les mêmes clés
function normalizeMinerInfo(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  const v = (...keys) => {
    for (const k of keys) {
      const x = raw[k];
      if (x !== undefined && x !== null) return x;
    }
    return undefined;
  };
  const out = { ...raw };
  out.hashRate = v('hashRate', 'hashrate');
  out.hashRate_1m = v('hashRate_1m', 'hashrate_1m');
  out.hashRate_10m = v('hashRate_10m', 'hashrate_10m');
  out.hashRate_1h = v('hashRate_1h', 'hashrate_1h');
  out.expectedHashrate = v('expectedHashrate', 'expected_hashrate');
  out.sharesAccepted = v('sharesAccepted', 'shares_accepted');
  out.sharesRejected = v('sharesRejected', 'shares_rejected');
  out.sharesRejectedReasons = v('sharesRejectedReasons', 'shares_rejected_reasons');
  out.bestDiff = v('bestDiff', 'best_diff');
  out.bestSessionDiff = v('bestSessionDiff', 'best_session_diff');
  out.poolDifficulty = v('poolDifficulty', 'pool_difficulty');
  out.blockHeight = v('blockHeight', 'block_height');
  out.blockFound = v('blockFound', 'block_found');
  out.coreVoltage = v('coreVoltage', 'core_voltage');
  out.coreVoltageActual = v('coreVoltageActual', 'core_voltage_actual');
  out.temp2 = v('temp2', 'temp_2');
  out.vrTemp = v('vrTemp', 'vr_temp');
  out.fanrpm = v('fanrpm', 'fan_rpm');
  out.fan2rpm = v('fan2rpm', 'fan2_rpm', 'fan_2_rpm');
  out.errorPercentage = v('errorPercentage', 'error_percentage');
  out.smallCoreCount = v('smallCoreCount', 'small_core_count');
  out.ASICModel = v('ASICModel', 'asic_model');
  out.stratumURL = v('stratumURL', 'stratum_url');
  out.stratumPort = v('stratumPort', 'stratum_port');
  out.stratumUser = v('stratumUser', 'stratum_user');
  out.responseTime = v('responseTime', 'response_time');
  out.isUsingFallbackStratum = v('isUsingFallbackStratum', 'is_using_fallback_stratum');
  out.uptimeSeconds = v('uptimeSeconds', 'uptime_seconds');
  out.axeOSVersion = v('axeOSVersion', 'axeos_version');
  out.ipv4 = v('ipv4', 'ipV4', 'ip');
  out.wifiRSSI = v('wifiRSSI', 'wifi_rssi');
  out.resetReason = v('resetReason', 'reset_reason');
  out.hashrateMonitor = v('hashrateMonitor', 'hashrate_monitor');
  return out;
}

// Proxy vers le miner (GET et PATCH). Pour GET /api/miner/info on normalise le JSON.
function proxyToMiner(req, res) {
  const minerIp = getMinerIp();
  const base = minerIp.startsWith('http') ? minerIp : `http://${minerIp}`;
  const sub = (req.originalUrl || req.url).replace(/^\/api\/miner/, '') || '/info';
  const targetPath = sub.startsWith('/api/') ? sub : `/api/system${sub === '/' ? '/info' : sub}`;
  const url = `${base}${targetPath}`;
  const isGetInfo = req.method === 'GET' && (targetPath === '/api/system/info' || targetPath.endsWith('/info'));

  const opts = {
    method: req.method,
    headers: {
      'accept': 'application/json',
      'content-type': req.get('content-type') || 'application/json'
    }
  };
  const body = req.method !== 'GET' && req.method !== 'HEAD' && req.body ? JSON.stringify(req.body) : null;
  if (body) opts.headers['content-length'] = Buffer.byteLength(body);

  const proxyReq = http.request(url, opts, (proxyRes) => {
    if (isGetInfo && proxyRes.statusCode === 200) {
      let buf = '';
      proxyRes.setEncoding('utf8');
      proxyRes.on('data', (chunk) => { buf += chunk; });
      proxyRes.on('end', () => {
        try {
          const data = JSON.parse(buf);
          res.setHeader('content-type', 'application/json');
          res.status(200).json(normalizeMinerInfo(data));
        } catch (_) {
          res.setHeader('content-type', 'application/json');
          res.status(200).send(buf);
        }
      });
      return;
    }
    res.status(proxyRes.statusCode);
    const h = proxyRes.headers;
    if (h['content-type']) res.setHeader('content-type', h['content-type']);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', (e) => {
    res.status(502).json({ error: 'Miner unreachable', message: e.message, minerIp });
  });
  if (body) proxyReq.write(body);
  proxyReq.end();
}

// Body parser pour PATCH
app.use(express.json({ limit: '1mb' }));

// Config exposée au front (mode proxy + IP actuelle)
app.get('/config.json', (req, res) => {
  res.json({
    proxyMode: true,
    minerIp: getMinerIp()
  });
});

// Sauvegarder l'IP du miner (écrit dans data/config.json)
app.post('/api/config', (req, res) => {
  const { minerIp } = req.body || {};
  const dir = path.join(__dirname, 'data');
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'config.json'), JSON.stringify({ minerIp: (minerIp || '').trim() || getMinerIp() }, null, 2));
    res.json({ ok: true, minerIp: getMinerIp() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Proxy API miner
app.use('/api/miner', (req, res, next) => {
  if (req.method === 'GET' || req.method === 'PATCH' || req.method === 'POST') {
    return proxyToMiner(req, res);
  }
  next();
});

// Fichiers statiques (dashboard)
app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NerdOctaxe Dashboard listening on ${PORT}, miner IP: ${getMinerIp()}`);
});
