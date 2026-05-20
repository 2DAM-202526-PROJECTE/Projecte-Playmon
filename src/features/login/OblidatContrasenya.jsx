import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { requestPasswordReset } from "@/api/securityApi";

export default function OblidatContrasenya() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        const value = email.trim();
        if (!value) {
            setError("Introdueix un email vàlid.");
            return;
        }
        try {
            setLoading(true);
            setError("");
            await requestPasswordReset(value);
            setSent(true);
        } catch (err) {
            const msg = err?.message ?? "No s'ha pogut enviar l'email.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md bg-[#0d0d0d] rounded-2xl p-8 border border-white/5">
                <h1 className="text-2xl font-bold text-white mb-2">Recuperar contrasenya</h1>
                <p className="text-sm text-gray-400 mb-6">
                    {sent
                        ? "Si l'email està registrat, rebràs un enllaç de recuperació en breu."
                        : "Introdueix el teu email i t'enviarem un enllaç per restablir-la."}
                </p>

                {!sent ? (
                    <form onSubmit={submit} className="space-y-5">
                        <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 focus-within:bg-black/60 group">
                            <MdAlternateEmail className="text-2xl text-gray-400 group-focus-within:text-[#CC8400] transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="el-teu@email.com"
                                autoFocus
                                className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-500 font-medium"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-bold text-lg cursor-pointer transition-all bg-gradient-to-r from-[#CC8400] to-[#E65100] text-black shadow-lg shadow-orange-900/40 disabled:opacity-60"
                        >
                            {loading ? "Enviant..." : "Enviar enllaç"}
                        </button>
                    </form>
                ) : (
                    <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-300">
                        Comprova la safata d'entrada (i la carpeta de correu brossa).
                        L'enllaç expira en 30 minuts.
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="mt-6 w-full text-sm text-gray-400 hover:text-[#CC8400] transition-colors"
                >
                    ← Tornar a inici de sessió
                </button>
            </div>
        </div>
    );
}
