import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbLockPassword } from "react-icons/tb";
import { MdAlternateEmail } from "react-icons/md";
import { IoMdContact } from "react-icons/io";
import { getToken, login, register } from "../../api/authApi";
import { getRedirectPath } from "../../components/ProtectedRoute";

export const LoginSingup = () => {
    const [action, setAction] = useState("Iniciar Sessió"); // o "Registrarse"
    const navigate = useNavigate();

    useEffect(() => {
        if (getToken()) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    // Inputs controlats
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    // UI state
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", text: "" }); // type: success|error|info

    const isRegister = action === "Registrarse";

    const canSubmit = useMemo(() => {
        if (isRegister) return form.username.trim() && form.email.trim() && form.password.trim();
        return form.email.trim() && form.password.trim();
    }, [form, isRegister]);

    const setField = (key) => (e) => {
        setFeedback({ type: "", text: "" });
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const submitRegister = async () => {
        if (!canSubmit) {
            setFeedback({ type: "error", text: "Omple username, email i contrasenya." });
            return;
        }

        setLoading(true);
        setFeedback({ type: "", text: "" });

        try {
            const data = await register(
                form.username.trim(),
                form.email.trim(),
                form.password
            );

            setFeedback({ type: "success", text: `Usuari creat! (id: ${data.id ?? "?"})` });
            setAction("Iniciar Sessió");
            setForm({ username: "", email: "", password: "" });
        } catch (e) {
            setFeedback({ type: "error", text: e?.message || "Error creant usuari" });
        } finally {
            setLoading(false);
        }
    };

    const submitLogin = async () => {
        if (!canSubmit) {
            setFeedback({ type: "error", text: "Omple usuari/email i contrasenya." });
            return;
        }

        setLoading(true);
        setFeedback({ type: "", text: "" });

        try {
            await login(form.email.trim(), form.password);

            setFeedback({ type: "success", text: "Sessió iniciada. Redirigint.." });
            const redirectPath = getRedirectPath() || "/";
            navigate(redirectPath);
        } catch (e) {
            setFeedback({ type: "error", text: e?.message || "Error fent login" });
        } finally {
            setLoading(false);
        }
    };

    const handleTabClick = (nextAction) => {
        setFeedback({ type: "", text: "" });

        // 1r click: canvia mode
        if (action !== nextAction) {
            setAction(nextAction);
            return;
        }

        // 2n click (mateix mode): submit
        if (nextAction === "Registrarse") submitRegister();
        else submitLogin();
    };

    const feedbackBox =
        feedback.text && (
            <div
                className={`mt-5 rounded-xl border px-4 py-3 text-sm ${feedback.type === "success"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : feedback.type === "error"
                            ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                            : "border-white/10 bg-white/5 text-gray-200"
                    }`}
            >
                {feedback.text}
            </div>
        );

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-black text-white font-sans">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#CC8400] rounded-full blur-[120px] opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E65100] rounded-full blur-[120px] opacity-30 animate-pulse"></div>

            <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                {/* Decorative border gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#CC8400] via-[#E65100] to-[#CC8400]"></div>

                <div className="flex flex-col items-center gap-2 mb-6">
                    <h2 className="text-4xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent text-center">
                        {action}
                    </h2>
                    <div className="w-16 h-1 bg-[#CC8400] rounded-full"></div>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (isRegister) submitRegister();
                        else submitLogin();
                    }}
                    className="flex flex-col gap-5"
                >
                    {isRegister && (
                        <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 focus-within:bg-black/60 group">
                            <IoMdContact className="text-2xl text-gray-400 group-focus-within:text-[#CC8400] transition-colors" />
                            <input
                                type="text"
                                value={form.username}
                                onChange={setField("username")}
                                placeholder="Nom d'usuari"
                                className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-500 font-medium"
                            />
                        </div>
                    )}

                    <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 focus-within:bg-black/60 group">
                        <MdAlternateEmail className="text-2xl text-gray-400 group-focus-within:text-[#CC8400] transition-colors" />
                        <input
                            type={isRegister ? "email" : "text"}
                            value={form.email}
                            onChange={setField("email")}
                            placeholder={isRegister ? "Correu Electronic" : "Usuari o Email"}
                            className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-500 font-medium"
                        />
                    </div>

                    <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 focus-within:bg-black/60 group">
                        <TbLockPassword className="text-2xl text-gray-400 group-focus-within:text-[#CC8400] transition-colors" />
                        <input
                            type="password"
                            value={form.password}
                            onChange={setField("password")}
                            placeholder="Contrasenya"
                            className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-500 font-medium"
                        />
                    </div>

                    {/* Submit per Enter */}
                    <button type="submit" className="hidden">
                        Submit
                    </button>
                </form>

                {action === "Iniciar Sessió" && (
                    <div className="mt-4 text-right">
                        <div className="text-sm text-gray-400 hover:text-[#CC8400] cursor-pointer transition-colors duration-300">
                            Contrasenya oblidada? <span className="text-[#CC8400] font-semibold">Fes Clic Aqui!</span>
                        </div>
                    </div>
                )}

                {feedbackBox}

                <div className="flex gap-4 mt-8">
                    <button
                        type="button"
                        disabled={loading}
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl font-bold text-lg cursor-pointer transition-all duration-300 ${action === "Iniciar Sessió"
                                ? "bg-gradient-to-r from-[#CC8400] to-[#E65100] text-black shadow-lg shadow-orange-900/40 transform scale-105"
                                : "bg-black/30 text-gray-400 hover:bg-black/50"
                            } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                        onClick={() => handleTabClick("Iniciar Sessió")}
                        title={action === "Iniciar Sessió" ? "Torna a clicar per enviar" : "Canviar a Login"}
                    >
                        {loading && action === "Iniciar Sessió" ? "Enviant..." : "Iniciar Sessió"}
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl font-bold text-lg cursor-pointer transition-all duration-300 ${action === "Registrarse"
                                ? "bg-gradient-to-r from-[#CC8400] to-[#E65100] text-black shadow-lg shadow-orange-900/40 transform scale-105"
                                : "bg-black/30 text-gray-400 hover:bg-black/50"
                            } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                        onClick={() => handleTabClick("Registrarse")}
                        title={action === "Registrarse" ? "Torna a clicar per enviar" : "Canviar a Registre"}
                    >
                        {loading && action === "Registrarse" ? "Enviant..." : "Registrarse"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginSingup;
