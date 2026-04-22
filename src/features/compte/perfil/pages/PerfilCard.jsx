export default function PerfilCard({
  user,
  cameraIcon,
  onEditProfile,
  onChangePhoto,
}) {
  const nom = user?.name ?? "Usuari";
  const correu = user?.email ?? "";
  const avatar = user?.avatar ?? null;
  const username = user?.username ?? "@nomusuari";
  const planRaw = (user?.plan || user?.pla_pagament || "basic").toLowerCase().trim();
  const normalizedPlan = planRaw;

  const planMapping = {
    basic: { label: "Basic", colorClass: "text-white", dotClass: "bg-gray-400", glow: "0 0 4px rgba(255,255,255,0.3)" },
    super: { label: "Super", colorClass: "text-[#3b9eff]", dotClass: "bg-[#3b9eff] shadow-[0_0_12px_rgba(59,158,255,0.6)]", glow: "0 0 7px #3b9eff, 0 0 14px rgba(59,158,255,0.4)" },
    ultra: { label: "Ultra", colorClass: "text-[#ff9d00]", dotClass: "bg-[#ff9d00] shadow-[0_0_12px_rgba(255,157,0,0.6)]", glow: "0 0 7px #ff9d00, 0 0 14px rgba(255,157,0,0.4)" },
  };

  const planInfo = planMapping[normalizedPlan] || planMapping.basic;

  return (
    <section className="w-full rounded-3xl px-6 py-12 sm:px-12 sm:py-16 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(204,132,0,0.04) 100%)',
        border: '1px solid rgba(204,132,0,0.18)',
        boxShadow: '0 0 60px rgba(204,132,0,0.07), 0 1px 0 0 rgba(204,132,0,0.25) inset'
      }}>
      {/* Línia daurada superior */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(204,132,0,0.5), transparent)' }} />
      {/* Glow de fons */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(204,132,0,0.08) 0%, transparent 70%)' }} />

      {/* Acció d'editar nom de perfil */}
      <div className="flex justify-end mb-6 relative z-10">
        <button
          type="button"
          onClick={onEditProfile}
          className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-bold text-white/70 hover:text-black hover:border-transparent transition-all duration-300"
          style={{ '--hover-bg': 'linear-gradient(135deg, #FFB800 0%, #CC8400 100%)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #FFB800 0%, #CC8400 100%)'; e.currentTarget.style.color = 'black'; }}
          onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
        >
          Editar perfil
        </button>
      </div>

      {/* Avatar + camps centrats */}
      <div className="flex flex-col items-center relative z-10">
        <div className="relative inline-block mb-10">
          <div className="h-48 w-48 sm:h-56 sm:w-56 overflow-hidden rounded-full bg-white/5 shadow-2xl" style={{ boxShadow: '0 0 0 3px rgba(204,132,0,0.25), 0 0 40px rgba(204,132,0,0.1)' }}>
            {avatar ? (
              <img src={avatar} alt="Foto de perfil" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-6xl font-semibold text-white/50">
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
            className="absolute bottom-2 right-2 z-50 grid h-14 w-14 place-items-center rounded-full transition-all shadow-xl hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #FFB800 0%, #CC8400 100%)', boxShadow: '0 0 20px rgba(204,132,0,0.4)' }}
          >
            {cameraIcon ? (
              <img src={cameraIcon} alt="" className="h-7 w-7 opacity-90" />
            ) : (
              <span className="text-2xl">📷</span>
            )}
          </button>
        </div>

        {/* Camps d'informació */}
        <div className="w-full max-w-3xl space-y-5">
          <div className="flex flex-col rounded-2xl bg-white/[0.03] p-5 sm:p-6 text-left border border-white/5 shadow-sm transition-all hover:bg-white/[0.07] outline-none group/item">
            <span className="text-xs sm:text-[10px] font-bold text-[#CC8400] uppercase tracking-widest mb-1 sm:mb-2 opacity-80 group-hover/item:opacity-100 transition-opacity">Nom d'usuari</span>
            <span 
              className={`text-xl sm:text-2xl font-semibold ${planInfo.colorClass}`}
              style={{ textShadow: planInfo.glow }}
            >
              {username}
              {normalizedPlan === 'ultra' && (
                <span className="ml-2 text-white inline-block drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">★</span>
              )}
            </span>
          </div>
          
          <div className="flex flex-col rounded-2xl bg-white/[0.03] p-5 sm:p-6 text-left border border-white/5 shadow-sm transition-all hover:bg-white/[0.07] outline-none group/item">
            <span className="text-xs sm:text-[10px] font-bold text-[#CC8400] uppercase tracking-widest mb-1 sm:mb-2 opacity-80 group-hover/item:opacity-100 transition-opacity">Nom</span>
            <span className="text-xl sm:text-2xl font-semibold text-white">{nom}</span>
          </div>

          <div className="flex flex-col rounded-2xl bg-white/[0.03] p-5 sm:p-6 text-left border border-white/5 shadow-sm transition-all hover:bg-white/[0.07] outline-none group/item">
            <span className="text-xs sm:text-[10px] font-bold text-[#CC8400] uppercase tracking-widest mb-1 sm:mb-2 opacity-80 group-hover/item:opacity-100 transition-opacity">Correu electrònic</span>
            <span className="text-xl sm:text-2xl font-semibold text-white truncate">{correu}</span>
          </div>

          <div className="flex flex-col rounded-2xl bg-white/[0.03] p-5 sm:p-6 text-left border border-white/5 shadow-sm transition-all hover:bg-white/[0.07] outline-none group/item">
            <span className="text-xs sm:text-[10px] font-bold text-[#CC8400] uppercase tracking-widest mb-1 sm:mb-2 opacity-80 group-hover/item:opacity-100 transition-opacity">Pla de subscripció</span>
            <span className={`flex items-center gap-3 text-xl sm:text-2xl font-semibold ${planInfo.colorClass}`}>
              <span className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full ${planInfo.dotClass}`}></span>
              {planInfo.label}
            </span>
          </div>
        </div>

        {/* Cercador */}
        <div className="mt-12 w-full max-w-3xl">
          <div className="flex items-center gap-4 rounded-2xl bg-white/[0.03] px-6 py-4 sm:py-5 border border-white/[0.08] focus-within:border-[#CC8400]/40 focus-within:bg-white/[0.06] transition-all group">
            <SearchIcon className="group-focus-within:text-[#CC8400] transition-colors" />
            <input
              type="search"
              placeholder="Cerca al Compte"
              className="w-full bg-transparent text-base sm:text-lg text-white outline-none placeholder:text-white/30"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 text-white/40 ${className}`} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 21l-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

