import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { enable2FA, verify2FA, disable2FA } from "@/api/securityApi";

/**
 * mode = "enable"  → genera secret, mostra QR, demana codi per confirmar
 * mode = "disable" → demana codi per desactivar
 */
export default function TwoFactorModal({ mode, onClose, onSuccess }) {
    const [qrData, setQrData] = useState(null);
    const [secret, setSecret] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(mode === "enable");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    useEffect(() => {
        if (mode !== "enable") return;
        let alive = true;
        (async () => {
            try {
                const data = await enable2FA();
                if (!alive) return;
                setQrData(data.qr_data_uri);
                setSecret(data.secret);
            } catch (e) {
                if (!alive) return;
                setError(e?.message || "No s'ha pogut generar el codi");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!/^\d{6}$/.test(code)) {
            setError("Introdueix un codi de 6 dígits");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            if (mode === "enable") {
                await verify2FA(code);
            } else {
                await disable2FA(code);
            }
            onSuccess?.();
        } catch (e2) {
            setError(e2?.message || "Codi incorrecte");
        } finally {
            setSubmitting(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-[#0f0f0f] border border-white/10 p-6 shadow-2xl space-y-5">
                <header className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                        {mode === "enable" ? "Activa 2FA" : "Desactiva 2FA"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white/40 hover:text-white text-2xl leading-none"
                        aria-label="Tancar"
                    >×</button>
                </header>

                {mode === "enable" && (
                    <>
                        {loading ? (
                            <div className="text-center text-sm text-white/60 py-10">Generant codi QR...</div>
                        ) : qrData ? (
                            <div className="space-y-4">
                                <p className="text-sm text-white/70">
                                    Escaneja aquest codi amb Google Authenticator, Authy o similar.
                                </p>
                                <div className="bg-white rounded-xl p-4 flex justify-center">
                                    <img src={qrData} alt="QR 2FA" className="w-48 h-48" />
                                </div>
                                <details className="text-xs text-white/50">
                                    <summary className="cursor-pointer hover:text-white/80">No pots escanejar? Mostra el codi manual</summary>
                                    <div className="mt-2 p-2 rounded bg-white/5 font-mono text-white/80 break-all">{secret}</div>
                                </details>
                            </div>
                        ) : null}
                    </>
                )}

                {mode === "disable" && (
                    <p className="text-sm text-white/70">
                        Introdueix un codi vàlid de la teva app autenticadora per confirmar.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="6 dígits"
                        className="w-full rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-center text-xl tracking-[0.5em] font-mono text-white outline-none focus:border-[#CC8400]/60 transition"
                        autoFocus={mode === "disable"}
                    />

                    {error && (
                        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/5"
                        >
                            Cancel·la
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || code.length !== 6}
                            className="rounded-lg px-4 py-2 text-xs font-bold text-black disabled:opacity-50"
                            style={{ background: "linear-gradient(135deg, #FFB800 0%, #CC8400 100%)" }}
                        >
                            {submitting ? "Verificant..." : mode === "enable" ? "Activar" : "Desactivar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
