export default function PasConfirmar({ data, onBack, onRestart }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-green-50 p-5">
        <div className="text-sm font-semibold text-green-800">Subscripció activada</div>
        <div className="mt-1 text-sm text-green-700">
          Pagament simulat completat correctament.
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
        <div className="text-sm font-semibold text-slate-900">Resum</div>
        <div className="mt-2 text-sm text-slate-700">
          <div>Pla: <b>{data.planId || "-"}</b></div>
          <div>Facturació: <b>{data.billingCycle}</b></div>
          <div>Mètode: <b>{data.paymentMethod}</b></div>
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
          onClick={onRestart}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
        >
          Tornar a començar
        </button>
      </div>
    </div>
  );
}
