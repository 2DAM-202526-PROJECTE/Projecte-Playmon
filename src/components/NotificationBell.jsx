import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    HiBell, HiXMark, HiInformationCircle, HiExclamationTriangle,
    HiBellAlert, HiCheckCircle, HiArrowPath,
} from 'react-icons/hi2'
import { getNotifications, markRead, markAllRead, deleteNotification } from '@/api/notificationsApi'
import { isLoggedIn } from '@/api/authApi'

const TYPE_CONFIG = {
    info:    { icon: HiInformationCircle, color: 'text-blue-400',   border: 'border-blue-500/40',   bg: 'bg-blue-500/8'   },
    warning: { icon: HiExclamationTriangle, color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/8'  },
    alert:   { icon: HiBellAlert,          color: 'text-rose-400',   border: 'border-rose-500/40',   bg: 'bg-rose-500/8'   },
}

function formatRelTime(iso) {
    if (!iso) return ''
    const diff = Date.now() - new Date(iso)
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Ara mateix'
    if (mins < 60) return `Fa ${mins} min`
    const h = Math.floor(mins / 60)
    if (h < 24) return `Fa ${h}h`
    const d = Math.floor(h / 24)
    return d === 1 ? 'Ahir' : `Fa ${d} dies`
}

export default function NotificationBell() {
    const [open, setOpen] = useState(false)
    const [notifs, setNotifs] = useState([])
    const [loading, setLoading] = useState(false)
    const panelRef = useRef(null)
    const bellRef = useRef(null)

    const unread = notifs.filter(n => !n.is_read).length

    const fetchNotifs = useCallback(async () => {
        if (!isLoggedIn()) return
        try {
            const data = await getNotifications()
            setNotifs(data || [])
        } catch {
            // silenci si falla
        }
    }, [])

    // Carrega inicial + polling cada 60s
    useEffect(() => {
        fetchNotifs()
        const interval = setInterval(fetchNotifs, 60000)
        return () => clearInterval(interval)
    }, [fetchNotifs])

    // Tanca en clicar fora
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target) &&
                bellRef.current && !bellRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleOpen = () => {
        setOpen(o => !o)
    }

    const handleMarkRead = async (notif) => {
        if (notif.is_read) return
        setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n))
        try { await markRead(notif.id) } catch { fetchNotifs() }
    }

    const handleMarkAll = async () => {
        setLoading(true)
        setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))
        try { await markAllRead() } catch { fetchNotifs() }
        setLoading(false)
    }

    const handleDelete = async (e, notif) => {
        e.stopPropagation()
        setNotifs(prev => prev.filter(n => n.id !== notif.id))
        try { await deleteNotification(notif.id) } catch { fetchNotifs() }
    }

    if (!isLoggedIn()) return null

    return (
        <div className="relative">
            {/* Botó campana */}
            <button
                ref={bellRef}
                onClick={handleOpen}
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                    ${open ? 'bg-white/12 text-white' : 'text-white/60 hover:text-white hover:bg-white/8'}`}
            >
                <HiBell className="text-xl" />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full
                                     bg-rose-500 text-white text-[9px] font-black flex items-center justify-center
                                     shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {/* Panel dropdown */}
            {open && (
                <div
                    ref={panelRef}
                    className="absolute right-0 top-12 w-[360px] max-h-[520px] flex flex-col
                               bg-[#111111] border border-white/10 rounded-2xl shadow-2xl z-[200] overflow-hidden"
                    style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)' }}
                >
                    {/* Capçalera */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <HiBell className="text-white/60 text-base" />
                            <span className="text-white font-bold text-sm">Notificacions</span>
                            {unread > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold">
                                    {unread} noves
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unread > 0 && (
                                <button
                                    onClick={handleMarkAll}
                                    disabled={loading}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold
                                               text-white/50 hover:text-white/80 hover:bg-white/6 transition-all"
                                    title="Marcar totes com llegides"
                                >
                                    {loading
                                        ? <HiArrowPath className="text-xs animate-spin" />
                                        : <HiCheckCircle className="text-xs" />
                                    }
                                    Llegir tot
                                </button>
                            )}
                            <button onClick={() => setOpen(false)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/8 transition-all">
                                <HiXMark className="text-sm" />
                            </button>
                        </div>
                    </div>

                    {/* Llista */}
                    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
                        {notifs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <HiBell className="text-white/10 text-4xl mb-3" />
                                <p className="text-white/40 text-sm font-medium">Sense notificacions</p>
                                <p className="text-white/25 text-xs mt-1">Aquí apareixeran els avisos de la teva subscripció.</p>
                            </div>
                        ) : (
                            <div className="p-2 flex flex-col gap-1">
                                {notifs.map(notif => {
                                    const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info
                                    const Icon = cfg.icon
                                    return (
                                        <div
                                            key={notif.id}
                                            onClick={() => handleMarkRead(notif)}
                                            className={`group relative flex gap-3 p-3 rounded-xl border-l-2 cursor-pointer transition-all duration-150
                                                ${cfg.border} ${cfg.bg}
                                                ${notif.is_read ? 'opacity-55 hover:opacity-80' : 'hover:brightness-110'}`}
                                            style={{ background: notif.is_read ? 'rgba(255,255,255,0.02)' : undefined }}
                                        >
                                            <Icon className={`${cfg.color} text-lg flex-shrink-0 mt-0.5`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-xs font-bold leading-tight ${notif.is_read ? 'text-white/55' : 'text-white'}`}>
                                                        {notif.title}
                                                    </p>
                                                    {!notif.is_read && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1" />
                                                    )}
                                                </div>
                                                <p className="text-white/45 text-[11px] leading-relaxed mt-0.5 line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <p className="text-white/25 text-[10px] mt-1.5">
                                                    {formatRelTime(notif.created_at)}
                                                    {notif.is_global && <span className="ml-2 opacity-60">· Global</span>}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => handleDelete(e, notif)}
                                                className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md flex items-center justify-center
                                                           text-white/30 hover:text-white/70 hover:bg-white/10 transition-all flex-shrink-0 mt-0.5"
                                            >
                                                <HiXMark className="text-xs" />
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifs.length > 0 && (
                        <div className="px-4 py-2.5 border-t border-white/8 flex-shrink-0">
                            <p className="text-white/25 text-[10px] text-center">
                                {notifs.length} notificació{notifs.length !== 1 ? 'ns' : ''}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
