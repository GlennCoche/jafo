"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NodeStatus } from "@/components/NodeStatus";
import { PoolStats } from "@/components/PoolStats";
import { SyncWarning } from "@/components/SyncWarning";
import { MinerSection } from "@/components/MinerSection";

type HealthRes = { ok?: boolean; status?: number };
type PoolStatsRes = {
  nodeName?: string;
  workersTotal?: number;
  workersConnected?: number;
  hashrate?: number;
  sharesValid?: number;
  sharesStale?: number;
  sharesInvalid?: number;
  blocksFound?: number;
  sha?: { hashrate?: number; workers?: number };
};

export default function Home() {
  const [health, setHealth] = useState<HealthRes | null>(null);
  const [poolStats, setPoolStats] = useState<PoolStatsRes | null>(null);
  const [minerIp, setMinerIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [hRes, pRes, mRes] = await Promise.all([
          fetch("/api/node/health"),
          fetch("/api/node/pool/stats"),
          fetch("/api/miner/status"),
        ]);
        if (cancelled) return;
        setHealth(hRes.ok ? await hRes.json() : null);
        setPoolStats(pRes.ok ? await pRes.json() : null);
        if (mRes.ok) {
          const m = await mRes.json();
          setMinerIp(m.minerIp ?? null);
        }
      } catch {
        if (!cancelled) {
          setHealth(null);
          setPoolStats(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    const t = setInterval(fetchData, 10000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">AppQUAI</h1>
          <nav className="flex items-center gap-4">
            <Link
              href="/settings"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Réglages
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-6">
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
            État du nœud
          </h2>
          <NodeStatus health={health} loading={loading} />
        </section>

        <section>
          <SyncWarning />
        </section>

        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
            Pool Stratum (stats)
          </h2>
          <PoolStats data={poolStats} loading={loading} />
        </section>

        <MinerSection minerIp={minerIp} />

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-sm text-[var(--muted)]">
            Connexion mineur : <code className="rounded bg-[var(--background)] px-1">stratum+tcp://&lt;ip-umbrel&gt;:3333</code>
            {" "}(username = adresse Quai ou Qi, password = <code className="rounded bg-[var(--background)] px-1">x</code>).
          </p>
        </section>
      </main>
    </div>
  );
}
