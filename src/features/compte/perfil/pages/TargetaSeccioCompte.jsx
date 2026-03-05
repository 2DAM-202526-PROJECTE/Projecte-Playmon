export default function TargetaSeccioCompte({ titol, descripcio }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
      <h2 className="text-lg font-semibold text-slate-900">{titol}</h2>
      <p className="mt-2 text-sm text-slate-600">{descripcio}</p>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-black/5">
        <p className="text-sm text-slate-500">
          (Placeholder) Ací anirà el contingut d’aquesta secció.
        </p>
      </div>
    </section>
  );
}
