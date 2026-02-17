"use client";

import { useEffect, useState } from "react";
import { HomeView } from "@/components/views/HomeView";
import { PoolView } from "@/components/views/PoolView";
import { BlocksView } from "@/components/views/BlocksView";
import { SettingsView } from "@/components/views/SettingsView";
import { SyncWarning } from "@/components/SyncWarning";

type TabId = "home" | "pool" | "blocks" | "settings";

type HealthRes = { ok?: boolean } | null;
type PoolStatsRes = {
  workersTotal?: number;
  workersConnected?: number;
  hashrate?: number;
  blocksFound?: number;
  sha?: { hashrate?: number; workers?: number };
} | null;
type WorkersRes = { workers?: Array<{ name?: string; hashrate?: number }> } | null;
type ConfigRes = { quaiCoinbases?: string; qiCoinbases?: string } | null;

const APP_VERSION = "1.0.2";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [health, setHealth] = useState<HealthRes>(null);
  const [poolStats, setPoolStats] = useState<PoolStatsRes>(null);
  const [workers, setWorkers] = useState<WorkersRes>(null);
  const [config, setConfig] = useState<ConfigRes>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [hRes, pRes, wRes, cRes] = await Promise.all([
          fetch("/api/node/health"),
          fetch("/api/node/pool/stats"),
          fetch("/api/node/pool/workers"),
          fetch("/api/node/config"),
        ]);
        if (cancelled) return;
        setHealth(hRes.ok ? await hRes.json() : null);
        setPoolStats(pRes.ok ? await pRes.json() : null);
        setWorkers(wRes.ok ? await wRes.json() : null);
        setConfig(cRes.ok ? await cRes.json() : null);
      } catch {
        if (!cancelled) {
          setHealth(null);
          setPoolStats(null);
          setWorkers(null);
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

  const online = health?.ok === true;
  const statusPillClass = loading
    ? "axe-pill"
    : online
      ? "axe-pill axe-pill--ok"
      : "axe-pill axe-pill--err";
  const statusLabel = loading ? "Chargement…" : online ? "En ligne" : "Hors ligne";

  const stratumUrl = "stratum+tcp://<ip-umbrel>:3333";
  const payoutAddress = config?.quaiCoinbases || config?.qiCoinbases || null;

  return (
    <div className="min-h-screen bg-[var(--axe-950)] text-slate-100">
      <div className="mx-auto max-w-6xl p-5 md:p-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/20">
              <span className="text-xl font-bold text-amber-400">Q</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-2xl font-extrabold tracking-tight">AppQUAI v{APP_VERSION}</div>
                <span className="axe-pill">QUAI</span>
              </div>
              <div className="text-sm text-slate-400">Nœud QUAI + Solo Pool</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className={statusPillClass}>{statusLabel}</span>
          </div>
        </header>

        <div className="mt-6 flex items-center justify-between">
          <div className="axe-tabs">
            <button
              type="button"
              className={`axe-tab ${activeTab === "home" ? "axe-tab--active" : ""}`}
              onClick={() => setActiveTab("home")}
            >
              Home
            </button>
            <button
              type="button"
              className={`axe-tab ${activeTab === "pool" ? "axe-tab--active" : ""}`}
              onClick={() => setActiveTab("pool")}
            >
              Pool
            </button>
            <button
              type="button"
              className={`axe-tab ${activeTab === "blocks" ? "axe-tab--active" : ""}`}
              onClick={() => setActiveTab("blocks")}
            >
              Blocs
            </button>
            <button
              type="button"
              className={`axe-tab ${activeTab === "settings" ? "axe-tab--active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Réglages
            </button>
          </div>
          <div className="hidden text-xs text-slate-500 md:block">
            Les changements nécessitent un redémarrage de l’app pour être appliqués.
          </div>
        </div>

        {activeTab === "home" && (
          <>
            <div className="mt-4">
              <SyncWarning />
            </div>
            <HomeView
              health={health}
              poolStats={poolStats}
              loading={loading}
              onOpenPool={() => setActiveTab("pool")}
            />
          </>
        )}
        {activeTab === "pool" && (
          <PoolView
            poolStats={poolStats}
            workers={workers}
            loading={loading}
            stratumUrl={stratumUrl}
            payoutAddress={payoutAddress}
            online={online}
          />
        )}
        {activeTab === "blocks" && <BlocksView />}
        {activeTab === "settings" && <SettingsView />}
      </div>
    </div>
  );
}
