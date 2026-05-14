import { useState } from "react";
import { HiBellAlert, HiInformationCircle, HiExclamationTriangle, HiCheck } from "react-icons/hi2";

export default function AdminNotifications() {
    const [message, setMessage] = useState("");
    const [type, setType] = useState("info");
    const [sent, setSent] = useState(false);

    const types = [
        { id: "info", label: "Informació", icon: HiInformationCircle, color: "text-blue-400", bg: "bg-blue-500/10" },
        { id: "warning", label: "Avís", icon: HiExclamationTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
        { id: "alert", label: "Crític", icon: HiBellAlert, color: "text-rose-400", bg: "bg-rose-500/10" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message) return;
        
        // Aquí s'hauria de cridar a l'API per guardar la notificació
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setMessage("");
        }, 3000);
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <header>
                <h1 className="text-2xl font-bold text-white">Notificacions Global</h1>
                <p className="text-sm text-white/50 mt-1">Crea missatges que apareixeran a tots els usuaris quan iniciïn sessió.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#CC8400]">Missatge</label>
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escriu el missatge de la notificació..."
                        rows={4}
                        className="w-full bg-[#141414] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-[#CC8400]/50 transition-colors placeholder:text-white/20"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#CC8400]">Tipus de Notificació</label>
                    <div className="grid grid-cols-3 gap-3">
                        {types.map((t) => {
                            const Icon = t.icon;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setType(t.id)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                                        type === t.id 
                                        ? `border-[#CC8400] bg-[#CC8400]/10` 
                                        : "border-white/5 bg-[#141414] hover:bg-white/5"
                                    }`}
                                >
                                    <Icon className={`h-6 w-6 ${t.color}`} />
                                    <span className="text-[10px] font-bold text-white uppercase">{t.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={sent || !message}
                    className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                        sent 
                        ? "bg-emerald-500 text-white" 
                        : "bg-[#CC8400] hover:bg-[#B37400] text-white shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    }`}
                >
                    {sent ? (
                        <>
                            <HiCheck className="h-5 w-5" />
                            Enviat amb èxit
                        </>
                    ) : (
                        "Generar Notificació"
                    )}
                </button>
            </form>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4">
                <HiInformationCircle className="h-6 w-6 text-blue-400 shrink-0" />
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Com funciona?</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                        Aquesta notificació s'emmagatzemarà a la base de dades i es mostrarà com un banner o popup 
                        quan l'usuari accedeixi a la Home. Un cop l'usuari la tanqui, no tornarà a aparèixer.
                    </p>
                </div>
            </div>
        </div>
    );
}
