"use client";

import { KPICard } from "./KPICard";

type NodeStatusProps = {
  health: { ok?: boolean; status?: number } | null;
  loading?: boolean;
};

export function NodeStatus({ health, loading }: NodeStatusProps) {
  if (loading) {
    return (
      <KPICard
        title="Nœud QUAI"
        value="Chargement…"
        status="muted"
      />
    );
  }
  const ok = health?.ok === true;
  return (
    <KPICard
      title="Nœud QUAI"
      value={ok ? "En ligne" : "Hors ligne"}
      subtitle={ok ? "Stratum et API disponibles" : "Vérifiez que le conteneur go-quai tourne"}
      status={ok ? "ok" : "err"}
    />
  );
}
