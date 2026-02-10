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

// Proxy vers le miner (GET et PATCH)
function proxyToMiner(req, res) {
  const minerIp = getMinerIp();
  const base = minerIp.startsWith('http') ? minerIp : `http://${minerIp}`;
  const sub = (req.originalUrl || req.url).replace(/^\/api\/miner/, '') || '/info';
  const targetPath = sub.startsWith('/api/') ? sub : `/api/system${sub === '/' ? '/info' : sub}`;
  const url = `${base}${targetPath}`;

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
