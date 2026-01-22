import React, { useState } from 'react'
import { TbLockPassword } from "react-icons/tb";
import { MdAlternateEmail } from "react-icons/md";
import { IoMdContact } from "react-icons/io";

export const LoginSingup = () => {
    const [action, setAction] = useState("Iniciar Sessió");

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-black text-white font-sans">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#CC8400] rounded-full blur-[120px] opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E65100] rounded-full blur-[120px] opacity-30 animate-pulse"></div>

            <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                {/* Decorative border gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#CC8400] via-[#E65100] to-[#CC8400]"></div>

                <div className="flex flex-col items-center gap-2 mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent text-center">
                        {action}
                    </h2>
                    <div className="w-16 h-1 bg-[#CC8400] rounded-full"></div>
                </div>

                <div className="flex flex-col gap-5">
                    {action === "Registrarse" && (
                        <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 focus-within:bg-black/60 group">
                            <IoMdContact className="text-2xl text-gray-400 group-focus-within:text-[#CC8400] transition-colors" />
                            <input
                                type="text"
                                placeholder="Nom d'usuari"
                                className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-500 font-medium"
                            />
                        </div>
                    )}

                    <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 focus-within:bg-black/60 group">
                        <MdAlternateEmail className="text-2xl text-gray-400 group-focus-within:text-[#CC8400] transition-colors" />
                        <input
                            type="email"
                            placeholder="Correu Electronic"
                            className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-500 font-medium"
                        />
                    </div>

                    <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 transition-all focus-within:border-[#CC8400]/50 focus-within:bg-black/60 group">
                        <TbLockPassword className="text-2xl text-gray-400 group-focus-within:text-[#CC8400] transition-colors" />
                        <input
                            type="password"
                            placeholder="Contrasenya"
                            className="bg-transparent border-none outline-none text-white pl-4 w-full placeholder-gray-500 font-medium"
                        />
                    </div>
                </div>

                {action === "Iniciar Sessió" && (
                    <div className="mt-4 text-right">
                        <div className="text-sm text-gray-400 hover:text-[#CC8400] cursor-pointer transition-colors duration-300">
                            Contrasenya oblidada? <span className="text-[#CC8400] font-semibold">Fes Clic Aqui!</span>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 mt-8">
                    <div
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl font-bold text-lg cursor-pointer transition-all duration-300 ${action === "Iniciar Sessió" ? "bg-gradient-to-r from-[#CC8400] to-[#E65100] text-black shadow-lg shadow-orange-900/40 transform scale-105" : "bg-black/30 text-gray-400 hover:bg-black/50"}`}
                        onClick={() => setAction("Iniciar Sessió")}
                    >
                        Iniciar Sessió
                    </div>
                    <div
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl font-bold text-lg cursor-pointer transition-all duration-300 ${action === "Registrarse" ? "bg-gradient-to-r from-[#CC8400] to-[#E65100] text-black shadow-lg shadow-orange-900/40 transform scale-105" : "bg-black/30 text-gray-400 hover:bg-black/50"}`}
                        onClick={() => setAction("Registrarse")}
                    >
                        Registrarse
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginSingup