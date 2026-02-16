"use client";

export function SyncWarning() {
  return (
    <div className="rounded-2xl border border-[var(--warn)]/50 bg-[var(--warn)]/10 p-4 text-sm text-[var(--foreground)]">
      <p className="font-medium text-[var(--warn)]">Ne minez qu’après synchronisation complète</p>
      <p className="mt-1 text-[var(--muted)]">
        La doc QUAI recommande de ne pas connecter votre mineur avant que le nœud soit entièrement
        synchronisé avec le réseau (700+ Go, sync longue). Miner avant la fin de la sync peut
        produire des blocs invalides et gaspiller du hashrate.
      </p>
    </div>
  );
}
