"use client";

import { NodeOfflineHelp } from "../NodeOfflineHelp";

type Health = { ok?: boolean } | null;
type PoolStats = {
  workersTotal?: number;
  workersConnected?: number;
  hashrate?: number;
  blocksFound?: number;
  sha?: { hashrate?: number; workers?: number };
} | null;

function formatHashrate(h: number | undefined): string {
  if (h == null || !Number.isFinite(h)) return "—";
  if (h >= 1e12) return `${(h / 1e12).toFixed(2)} TH/s`;
  if (h >= 1e9) return `${(h / 1e9).toFixed(2)} GH/s`;
  if (h >= 1e6) return `${(h / 1e6).toFixed(2)} MH/s`;
  return `${h} H/s`;
}

const CIRCLE = 2 * Math.PI * 48;
const circumference = CIRCLE;

export function HomeView({
  health,
  poolStats,
  loading,
  onOpenPool,
}: {
  health: Health;
  poolStats: PoolStats;
  loading: boolean;
  onOpenPool: () => void;
}) {
  const online = health?.ok === true;
  const syncPct = online ? 100 : 0;
  const offset = circumference - (syncPct / 100) * circumference;
  const workers = poolStats?.workersConnected ?? poolStats?.workersTotal ?? 0;
  const hashrate = poolStats?.sha?.hashrate ?? poolStats?.hashrate;

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <section className="axe-card lg:col-span-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-slate-400">Blockchain</div>
            <div className="mt-1 text-3xl font-extrabold tracking-tight">
              {loading ? "…" : online ? "En ligne" : "Hors ligne"}
            </div>
            <div className="mt-2 text-sm text-slate-400">
              {online ? "Stratum et API disponibles" : "Vérifiez que le conteneur go-quai tourne"}
            </div>
            {online && (
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>main | Colosseum</span>
                <span>slice [0 0]</span>
              </div>
            )}
          </div>
          <div className="axe-ring h-28 w-28 flex-shrink-0">
            <svg viewBox="0 0 120 120" className="h-28 w-28">
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#00e5ff" />
                  <stop offset="0.5" stopColor="#ff2bd6" />
                  <stop offset="1" stopColor="#ff9a00" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="48" stroke="#1f2937" strokeWidth="10" fill="none" />
              <circle
                className="ring-progress"
                cx="60"
                cy="60"
                r="48"
                stroke="url(#ringGrad)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
              <text
                x="60"
                y="66"
                textAnchor="middle"
                className="fill-slate-100 font-extrabold"
                style={{ fontSize: 22 }}
              >
                {loading ? "…" : online ? "100%" : "0%"}
              </text>
            </svg>
          </div>
        </div>

        {!loading && !online && (
          <div className="mt-4">
            <NodeOfflineHelp />
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-6">
          <div className="axe-stat">
            <div className="axe-stat__k">Blocs</div>
            <div className="axe-stat__v">{poolStats?.blocksFound ?? "—"}</div>
          </div>
          <div className="axe-stat">
            <div className="axe-stat__k">Peers</div>
            <div className="axe-stat__v">—</div>
          </div>
          <div className="axe-stat">
            <div className="axe-stat__k">Retard chaîne</div>
            <div className="axe-stat__v">—</div>
            <div className="axe-stat__k mt-1 text-slate-500">blocs behind / ahead</div>
          </div>
          <div className="axe-stat">
            <div className="axe-stat__k">Workers</div>
            <div className="axe-stat__v">{online ? workers : "—"}</div>
          </div>
          <div className="axe-stat">
            <div className="axe-stat__k">Hashrate</div>
            <div className="axe-stat__v">{online ? formatHashrate(hashrate) : "—"}</div>
          </div>
          <div className="axe-stat">
            <div className="axe-stat__k">Disque</div>
            <div className="axe-stat__v">—</div>
          </div>
        </div>
      </section>

      <section className="axe-card lg:col-span-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-slate-400">Pool QUAI</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight">Solo Pool</div>
            <div className="mt-2 text-sm text-slate-400">
              Port <span className="font-mono">3333</span>
            </div>
          </div>
          <button type="button" className="axe-btn" onClick={onOpenPool}>
            Ouvrir Pool
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3">
          <div className="axe-stat">
            <div className="axe-stat__k">Workers</div>
            <div className="axe-stat__v">{loading || !online ? "—" : workers}</div>
          </div>
          <div className="axe-stat">
            <div className="axe-stat__k">Hashrate</div>
            <div className="axe-stat__v">{loading || !online ? "—" : formatHashrate(hashrate)}</div>
            <div className="axe-stat__k mt-1">TH/s (best-effort)</div>
          </div>
          <div className="axe-stat">
            <div className="axe-stat__k">Difficulté réseau</div>
            <div className="axe-stat__v">—</div>
            <div className="axe-stat__k mt-1 text-slate-500">SHA256</div>
          </div>
          <div className="axe-stat">
            <div className="axe-stat__k">ETA bloc</div>
            <div className="axe-stat__v">—</div>
            <div className="axe-stat__k mt-1 text-slate-500">Selon hashrate du pool</div>
          </div>
        </div>
      </section>
    </div>
  );
}
