import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import defaultAvatar from "@/assets/perfilDefecte.png";
import { ensureCurrentUser, getCurrentUser, logout } from "@/api/authApi";

export default function HeaderCompte({
  logoSrc,
  appName = "Playmon",
  mostrarMenu = true,
}) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => getCurrentUser());
  const [menuObert, setMenuObert] = useState(false);

  // refs per controlar hover “amb intenció” i click fora
  const wrapperRef = useRef(null);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    let viu = true;

    ensureCurrentUser()
      .then((u) => {
        if (viu) setUser(u);
      })
      .catch(() => {
        if (viu) setUser(getCurrentUser());
      });

    const onStorage = (e) => {
      if (e.key === "authUser") setUser(getCurrentUser());
    };
    const onCustom = () => setUser(getCurrentUser());

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:user-updated", onCustom);

    return () => {
      viu = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:user-updated", onCustom);
    };
  }, []);

  // Neteja timers en unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Click fora per tancar
  useEffect(() => {
    if (!menuObert) return;

    const onPointerDown = (e) => {
      const el = wrapperRef.current;
      if (!el) return;
      if (!el.contains(e.target)) setMenuObert(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [menuObert]);

  const nomUsuari = user?.name ?? user?.username ?? "Usuari";
  const avatarUsuari = user?.avatar ?? defaultAvatar;
  const esAdmin = (user?.role || "").toLowerCase() === "admin";

  const inicials = useMemo(() => {
    const n = (nomUsuari || "U").trim();
    const parts = n.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "U";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [nomUsuari]);

  const cancelTancar = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const obrirMenu = () => {
    if (!mostrarMenu) return;
    cancelTancar();
    setMenuObert(true);
  };

  const programarTancarMenu = () => {
    if (!mostrarMenu) return;
    cancelTancar();
    closeTimerRef.current = window.setTimeout(() => {
      setMenuObert(false);
    }, 140); // 👈 clau perquè no “fuga” al moure el ratolí
  };

  const toggleMenuClick = () => {
    if (!mostrarMenu) return;
    cancelTancar();
    setMenuObert((v) => !v); // fallback per touch
  };

  const tancarSessio = () => {
    logout();
    setMenuObert(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/35 backdrop-blur-md" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

        <div className="relative mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
          {/* Logo esquerra */}
          <div className="flex items-center gap-3">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={`${appName} logo`}
                className="h-20 w-auto select-none"
                draggable={false}
              />
            ) : (
              <span className="select-none text-lg font-semibold tracking-tight text-white">
                {appName}
              </span>
            )}
          </div>

          {/* Usuari dreta + menú */}
          <div
            ref={wrapperRef}
            className="relative"
            onPointerEnter={obrirMenu}
            onPointerLeave={programarTancarMenu}
            onFocusCapture={obrirMenu} // teclat
            onKeyDown={(e) => {
              if (e.key === "Escape") setMenuObert(false);
            }}
          >
            <button
              type="button"
              onClick={toggleMenuClick}
              className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              aria-haspopup={mostrarMenu ? "menu" : undefined}
              aria-expanded={mostrarMenu ? menuObert : undefined}
            >
              <span className="hidden text-sm font-semibold text-white/90 sm:block">
                {nomUsuari}
              </span>

              {avatarUsuari ? (
                <img
                  src={avatarUsuari}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20"
                />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white/80 ring-1 ring-white/15">
                  {inicials}
                </span>
              )}

              {mostrarMenu ? <span className="hidden text-white/60 sm:block">▾</span> : null}
            </button>

            {/* Menú (sempre muntat → transicions fluides) */}
            {mostrarMenu ? (
              <div
                role="menu"
                className={[
                  "absolute right-0 top-[52px] w-64 overflow-hidden rounded-2xl",
                  "bg-[#1f1f1f] shadow-xl ring-1 ring-white/10",
                  // “hover bridge” invisible per evitar micro-gap
                  "before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3",
                  // Transicions
                  "origin-top-right transition-all duration-150 ease-out",
                  menuObert
                    ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
                    : "pointer-events-none opacity-0 translate-y-1 scale-95",
                ].join(" ")}
                // aquests events asseguren que, si per qualsevol motiu s’activa el leave, no tanque abans d’hora
                onPointerEnter={cancelTancar}
                onPointerLeave={programarTancarMenu}
              >
                <MenuItem to="/compte/inici" label="Compte" onClick={() => setMenuObert(false)} />
                <MenuItem
                  to="/compte/informacio-personal"
                  label="Informació personal"
                  onClick={() => setMenuObert(false)}
                />
                <MenuItem to="/compte/seguretat" label="Seguretat" onClick={() => setMenuObert(false)} />
                <MenuItem to="/compte/contrasenya" label="Contrasenya" onClick={() => setMenuObert(false)} />
                {esAdmin ? (
                  <MenuItem to="/dashboard" label="Dashboard" onClick={() => setMenuObert(false)} />
                ) : null}

                <div className="h-px bg-white/10" />

                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-white/85 hover:bg-white/5"
                  onClick={tancarSessio}
                  role="menuitem"
                >
                  Tancar sessió
                  <span className="text-white/40">↗</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "flex w-full items-center justify-between px-4 py-3 text-sm font-semibold",
          isActive ? "bg-white/10 text-white" : "text-white/85 hover:bg-white/5",
        ].join(" ")
      }
      role="menuitem"
    >
      {label}
      <span className="text-white/40">›</span>
    </NavLink>
  );
}