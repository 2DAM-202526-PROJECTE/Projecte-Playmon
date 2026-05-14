import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useToast } from "@/features/compte/perfil/components/toast/ProveidorToast";

const IDIOMES = ["Català", "Castellà", "Anglès", "Francès", "Italià"];

export default function ModalEditarPerfil({ obert, user, onTancar, onGuardar }) {
  const dadesInicials = useMemo(
    () => ({
      nom:     user?.name    ?? "",
      email:   user?.email   ?? "",
      telefon: user?.telefon ?? "",
      idioma:  user?.idioma  ?? "",
    }),
    [user]
  );

  const [nom, setNom]         = useState(dadesInicials.nom);
  const [telefon, setTelefon] = useState(dadesInicials.telefon);
  const [idioma, setIdioma]   = useState(dadesInicials.idioma);
  const [error, setError]     = useState("");
  const [guardant, setGuardant] = useState(false);
  const { mostraToast } = useToast();

  const nomNet     = nom.trim();
  const telefonNet = telefon.trim();
  const idiomaNet  = idioma.trim();

  const hiHaCanvis =
    nomNet     !== (user?.name    ?? "").trim() ||
    telefonNet !== (user?.telefon ?? "").trim() ||
    idiomaNet  !== (user?.idioma  ?? "").trim();

  useEffect(() => {
    if (!obert) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [obert]);

  useEffect(() => {
    if (!obert) return;
    setNom(dadesInicials.nom);
    setTelefon(dadesInicials.telefon);
    setIdioma(dadesInicials.idioma);
    setError("");
    setGuardant(false);
  }, [obert, dadesInicials]);

  useEffect(() => {
    if (!obert) return;
    const onKeyDown = (e) => e.key === "Escape" && onTancar?.();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [obert, onTancar]);

  if (!obert) return null;

  const validar = () => {
    if (nomNet.length < 2)  return "El nom ha de tindre com a mínim 2 caràcters.";
    if (nomNet.length > 40) return "El nom és massa llarg (màxim 40 caràcters).";
    if (telefonNet && !/^[+()\d\s-]{6,25}$/.test(telefonNet)) return "Número de telèfon no vàlid.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) return setError(msg);

    try {
      setGuardant(true);
      setError("");

      await onGuardar?.({
        name:    nomNet,
        telefon: telefonNet,
        idioma:  idiomaNet,
      });

      mostraToast({
        tipus: "exit",
        titol: "Perfil actualitzat",
        missatge: "S'han guardat els canvis correctament.",
        duracio: 3000,
      });

      onTancar?.();
    } catch (err) {
      const msg = err?.message ?? "No s'ha pogut guardar. Torna-ho a provar.";
      setError(msg);
      mostraToast({
        tipus: "error",
        titol: "Error guardant el perfil",
        missatge: msg,
        duracio: 4000,
      });
    } finally {
      setGuardant(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onTancar}
        aria-hidden="true"
      />

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
              <h2 className="text-lg font-bold text-white">Editar perfil</h2>
              <p className="mt-1 text-sm text-white/45">Actualitza les dades bàsiques del teu compte.</p>
            </div>
            <button
              type="button"
              onClick={onTancar}
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/40 hover:border-white/20 hover:text-white/70 transition-all text-sm"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Nom */}
            <div>
              <label className="text-xs font-bold text-[#CC8400] uppercase tracking-widest opacity-80">Nom</label>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                maxLength={40}
                className="mt-2 w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white outline-none focus:border-[#CC8400]/50 focus:bg-white/[0.07] transition-all placeholder-white/25"
                placeholder="El teu nom"
                autoFocus
              />
            </div>

            {/* Correu electrònic (només lectura) */}
            <div>
              <label className="text-xs font-bold text-[#CC8400] uppercase tracking-widest opacity-80">Correu electrònic</label>
              <input
                value={dadesInicials.email}
                readOnly
                className="mt-2 w-full cursor-not-allowed rounded-2xl bg-white/[0.02] border border-white/[0.05] px-4 py-3 text-sm text-white/35 outline-none"
              />
              <p className="mt-1.5 text-xs text-white/30">L'email no es pot canviar des d'aquí.</p>
            </div>

            {/* Telèfon */}
            <div>
              <label className="text-xs font-bold text-[#CC8400] uppercase tracking-widest opacity-80">Telèfon</label>
              <input
                type="tel"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                maxLength={25}
                placeholder="+34 600 000 000"
                className="mt-2 w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white outline-none focus:border-[#CC8400]/50 focus:bg-white/[0.07] transition-all placeholder-white/25"
              />
            </div>

            {/* Idioma */}
            <div>
              <label className="text-xs font-bold text-[#CC8400] uppercase tracking-widest opacity-80">Idioma</label>
              <select
                value={idioma}
                onChange={(e) => setIdioma(e.target.value)}
                className="mt-2 w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white outline-none focus:border-[#CC8400]/50 focus:bg-white/[0.07] transition-all"
              >
                <option value="">— Sense definir —</option>
                {IDIOMES.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#0a0a0a] text-white">{opt}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">{error}</div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onTancar}
                className="rounded-xl border border-white/10 px-5 py-2 text-sm font-semibold text-white/50 hover:bg-white/5 hover:text-white/70 transition-all"
                disabled={guardant}
              >
                Cancel·lar
              </button>
              <button
                type="submit"
                className="rounded-xl px-5 py-2 text-sm font-bold text-black disabled:opacity-50 transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #FFB800 0%, #CC8400 100%)" }}
                disabled={guardant || !hiHaCanvis}
              >
                {guardant ? "Guardant..." : "Guardar canvis"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
