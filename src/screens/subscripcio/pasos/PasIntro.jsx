export default function PasIntro({ onNext }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-blue-50 p-4 text-sm text-slate-700">
        <div className="font-semibold text-slate-900">Què obtindràs?</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Accés al catàleg segons el pla.</li>
          <li>Historial i “Continuar veient”.</li>
          <li>Cancel·lació quan vulgues (simulat).</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
      >
        Començar
      </button>
    </div>
  );
}
