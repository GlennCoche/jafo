"use client";

import { KPICard } from "./KPICard";

type PoolStatsData = {
  nodeName?: string;
  workersTotal?: number;
  workersConnected?: number;
  hashrate?: number;
  sharesValid?: number;
  sharesStale?: number;
  sharesInvalid?: number;
  blocksFound?: number;
  uptime?: number;
  sha?: { hashrate?: number; workers?: number };
};

function formatHashrate(h: number | undefined): string {
  if (h == null || !Number.isFinite(h)) return "—";
  if (h >= 1e12) return `${(h / 1e12).toFixed(2)} TH/s`;
  if (h >= 1e9) return `${(h / 1e9).toFixed(2)} GH/s`;
  if (h >= 1e6) return `${(h / 1e6).toFixed(2)} MH/s`;
  return `${h} H/s`;
}

type PoolStatsProps = {
  data: PoolStatsData | null;
  loading?: boolean;
};

export function PoolStats({ data, loading }: PoolStatsProps) {
  if (loading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Hashrate" value="—" status="muted" />
        <KPICard title="Workers" value="—" status="muted" />
        <KPICard title="Parts valides" value="—" status="muted" />
        <KPICard title="Blocs trouvés" value="—" status="muted" />
      </div>
    );
  }
  const hashrate = data.sha?.hashrate ?? data.hashrate;
  const workers = data.workersConnected ?? data.workersTotal ?? 0;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Hashrate"
        value={formatHashrate(hashrate)}
        subtitle="SHA-256 (ASIC)"
      />
      <KPICard
        title="Workers"
        value={String(workers)}
        subtitle={`Total: ${data.workersTotal ?? 0}`}
      />
      <KPICard
        title="Parts valides"
        value={String(data.sharesValid ?? 0)}
        subtitle={
          [data.sharesStale, data.sharesInvalid].some(Number.isFinite)
            ? `Stale: ${data.sharesStale ?? 0} / Invalides: ${data.sharesInvalid ?? 0}`
            : undefined
        }
      />
      <KPICard
        title="Blocs trouvés"
        value={String(data.blocksFound ?? 0)}
      />
    </div>
  );
}
