const PLANS = [
  { id: "basic", name: "Bàsic", price: 6.99, quality: "HD", devices: 1 },
  { id: "standard", name: "Estàndard", price: 9.99, quality: "Full HD", devices: 2 },
  { id: "premium", name: "Premium", price: 12.99, quality: "4K", devices: 4 },
];

export default function PasTriarPlan({ data, onUpdate, onBack, onNext }) {
  const selected = data.planId;

  function canContinue() {
    return Boolean(selected);
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-sm font-semibold text-slate-900">Tria el teu pla</div>
        <p className="mt-1 text-sm text-slate-600">
          Pots canviar-lo més endavant.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {PLANS.map((p) => {
          const active = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onUpdate({ planId: p.id })}
              className={[
                "rounded-2xl border p-4 text-left transition",
                active
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white hover:bg-slate-50",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">{p.name}</div>
                {active && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                    Seleccionat
                  </span>
                )}
              </div>

              <div className="mt-2 text-2xl font-bold text-slate-900">
                {p.price.toFixed(2)}€
                <span className="ml-1 text-xs font-medium text-slate-500">/mes</span>
              </div>

              <div className="mt-3 text-sm text-slate-700">
                <div>Qualitat: <b>{p.quality}</b></div>
                <div>Dispositius: <b>{p.devices}</b></div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl bg-slate-50 p-4">
        <div className="text-sm font-semibold text-slate-900">Facturació</div>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => onUpdate({ billingCycle: "monthly" })}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium",
              data.billingCycle === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
            ].join(" ")}
          >
            Mensual
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ billingCycle: "yearly" })}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium",
              data.billingCycle === "yearly"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
            ].join(" ")}
          >
            Anual (simulat)
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Enrere
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue()}
          className={[
            "rounded-full px-5 py-2.5 text-sm font-semibold text-white",
            canContinue()
              ? "bg-blue-600 hover:brightness-95"
              : "bg-slate-300 cursor-not-allowed",
          ].join(" ")}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
