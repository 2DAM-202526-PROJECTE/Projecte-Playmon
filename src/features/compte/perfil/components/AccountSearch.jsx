import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    HiMagnifyingGlass, HiUser, HiStar, HiBookmark, HiClock,
    HiLockClosed, HiKey, HiCreditCard, HiShieldCheck,
    HiAtSymbol, HiIdentification, HiEnvelope,
    HiBolt, HiArrowRightOnRectangle,
    HiDevicePhoneMobile, HiPencil,
} from 'react-icons/hi2'

// ── Design tokens (match project palette) ──────────────────────────────────
const AMBER      = '#CC8400'
const AMBER_HOT  = '#FFB800'
const BORDER     = 'rgba(204,132,0,0.18)'
const BORDER_MID = 'rgba(204,132,0,0.32)'
const BORDER_HOT = 'rgba(204,132,0,0.55)'
const TEXT       = '#f5efe4'
const TEXT_DIM   = 'rgba(184,173,156,0.85)'
const TEXT_MUTE  = 'rgba(122,112,101,1)'

// ── Inject toast keyframe once ──────────────────────────────────────────────
if (!document.getElementById('__pm-search-styles')) {
    const s = document.createElement('style')
    s.id = '__pm-search-styles'
    s.textContent = `
        @keyframes pm-toast-in {
            from { opacity: 0; transform: translate(-50%, 6px) scale(0.96); }
            to   { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        [data-playmon-search="1"] input::placeholder { color: ${TEXT_MUTE}; }
    `
    document.head.appendChild(s)
}

// ── Search dataset (built from real user data + real routes) ────────────────
function buildItems(user) {
    const username  = user?.username ?? 'usuari'
    const nom       = user?.name ?? 'Usuari'
    const email     = user?.email ?? ''
    const planRaw   = (user?.plan || 'basic').toLowerCase().trim()
    const planLabel = { ultra: 'Ultra', super: 'Super', basic: 'Bàsic' }[planRaw] ?? 'Bàsic'

    return [
        // Configuració — subpàgines de compte
        { id:'page-info',  cat:'Configuració', title:'Informació personal',         sub:'Nom, idioma, regió',                  icon:HiUser,                 route:'/compte/informacio-personal' },
        { id:'page-fav',   cat:'Configuració', title:'Favorits',                    sub:'Sèries i pel·lícules guardades',      icon:HiStar,                 route:'/compte/favorits' },
        { id:'page-later', cat:'Configuració', title:'Veure més tard',              sub:'La teva cua de visualització',        icon:HiBookmark,             route:'/compte/llista' },
        { id:'page-hist',  cat:'Configuració', title:'Historial de visualització',  sub:'Tot el que has vist',                 icon:HiClock,                route:'/compte/historial' },
        { id:'page-sec',   cat:'Configuració', title:'Seguretat i inici de sessió', sub:'2FA, sessions actives, alertes',      icon:HiShieldCheck,          route:'/compte/seguretat' },
        { id:'page-pwd',   cat:'Configuració', title:'Contrasenya',                 sub:'Canvia la teva contrasenya',          icon:HiKey,                  route:'/compte/contrasenya' },
        { id:'page-pay',   cat:'Configuració', title:'Pagaments i subscripcions',   sub:'Pla, factures, mètodes de pagament',  icon:HiCreditCard,           route:'/compte/pagaments' },
        { id:'page-dev',   cat:'Configuració', title:'Dispositius i connexions',    sub:'Sessions actives',                    icon:HiDevicePhoneMobile,    route:'/compte/connexions' },

        // El teu compte — dades de l'usuari actiu
        { id:'f-user',  cat:'El teu compte', title:"Nom d'usuari",       sub:`@${username}`,  icon:HiAtSymbol },
        { id:'f-name',  cat:'El teu compte', title:'Nom',                 sub:nom,             icon:HiIdentification },
        { id:'f-email', cat:'El teu compte', title:'Correu electrònic',   sub:email,           icon:HiEnvelope,  badge:'Verificat' },
        { id:'f-plan',  cat:'El teu compte', title:'Pla de subscripció',  sub:planLabel,       icon:HiCreditCard, route:'/compte/pagaments' },

        // Subscripció
        { id:'sub-plan',   cat:'Subscripció', title:`Pla ${planLabel}`,        sub:'Gestiona el teu pla',                        icon:HiBolt,                  badge:'Actiu', route:'/compte/pagaments' },
        { id:'sub-chg',    cat:'Subscripció', title:'Canviar de pla',           sub:'Bàsic · Super · Ultra',                      icon:HiBolt,                  route:'/compte/pagaments' },
        { id:'sub-cancel', cat:'Subscripció', title:'Cancel·lar subscripció',   sub:"Mantindrà accés fins al final del cicle",     icon:HiArrowRightOnRectangle, danger:true, route:'/compte/pagaments' },

        // Factures
        { id:'pay-bills', cat:'Factures', title:'Veure totes les factures', sub:'Historial de pagaments i rebuts',   icon:HiCreditCard, route:'/compte/pagaments' },

        // Dispositius
        { id:'dev-all',    cat:'Dispositius', title:'Gestionar dispositius',               sub:'Sessions actives i connexions',   icon:HiDevicePhoneMobile, route:'/compte/connexions' },
        { id:'dev-logout', cat:'Dispositius', title:'Tancar sessió a tots els dispositius', sub:'Forçar revalidació',             icon:HiArrowRightOnRectangle, danger:true, route:'/compte/connexions' },

        // Seguretat
        { id:'sec-2fa',    cat:'Seguretat', title:'Verificació en 2 passos',  sub:'Activada',                            icon:HiShieldCheck,           badge:'On', route:'/compte/seguretat' },
        { id:'sec-pwd',    cat:'Seguretat', title:'Canviar contrasenya',      sub:'Última actualització',                icon:HiKey,                   route:'/compte/contrasenya' },
        { id:'sec-activ',  cat:'Seguretat', title:'Activitat recent',          sub:'Inicis de sessió dels últims 30 dies', icon:HiClock,                route:'/compte/seguretat' },

        // Historial
        { id:'h-all', cat:'Historial', title:'Veure historial complet', sub:'Tot el que has vist a Playmon', icon:HiClock, route:'/compte/historial' },

        // Accions
        { id:'a-edit',    cat:'Accions', title:'Editar perfil',       sub:'Canvia el teu nom o avatar',  icon:HiPencil,               action:'edit' },
        { id:'a-upgrade', cat:'Accions', title:'Millorar el meu pla', sub:'Accedeix a més contingut',    icon:HiBolt,                 route:'/compte/pagaments' },
        { id:'a-logout',  cat:'Accions', title:'Tancar sessió',        sub:'',                            icon:HiArrowRightOnRectangle, danger:true, action:'logout' },
    ]
}

// ── Matching helpers ────────────────────────────────────────────────────────
function normalize(s) {
    return (s || '').toString().toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function scoreItem(item, q) {
    if (!q) return 0
    const nq = normalize(q)
    const t  = normalize(item.title)
    const s  = normalize(item.sub)
    const c  = normalize(item.cat)
    if (t === nq)         return 1000
    if (t.startsWith(nq)) return 800
    if (t.includes(nq))   return 600
    if (s.includes(nq))   return 400
    if (c.includes(nq))   return 200
    return 0
}

function filterItems(all, q, limit = 12) {
    if (!q || !q.trim()) {
        const seen = new Set()
        const out  = []
        for (const it of all) {
            if (seen.has(it.cat)) continue
            seen.add(it.cat)
            out.push(it)
            if (out.length >= 7) break
        }
        return out
    }
    return all
        .map(it => ({ it, s: scoreItem(it, q) }))
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, limit)
        .map(x => x.it)
}

function groupByCat(items) {
    const groups = []
    const byCat  = {}
    for (const it of items) {
        if (!byCat[it.cat]) {
            byCat[it.cat] = { cat: it.cat, items: [] }
            groups.push(byCat[it.cat])
        }
        byCat[it.cat].items.push(it)
    }
    return groups
}

// ── Highlight matching substring in amber ───────────────────────────────────
function Highlight({ text, query }) {
    if (!query || !query.trim()) return <>{text}</>
    const nText = normalize(text)
    const nQ    = normalize(query)
    const i     = nText.indexOf(nQ)
    if (i === -1) return <>{text}</>
    return (
        <>
            {text.slice(0, i)}
            <span style={{
                color: AMBER_HOT, fontWeight: 600,
                background: 'rgba(204,132,0,0.14)', borderRadius: 3, padding: '0 2px',
            }}>
                {text.slice(i, i + query.length)}
            </span>
            {text.slice(i + query.length)}
        </>
    )
}

// ── Small keyboard hint ─────────────────────────────────────────────────────
function Hint({ k, label }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <kbd style={{
                fontFamily: 'monospace', fontSize: 10, padding: '2px 6px',
                borderRadius: 4, color: TEXT_DIM,
                background: 'rgba(0,0,0,0.4)', border: `1px solid ${BORDER}`,
            }}>{k}</kbd>
            <span>{label}</span>
        </span>
    )
}

// ── No results state ────────────────────────────────────────────────────────
function NoResults({ query }) {
    return (
        <div style={{ padding: '36px 20px', textAlign: 'center' }}>
            <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(204,132,0,0.06)', border: `1px solid ${BORDER}`,
                margin: '0 auto 12px', display: 'grid', placeItems: 'center',
                color: TEXT_MUTE,
            }}>
                <HiMagnifyingGlass style={{ width: 20, height: 20 }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, marginBottom: 4 }}>
                Cap resultat per &ldquo;{query}&rdquo;
            </div>
            <div style={{ fontSize: 12.5, color: TEXT_DIM }}>
                Prova amb&nbsp;
                <em style={{ color: AMBER, fontStyle: 'normal' }}>pla</em>,&nbsp;
                <em style={{ color: AMBER, fontStyle: 'normal' }}>factura</em> o&nbsp;
                <em style={{ color: AMBER, fontStyle: 'normal' }}>dispositiu</em>.
            </div>
        </div>
    )
}

// ── Toast shown after selecting an item ────────────────────────────────────
function SelectToast({ item }) {
    const Ico = item.icon
    return (
        <div style={{
            position: 'absolute', top: -54, left: '50%', transform: 'translateX(-50%)',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '9px 16px 9px 12px', borderRadius: 999,
            background: 'linear-gradient(180deg, rgba(30,20,8,0.97), rgba(18,12,5,0.97))',
            border: `1px solid ${BORDER_HOT}`,
            boxShadow: `0 10px 30px rgba(0,0,0,0.55), 0 0 30px rgba(204,132,0,0.22)`,
            color: TEXT, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
            animation: 'pm-toast-in 0.35s cubic-bezier(.2,.9,.3,1.2)',
            zIndex: 60,
        }}>
            <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'rgba(204,132,0,0.18)', border: `1px solid ${BORDER_MID}`,
                display: 'grid', placeItems: 'center', color: AMBER_HOT,
            }}>
                <Ico style={{ width: 12, height: 12 }} />
            </div>
            <span style={{ color: TEXT_DIM }}>Obrint</span>
            <span style={{ color: AMBER_HOT, fontWeight: 600 }}>{item.title}</span>
            <span style={{ color: AMBER, fontSize: 14 }}>→</span>
        </div>
    )
}

// ── Main component ──────────────────────────────────────────────────────────
export default function AccountSearch({ user, onEditProfile }) {
    const navigate = useNavigate()

    const [open,   setOpen]   = useState(false)
    const [query,  setQuery]  = useState('')
    const [active, setActive] = useState(0)
    const [toast,  setToast]  = useState(null)

    const containerRef = useRef(null)
    const inputRef     = useRef(null)

    const allItems = useMemo(() => buildItems(user), [user])
    const results  = useMemo(() => filterItems(allItems, query), [allItems, query])
    const groups   = useMemo(() => groupByCat(results), [results])
    const isEmptyQ = !query.trim()

    useEffect(() => { setActive(0) }, [query])

    // Close on click outside
    useEffect(() => {
        if (!open) return
        const onDown = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        return () => document.removeEventListener('mousedown', onDown)
    }, [open])

    // ⌘K / Ctrl+K shortcut
    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault()
                inputRef.current?.focus()
                setOpen(true)
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    // Toast auto-dismiss
    useEffect(() => {
        if (!toast) return
        const t = setTimeout(() => setToast(null), 2200)
        return () => clearTimeout(t)
    }, [toast])

    const selectItem = (item) => {
        setToast(item)
        setOpen(false)
        setQuery('')
        inputRef.current?.blur()
        if (item.action === 'edit')   { onEditProfile?.(); return }
        if (item.action === 'logout') { navigate('/logout'); return }
        if (item.route)               { navigate(item.route) }
    }

    const onKeyDown = (e) => {
        if (e.key === 'Escape') {
            setOpen(false)
            inputRef.current?.blur()
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (results.length) setActive(i => (i + 1) % results.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (results.length) setActive(i => (i - 1 + results.length) % results.length)
        } else if (e.key === 'Enter') {
            if (results[active]) { e.preventDefault(); selectItem(results[active]) }
        }
    }

    return (
        <div ref={containerRef} data-playmon-search="1" style={{ position: 'relative' }}>
            {/* ── Input pill ── */}
            <div
                style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '0 18px', height: 52, borderRadius: 999,
                    background: 'rgba(8,6,3,0.7)',
                    border: `1px solid ${open ? BORDER_HOT : BORDER_MID}`,
                    boxShadow: open
                        ? `0 0 0 4px rgba(204,132,0,0.08), 0 20px 50px -20px rgba(204,132,0,0.38)`
                        : `inset 0 0 30px rgba(204,132,0,0.05)`,
                    transition: 'box-shadow 0.18s, border-color 0.18s',
                    cursor: 'text',
                }}
                onClick={() => { inputRef.current?.focus(); setOpen(true) }}
            >
                <HiMagnifyingGlass style={{ width: 18, height: 18, color: AMBER_HOT, flexShrink: 0 }} />
                <input
                    ref={inputRef}
                    value={query}
                    onChange={e => { setQuery(e.target.value); setOpen(true) }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={onKeyDown}
                    placeholder="Cerca al compte: pagaments, dispositius, perfils, factures…"
                    style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        color: TEXT, fontSize: 15, fontFamily: 'inherit',
                    }}
                />
                {query && (
                    <button
                        onClick={e => { e.stopPropagation(); setQuery(''); inputRef.current?.focus() }}
                        title="Esborrar"
                        style={{
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            color: TEXT_MUTE, padding: 4, display: 'grid', placeItems: 'center',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                )}
                <kbd style={{
                    fontFamily: 'monospace', fontSize: 11,
                    color: open ? AMBER : TEXT_DIM,
                    padding: '3px 7px', borderRadius: 6,
                    border: `1px solid ${open ? BORDER_MID : BORDER}`,
                    background: 'rgba(0,0,0,0.35)', flexShrink: 0,
                }}>⌘K</kbd>
            </div>

            {/* ── Dropdown ── */}
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                    background: 'linear-gradient(180deg, rgba(18,12,5,0.97), rgba(10,7,3,0.97))',
                    border: `1px solid ${BORDER_MID}`,
                    borderRadius: 16,
                    boxShadow: `0 30px 80px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(204,132,0,0.04), 0 0 60px rgba(204,132,0,0.07)`,
                    backdropFilter: 'blur(14px)',
                    maxHeight: 460, overflow: 'hidden',
                    zIndex: 50,
                    display: 'flex', flexDirection: 'column',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '12px 18px 4px',
                        fontSize: 10.5, letterSpacing: '0.22em',
                        color: TEXT_MUTE, fontWeight: 500, textTransform: 'uppercase',
                    }}>
                        {isEmptyQ
                            ? 'Suggeriments'
                            : `${results.length} resultat${results.length === 1 ? '' : 's'} per "${query}"`
                        }
                    </div>

                    {/* Results */}
                    <div style={{ overflowY: 'auto', padding: '4px 8px 8px', flex: 1 }}>
                        {results.length === 0 ? (
                            <NoResults query={query} />
                        ) : (
                            groups.map((grp, gi) => (
                                <div key={grp.cat} style={{ marginTop: gi === 0 ? 0 : 8 }}>
                                    <div style={{
                                        padding: '8px 12px 4px',
                                        fontSize: 10, letterSpacing: '0.2em',
                                        color: AMBER, fontWeight: 600, textTransform: 'uppercase',
                                    }}>
                                        {grp.cat}
                                    </div>
                                    {grp.items.map(it => {
                                        const idx      = results.indexOf(it)
                                        const isActive = idx === active
                                        const Ico      = it.icon
                                        return (
                                            <button
                                                key={it.id}
                                                onMouseEnter={() => setActive(idx)}
                                                onMouseDown={e => { e.preventDefault(); selectItem(it) }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 12,
                                                    width: '100%', textAlign: 'left',
                                                    padding: '10px 12px', borderRadius: 10,
                                                    background: isActive
                                                        ? 'linear-gradient(90deg, rgba(204,132,0,0.15), rgba(204,132,0,0.03))'
                                                        : 'transparent',
                                                    border: `1px solid ${isActive ? BORDER_MID : 'transparent'}`,
                                                    color: TEXT, cursor: 'pointer', fontFamily: 'inherit',
                                                }}
                                            >
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                                    background: it.danger
                                                        ? 'rgba(220,90,70,0.08)'
                                                        : (isActive ? 'rgba(204,132,0,0.12)' : 'rgba(204,132,0,0.06)'),
                                                    border: `1px solid ${it.danger ? 'rgba(220,90,70,0.25)' : BORDER}`,
                                                    display: 'grid', placeItems: 'center',
                                                    color: it.danger ? '#e88a78' : AMBER_HOT,
                                                }}>
                                                    <Ico style={{ width: 15, height: 15 }} />
                                                </div>

                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{
                                                        fontSize: 14, fontWeight: 500,
                                                        color: it.danger ? '#f0baad' : TEXT,
                                                        display: 'flex', alignItems: 'center', gap: 8,
                                                    }}>
                                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            <Highlight text={it.title} query={query} />
                                                        </span>
                                                        {it.badge && (
                                                            <span style={{
                                                                fontSize: 10, letterSpacing: '0.06em',
                                                                textTransform: 'uppercase',
                                                                color: AMBER_HOT, padding: '2px 6px',
                                                                borderRadius: 4, flexShrink: 0,
                                                                background: 'rgba(204,132,0,0.10)',
                                                                border: `1px solid ${BORDER_MID}`, fontWeight: 600,
                                                            }}>{it.badge}</span>
                                                        )}
                                                    </div>
                                                    {it.sub && (
                                                        <div style={{
                                                            fontSize: 12.5, color: TEXT_DIM, marginTop: 1,
                                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                        }}>
                                                            <Highlight text={it.sub} query={query} />
                                                        </div>
                                                    )}
                                                </div>

                                                {isActive && (
                                                    <div style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                                        color: AMBER, fontSize: 11, fontWeight: 500, flexShrink: 0,
                                                    }}>
                                                        <span>obrir</span>
                                                        <kbd style={{
                                                            fontFamily: 'monospace', fontSize: 10,
                                                            padding: '2px 6px', borderRadius: 4,
                                                            background: 'rgba(0,0,0,0.4)',
                                                            border: `1px solid ${BORDER}`, color: AMBER,
                                                        }}>↵</kbd>
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer hints */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 16px', borderTop: `1px solid ${BORDER}`,
                        background: 'rgba(0,0,0,0.25)',
                        fontSize: 11, color: TEXT_MUTE,
                    }}>
                        <div style={{ display: 'flex', gap: 14 }}>
                            <Hint k="↑↓" label="navegar" />
                            <Hint k="↵"  label="obrir" />
                            <Hint k="esc" label="tancar" />
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ color: AMBER, fontWeight: 600 }}>Playmon</span>
                            <span>· cerca al compte</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Toast ── */}
            {toast && <SelectToast item={toast} />}
        </div>
    )
}
