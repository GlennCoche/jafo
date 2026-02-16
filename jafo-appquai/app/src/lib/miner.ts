export function getMinerIp(): string {
  const ip = typeof process.env.MINER_IP === "string" ? process.env.MINER_IP.trim() : "";
  return ip || "";
}

export function getMinerBaseUrl(): string {
  const ip = getMinerIp();
  if (!ip) return "";
  return ip.startsWith("http") ? ip : `http://${ip}`;
}

function pick<T extends Record<string, unknown>>(raw: T, ...keys: (keyof T)[]): unknown {
  for (const k of keys) {
    const x = raw[k];
    if (x !== undefined && x !== null) return x;
  }
  return undefined;
}

export function normalizeMinerInfo<T extends Record<string, unknown>>(raw: T): T {
  if (!raw || typeof raw !== "object") return raw;
  const out = { ...raw } as T;
  const o = out as Record<string, unknown>;
  o.hashRate = pick(raw, "hashRate", "hashrate") ?? o.hashRate;
  o.hashRate_1m = pick(raw, "hashRate_1m", "hashrate_1m") ?? o.hashRate_1m;
  o.sharesAccepted = pick(raw, "sharesAccepted", "shares_accepted") ?? o.sharesAccepted;
  o.sharesRejected = pick(raw, "sharesRejected", "shares_rejected") ?? o.sharesRejected;
  o.temp2 = pick(raw, "temp2", "temp_2") ?? o.temp2;
  o.vrTemp = pick(raw, "vrTemp", "vr_temp") ?? o.vrTemp;
  o.fanrpm = pick(raw, "fanrpm", "fan_rpm") ?? o.fanrpm;
  o.fan2rpm = pick(raw, "fan2rpm", "fan2_rpm", "fan_2_rpm") ?? o.fan2rpm;
  o.responseTime =
    pick(raw, "responseTime", "response_time", "ping") ??
    o.responseTime;
  return out;
}
