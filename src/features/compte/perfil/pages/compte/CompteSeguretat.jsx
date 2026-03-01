import React from "react";


export default function CompteSeguretat() {
  // ⚠️ Mock (després ho connectes al backend / estat global)
  const activitat = {
    titol: "Inici de sessió nou a...",
    dataLloc: "16 de febr. - Espanya",
  };

  const dispositius = {
    windows: { sessions: 7, resum: "Prova data Windows, Windows, ..." },
    androidTelefon: { sessions: 1, resum: "Prova data Iphone" },
    androidTauleta: { sessions: 1, resum: "Prova data Ipad" },
    total: 10,
  };

  return (
    <div className="space-y-6">
      {/* Capçalera (opcional, si vols igual que Google, pots deixar-la) */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Seguretat i inici de sessió
        </h1>
        <p className="max-w-3xl text-sm text-white/70">
          Revisa l’activitat recent i gestiona els dispositius on tens la sessió iniciada.
        </p>
      </header>

      {/* Activitat recent */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-white/80">
          Activitat de seguretat recent
        </h2>

        <div className="overflow-hidden rounded-2xl bg-[#303134] ring-1 ring-white/10">
          {/* Item activitat */}
          <Fila
            principal={activitat.titol}
            secundari={activitat.dataLloc}
            esquerraIcona={<IconaAvis />}
            onClick={() => console.log("Obrir detall activitat")}
          />

          <Separador />

          {/* CTA */}
          <Fila
            principal="Revisa l'activitat de seguretat"
            esquerraIcona={null}
            esCTA
            onClick={() => console.log("Anar a activitat de seguretat")}
          />
        </div>
      </section>

      {/* Dispositius */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-white/80">Els teus dispositius</h2>
        <p className="text-sm text-white/60">Dispositius en què tens la sessió iniciada</p>

        <div className="overflow-hidden rounded-2xl bg-[#303134] ring-1 ring-white/10">
          <Fila
            principal={`${dispositius.windows.sessions} sessions en ordinadors Windows`}
            secundari={dispositius.windows.resum}
            esquerraIcona={<IconaOrdinador />}
            onClick={() => console.log("Detall Windows")}
          />

          <Separador />

          <Fila
            principal={`${dispositius.androidTelefon.sessions} sessió en un telèfon Android`}
            secundari={dispositius.androidTelefon.resum}
            esquerraIcona={<IconaTelefon />}
            onClick={() => console.log("Detall telèfon")}
          />

          <Separador />

          <Fila
            principal={`${dispositius.androidTauleta.sessions} sessió en una tauleta Android`}
            secundari={dispositius.androidTauleta.resum}
            esquerraIcona={<IconaTauleta />}
            onClick={() => console.log("Detall tauleta")}
          />

          {/* <Separador />

          <Fila
            principal="Cerca un dispositiu perdut"
            esquerraIcona={<IconaLocalitzacio />}
            onClick={() => console.log("Cerca dispositiu")}
          /> */}

          <Separador />

          <Fila
            principal="Gestiona tots els dispositius"
            esquerraIcona={null}
            badge={String(dispositius.total)}
            onClick={() => console.log("Gestiona dispositius")}
          />
        </div>
      </section>
    </div>
  );
}

/* ---------- Components UI ---------- */

function Fila({
  principal,
  secundari,
  esquerraIcona,
  badge,
  esCTA = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex w-full items-center justify-between gap-4 px-6 py-4 text-left",
        "hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-start gap-4">
        {/* Icona esquerra */}
        <div className="mt-1 text-white/60">
          {esquerraIcona ? (
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
              {esquerraIcona}
            </span>
          ) : (
            <span className="h-9 w-9" />
          )}
        </div>

        {/* Text */}
        <div className="min-w-0">
          <div
            className={[
              "text-sm font-semibold",
              esCTA ? "text-white" : "text-white",
            ].join(" ")}
          >
            {principal}
          </div>

          {secundari ? (
            <div className="mt-1 text-sm text-white/65">{secundari}</div>
          ) : null}
        </div>
      </div>

      {/* Dreta: badge o chevron */}
      {badge ? (
        <span className="grid h-7 w-7 place-items-center rounded-full bg-black/30 text-xs font-semibold text-white/80 ring-1 ring-white/10">
          {badge}
        </span>
      ) : (
        <Chevron />
      )}
    </button>
  );
}

function Separador() {
  return <div className="h-px bg-white/10" />;
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-white/35 group-hover:text-white/55"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/* ---------- Icones ---------- */

const iconClass = "h-5 w-5";

function IconaAvis() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.3 2.6 18a2 2 0 0 0 1.8 3h15.2a2 2 0 0 0 1.8-3L13.7 3.3a2 2 0 0 0-3.4 0z" />
    </svg>
  );
}

function IconaOrdinador() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M7 20h10" />
      <path d="M9 16v4" />
      <path d="M15 16v4" />
    </svg>
  );
}

function IconaTelefon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 19h2" />
    </svg>
  );
}

function IconaTauleta() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M10.5 18h3" />
    </svg>
  );
}

function IconaLocalitzacio() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <path d="M4.9 4.9l2.1 2.1" />
      <path d="M17 17l2.1 2.1" />
      <path d="M19.1 4.9 17 7" />
      <path d="M7 17 4.9 19.1" />
    </svg>
  );
}
