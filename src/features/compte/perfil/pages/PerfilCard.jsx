export default function PerfilCard({
  user,
  cameraIcon,
  onEditProfile,
  onManagePlan,
  onChangePhoto,
}) {
  const nom = user?.name ?? "Usuari";
  const correu = user?.email ?? "";
  const avatar = user?.avatar ?? null;

  return (
    <section className="relative rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:items-center">
        {/* Avatar */}
        <div className="flex justify-center md:justify-start">
          <div className="relative h-40 w-40 overflow-hidden rounded-full bg-slate-200 ring-4 ring-white shadow-lg">
            {avatar ? (
              <img
                src={avatar}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-sm font-semibold text-slate-600">
                {nom.slice(0, 2).toUpperCase()}
              </div>
            )}

            {/* Botó canviar foto */}
            {cameraIcon ? (
              <button
                type="button"
                title="Canviar foto"
                aria-label="Canviar foto"
                onClick={onChangePhoto}
                className="group absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white shadow-md ring-1 ring-black/10 hover:bg-slate-50"
              >
                <img
                  src={cameraIcon}
                  alt=""
                  className="h-7 opacity-0 scale-90 transition-all duration-150 group-hover:opacity-100 group-hover:scale-100"
                />
              </button>
            ) : null}
          </div>
        </div>

        {/* Info */}
        <div className="text-center md:text-left">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-2xl font-semibold tracking-tight text-slate-950">
                {nom}
              </div>
              <div className="mt-1 text-sm text-slate-500">{correu}</div>

              {/* Pills (estil streaming) */}
              <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  Perfil
                </span>
              </div>
            </div>

            {/* Accions */}
            <div className="relative z-10 flex items-center justify-center gap-2 md:justify-end">
              <button
                type="button"
                onClick={() => {
                  console.log("CLICK editar perfil");
                  onEditProfile?.();
                }}
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:brightness-95"
              >
                Editar perfil
              </button>

              <button
                type="button"
                onClick={onManagePlan}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 hover:bg-slate-50"
              >
                Gestionar pla
              </button>
            </div>
          </div>

          {/* Stats (placeholder) */}
          <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-black/5">
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-950">12</div>
              <div className="text-xs text-slate-500">Seguim mirant</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-950">48</div>
              <div className="text-xs text-slate-500">Guardats</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-950">Premium</div>
              <div className="text-xs text-slate-500">Subscripció</div>
            </div>
          </div>

          {/* Panels */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Pla */}
            <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-950">
                    El teu pla
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Qualitat alta, fins a 2 dispositius.
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  Actiu
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onManagePlan}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
                >
                  Canviar pla
                </button>
                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 hover:bg-slate-50"
                >
                  Veure factures
                </button>
              </div>
            </div>

            {/* Seguretat */}
            <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
              <div className="text-sm font-semibold text-slate-950">Seguretat</div>
              <div className="mt-1 text-sm text-slate-600">
                Mantén el compte segur amb contrasenya i dispositius autoritzats.
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 hover:bg-slate-50"
                >
                  Canviar contrasenya
                </button>
                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 hover:bg-slate-50"
                >
                  Dispositius
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
