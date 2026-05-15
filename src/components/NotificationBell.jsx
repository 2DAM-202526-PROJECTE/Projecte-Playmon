import { useCallback, useEffect, useRef, useState } from "react";
import { HiBell } from "react-icons/hi2";
import {
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
} from "@/api/notificationsApi";
import { isLoggedIn } from "@/api/authApi";

const POLL_MS = 30000;

export default function NotificationBell() {
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    const reload = useCallback(async () => {
        if (!isLoggedIn()) return;
        try {
            const data = await fetchNotifications();
            setItems(Array.isArray(data) ? data : []);
        } catch {
            // ignora errors de xarxa puntuals
        }
    }, []);

    useEffect(() => {
        reload();
        const id = setInterval(reload, POLL_MS);
        return () => clearInterval(id);
    }, [reload]);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (!ref.current || ref.current.contains(e.target)) return;
            setOpen(false);
        };
        if (open) document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, [open]);

    const unreadCount = items.filter((n) => !n.is_read).length;

    const handleMarkRead = async (n) => {
        if (n.is_read) return;
        try {
            await markNotificationRead(n.id);
            setItems((prev) => prev.map((it) => it.id === n.id ? { ...it, is_read: true } : it));
        } catch { /* noop */ }
    };

    const handleMarkAll = async () => {
        setLoading(true);
        try {
            await markAllNotificationsRead();
            setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch { /* noop */ } finally { setLoading(false); }
    };

    const handleDelete = async (n) => {
        try {
            await deleteNotification(n.id);
            setItems((prev) => prev.filter((it) => it.id !== n.id));
        } catch { /* noop */ }
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="relative h-10 w-10 grid place-items-center rounded-full text-white/70 hover:text-white hover:bg-white/5 transition"
                aria-label="Notificacions"
            >
                <HiBell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-[#CC8400] text-[10px] font-bold text-black px-1">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 z-50 w-[360px] max-h-[480px] overflow-hidden rounded-2xl bg-[#0f0f0f] border border-white/10 shadow-2xl flex flex-col">
                    <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <h3 className="text-sm font-bold text-white">Notificacions</h3>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAll}
                                disabled={loading}
                                className="text-xs font-semibold text-[#CC8400] hover:text-[#FFB800] disabled:opacity-50"
                            >
                                Marca totes
                            </button>
                        )}
                    </header>
                    <div className="overflow-y-auto flex-1">
                        {items.length === 0 ? (
                            <div className="p-6 text-center text-sm text-white/40">Sense notificacions.</div>
                        ) : (
                            items.map((n) => (
                                <div
                                    key={`${n.is_global ? "g" : "p"}-${n.id}`}
                                    onClick={() => handleMarkRead(n)}
                                    className={`group flex items-start gap-3 px-4 py-3 border-b border-white/5 cursor-pointer transition ${n.is_read ? "opacity-60" : "bg-white/[0.02] hover:bg-white/[0.05]"}`}
                                >
                                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.is_read ? "bg-white/20" : typeColor(n.type)}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-white/85 truncate">{n.title}</div>
                                        <div className="text-xs text-white/55 mt-0.5 line-clamp-2">{n.message}</div>
                                        <div className="text-[10px] text-white/35 mt-1">{formatTime(n.created_at)}</div>
                                    </div>
                                    {!n.is_global && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(n); }}
                                            className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition text-lg leading-none"
                                            aria-label="Eliminar"
                                        >×</button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function typeColor(type) {
    if (type === "alert") return "bg-red-400";
    if (type === "warning") return "bg-amber-400";
    return "bg-[#CC8400]";
}

function formatTime(iso) {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        const diff = (Date.now() - d.getTime()) / 1000;
        if (diff < 60) return "Ara mateix";
        if (diff < 3600) return `Fa ${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `Fa ${Math.floor(diff / 3600)} h`;
        return d.toLocaleDateString("ca-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch {
        return iso;
    }
}
