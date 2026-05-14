import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "@/assets/perfilDefecte.png";
import { useAuthUser } from "@/features/compte/perfil/hooks/useAuthUser";
import { useToast } from "@/features/compte/perfil/components/toast/ProveidorToast";
import ModalCanviarAvatar from "@/features/compte/perfil/pages/compte/ModelEditarAvatar";
import { uploadAvatar, deleteAvatar } from "@/api/usersApi";

// ── Camps editables ───────────────────────────────────────────────────────────
// type: text | tel | email | select
const EDITABLE_FIELDS = {
  name:          { label: "Nom",                titol: "Editar nom",                placeholder: "El teu nom",         type: "text", min: 2, max: 40 },
  telefon:       { label: "Telèfon",            titol: "Editar telèfon",            placeholder: "+34 600 000 000",    type: "tel",  max: 25 },
  idioma:        { label: "Idioma",             titol: "Editar idioma",             type: "select",
                   options: ["Català", "Castellà", "Anglès", "Francès", "Italià"] },
  adrecaCasa:    { label: "Adreça de casa",     titol: "Editar adreça de casa",     placeholder: "Carrer, número, ciutat", type: "text", max: 120 },
  adrecaTreball: { label: "Adreça de treball",  titol: "Editar adreça de treball",  placeholder: "Carrer, número, ciutat", type: "text", max: 120 },
};

export default function CompteInformacioPersonal() {
  const navigate = useNavigate();
  const [authUser, patchUser] = useAuthUser();
  const { mostraToast } = useToast();

  const user = useMemo(() => ({
    nom:           authUser?.name ?? "Usuari",
    usuari:        authUser?.username ?? "@usuari",
    plan:          authUser?.pla_pagament ?? "basic",
    emails:        authUser?.email ? [authUser.email] : [],
    telefon:       authUser?.telefon || "",
    idioma:        authUser?.idioma  || "",
    adrecaCasa:    authUser?.adrecaCasa    || "",
    adrecaTreball: authUser?.adrecaTreball || "",
    avatar:        authUser?.avatar ?? defaultAvatar,
    darrerCanviContrasenya: authUser?.darrerCanviContrasenya || "—",
  }), [authUser]);

  const [editField, setEditField]   = useState(null);
  const [avatarObert, setAvatarObert] = useState(false);

  const obrirEdicio = (field) => setEditField(field);

  const guardarCamp = async (field, valor) => {
    const valorNet = (valor ?? "").toString().trim();
    patchUser({ [field]: valorNet });
    mostraToast({
      tipus: "exit",
      titol: "Camp actualitzat",
      missatge: `${EDITABLE_FIELDS[field].label} guardat correctament.`,
      duracio: 2500,
    });
    setEditField(null);
  };

  const guardarAvatar = async (fitxer) => {
    if (!authUser?.id) throw new Error("Usuari no autenticat");
    const { avatar_url } = await uploadAvatar(authUser.id, fitxer);
    patchUser({ avatar: avatar_url });
  };

  const eliminarAvatar = async () => {
    if (!authUser?.id) throw new Error("Usuari no autenticat");
    await deleteAvatar(authUser.id);
    patchUser({ avatar: null });
  };

  const planClean = (user.plan || "").toLowerCase().trim();
  const normalizedPlan = planClean === "super" ? "ultra" : planClean;
  const planMapping = {
    basic:  { color: "text-white",          glow: "0 0 4px rgba(255,255,255,0.3)" },
    ultra:  { color: "text-[#ff9d00]",      glow: "0 0 7px #ff9d00, 0 0 14px rgba(255,157,0,0.4)" },
    master: { color: "text-[#ff9d00]",      glow: "0 0 7px #ff9d00, 0 0 14px rgba(255,157,0,0.4)" },
  };
  const planInfo = planMapping[normalizedPlan] || planMapping.basic;

  return (
    <div className="space-y-6">
      {/* Capçalera */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Informació personal</h1>
        <p className="max-w-3xl text-sm text-white/70">
          Gestiona els detalls que milloren la teva experiència i decideix quina informació és visible per a altres persones.
        </p>
      </header>

      {/* Targeta informació */}
      <section
        className="overflow-hidden rounded-2xl relative"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(204,132,0,0.15)",
          boxShadow: "0 0 40px rgba(204,132,0,0.04)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(204,132,0,0.45), transparent)" }}
        />

        <FilaInfo
          icona={<IconaCamera />}
          titol="Foto de perfil"
          valor=""
          avatarDreta={user.avatar}
          onClick={() => setAvatarObert(true)}
        />
        <Separador />

        <FilaInfo
          icona={<IconaUsuari />}
          titol="Nom d'usuari"
          valor={user.usuari}
          valorColorClass={planInfo.color}
          valorGlowStyle={planInfo.glow}
          readonly
        />
        <Separador />

        <FilaInfo
          icona={<IconaUsuari />}
          titol="Nom"
          valor={user.nom}
          onClick={() => obrirEdicio("name")}
        />
        <Separador />

        <FilaInfo
          icona={<IconaCorreu />}
          titol="Adreça electrònica"
          valors={user.emails.length ? user.emails : ["—"]}
          readonly
        />
        <Separador />

        <FilaInfo
          icona={<IconaTelefon />}
          titol="Telèfon"
          valor={user.telefon || "No s'ha definit"}
          buit={!user.telefon}
          onClick={() => obrirEdicio("telefon")}
        />
        <Separador />

        <FilaInfo
          icona={<IconaIdioma />}
          titol="Idioma"
          valor={user.idioma || "No s'ha definit"}
          buit={!user.idioma}
          onClick={() => obrirEdicio("idioma")}
        />
        <Separador />

        <FilaInfo
          icona={<IconaCasa />}
          titol="Adreça de casa"
          valor={user.adrecaCasa || "No s'ha definit"}
          buit={!user.adrecaCasa}
          onClick={() => obrirEdicio("adrecaCasa")}
        />
        <Separador />

        <FilaInfo
          icona={<IconaMaleta />}
          titol="Adreça de treball"
          valor={user.adrecaTreball || "No s'ha definit"}
          buit={!user.adrecaTreball}
          onClick={() => obrirEdicio("adrecaTreball")}
        />
        <Separador />

        <FilaInfo
          icona={<IconaContrasenya />}
          titol="Contrasenya"
          valor="Canvia la contrasenya del teu compte"
          onClick={() => navigate("/compte/contrasenya")}
        />
      </section>

      {/* Modals */}
      <EditFieldModal
        obert={!!editField}
        field={editField}
        valorActual={editField ? user[editField] : ""}
        onTancar={() => setEditField(null)}
        onGuardar={(valor) => guardarCamp(editField, valor)}
      />

      <ModalCanviarAvatar
        obert={avatarObert}
        avatarActual={authUser?.avatar}
        onTancar={() => setAvatarObert(false)}
        onGuardar={guardarAvatar}
        onEliminar={eliminarAvatar}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Modal d'edició d'un sol camp                                                */
/* ─────────────────────────────────────────────────────────────────────────── */

function EditFieldModal({ obert, field, valorActual, onTancar, onGuardar }) {
  const def = field ? EDITABLE_FIELDS[field] : null;
  const [valor, setValor] = useState(valorActual || "");
  const [error, setError] = useState("");
  const [guardant, setGuardant] = useState(false);

  useEffect(() => {
    if (obert) {
      setValor(valorActual || "");
      setError("");
      setGuardant(false);
    }
  }, [obert, valorActual]);

  useEffect(() => {
    if (!obert) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [obert]);

  useEffect(() => {
    if (!obert) return;
    const onKey = (e) => e.key === "Escape" && onTancar?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [obert, onTancar]);

  if (!obert || !def) return null;

  const valorNet = (valor ?? "").toString().trim();
  const hiHaCanvis = valorNet !== (valorActual || "").toString().trim();

  const validar = () => {
    if (def.min && valorNet.length > 0 && valorNet.length < def.min) {
      return `Mínim ${def.min} caràcters.`;
    }
    if (def.max && valorNet.length > def.max) {
      return `Màxim ${def.max} caràcters.`;
    }
    if (def.type === "tel" && valorNet && !/^[+()\d\s-]{6,25}$/.test(valorNet)) {
      return "Número de telèfon no vàlid.";
    }
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) return setError(msg);
    try {
      setGuardant(true);
      await onGuardar?.(valorNet);
    } catch (err) {
      setError(err?.message ?? "No s'ha pogut guardar.");
    } finally {
      setGuardant(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onTancar} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative mx-auto mt-24 w-[92%] max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-3xl p-5 md:p-6 border border-white/[0.08] relative"
          style={{
            background: "rgba(10,10,10,0.97)",
            boxShadow: "0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="absolute top-0 left-6 right-6 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(204,132,0,0.5), transparent)" }}
          />

          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">{def.titol}</h2>
              <p className="mt-1 text-sm text-white/45">Actualitza aquest camp del teu perfil.</p>
            </div>
            <button
              type="button"
              onClick={onTancar}
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/40 hover:border-white/20 hover:text-white/70 transition-all text-sm"
            >
              ✕
            </button>
          </div>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#CC8400] uppercase tracking-widest opacity-80">
                {def.label}
              </label>

              {def.type === "select" ? (
                <select
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="mt-2 w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white outline-none focus:border-[#CC8400]/50 focus:bg-white/[0.07] transition-all"
                  autoFocus
                >
                  <option value="">— Sense definir —</option>
                  {def.options.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0a0a0a] text-white">{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={def.type}
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  maxLength={def.max}
                  placeholder={def.placeholder}
                  className="mt-2 w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white outline-none focus:border-[#CC8400]/50 focus:bg-white/[0.07] transition-all placeholder-white/25"
                  autoFocus
                />
              )}
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">{error}</div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onTancar}
                disabled={guardant}
                className="rounded-xl border border-white/10 px-5 py-2 text-sm font-semibold text-white/50 hover:bg-white/5 hover:text-white/70 transition-all"
              >
                Cancel·lar
              </button>
              <button
                type="submit"
                disabled={guardant || !hiHaCanvis}
                className="rounded-xl px-5 py-2 text-sm font-bold text-black disabled:opacity-50 transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #FFB800 0%, #CC8400 100%)" }}
              >
                {guardant ? "Guardant..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Components UI                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */

function FilaInfo({ icona, titol, valor, valors, avatarDreta, onClick, valorColorClass, valorGlowStyle, readonly, buit }) {
  const interactiu = !readonly && !!onClick;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!interactiu}
      className={`group flex w-full items-center justify-between gap-4 px-6 py-4 text-left border-l-2 border-transparent transition-all duration-200 focus:outline-none ${
        interactiu
          ? "hover:bg-white/[0.04] hover:border-[#CC8400]/40 cursor-pointer"
          : "cursor-default opacity-95"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`mt-1 text-white/35 ${interactiu ? "group-hover:text-[#CC8400]/70" : ""} transition-colors`}>{icona}</div>

        <div className="min-w-0">
          <div className={`text-sm font-semibold text-white/80 ${interactiu ? "group-hover:text-white" : ""} transition-colors`}>
            {titol}
          </div>

          {(typeof valor === "string" || React.isValidElement(valor)) && valor !== "" ? (
            <div
              className={`mt-1 text-sm ${valorColorClass || (buit ? "text-white/30 italic" : "text-white/55")}`}
              style={valorGlowStyle ? { textShadow: valorGlowStyle } : {}}
            >
              {valor}
            </div>
          ) : null}

          {Array.isArray(valors) && valors.length ? (
            <div className="mt-1 space-y-1">
              {valors.map((v) => (
                <div key={v} className="text-sm text-white/55">{v}</div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {avatarDreta ? (
        <img src={avatarDreta} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-[#CC8400]/20" />
      ) : interactiu ? (
        <ChevronDreta />
      ) : null}
    </button>
  );
}

function Separador() { return <div className="h-px bg-white/10" />; }

function ChevronDreta() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/40 group-hover:text-[#CC8400]" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/* ── Icones ── */
const baseIcon = "h-5 w-5";
function IconaCamera()      { return (<svg viewBox="0 0 24 24" className={baseIcon} fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h3l2-2h6l2 2h3v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" /><circle cx="12" cy="13" r="3" /></svg>); }
function IconaUsuari()      { return (<svg viewBox="0 0 24 24" className={baseIcon} fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="8" r="4" /></svg>); }
function IconaCorreu()      { return (<svg viewBox="0 0 24 24" className={baseIcon} fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></svg>); }
function IconaTelefon()     { return (<svg viewBox="0 0 24 24" className={baseIcon} fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L9.1 10.9a16 16 0 0 0 4 4l1.57-1.0a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z" /></svg>); }
function IconaIdioma()      { return (<svg viewBox="0 0 24 24" className={baseIcon} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>); }
function IconaCasa()        { return (<svg viewBox="0 0 24 24" className={baseIcon} fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-6v-7H10v7H4a1 1 0 0 1-1-1z" /></svg>); }
function IconaMaleta()      { return (<svg viewBox="0 0 24 24" className={baseIcon} fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="7" width="16" height="14" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>); }
function IconaContrasenya() { return (<svg viewBox="0 0 24 24" className={baseIcon} fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 11h10" /><path d="M7 15h6" /><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M7 7V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" /></svg>); }
