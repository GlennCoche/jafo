"use client";

export function BlocksView() {
  return (
    <div className="mt-4">
      <section className="axe-card">
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-slate-400">Blocs</div>
            <div className="mt-1 text-lg font-bold">Blocs trouvés (solo)</div>
            <div className="mt-1 text-sm text-slate-500">
              Historique de votre pool solo local.
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
          <div className="grid grid-cols-12 gap-2 bg-black/35 px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
            <div className="col-span-3">Heure</div>
            <div className="col-span-2">Hauteur</div>
            <div className="col-span-2">Statut</div>
            <div className="col-span-5">Mineur</div>
          </div>
          <div className="divide-y divide-white/10">
            <div className="px-3 py-8 text-center text-slate-500">
              Aucun bloc trouvé pour l’instant.
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Conseil : utilisez l’onglet Pool pour suivre le hashrate et les workers. Cet onglet change lorsqu’un bloc est trouvé.
        </p>
      </section>
    </div>
  );
}
