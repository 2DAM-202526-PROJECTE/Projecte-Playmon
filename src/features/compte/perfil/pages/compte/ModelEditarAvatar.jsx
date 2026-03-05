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
        className="absolute inset-0 bg-black/40"
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
        <div className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-black/10 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Canviar foto de perfil
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Formats: JPG/PNG/WEBP · Màxim {MIDA_MAX_MB}MB
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

          {/* Preview */}
          <div className="mt-5 flex flex-col items-center gap-4">
            <div className="relative h-36 w-36 overflow-hidden rounded-full bg-slate-200 ring-4 ring-white shadow-lg">
              {urlMostrada ? (
                <img
                  src={urlMostrada}
                  alt="Previsualització avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm font-semibold text-slate-600">
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
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:brightness-95"
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
                      mostraToast({
                        tipus: "info",
                        titol: "Avatar eliminat",
                        missatge: "Has eliminat la foto de perfil.",
                        duracio: 2500,
                      });
                      onTancar?.();
                    } catch (err) {
                      const m = err?.message ?? "No s'ha pogut eliminar l'avatar.";
                      setError(m);
                      mostraToast({
                        tipus: "error",
                        titol: "Error eliminant l'avatar",
                        missatge: m,
                        duracio: 4500,
                      });
                    } finally {
                      setGuardant(false);
                    }
                  }}
                  disabled={guardant}
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 hover:bg-slate-50"
                >
                  Eliminar foto
                </button>
              ) : null}
            </div>

            {fitxer ? (
              <div className="w-full rounded-2xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-black/5">
                <div className="font-semibold">{fitxer.name}</div>
                <div className="text-xs text-slate-500">
                  {(fitxer.size / (1024 * 1024)).toFixed(2)} MB · {fitxer.type}
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="w-full rounded-2xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
                {error}
              </div>
            ) : null}
          </div>

          {/* Accions */}
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onTancar}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 hover:bg-slate-50"
              disabled={guardant}
            >
              Cancel·lar
            </button>

            <button
              type="button"
              onClick={guardar}
              disabled={guardant || !fitxer}
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-60"
            >
              {guardant ? "Guardant..." : "Guardar avatar"}
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-white/80">
          Pots tancar amb ESC o clicant fora.
        </p>
      </div>
    </div>,
    document.body
  );
}