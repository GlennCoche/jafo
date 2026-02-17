"use client";

/**
 * Affiche quand le nœud est "Hors ligne" : explication et étapes pour vérifier / redémarrer.
 */
export function NodeOfflineHelp() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
      <h3 className="font-medium text-[var(--foreground)]">Que se passe-t-il ?</h3>
      <p className="mt-2 text-[var(--muted)]">
        <strong>« Hors ligne »</strong> signifie que le conteneur <strong>go-quai</strong> (le nœud QUAI) ne répond pas
        à l’API (port 3336). Soit il n’a pas démarré, soit il a planté, soit la synchronisation n’a pas encore ouvert l’API.
      </p>

      <h4 className="mt-4 font-medium text-[var(--foreground)]">À faire sur Umbrel</h4>
      <ol className="mt-2 list-decimal space-y-1 pl-4 text-[var(--muted)]">
        <li>Ouvrez le <strong>tableau de bord Umbrel</strong> (pas cette page AppQUAI).</li>
        <li>Cliquez sur l’app <strong>AppQUAI</strong> → <strong>Logs</strong> (ou Détails / Paramètres selon votre version).</li>
        <li>Vérifiez les logs du conteneur <strong>go-quai</strong> : erreurs, manque d’espace disque, ou message de démarrage.</li>
        <li>Si besoin : <strong>Redémarrez l’app</strong> AppQUAI (bouton Redémarrer dans Umbrel). Attendez 1–2 minutes puis rechargez cette page.</li>
      </ol>

      <h4 className="mt-4 font-medium text-[var(--foreground)]">Ordre normal des choses</h4>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-[var(--muted)]">
        <li><strong>1.</strong> L’app est installée → vous voyez cette interface (dashboard + Réglages).</li>
        <li><strong>2.</strong> Le conteneur <strong>go-quai</strong> démarre et commence la <strong>synchronisation</strong> (700+ Go, plusieurs jours).</li>
        <li><strong>3.</strong> Quand l’API répond, le statut passe à <strong>« En ligne »</strong> et les stats du pool s’affichent.</li>
        <li><strong>4.</strong> Une fois la sync <strong>complète</strong>, vous pouvez connecter votre mineur en <code className="rounded bg-[var(--background)] px-1">stratum+tcp://&lt;ip-umbrel&gt;:3333</code>.</li>
      </ul>
    </div>
  );
}
