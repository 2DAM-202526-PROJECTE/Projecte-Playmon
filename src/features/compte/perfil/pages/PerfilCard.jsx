export default function PerfilCard({
  user,
  cameraIcon,
  onEditProfile,
  onChangePhoto,
}) {
  const nom = user?.name ?? "Usuari";
  const correu = user?.email ?? "";
  const avatar = user?.avatar ?? null;

  return (
    <section className="rounded-3xl bg-[#1f1f1f] px-6 py-10 ring-1 ring-white/10">
      {/* Acció d'editar nom de perfil */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onEditProfile}
          className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/15"
        >
          Editar perfil
        </button>
      </div>

      {/* Avatar + nom/email centrats */}
      <div className="mt-2 flex flex-col items-center text-center">
        <div className="relative inline-block">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
            {avatar ? (
              <img src={avatar} alt="Foto de perfil" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs font-semibold text-white/70">
                {nom.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Càmera a sobre de foto d'avatar per poder editar*/}
          <button
            type="button"
            title="Canviar foto"
            aria-label="Canviar foto"
            onClick={onChangePhoto}
            className="absolute -bottom-1 -right-1 z-50 grid h-8 w-8 place-items-center rounded-full bg-[#202124] ring-1 ring-white/20 hover:bg-white/10"
          >
            {cameraIcon ? (
              <img src={cameraIcon} alt="" className="h-4 w-4 opacity-90" />
            ) : (
              <span className="text-xs">📷</span>
            )}
          </button>
        </div>

        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
          {nom}
        </h2>
        <p className="mt-1 text-sm text-white/70">{correu}</p>

        {/* Cercador */}
        <div className="mt-7 w-full max-w-2xl">
          <div className="flex items-center gap-3 rounded-full bg-white/10 px-5 py-3.5 ring-1 ring-white/10 focus-within:ring-white/20">
            <SearchIcon />
            <input
              type="search"
              placeholder="Cerca al Compte"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 21l-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

