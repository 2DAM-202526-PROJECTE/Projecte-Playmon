import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useToast } from "@/features/compte/perfil/components/toast/ProveidorToast";

const TIPUS_PERMESOS = ["image/jpeg", "image/png", "image/webp"];
const MIDA_MAX_MB = 2;

export default function ModalCanviarAvatar({
  obert,
  avatarActual,
  onTancar,
  onGuardar, // async (fitxer) => void
  onEliminar, // opcional: () => void
}) {
  const { mostraToast } = useToast();

  const inputRef = useRef(null);
  const [fitxer, setFitxer] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [guardant, setGuardant] = useState(false);

  // Bloquejar scroll del fons
  useEffect(() => {
    if (!obert) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [obert]);

  // ESC per tancar
  useEffect(() => {
    if (!obert) return;
    const onKeyDown = (e) => e.key === "Escape" && onTancar?.();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [obert, onTancar]);

  // Neteja quan obres/tanques
  useEffect(() => {
    if (!obert) return;

    setFitxer(null);
    setError("");
    setGuardant(false);

    // important: no mantenim preview d'una sessió anterior
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obert]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!obert) return null;

  const validaFitxer = (f) => {
    if (!f) return "No s'ha seleccionat cap fitxer.";
    if (!TIPUS_PERMESOS.includes(f.type))
      return "Format no permés. Usa JPG, PNG o WEBP.";
    const midaMB = f.size / (1024 * 1024);
    if (midaMB > MIDA_MAX_MB)
      return `La imatge pesa massa (${midaMB.toFixed(2)}MB). Màxim ${MIDA_MAX_MB}MB.`;
    return "";
  };

  const seleccionarFitxer = () => inputRef.current?.click();

  const onCanviFitxer = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const msg = validaFitxer(f);
    if (msg) {
      setError(msg);
      mostraToast({
        tipus: "error",
        titol: "Imatge no vàlida",
        missatge: msg,
        duracio: 4000,
      });
      return;
    }

    setError("");
    setFitxer(f);

    // Preview
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const guardar = async () => {
    const msg = validaFitxer(fitxer);
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setGuardant(true);
      setError("");

      await onGuardar?.(fitxer);

      mostraToast({
        tipus: "exit",
        titol: "Avatar actualitzat",
        missatge: "La teua foto de perfil s'ha actualitzat correctament.",
        duracio: 3000,
      });

      onTancar?.();
    } catch (err) {
      const m = err?.message ?? "No s'ha pogut actualitzar l'avatar.";
      setError(m);
      mostraToast({
        tipus: "error",
        titol: "Error actualitzant l'avatar",
        missatge: m,
        duracio: 4500,
      });
    } finally {
      setGuardant(false);
    }
  };

  const urlMostrada = previewUrl || avatarActual || null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onTancar}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative mx-auto mt-16 w-[92%] max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-3xl p-5 md:p-6 border border-white/[0.08] relative" style={{ background: 'rgba(10,10,10,0.97)', boxShadow: '0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)' }}>
          {/* Línia daurada superior */}
          <div className="absolute top-0 left-6 right-6 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(204,132,0,0.5), transparent)' }} />

          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Canviar foto de perfil</h2>
              <p className="mt-1 text-sm text-white/45">Formats: JPG/PNG/WEBP · Màxim {MIDA_MAX_MB}MB</p>
            </div>
            <button
              type="button"
              onClick={onTancar}
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/40 hover:border-white/20 hover:text-white/70 transition-all text-sm"
            >
              ✕
            </button>
          </div>

          {/* Preview */}
          <div className="mt-5 flex flex-col items-center gap-4">
            <div className="relative h-36 w-36 overflow-hidden rounded-full border-2 border-[#CC8400]/30 shadow-[0_0_30px_rgba(204,132,0,0.1)]" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {urlMostrada ? (
                <img src={urlMostrada} alt="Previsualització avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm font-semibold text-white/30">
                  Sense foto
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onCanviFitxer}
              />
              <button
                type="button"
                onClick={seleccionarFitxer}
                className="rounded-xl px-5 py-2 text-sm font-bold text-black transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #FFB800 0%, #CC8400 100%)' }}
              >
                Seleccionar imatge
              </button>

              {onEliminar ? (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setGuardant(true);
                      setError("");
                      await onEliminar();
                      mostraToast({ tipus: "info", titol: "Avatar eliminat", missatge: "Has eliminat la foto de perfil.", duracio: 2500 });
                      onTancar?.();
                    } catch (err) {
                      const m = err?.message ?? "No s'ha pogut eliminar l'avatar.";
                      setError(m);
                      mostraToast({ tipus: "error", titol: "Error eliminant l'avatar", missatge: m, duracio: 4500 });
                    } finally {
                      setGuardant(false);
                    }
                  }}
                  disabled={guardant}
                  className="rounded-xl border border-red-500/20 px-5 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Eliminar foto
                </button>
              ) : null}
            </div>

            {fitxer ? (
              <div className="w-full rounded-xl bg-white/[0.03] border border-white/[0.07] p-3 text-sm">
                <div className="font-semibold text-white/80">{fitxer.name}</div>
                <div className="text-xs text-white/35 mt-0.5">{(fitxer.size / (1024 * 1024)).toFixed(2)} MB · {fitxer.type}</div>
              </div>
            ) : null}

            {error ? (
              <div className="w-full rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">{error}</div>
            ) : null}
          </div>

          {/* Accions */}
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onTancar}
              className="rounded-xl border border-white/10 px-5 py-2 text-sm font-semibold text-white/50 hover:bg-white/5 hover:text-white/70 transition-all"
              disabled={guardant}
            >
              Cancel·lar
            </button>
            <button
              type="button"
              onClick={guardar}
              disabled={guardant || !fitxer}
              className="rounded-xl px-5 py-2 text-sm font-bold text-black disabled:opacity-50 transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #FFB800 0%, #CC8400 100%)' }}
            >
              {guardant ? "Guardant..." : "Guardar avatar"}
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-white/40">Pots tancar amb ESC o clicant fora.</p>
      </div>
    </div>,
    document.body
  );
}