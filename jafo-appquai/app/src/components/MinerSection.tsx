"use client";

import { useEffect, useState } from "react";
import { KPICard } from "./KPICard";

type MinerInfo = {
  hashRate?: number;
  hashRate_1m?: number;
  sharesAccepted?: number;
  sharesRejected?: number;
  temp2?: number;
  vrTemp?: number;
  fanrpm?: number;
  fan2rpm?: number;
  responseTime?: number;
  error?: string;
};

function formatHashrate(h: number | undefined): string {
  if (h == null || !Number.isFinite(h)) return "—";
  if (h >= 1e12) return `${(h / 1e12).toFixed(2)} TH/s`;
  if (h >= 1e9) return `${(h / 1e9).toFixed(2)} GH/s`;
  return `${h} H/s`;
}

type MinerSectionProps = {
  minerIp: string | null;
};

export function MinerSection({ minerIp }: MinerSectionProps) {
  const [info, setInfo] = useState<MinerInfo | null>(null);
  const [loading, setLoading] = useState(!!minerIp);

  useEffect(() => {
    if (!minerIp) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const fetchInfo = async () => {
      try {
        const res = await fetch("/api/miner/info");
        if (cancelled) return;
        setInfo(res.ok ? await res.json() : null);
      } catch {
        if (!cancelled) setInfo(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchInfo();
    const t = setInterval(fetchInfo, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [minerIp]);

  if (!minerIp) return null;

  if (loading && !info) {
    return (
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
          Mineur NerdOctaxe
        </h2>
        <p className="text-[var(--muted)]">Chargement…</p>
      </section>
    );
  }

  if (info?.error && !info.hashRate) {
    return (
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
          Mineur NerdOctaxe
        </h2>
        <p className="text-[var(--err)]">Mineur injoignable ({minerIp})</p>
      </section>
    );
  }

  const hashrate = info?.hashRate_1m ?? info?.hashRate;
  return (
    <section>
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
        Mineur NerdOctaxe ({minerIp})
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Hashrate"
          value={formatHashrate(hashrate)}
          status="ok"
        />
        <KPICard
          title="Parts"
          value={`${info?.sharesAccepted ?? 0} acceptées`}
          subtitle={info?.sharesRejected != null ? `${info.sharesRejected} rejetées` : undefined}
        />
        <KPICard
          title="Températures"
          value={info?.temp2 != null ? `${info.temp2} °C` : "—"}
          subtitle={info?.vrTemp != null ? `VR: ${info.vrTemp} °C` : undefined}
        />
        <KPICard
          title="Ventilateur"
          value={info?.fanrpm != null ? `${info.fanrpm} RPM` : "—"}
          subtitle={info?.responseTime != null ? `Latence: ${info.responseTime} ms` : undefined}
        />
      </div>
    </section>
  );
}
