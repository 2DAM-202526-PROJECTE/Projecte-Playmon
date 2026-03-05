import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useToast } from "@/features/compte/perfil/components/toast/ProveidorToast";

export default function ModalEditarPerfil({ obert, user, onTancar, onGuardar }) {
  const dadesInicials = useMemo(
    () => ({ nom: user?.name ?? "", email: user?.email ?? "" }),
    [user]
  );

  const [nom, setNom] = useState(dadesInicials.nom);
  const [error, setError] = useState("");
  const [guardant, setGuardant] = useState(false);
  const nomNet = nom.trim();
  const hiHaCanvis = nomNet !== (user?.name ?? "");
  const { mostraToast } = useToast();


  // Bloquejar el scroll quen s'esta editant
  useEffect(() => {
    if (!obert) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [obert]);
  
  // Quan s'obre el modal, reiniciar els camps i errors
  useEffect(() => {
    if (!obert) return;
    setNom(dadesInicials.nom);
    setError("");
    setGuardant(false);
  }, [obert, dadesInicials.nom]);

  // Tancar el modal amb Escape
  useEffect(() => {
    if (!obert) return;
    const onKeyDown = (e) => e.key === "Escape" && onTancar?.();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [obert, onTancar]);

  if (!obert) return null;

  // Validacions senzilles (es poden ampliar)
  const validar = () => {
    const n = nom.trim();
    if (n.length < 2) return "El nom ha de tindre com a mínim 2 caràcters.";
    if (n.length > 40) return "El nom és massa llarg (màxim 40 caràcters).";
    return "";
  };

  // Guardar canvis
  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) return setError(msg);

    try {
      setGuardant(true);
      setError("");

      await onGuardar?.({ name: nom.trim() });

      // Toast èxit
      mostraToast({
        tipus: "exit",
        titol: "Perfil actualitzat",
        missatge: "S’han guardat els canvis correctament.",
        duracio: 3000,
      });

      onTancar?.();
    } catch (err) {
      const msg = err?.message ?? "No s’ha pogut guardar. Torna-ho a provar.";
      setError(msg);

      // Toast error
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

  // El modal es renderitza fora del flux normal de l'aplicació per evitar problemes de z-index i posicionament
  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onTancar}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative mx-auto mt-24 w-[92%] max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-black/10 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Editar perfil</h2>
              <p className="mt-1 text-sm text-slate-500">
                Actualitza les dades bàsiques del teu compte.
              </p>
            </div>

            <button
              type="button"
              onClick={onTancar}
              className="rounded-full px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-800">Nom</label>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-black/10 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/20"
                placeholder="El teu nom"
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-800">Correu electrònic</label>
              <input
                value={dadesInicials.email}
                readOnly
                className="mt-2 w-full cursor-not-allowed rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-black/10 outline-none"
              />
              <p className="mt-2 text-xs text-slate-500">
                (De moment) l’email no es pot canviar des d’aquí.
              </p>
            </div>

            {error ? (
              <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
                {error}
              </div>
            ) : null}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onTancar}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 hover:bg-slate-50"
                disabled={guardant || !hiHaCanvis}
              >
                Cancel·lar
              </button>

              <button
                type="submit"
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-60"
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