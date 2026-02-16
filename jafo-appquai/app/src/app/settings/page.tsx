"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NodeConfig = {
  quaiCoinbases: string;
  qiCoinbases: string;
  minerPreference: number;
  coinbaseLockup: number;
};

const LOCKUP_LABELS: Record<number, string> = {
  0: "2 semaines (0)",
  1: "3 mois (+3.5% an 1)",
  2: "6 mois (+10% an 1)",
  3: "12 mois (+25% an 1)",
};

export default function SettingsPage() {
  const [config, setConfig] = useState<NodeConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<NodeConfig>({
    quaiCoinbases: "0x00433b2AdDF610eA8280B9A929F1db8fbF0E3678",
    qiCoinbases: "0x00433b2AdDF610eA8280B9A929F1db8fbF0E3678",
    minerPreference: 0.5,
    coinbaseLockup: 0,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/node/config")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!cancelled && data) {
          setConfig(data);
          setForm({
            quaiCoinbases: data.quaiCoinbases ?? form.quaiCoinbases,
            qiCoinbases: data.qiCoinbases ?? form.qiCoinbases,
            minerPreference: Number(data.minerPreference) ?? 0.5,
            coinbaseLockup: Number(data.coinbaseLockup) ?? 0,
          });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/node/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setConfig(data);
        setMessage("Config enregistrée. Redémarrez le nœud go-quai pour appliquer.");
      } else {
        setMessage(data?.error ?? "Erreur lors de l’enregistrement.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">AppQUAI – Réglages</h1>
          <Link href="/" className="text-sm text-[var(--accent)] hover:underline">
            Retour
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">
              Adresse Quai (coinbase)
            </label>
            <input
              type="text"
              value={form.quaiCoinbases}
              onChange={(e) => setForm((f) => ({ ...f, quaiCoinbases: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="0x..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">
              Adresse Qi mining (0x00...)
            </label>
            <input
              type="text"
              value={form.qiCoinbases}
              onChange={(e) => setForm((f) => ({ ...f, qiCoinbases: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="0x00..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">
              Préférence récompenses (0 = 100% Quai, 0.5 = 50/50, 1 = 100% Qi)
            </label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.25}
              value={form.minerPreference}
              onChange={(e) => setForm((f) => ({ ...f, minerPreference: Number(e.target.value) }))}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">
              Lockup (période de blocage des récompenses)
            </label>
            <select
              value={form.coinbaseLockup}
              onChange={(e) => setForm((f) => ({ ...f, coinbaseLockup: Number(e.target.value) }))}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {LOCKUP_LABELS[n] ?? n}
                </option>
              ))}
            </select>
          </div>
          {message && (
            <p className={`text-sm ${message.startsWith("Config") ? "text-[var(--ok)]" : "text-[var(--err)]"}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      </main>
    </div>
  );
}
