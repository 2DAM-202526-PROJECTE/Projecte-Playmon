import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logout, ensureCurrentUser } from "@/api/authApi";
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

  const planBadge = isUltra
    ? { label: "Ultra", color: "#ff9d00", bg: "rgba(255,157,0,0.15)", border: "rgba(255,157,0,0.35)" }
    : isSuper
    ? { label: "Super", color: "#3b9eff", bg: "rgba(59,158,255,0.15)", border: "rgba(59,158,255,0.35)" }
    : null;

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
    closeTimerRef.current = window.setTimeout(() => setMenuObert(false), 140);
  };

  const toggleMenuClick = () => {
    if (!mostrarMenu) return;
    setMenuObert(!menuObert);
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
      {/* Botó trigger */}
      <button
        type="button"
        onClick={toggleMenuClick}
        className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-white/5 transition-all focus:outline-none ring-1 ring-white/10"
      >
        <span
          className={`hidden text-sm sm:block font-bold ${isUltra ? 'text-[#ff9d00]' : isSuper ? 'text-[#3b9eff]' : 'text-white'}`}
          style={{ textShadow: isUltra ? '0 0 7px #ff9d00' : isSuper ? '0 0 7px #3b9eff' : '0 0 4px rgba(255,255,255,0.3)' }}
        >
          {nomUsuari}
          {isUltra && <span className="ml-1 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">★</span>}
        </span>
        <img
          src={avatarUsuari}
          alt=""
          className={`h-8 w-8 rounded-full object-cover ${isUltra ? 'ring-2 ring-[#ff9d00]' : isSuper ? 'ring-2 ring-[#3b9eff]' : 'ring-1 ring-white/20'}`}
        />
        {mostrarMenu && <span className="hidden text-white/60 sm:block">▾</span>}
      </button>

      {/* Dropdown */}
      {mostrarMenu && (
        <div
          role="menu"
          className={[
            "absolute right-0 top-[110%] w-72 overflow-hidden rounded-2xl",
            "shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-white/10",
            "origin-top-right transition-all duration-200 ease-out",
            menuObert
              ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
              : "pointer-events-none opacity-0 translate-y-2 scale-95",
          ].join(" ")}
          style={{ background: '#1a1a1a' }}
          onPointerEnter={cancelTancar}
          onPointerLeave={programarTancarMenu}
        >
          {/* Capçalera usuari */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.08]">
            <img
              src={avatarUsuari}
              alt=""
              className={`h-11 w-11 rounded-full object-cover flex-shrink-0 ${isUltra ? 'ring-2 ring-[#ff9d00]' : isSuper ? 'ring-2 ring-[#3b9eff]' : 'ring-1 ring-white/20'}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{nomUsuari}</p>
              <p className="text-xs text-white/45 truncate">{emailUsuari}</p>
              {planBadge && (
                <span
                  className="mt-1 inline-block text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ color: planBadge.color, background: planBadge.bg, border: `1px solid ${planBadge.border}` }}
                >
                  {planBadge.label}
                </span>
              )}
            </div>
          </div>

          {/* Secció llistes */}
          <div className="pt-2">
            <p className="px-4 pb-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/30">
              Les meves llistes
            </p>
            <MenuItemIcon
              to="/compte/favorits"
              label="Favorits"
              onClick={close}
              icon={<StarIcon />}
              isGolden={true}
            />
            <MenuItemIcon
              to="/compte/llista"
              label="Veure més tard"
              onClick={close}
              icon={<BookmarkIcon />}
              isGolden={true}
            />
          </div>

          {/* Secció compte */}
          <div className="pt-2">
            <p className="px-4 pb-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/30">
              Compte
            </p>
            <MenuItemIcon to="/compte/inici"                  label="Resum del compte"      onClick={close} icon={<UserIcon />} />
            <MenuItemIcon to="/compte/informacio-personal"    label="Informació personal"   onClick={close} icon={<InfoIcon />} />
            <MenuItemIcon to="/compte/seguretat"              label="Seguretat"              onClick={close} icon={<LockIcon />} />
            <MenuItemIcon to="/compte/contrasenya"            label="Contrasenya"            onClick={close} icon={<KeyIcon />} />
            {esAdmin && <MenuItemIcon to="/dashboard/users"   label="Dashboard Admin"        onClick={close} icon={<ShieldIcon />} />}
          </div>

          {/* Tancar sessió */}
          <div className="mt-1 border-t border-white/[0.08]">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-white/55 hover:bg-red-500/10 hover:text-red-400 transition-all"
              onClick={tancarSessio}
              role="menuitem"
            >
              Tancar sessió
              <LogoutIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItemIcon({ to, label, onClick, icon, isGolden }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      role="menuitem"
      className={({ isActive }) =>
        [
          "flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all duration-200",
          isActive
            ? "bg-[#CC8400]/15 text-[#CC8400]"
            : isGolden
              ? "text-[#CC8400] hover:bg-white/5"
              : "text-white/70 hover:bg-white/5 hover:text-white",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span className={`flex-shrink-0 ${isActive || isGolden ? 'text-[#CC8400]' : 'text-white/35'}`}>{icon}</span>
          <span className="flex-1">{label}</span>
          <span className={isActive || isGolden ? "text-[#CC8400]/70" : "text-white/20"}>›</span>
        </>
      )}
    </NavLink>
  );
}

/* Icones */
function UserIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="8" r="4" /></svg>;
}
function InfoIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>;
}
function LockIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
}
function KeyIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="17" r="3" /><path d="M10 17h4l2-2M21 2l-2 2m0 0 3 3-2 2-3-3m2-2-7 7" /></svg>;
}
function BookmarkIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>;
}
function ShieldIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function LogoutIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}
function StarIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
