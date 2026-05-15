import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/features/compte/perfil/components/toast/ProveidorToast";
import { useSecurityData } from "@/features/compte/perfil/hooks/useSecurityData";
import {
    revokeSession,
    revokeAllOtherSessions,
    updateSecuritySettings,
} from "@/api/securityApi";
import { logout } from "@/api/authApi";
import TwoFactorModal from "@/features/compte/perfil/components/TwoFactorModal";
import { formatUserAgent } from "@/utils/userAgent";

export default function CompteSeguretat() {
    const navigate = useNavigate();
    const { mostraToast } = useToast();
    const { sessions, history, settings, loading, error, reload, setSettings } = useSecurityData();

    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [recoveryPhone, setRecoveryPhone] = useState("");
    const [editingRecovery, setEditingRecovery] = useState(false);
    const [savingRecovery, setSavingRecovery] = useState(false);
    const [revoking, setRevoking] = useState(null);
    const [historyExpanded, setHistoryExpanded] = useState(false);
    const [twoFAModal, setTwoFAModal] = useState(null); // "enable" | "disable" | null

    const HISTORY_PREVIEW = 3;
    const historyVisible = historyExpanded ? history : history.slice(0, HISTORY_PREVIEW);
    const historyHasMore = history.length > HISTORY_PREVIEW;

    const startEditRecovery = () => {
        setRecoveryEmail(settings?.recovery_email || "");
        setRecoveryPhone(settings?.recovery_phone || "");
        setEditingRecovery(true);
    };

    const cancelEditRecovery = () => {
        setEditingRecovery(false);
    };

    const saveRecovery = async () => {
        setSavingRecovery(true);
        try {
            const payload = {
                recovery_email: recoveryEmail.trim() || null,
                recovery_phone: recoveryPhone.trim() || null,
            };
            await updateSecuritySettings(payload);
            setSettings((s) => ({ ...(s || {}), ...payload }));
            setEditingRecovery(false);
            mostraToast({ tipus: "exit", titol: "Recuperació actualitzada", missatge: "Dades de recuperació guardades.", duracio: 2500 });
        } catch (e) {
            mostraToast({ tipus: "error", titol: "Error", missatge: e?.message || "No s'ha pogut guardar.", duracio: 4000 });
        } finally {
            setSavingRecovery(false);
        }
    };

    const toggleLoginAlerts = async () => {
        const next = !settings?.login_alerts_enabled;
        try {
            await updateSecuritySettings({ login_alerts_enabled: next });
            setSettings((s) => ({ ...(s || {}), login_alerts_enabled: next }));
            mostraToast({ tipus: "exit", titol: "Alertes actualitzades", missatge: next ? "Alertes activades." : "Alertes desactivades.", duracio: 2200 });
        } catch (e) {
            mostraToast({ tipus: "error", titol: "Error", missatge: e?.message || "No s'ha pogut actualitzar.", duracio: 4000 });
        }
    };

    const handleRevokeOne = async (id) => {
        setRevoking(id);
        try {
            await revokeSession(id);
            await reload();
            mostraToast({ tipus: "exit", titol: "Sessió tancada", missatge: "S'ha revocat la sessió.", duracio: 2200 });
        } catch (e) {
            mostraToast({ tipus: "error", titol: "Error", missatge: e?.message || "No s'ha pogut revocar.", duracio: 4000 });
        } finally {
            setRevoking(null);
        }
    };

    const handleRevokeAll = async () => {
        if (!window.confirm("Vols tancar totes les altres sessions actives?")) return;
        try {
            await revokeAllOtherSessions();
            await reload();
            mostraToast({ tipus: "exit", titol: "Sessions tancades", missatge: "S'han tancat les altres sessions.", duracio: 2500 });
        } catch (e) {
            mostraToast({ tipus: "error", titol: "Error", missatge: e?.message || "No s'ha pogut completar.", duracio: 4000 });
        }
    };

    const handleLogoutAll = async () => {
        if (!window.confirm("Es tancaran TOTES les teves sessions, inclosa aquesta. Continuar?")) return;
        try {
            await revokeAllOtherSessions();
            logout();
            navigate("/");
        } catch (e) {
            mostraToast({ tipus: "error", titol: "Error", missatge: e?.message || "Error tancant sessions.", duracio: 4000 });
        }
    };

    if (loading) {
        return <div className="text-white/60 text-sm">Carregant dades de seguretat...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Capçalera */}
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                    Seguretat i inici de sessió
                </h1>
                <p className="max-w-3xl text-sm text-white/60">
                    Revisa l'activitat recent, gestiona les sessions actives i configura la teva recuperació de compte.
                </p>
            </header>

            {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            {/* Resum (3 cards) */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card
                    titol="Verificació 2FA"
                    valor={settings?.two_factor_enabled ? "Activada" : "Desactivada"}
                    estat={settings?.two_factor_enabled ? "actiu" : "inactiu"}
                    accio={settings?.two_factor_enabled ? "Desactiva" : "Activa"}
                    onAccio={() => setTwoFAModal(settings?.two_factor_enabled ? "disable" : "enable")}
                />
                <Card
                    titol="Contrasenya"
                    valor={settings?.password_changed_at ? `Canviada el ${formatDate(settings.password_changed_at)}` : "Mai canviada"}
                    accio="Canvia"
                    onAccio={() => navigate("/compte/contrasenya")}
                />
                <Card
                    titol="Sessions actives"
                    valor={`${settings?.active_sessions_count ?? sessions.length} dispositius`}
                    accio="Veure totes"
                    onAccio={() => document.getElementById("sessions-actives")?.scrollIntoView({ behavior: "smooth" })}
                />
            </section>

            {/* Activitat recent */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white/40">Activitat recent</h2>
                <div className="overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                    {history.length === 0 ? (
                        <div className="p-6 text-sm text-white/40">Encara no hi ha activitat registrada.</div>
                    ) : (
                        <>
                            {historyVisible.map((h, idx) => (
                                <div key={h.id} className={`flex items-start justify-between gap-4 px-6 py-4 ${idx > 0 ? "border-t border-white/5" : ""}`}>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-white/80 flex items-center gap-2">
                                            <span className={`inline-block h-2 w-2 rounded-full ${h.success ? "bg-emerald-400" : "bg-red-400"}`} />
                                            {h.success ? "Inici de sessió correcte" : "Intent fallit"}
                                        </div>
                                        <div className="text-xs text-white/45 mt-1">
                                            {formatDate(h.created_at)} · {h.ip_address || "IP desconeguda"}
                                        </div>
                                        <div className="text-xs text-white/40 mt-0.5">{formatUserAgent(h.user_agent)}</div>
                                    </div>
                                </div>
                            ))}
                            {historyHasMore && (
                                <button
                                    type="button"
                                    onClick={() => setHistoryExpanded((v) => !v)}
                                    className="flex w-full items-center justify-center gap-2 border-t border-white/5 px-6 py-3 text-xs font-semibold text-[#CC8400] hover:bg-white/[0.02] hover:text-[#FFB800] transition"
                                >
                                    {historyExpanded
                                        ? "Amaga"
                                        : `Veure ${history.length - HISTORY_PREVIEW} més`}
                                    <span className={`transition-transform duration-200 ${historyExpanded ? "rotate-180" : ""}`}>▾</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Sessions actives */}
            <section id="sessions-actives" className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-white/40">Sessions actives</h2>
                    {sessions.length > 1 && (
                        <button
                            type="button"
                            onClick={handleRevokeAll}
                            className="text-xs font-semibold text-[#CC8400] hover:text-[#FFB800] transition"
                        >
                            Tancar totes les altres
                        </button>
                    )}
                </div>
                <div className="overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                    {sessions.length === 0 ? (
                        <div className="p-6 text-sm text-white/40">Cap sessió activa.</div>
                    ) : (
                        sessions.map((s, idx) => (
                            <div key={s.id} className={`flex items-center justify-between gap-4 px-6 py-4 ${idx > 0 ? "border-t border-white/5" : ""}`}>
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-white/80 flex items-center gap-2">
                                        {s.is_current && (
                                            <span className="rounded-full bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                                                Aquesta sessió
                                            </span>
                                        )}
                                        {s.ip_address || "IP desconeguda"}
                                    </div>
                                    <div className="text-xs text-white/45 mt-1">
                                        Inici: {formatDate(s.created_at)} · Vista: {formatDate(s.last_seen)}
                                    </div>
                                    <div className="text-xs text-white/40 mt-0.5">{formatUserAgent(s.user_agent)}</div>
                                </div>
                                {!s.is_current && (
                                    <button
                                        type="button"
                                        onClick={() => handleRevokeOne(s.id)}
                                        disabled={revoking === s.id}
                                        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-50"
                                    >
                                        {revoking === s.id ? "Tancant..." : "Tancar"}
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Alertes login */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white/40">Notificacions de seguretat</h2>
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 flex items-center justify-between gap-4">
                    <div>
                        <div className="text-sm font-semibold text-white/85">Alerta a cada inici de sessió</div>
                        <div className="text-xs text-white/50 mt-1">Rep una notificació quan algú inicia sessió al teu compte.</div>
                    </div>
                    <Switch checked={!!settings?.login_alerts_enabled} onChange={toggleLoginAlerts} />
                </div>
            </section>

            {/* Recuperació */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white/40">Recuperació de compte</h2>
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 space-y-4">
                    {editingRecovery ? (
                        <>
                            <Field
                                label="Email de recuperació"
                                value={recoveryEmail}
                                onChange={setRecoveryEmail}
                                placeholder="email@exemple.com"
                                type="email"
                            />
                            <Field
                                label="Telèfon de recuperació"
                                value={recoveryPhone}
                                onChange={setRecoveryPhone}
                                placeholder="+34 600 000 000"
                                type="tel"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={cancelEditRecovery}
                                    className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/5"
                                >
                                    Cancel·la
                                </button>
                                <button
                                    type="button"
                                    onClick={saveRecovery}
                                    disabled={savingRecovery}
                                    className="rounded-lg px-4 py-2 text-xs font-bold text-black disabled:opacity-60"
                                    style={{ background: "linear-gradient(135deg, #FFB800 0%, #CC8400 100%)" }}
                                >
                                    {savingRecovery ? "Guardant..." : "Guarda"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Row label="Email" value={settings?.recovery_email || "—"} />
                            <Row label="Telèfon" value={settings?.recovery_phone || "—"} />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={startEditRecovery}
                                    className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-white"
                                >
                                    Editar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {twoFAModal && (
                <TwoFactorModal
                    mode={twoFAModal}
                    onClose={() => setTwoFAModal(null)}
                    onSuccess={async () => {
                        const enabling = twoFAModal === "enable";
                        setTwoFAModal(null);
                        await reload();
                        mostraToast({
                            tipus: "exit",
                            titol: enabling ? "2FA activada" : "2FA desactivada",
                            missatge: enabling
                                ? "El teu compte ara està protegit amb verificació en dos passos."
                                : "Has desactivat la verificació en dos passos.",
                            duracio: 3000,
                        });
                    }}
                />
            )}

            {/* Zona perillosa */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-red-400/70">Zona perillosa</h2>
                <div className="rounded-2xl bg-red-500/5 border border-red-500/20 p-5 flex items-center justify-between gap-4">
                    <div>
                        <div className="text-sm font-semibold text-red-200">Tancar totes les sessions</div>
                        <div className="text-xs text-red-200/60 mt-1">Et desconnectaràs de tots els dispositius, inclòs aquest.</div>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogoutAll}
                        className="rounded-lg border border-red-400/40 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10"
                    >
                        Tancar tot
                    </button>
                </div>
            </section>
        </div>
    );
}

/* ---------- Subcomponents ---------- */

function Card({ titol, valor, estat, accio, onAccio }) {
    return (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-widest text-white/45">{titol}</div>
            <div className="text-base font-semibold text-white/85 flex items-center gap-2">
                {estat && (
                    <span className={`inline-block h-2 w-2 rounded-full ${estat === "actiu" ? "bg-emerald-400" : "bg-white/30"}`} />
                )}
                {valor}
            </div>
            <button
                type="button"
                onClick={onAccio}
                className="self-start text-xs font-semibold text-[#CC8400] hover:text-[#FFB800] transition"
            >
                {accio} →
            </button>
        </div>
    );
}

function Switch({ checked, onChange }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-[#CC8400]" : "bg-white/15"}`}
        >
            <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-[1.4rem]" : "left-0.5"}`}
            />
        </button>
    );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#CC8400] uppercase tracking-widest opacity-80">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-white outline-none focus:border-[#CC8400]/50 focus:bg-white/[0.07] transition placeholder-white/25"
            />
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="text-xs uppercase tracking-wider text-white/40">{label}</div>
            <div className="text-sm font-semibold text-white/80">{value}</div>
        </div>
    );
}

function formatDate(iso) {
    if (!iso) return "—";
    try {
        const d = new Date(iso);
        return d.toLocaleString("ca-ES", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    } catch {
        return iso;
    }
}
