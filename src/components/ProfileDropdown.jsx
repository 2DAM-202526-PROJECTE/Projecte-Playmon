import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logout, ensureCurrentUser } from "@/api/authApi";
import { HiStar, HiBookmark } from "react-icons/hi2";
import defaultAvatar from "@/assets/perfilDefecte.png";

export default function ProfileDropdown({ mostrarMenu = true }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());
  const [menuObert, setMenuObert] = useState(false);
  const wrapperRef = useRef(null);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    let viu = true;
    ensureCurrentUser()
      .then((u) => { if (viu) setUser(u); })
      .catch(() => { if (viu) setUser(getCurrentUser()); });

    const onStorage = (e) => { if (e.key === "authUser") setUser(getCurrentUser()); };
    const onCustom = () => setUser(getCurrentUser());

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:user-updated", onCustom);

    return () => {
      viu = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:user-updated", onCustom);
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!menuObert) return;
    const onPointerDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuObert(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [menuObert]);

  const nomUsuari = user?.name ?? user?.username ?? "Usuari";
  const emailUsuari = user?.email ?? "";
  const avatarUsuari = user?.avatar ?? defaultAvatar;
  const esAdmin = (user?.role || "").toLowerCase() === "admin";
  const planPagament = (user?.pla_pagament || "").toLowerCase().trim();
  const isUltra = planPagament === "ultra";
  const isSuper = planPagament === "super";

  const planLabel = isUltra ? "Ultra" : isSuper ? "Super" : "Estàndard";
  const planColor = isUltra ? "#ff9d00" : isSuper ? "#3b9eff" : "#888";

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
    }, 140);
  };

  const tancarSessio = () => {
    logout();
    setMenuObert(false);
    navigate("/");
  };

  const close = () => setMenuObert(false);

  return (
    <div
      ref={wrapperRef}
      className="relative z-[100]"
      onPointerEnter={obrirMenu}
      onPointerLeave={programarTancarMenu}
    >
      {/* ── Trigger button ── */}
      <button
        type="button"
  
        className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-white/5 transition-all focus:outline-none ring-1 ring-white/10"
      >
        <span
          className={`hidden text-sm sm:block transition-all font-bold ${
            isUltra ? 'text-[#ff9d00]' : isSuper ? 'text-[#3b9eff]' : 'text-white font-semibold'
          }`}
          style={{
            textShadow: isUltra
              ? '0 0 7px #ff9d00, 0 0 14px rgba(255,157,0,0.4)'
              : isSuper
              ? '0 0 7px #3b9eff, 0 0 14px rgba(59,158,255,0.4)'
              : '0 0 4px rgba(255,255,255,0.3)'
          }}
        >
          {nomUsuari}
          {isUltra && (
            <span className="ml-1 text-white inline-block drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">★</span>
          )}
        </span>

        <img
          src={avatarUsuari}
          alt=""
          className={`h-8 w-8 rounded-full object-cover transition-all ${
            isUltra ? 'ring-2 ring-[#ff9d00]' : isSuper ? 'ring-2 ring-[#3b9eff]' : 'ring-1 ring-white/20'
          }`}
        />

        {mostrarMenu && <span className="hidden text-white/60 sm:block">▾</span>}
      </button>

      {/* ── Dropdown panel ── */}
      {mostrarMenu && (
        <div
          role="menu"
          className={[
            "absolute right-0 top-[110%] w-72 overflow-hidden rounded-2xl",
            "bg-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/10",
            "origin-top-right transition-all duration-300 ease-out",
            menuObert
              ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
              : "pointer-events-none opacity-0 translate-y-2 scale-95",
          ].join(" ")}
          onPointerEnter={cancelTancar}
          onPointerLeave={programarTancarMenu}
        >
          {/* ── Capçalera d'usuari ── */}
          <div className="flex items-center gap-3.5 px-5 py-4 border-b border-white/8">
            <div className="relative flex-shrink-0">
              <img
                src={avatarUsuari}
                alt=""
                className={`h-12 w-12 rounded-full object-cover ${
                  isUltra ? 'ring-2 ring-[#ff9d00]' : isSuper ? 'ring-2 ring-[#3b9eff]' : 'ring-1 ring-white/20'
                }`}
              />
              {(isUltra || isSuper) && (
                <span className="absolute -bottom-0.5 -right-0.5 text-[10px] leading-none">
                  {isUltra ? '★' : '●'}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className={`font-bold text-sm truncate ${
                isUltra ? 'text-[#ff9d00]' : isSuper ? 'text-[#3b9eff]' : 'text-white'
              }`}>
                {nomUsuari}
              </p>
              {emailUsuari && (
                <p className="text-white/35 text-xs truncate mt-0.5">{emailUsuari}</p>
              )}
              <span
                className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: `${planColor}22`, color: planColor, border: `1px solid ${planColor}44` }}
              >
                {planLabel}
              </span>
            </div>
          </div>

          {/* ── Llistes ràpides ── */}
          <div className="py-1 border-b border-white/8">
            <p className="px-5 pt-2 pb-1 text-[10px] font-bold text-white/25 uppercase tracking-widest">
              Les meves llistes
            </p>
            <MenuItem
              to="/compte/favorits"
              label="Favorits"
              icon={<HiStar className="text-yellow-400 text-base" />}
              onClick={close}
            />
            <MenuItem
              to="/compte/llista"
              label="Veure més tard"
              icon={<HiBookmark className="text-[#CC8400] text-base" />}
              onClick={close}
            />
          </div>

          {/* ── Compte ── */}
          <div className="py-1 border-b border-white/8">
            <p className="px-5 pt-2 pb-1 text-[10px] font-bold text-white/25 uppercase tracking-widest">
              Compte
            </p>
            <MenuItem to="/compte/inici" label="Resum del compte" onClick={close} />
            <MenuItem to="/compte/informacio-personal" label="Informació personal" onClick={close} />
            <MenuItem to="/compte/seguretat" label="Seguretat" onClick={close} />
            <MenuItem to="/compte/contrasenya" label="Contrasenya" onClick={close} />
            {esAdmin && <MenuItem to="/dashboard/users" label="Dashboard" onClick={close} />}
          </div>

          {/* ── Tancar sessió ── */}
          <div className="py-1">
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-semibold text-white/55 hover:bg-red-500/10 hover:text-red-400 transition-all"
              onClick={tancarSessio}
              role="menuitem"
            >
              Tancar sessió
              <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      role="menuitem"
      className={({ isActive }) =>
        [
          "flex w-full items-center gap-3 px-5 py-2.5 text-sm font-semibold transition-all duration-200",
          isActive
            ? "bg-[#CC8400]/15 text-[#CC8400] border-l-[3px] border-[#CC8400]"
            : "text-white/70 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="flex-1">{label}</span>
          <span className={`text-xs ${isActive ? "text-[#CC8400]" : "text-white/20"}`}>›</span>
        </>
      )}
    </NavLink>
  );
}
