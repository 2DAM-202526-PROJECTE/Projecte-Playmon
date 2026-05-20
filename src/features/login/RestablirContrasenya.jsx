import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TbLockPassword } from "react-icons/tb";
import { confirmPasswordReset } from "@/api/securityApi";

export default function RestablirContrasenya() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const token = params.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        const p = password.trim();
        if (p.length < 8) {
            setError("La nova contrasenya ha de tenir mínim 8 caràcters.");
            return;
        }
        if (p !== confirm.trim()) {
            setError("Les contrasenyes no coincideixen.");
            return;
        }
        try {
            setLoading(true);
            setError("");
            await confirmPasswordReset(token, p);
            setDone(true);
            setTimeout(() => navigate("/login", { replace: true }), 2500);
        } catch (err) {
            const msg = err?.message ?? "No s'ha pogut restablir la contrasenya.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black p-4">
                <div className="w-full max-w-md bg-[#0d0d0d] rounded-2xl p-8 border border-white/5 text-center">
                    <h1 className="text-2xl font-bold text-white mb-3">Enllaç no vàlid</h1>
                    <p className="text-sm text-gray-400 mb-6">
                        Aquest enllaç no és correcte o ha caducat. Demana'n un de nou des de la pàgina d'inici de sessió.
                    </p>
                    <button
                        onClick={() => navigate("/oblidat-contrasenya")}
                        className="w-full py-3 rounded-xl font-bold text-black bg-gradient-to-r from-[#CC8400] to-[#E65100]"
                    >
                        Demanar un nou enllaç
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md bg-[#0d0d0d] rounded-2xl p-8 border border-white/5">
                <h1 className="text-2xl font-bold text-white mb-2">Nova contrasenya</h1>
                <p className="text-sm text-gray-400 mb-6">
                    Introdueix la teva nova contrasenya. Totes les sessions actives es tancaran per seguretat.
                </p>

                {!done ? (
                    <form onSubmit={submit} className="space-y-5">
                        <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 focus-within:bg-black/60 group">
                            <TbLockPassword className="text-2xl text-gray-400 group-focus-within:text-[#CC8400] transition-colors" />
                            <input
                                type={showPwd ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínim 8 caràcters"
                                autoFocus
                                className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-500 font-medium"
                            />
                        </div>

                        <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 focus-within:bg-black/60 group">
                            <TbLockPassword className="text-2xl text-gray-400 group-focus-within:text-[#CC8400] transition-colors" />
                            <input
                                type={showPwd ? "text" : "password"}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="Repeteix la contrasenya"
                                className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-500 font-medium"
                            />
                        </div>

                        <label className="flex items-center gap-3 text-sm text-gray-400 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={showPwd}
                                onChange={(e) => setShowPwd(e.target.checked)}
                                className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#CC8400]"
                            />
                            Mostra la contrasenya
                        </label>

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
                            {loading ? "Guardant..." : "Restablir contrasenya"}
                        </button>
                    </form>
                ) : (
                    <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-300">
                        Contrasenya actualitzada. Redirigint a inici de sessió…
                    </div>
                )}
            </div>
        </div>
    );
}
