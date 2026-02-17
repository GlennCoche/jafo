"use client";

import { useEffect, useState } from "react";

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

export function SettingsView() {
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
      .then((r) => (r.ok ? r.json() : null))
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
    return () => {
      cancelled = true;
    };
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
        setMessage("Réglages enregistrés. Redémarrez l’app pour appliquer.");
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
    <div className="mt-4 space-y-4">
      <section className="axe-card">
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-slate-400">Réglages nœud</div>
            <div className="mt-1 text-lg font-bold">Adresses et préférences</div>
            <div className="mt-1 text-sm text-slate-500">
              La sauvegarde met à jour la config. Redémarrez l’app AppQUAI après enregistrement.
            </div>
          </div>
          <div className="text-sm text-slate-400">{message ?? ""}</div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="axe-field md:col-span-2">
            <label className="axe-label" htmlFor="quaiCoinbases">
              Adresse Quai (coinbase)
            </label>
            <input
              id="quaiCoinbases"
              type="text"
              value={form.quaiCoinbases}
              onChange={(e) => setForm((f) => ({ ...f, quaiCoinbases: e.target.value }))}
              className="axe-input font-mono"
              placeholder="0x..."
            />
          </div>

          <div className="axe-field md:col-span-2">
            <label className="axe-label" htmlFor="qiCoinbases">
              Adresse Qi mining (0x00...)
            </label>
            <input
              id="qiCoinbases"
              type="text"
              value={form.qiCoinbases}
              onChange={(e) => setForm((f) => ({ ...f, qiCoinbases: e.target.value }))}
              className="axe-input font-mono"
              placeholder="0x00..."
            />
            <div className="axe-help">
              Adresse de récompense Qi (mining). Format 0x00… (Pelagus Wallet).
            </div>
          </div>

          <div className="axe-field">
            <label className="axe-label" htmlFor="minerPreference">
              Préférence récompenses
            </label>
            <input
              id="minerPreference"
              type="number"
              min={0}
              max={1}
              step={0.25}
              value={form.minerPreference}
              onChange={(e) => setForm((f) => ({ ...f, minerPreference: Number(e.target.value) }))}
              className="axe-input"
            />
            <div className="axe-help">
              0 = 100% Quai, 0.5 = 50/50, 1 = 100% Qi.
            </div>
          </div>

          <div className="axe-field">
            <label className="axe-label" htmlFor="coinbaseLockup">
              Lockup (blocage des récompenses)
            </label>
            <select
              id="coinbaseLockup"
              value={form.coinbaseLockup}
              onChange={(e) => setForm((f) => ({ ...f, coinbaseLockup: Number(e.target.value) }))}
              className="axe-input"
            >
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {LOCKUP_LABELS[n] ?? n}
                </option>
              ))}
            </select>
          </div>

          <div className="axe-field md:col-span-2">
            <button type="submit" className="axe-btn" disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer les réglages"}
            </button>
            <div className="mt-2 text-xs text-slate-500">
              Après enregistrement : redémarrez l’app AppQUAI pour appliquer les changements.
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
