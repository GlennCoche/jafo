"use client";

type PoolStats = {
  workersTotal?: number;
  workersConnected?: number;
  hashrate?: number;
  sharesValid?: number;
  blocksFound?: number;
  sha?: { hashrate?: number; workers?: number };
} | null;
type WorkersRes = { workers?: Array<{ name?: string; hashrate?: number }> } | null;

function formatHashrate(h: number | undefined): string {
  if (h == null || !Number.isFinite(h)) return "—";
  if (h >= 1e12) return `${(h / 1e12).toFixed(2)} TH/s`;
  if (h >= 1e9) return `${(h / 1e9).toFixed(2)} GH/s`;
  return `${h} H/s`;
}

export function PoolView({
  poolStats,
  workers,
  loading,
  stratumUrl,
  payoutAddress,
  online,
}: {
  poolStats: PoolStats;
  workers: WorkersRes;
  loading: boolean;
  stratumUrl: string;
  payoutAddress: string | null;
  online: boolean;
}) {
  const workersCount = poolStats?.workersConnected ?? poolStats?.workersTotal ?? 0;
  const hashrate = poolStats?.sha?.hashrate ?? poolStats?.hashrate;
  const workersList = workers?.workers ?? [];

  return (
    <div className="mt-4 space-y-4">
      <section className="axe-card">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-slate-400">Pool QUAI</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight">Stratum v1</div>
            <div className="mt-2 text-sm text-slate-400">
              Connectez les mineurs à{" "}
              <span className="font-mono text-slate-200">{stratumUrl}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-3">
            <div className="axe-stat">
              <div className="axe-stat__k">Workers</div>
              <div className="axe-stat__v">{loading || !online ? "—" : workersCount}</div>
            </div>
            <div className="axe-stat">
              <div className="axe-stat__k">Dernière part</div>
              <div className="axe-stat__v">—</div>
              <div className="axe-stat__k mt-1">tous workers</div>
            </div>
            <div className="axe-stat">
              <div className="axe-stat__k">Hashrate</div>
              <div className="axe-stat__v">{loading || !online ? "—" : formatHashrate(hashrate)}</div>
              <div className="axe-stat__k mt-1">TH/s (best-effort)</div>
              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                {["1m", "5m", "15m", "1h", "6h", "24h", "7d"].map((label) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{label}</div>
                    <div className="mt-1 font-mono text-sm text-white">—</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="axe-stat">
              <div className="axe-stat__k">Difficulté réseau</div>
              <div className="axe-stat__v">—</div>
              <div className="axe-stat__k mt-1 text-slate-500">SHA256</div>
            </div>
            <div className="axe-stat">
              <div className="axe-stat__k">Meilleure part</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Depuis bloc
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-white">—</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Toujours
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-white">—</div>
                </div>
              </div>
              <div className="axe-stat__k mt-1 text-slate-500">
                Plus haute difficulté de part (pas une part gagnante garantie).
              </div>
            </div>
            <div className="axe-stat">
              <div className="axe-stat__k">ETA bloc</div>
              <div className="axe-stat__v">—</div>
              <div className="axe-stat__k mt-1 text-slate-500">Selon hashrate du pool</div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <div className="axe-stat">
              <div className="axe-stat__k">Workers (détails)</div>
              <div className="mt-2 text-xs text-slate-400">
                {loading ? "Chargement…" : !online ? "Nœud hors ligne." : workersList.length === 0 ? "Aucun worker connecté." : `${workersList.length} worker(s).`}
              </div>
              <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
                <div className="divide-y divide-white/10 bg-black/20">
                  {workersList.length === 0 ? (
                    <div className="px-3 py-4 text-center text-sm text-slate-500">
                      Connectez un mineur pour voir les stats par worker.
                    </div>
                  ) : (
                    workersList.map((w, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                        <span className="font-mono text-slate-200">{w.name ?? "—"}</span>
                        <span className="text-slate-400">{formatHashrate(w.hashrate)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="axe-card">
        <div className="text-sm text-slate-400">Configuration</div>
        <div className="mt-1 text-lg font-bold">Configuration mineur</div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="axe-note">
            <div className="axe-note__k">URL</div>
            <div className="axe-note__v font-mono break-all">{stratumUrl}</div>
          </div>
          <div className="axe-note">
            <div className="axe-note__k">Payout</div>
            <div className="axe-note__v min-w-0 break-all font-mono leading-snug">
              {payoutAddress || "non défini"}
            </div>
          </div>
          <div className="axe-note">
            <div className="axe-note__k">User</div>
            <div className="axe-note__v min-w-0 break-all font-mono leading-snug">
              {payoutAddress ? "adresse Quai ou Qi (.worker optionnel)" : "(définir payout d’abord)"}
            </div>
          </div>
          <div className="axe-note">
            <div className="axe-note__k">Password</div>
            <div className="axe-note__v font-mono">x</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-400">
          Username = adresse Quai ou Qi (mining). Password = x. Ne connectez le mineur qu’après sync complète du nœud.
        </p>
        {!payoutAddress && (
          <div className="mt-3 rounded-xl border border-red-500/25 bg-red-950/30 px-3 py-2 text-sm text-red-200">
            Adresse de payout non définie. Définissez vos adresses Quai/Qi dans Réglages avant de miner.
          </div>
        )}
      </section>
    </div>
  );
}
