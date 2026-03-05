// import TargetaSeccioCompte from "@/features/compte/perfil/pages/TargetaSeccioCompte";
import React from "react";
import defaultAvatar from "@/assets/perfilDefecte.png";
import { getCurrentUser } from "@/api/authApi";

export default function CompteInformacioPersonal({onChangePhoto}) {
  const authUser = getCurrentUser();

  const user = {
    nom: authUser?.name ?? authUser?.username ?? "Usuari",
    emails: authUser?.email ? [authUser.email] : [],
    telefon: authUser?.telefon ?? "No s'ha definit",
    idioma: authUser?.idioma ?? "No s'ha definit",
    adrecaCasa: "No s'ha definit",
    adrecaTreball: "No s'ha definit",
    altresAdreces: "Cap",
    avatar: authUser?.avatar ?? defaultAvatar,
    darrerCanviContrasenya: "11 de des. 2022",
  };

  return (
    <div className="space-y-6">
      {/* Capçalera */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Informació personal
        </h1>
        <p className="max-w-3xl text-sm text-white/70">
          Gestiona els detalls que milloren la teva experiència i decideix quina
          informació és visible per a altres persones
        </p>
      </header>

      {/* Targeta tipus Google */}
      <section className="overflow-hidden rounded-2xl bg-[#303134] ring-1 ring-white/10">
        <FilaInfo
          icona={<IconaCamera />}
          titol="Foto de perfil"
          valor=""
          avatarDreta={user.avatar}
          onClick={onChangePhoto}
        />

        <Separador />

        <FilaInfo
          icona={<IconaUsuari />}
          titol="Nom"
          valor={user.nom}
          onClick={() => console.log("Editar nom")}
        />

        <Separador />

        <FilaInfo
          icona={<IconaCorreu />}
          titol="Adreça electrònica"
          valors={user.emails}
          onClick={() => console.log("Gestionar emails")}
        />

        <Separador />

        <FilaInfo
          icona={<IconaTelefon />}
          titol="Telèfon"
          valor={user.telefon}
          onClick={() => console.log("Editar telèfon")}
        />

        <Separador />

        <FilaInfo
          icona={<IconaCasa />}
          titol="Adreça de casa"
          valor={user.adrecaCasa}
          onClick={() => console.log("Editar adreça casa")}
        />

        <Separador />

        <FilaInfo
          icona={<IconaMaleta />}
          titol="Adreça de treball"
          valor={user.adrecaTreball}
          onClick={() => console.log("Editar adreça treball")}
        />

        <Separador />

        <FilaInfo
          icona={<IconaContrasenya />}
          titol="Contrasenya"
          valor={`Darrer canvi: ${user.darrerCanviContrasenya}`}
          onClick={() => console.log("Canviar contrasenya")}
        />
      </section>
    </div>
  );
}

/* -----------------------------
 * Components UI
 * ----------------------------*/

function FilaInfo({ icona, titol, valor, valors, avatarDreta, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group flex w-full items-center justify-between gap-4
        px-6 py-4 text-left
        hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20
      "
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 text-white/70">{icona}</div>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{titol}</div>

          {/* Un sol valor */}
          {typeof valor === "string" && valor !== "" ? (
            <div className="mt-1 text-sm text-white/70">{valor}</div>
          ) : null}

          {/* Llista de valors */}
          {Array.isArray(valors) && valors.length ? (
            <div className="mt-1 space-y-1">
              {valors.map((v) => (
                <div key={v} className="text-sm text-white/70">
                  {v}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Avatar a la dreta (només 1a fila) */}
      {avatarDreta ? (
        <img
          src={avatarDreta}
          alt=""
          className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/15"
        />
      ) : (
        <ChevronDreta />
      )}
    </button>
  );
}

function Separador() {
  return <div className="h-px bg-white/10" />;
}

function ChevronDreta() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-white/40 group-hover:text-white/60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/* -----------------------------
 * Icones (estil simple)
 * ----------------------------*/

const baseIcon = "h-5 w-5";

function IconaCamera() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={baseIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 7h3l2-2h6l2 2h3v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function IconaUsuari() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={baseIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function IconaCorreu() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={baseIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function IconaTelefon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={baseIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L9.1 10.9a16 16 0 0 0 4 4l1.57-1.0a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconaIdioma() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={baseIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20" />
      <path d="M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}

function IconaCasa() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={baseIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-6v-7H10v7H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function IconaMaleta() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={baseIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="4" y="7" width="16" height="14" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function IconaAltres() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={baseIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="4" y="8" width="14" height="14" rx="2" />
      <path d="M8 8V6a2 2 0 0 1 2-2h10v14h-2" />
    </svg>
  );
}

function IconaContrasenya() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={baseIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 11h10" />
      <path d="M7 15h6" />
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M7 7V5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" />
    </svg>
  );
}
