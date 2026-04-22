import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { HiStar, HiPlus, HiVideoCamera, HiUser, HiMagnifyingGlass, HiXMark, HiSparkles, HiFilm } from 'react-icons/hi2'
import Header from '@/components/Header'
import HomeFooter from '@/features/home/components/HomeFooter'
import OriginalVideoCard from './components/OriginalVideoCard'
import VideoFormModal from './components/VideoFormModal'
import PersonalPanel from './components/PersonalPanel'
import CreatorModal from './components/CreatorModal'
import { getCurrentUser } from '@/api/authApi'
import { getVideos, deleteVideo } from '@/api/videosApi'

// ─── localStorage metadata (likes i views, no persistits a BD) ───────────────
const META_KEY = 'playmon_originals_meta'

function loadMeta() {
    try { return JSON.parse(localStorage.getItem(META_KEY) || '{}') }
    catch { return {} }
}

function saveMeta(meta) {
    localStorage.setItem(META_KEY, JSON.stringify(meta))
}

// ─── Normalitza un vídeo de la API al format que espera OriginalVideoCard ─────
function normalizeVideo(v, meta) {
    const m = meta[String(v.id)] || {}
    return {
        id: String(v.id),
        userId: String(v.user_id),
        username: v.username || 'Usuari',
        userAvatar: v.user_avatar || null,
        title: v.title || '',
        description: v.description || '',
        thumbnailDataUrl: v.thumbnail_url || null,
        category: v.categoria || '',
        createdAt: v.created_at || new Date().toISOString(),
        videoUrl: v.video_url,
        likes: m.likes ?? [],
        views: m.views ?? 0,
    }
}

// eslint-disable-next-line no-misleading-character-class
const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const SORT_OPTIONS = [
    { key: 'newest',     label: 'Més nous' },
    { key: 'mostLiked',  label: 'Més valorats' },
    { key: 'mostViewed', label: 'Més vistos' },
    { key: 'oldest',     label: 'Més antics' },
]

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onUpload }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-20 h-20 rounded-full bg-[#CC8400]/10 border border-[#CC8400]/20 flex items-center justify-center mb-6">
                <HiVideoCamera className="text-[#CC8400]/60 text-3xl" />
            </div>
            <h3 className="text-white/70 text-xl font-semibold mb-2">Encara no hi ha contingut</h3>
            <p className="text-white/35 text-sm max-w-sm mb-6">
                Sigues el primer en publicar a Playmon Originals. Puja el teu vídeo i comparteix-lo amb la comunitat.
            </p>
            <button
                onClick={onUpload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#CC8400] text-black text-sm font-bold
                           hover:bg-[#E09400] transition-all duration-200"
            >
                <HiPlus className="text-base" />
                Puja el primer vídeo
            </button>
        </div>
    )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OriginalsPage() {
    const currentUser = getCurrentUser()
    
    // Validació del pla
    const hasUltraPlan = currentUser?.pla_pagament?.toLowerCase() === 'ultra'

    const [rawVideos, setRawVideos] = useState([])   // dades de la API
    const [meta, setMeta] = useState(loadMeta)        // likes/views locals
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)

    if (!hasUltraPlan) {
        return (
            <div className="h-screen overflow-hidden bg-[#080808] flex flex-col relative">
                <Header />

                {/* Fons cinematogràfic */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.06]"
                        style={{ background: 'radial-gradient(circle, #CC8400 0%, transparent 65%)' }} />
                    <div className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full opacity-[0.04]"
                        style={{ background: 'radial-gradient(circle, #FFB800 0%, transparent 70%)' }} />
                    <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
                        style={{ background: 'radial-gradient(circle, #CC8400 0%, transparent 70%)' }} />
                    <div className="absolute inset-0 opacity-[0.015]"
                        style={{ backgroundImage: 'linear-gradient(rgba(204,132,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(204,132,0,0.8) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">

                    {/* Icona principal composta */}
                    <div className="relative mb-4">
                        <div className="absolute inset-0 rounded-full blur-3xl opacity-25"
                            style={{ background: 'radial-gradient(circle, #CC8400, transparent)' }} />
                        <div className="w-32 h-32 rounded-full border border-[#CC8400]/10 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full border border-[#CC8400]/20 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center border border-[#CC8400]/40 shadow-[0_0_50px_rgba(204,132,0,0.15)]"
                                    style={{ background: 'linear-gradient(135deg, rgba(204,132,0,0.25) 0%, rgba(255,184,0,0.08) 100%)' }}>
                                    <HiSparkles className="text-3xl" style={{ color: '#CC8400' }} />
                                </div>
                            </div>
                        </div>
                        {/* Partícules decoratives */}
                        <div className="absolute -top-1 right-3 w-3 h-3 rounded-full blur-sm" style={{ background: '#CC8400', opacity: 0.5 }} />
                        <div className="absolute bottom-2 -left-1 w-2 h-2 rounded-full blur-sm" style={{ background: '#FFB800', opacity: 0.4 }} />
                        <div className="absolute top-4 -left-4 w-1.5 h-1.5 rounded-full blur-sm" style={{ background: '#CC8400', opacity: 0.6 }} />
                        <div className="absolute -bottom-1 right-5 w-1.5 h-1.5 rounded-full blur-sm" style={{ background: '#FFB800', opacity: 0.35 }} />
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-3"
                        style={{ background: 'rgba(204,132,0,0.08)', borderColor: 'rgba(204,132,0,0.3)' }}>
                        <HiStar className="text-xs" style={{ color: '#CC8400' }} />
                        <span className="text-xs font-black tracking-[0.18em] uppercase" style={{ color: '#CC8400' }}>Pla Ultra Exclusiu</span>
                        <HiStar className="text-xs" style={{ color: '#CC8400' }} />
                    </div>

                    {/* Títol */}
                    <h1 className="text-4xl md:text-5xl font-black text-center mb-2 leading-none tracking-tight">
                        <span className="text-white">PLAYMON</span><br />
                        <span style={{
                            background: 'linear-gradient(135deg, #FFB800 0%, #CC8400 40%, #E09400 70%, #FFB800 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                        }}>ORIGINALS</span>
                    </h1>

                    <p className="text-center text-sm max-w-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Contingut exclusiu de la comunitat.{' '}
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Desbloqueja tot el que t'estàs perdent.</span>
                    </p>

                    {/* Feature cards */}
                    <div className="flex flex-wrap justify-center gap-2 mb-5 max-w-lg">
                        {[
                            { icon: <HiFilm className="text-base" style={{ color: '#CC8400' }} />, label: 'Playmon Originals', desc: 'Accés complet' },
                            { icon: <HiSparkles className="text-base" style={{ color: '#CC8400' }} />, label: 'Zero anuncis', desc: 'Experiència neta' },
                            { icon: <HiStar className="text-base" style={{ color: '#CC8400' }} />, label: 'Resolució màxima', desc: '4K HDR' },
                        ].map(f => (
                            <div key={f.label} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                {f.icon}
                                <div>
                                    <p className="text-white text-xs font-bold leading-tight">{f.label}</p>
                                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pla actual */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-px w-10" style={{ background: 'rgba(255,255,255,0.1)' }} />
                        <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            Pla actual: <span className="font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>{currentUser?.pla_pagament?.toUpperCase() || 'GRATUÏT'}</span>
                        </p>
                        <div className="h-px w-10" style={{ background: 'rgba(255,255,255,0.1)' }} />
                    </div>

                    {/* Botons */}
                    <div className="flex flex-col gap-2 w-full max-w-xs">
                        <button
                            onClick={() => window.location.href = '/compte/pagaments'}
                            className="w-full py-3 rounded-2xl font-black text-black text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(135deg, #FFB800 0%, #CC8400 50%, #E09400 100%)', boxShadow: '0 0 30px rgba(204,132,0,0.25)' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(204,132,0,0.45)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(204,132,0,0.25)'}
                        >
                            ✦ Millorar al Pla Ultra
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full py-2.5 rounded-2xl font-medium text-sm transition-all duration-200"
                            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', background: 'transparent' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
                        >
                            Tornar a l'inici
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const [showModal, setShowModal] = useState(false)
    const [editingVideo, setEditingVideo] = useState(null)
    const [panelOpen, setPanelOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [creatorToShow, setCreatorToShow] = useState(null)

    // ── Carregar vídeos de la API ────────────────────────────────────────────
    const fetchVideos = useCallback(async () => {
        setLoading(true)
        setLoadError(null)
        try {
            const data = await getVideos()
            setRawVideos(data.videos || [])
        } catch (err) {
            setLoadError('No s\'ha pogut carregar el contingut. Comprova la connexió.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchVideos() }, [fetchVideos])

    // ── Vídeos normalitzats (API + metadata local) ───────────────────────────
    const videos = useMemo(() => rawVideos.map(v => normalizeVideo(v, meta)), [rawVideos, meta])

    // ── Categories disponibles ───────────────────────────────────────────────
    const categories = useMemo(() => {
        const cats = videos.map(v => v.category).filter(Boolean)
        return [...new Set(cats)].sort()
    }, [videos])

    // ── Filtratge i ordenació ────────────────────────────────────────────────
    const filteredVideos = useMemo(() => {
        const q = normalize(searchQuery)
        const filtered = videos.filter(v => {
            const matchesText = !q ||
                normalize(v.title).includes(q) ||
                normalize(v.description).includes(q) ||
                normalize(v.username).includes(q)
            const matchesCat = !activeCategory || v.category === activeCategory
            return matchesText && matchesCat
        })
        return [...filtered].sort((a, b) => {
            if (sortBy === 'newest')     return new Date(b.createdAt) - new Date(a.createdAt)
            if (sortBy === 'oldest')     return new Date(a.createdAt) - new Date(b.createdAt)
            if (sortBy === 'mostLiked')  return (b.likes?.length ?? 0) - (a.likes?.length ?? 0)
            if (sortBy === 'mostViewed') return (b.views ?? 0) - (a.views ?? 0)
            return 0
        })
    }, [videos, searchQuery, activeCategory, sortBy])

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleSave = (savedVideo) => {
        // savedVideo és la resposta directa de la API
        setRawVideos(prev => {
            const exists = prev.find(v => String(v.id) === String(savedVideo.id))
            if (exists) {
                return prev.map(v => String(v.id) === String(savedVideo.id) ? savedVideo : v)
            }
            return [savedVideo, ...prev]
        })
        setShowModal(false)
        setEditingVideo(null)
    }

    const handleEdit = (video) => {
        // Passem el video normalitzat però l'id és el de la API
        setEditingVideo({ ...video, id: video.id, categoria: video.category })
        setShowModal(true)
        setPanelOpen(false)
    }

    const handleDelete = async (id) => {
        try {
            await deleteVideo(id)
            setRawVideos(prev => prev.filter(v => String(v.id) !== String(id)))
            // Netejar metadata del vídeo eliminat
            setMeta(prev => {
                const updated = { ...prev }
                delete updated[String(id)]
                saveMeta(updated)
                return updated
            })
        } catch {
            // Si falla el delete de la API, refresquem per assegurar consistència
            fetchVideos()
        }
    }

    const handleLike = (videoId) => {
        if (!currentUser) return
        const uid = String(currentUser.id)
        setMeta(prev => {
            const m = { ...prev }
            const entry = { ...(m[videoId] || { likes: [], views: 0 }) }
            const isLiked = entry.likes.includes(uid)
            entry.likes = isLiked ? entry.likes.filter(id => id !== uid) : [...entry.likes, uid]
            m[videoId] = entry
            saveMeta(m)
            return m
        })
    }

    const handleView = (videoId) => {
        const sessionKey = `playmon_originals_viewed_${videoId}`
        if (sessionStorage.getItem(sessionKey)) return
        sessionStorage.setItem(sessionKey, '1')
        setMeta(prev => {
            const m = { ...prev }
            const entry = { ...(m[videoId] || { likes: [], views: 0 }) }
            entry.views = (entry.views ?? 0) + 1
            m[videoId] = entry
            saveMeta(m)
            return m
        })
    }

    const openUpload = () => {
        setEditingVideo(null)
        setShowModal(true)
    }

    return (
        <div className="min-h-screen bg-[#080808] relative">

            {/* ── Fons cinematogràfic ambient (igual que la locked screen) ──── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.05]"
                    style={{ background: 'radial-gradient(circle, #CC8400 0%, transparent 65%)' }} />
                <div className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full opacity-[0.04]"
                    style={{ background: 'radial-gradient(circle, #FFB800 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
                    style={{ background: 'radial-gradient(circle, #CC8400 0%, transparent 70%)' }} />
                <div className="absolute inset-0 opacity-[0.012]"
                    style={{ backgroundImage: 'linear-gradient(rgba(204,132,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(204,132,0,0.8) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
            </div>

            <div className="relative z-10">
            <Header />

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section className="relative px-6 md:px-12 pt-12 pb-10 overflow-hidden">
                {/* Glow focused al hero */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[250px] rounded-full opacity-[0.12] blur-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, #CC8400 0%, transparent 70%)' }} />

                <div className="relative max-w-3xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
                        style={{ background: 'rgba(204,132,0,0.08)', borderColor: 'rgba(204,132,0,0.3)' }}>
                        <HiStar className="text-xs" style={{ color: '#CC8400' }} />
                        <span className="text-[11px] font-black tracking-[0.18em] uppercase" style={{ color: '#CC8400' }}>Contingut de la Comunitat</span>
                        <HiStar className="text-xs" style={{ color: '#CC8400' }} />
                    </div>

                    {/* Títol amb icona composta */}
                    <div className="flex items-center gap-5 mb-5">
                        {/* Icona concèntrica (igual que locked screen) */}
                        <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 rounded-full blur-2xl opacity-30"
                                style={{ background: 'radial-gradient(circle, #CC8400, transparent)' }} />
                            <div className="w-20 h-20 rounded-full border border-[#CC8400]/15 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full border border-[#CC8400]/25 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center border border-[#CC8400]/45 shadow-[0_0_30px_rgba(204,132,0,0.2)]"
                                        style={{ background: 'linear-gradient(135deg, rgba(204,132,0,0.25) 0%, rgba(255,184,0,0.08) 100%)' }}>
                                        <HiSparkles className="text-xl" style={{ color: '#CC8400' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-0.5 right-2 w-2 h-2 rounded-full blur-sm" style={{ background: '#CC8400', opacity: 0.55 }} />
                            <div className="absolute bottom-1 -left-0.5 w-1.5 h-1.5 rounded-full blur-sm" style={{ background: '#FFB800', opacity: 0.45 }} />
                        </div>

                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
                                <span className="text-white">PLAYMON</span><br />
                                <span style={{
                                    background: 'linear-gradient(135deg, #FFB800 0%, #CC8400 40%, #E09400 70%, #FFB800 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                                }}>ORIGINALS</span>
                            </h1>
                        </div>
                    </div>

                    <p className="text-white/55 text-base max-w-xl mb-7 leading-relaxed">
                        La plataforma on la comunitat crea. Puja els teus vídeos, descobreix el contingut d'altres usuaris
                        i forma part de l'univers Playmon.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={openUpload}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-black text-sm
                                       transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #FFB800 0%, #CC8400 50%, #E09400 100%)', boxShadow: '0 0 30px rgba(204,132,0,0.25)' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(204,132,0,0.45)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(204,132,0,0.25)'}
                        >
                            <HiPlus className="text-base" />
                            Puja el teu vídeo
                        </button>

                        <button
                            onClick={() => setPanelOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm
                                       transition-all duration-200 active:scale-95"
                            style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.04)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                        >
                            <HiUser className="text-base" />
                            El meu espai
                        </button>
                    </div>
                </div>
            </section>

            <div className="mx-6 md:mx-12 h-px mb-10"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(204,132,0,0.25), transparent)' }} />

            {/* ── Cerca + filtres de categoria ──────────────────────────────── */}
            <div className="px-6 md:px-12 mb-6">
                <div className="relative mb-4">
                    <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 text-lg pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Busca per títol, descripció o autor..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-10 py-3
                                   text-white placeholder-white/30 text-sm outline-none
                                   focus:border-[#CC8400]/50 focus:bg-white/8 transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                                       bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <HiXMark className="text-white/60 text-sm" />
                        </button>
                    )}
                </div>

                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveCategory('')}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
                                ${activeCategory === ''
                                    ? 'bg-[#CC8400] border-[#CC8400] text-black'
                                    : 'bg-white/5 border-white/10 text-white/55 hover:border-white/25 hover:text-white/80'
                                }`}
                        >
                            Tots
                        </button>
                        {categories.map(cat => (
                            <button key={cat}
                                onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
                                    ${activeCategory === cat
                                        ? 'bg-[#CC8400] border-[#CC8400] text-black'
                                        : 'bg-white/5 border-white/10 text-white/55 hover:border-white/25 hover:text-white/80'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Grid de contingut ─────────────────────────────────────────── */}
            <div className="px-6 md:px-12 pb-16">
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#CC8400]/15 border border-[#CC8400]/25 flex items-center justify-center">
                            <HiStar className="text-[#CC8400] text-lg" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg leading-tight">Explorar contingut</h2>
                            <p className="text-white/40 text-xs">
                                {loading ? 'Carregant...' : filteredVideos.length !== videos.length
                                    ? `${filteredVideos.length} de ${videos.length} vídeos`
                                    : `${videos.length} ${videos.length === 1 ? 'vídeo' : 'vídeos'}`
                                }
                            </p>
                        </div>
                    </div>

                    {videos.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {SORT_OPTIONS.map(opt => (
                                <button key={opt.key}
                                    onClick={() => setSortBy(opt.key)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border
                                        ${sortBy === opt.key
                                            ? 'bg-[#CC8400]/15 border-[#CC8400]/40 text-[#CC8400]'
                                            : 'bg-white/4 border-white/8 text-white/45 hover:border-white/20 hover:text-white/70'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <svg className="animate-spin h-8 w-8 text-[#CC8400]/60" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <p className="text-white/35 text-sm">Carregant vídeos...</p>
                    </div>
                )}

                {/* Error */}
                {!loading && loadError && (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <p className="text-white/50 text-sm">{loadError}</p>
                        <button onClick={fetchVideos}
                            className="px-4 py-2 rounded-xl bg-[#CC8400]/15 border border-[#CC8400]/30 text-[#CC8400] text-sm font-semibold
                                       hover:bg-[#CC8400]/25 transition-colors">
                            Tornar a intentar
                        </button>
                    </div>
                )}

                {/* Contingut */}
                {!loading && !loadError && (
                    videos.length === 0 ? (
                        <EmptyState onUpload={openUpload} />
                    ) : filteredVideos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <HiMagnifyingGlass className="text-white/15 text-4xl mb-3" />
                            <p className="text-white/50 text-sm font-medium mb-1">Cap resultat trobat</p>
                            <p className="text-white/30 text-xs">
                                Prova amb altres paraules o{' '}
                                <button onClick={() => { setSearchQuery(''); setActiveCategory('') }}
                                    className="text-[#CC8400] hover:text-[#E09400] transition-colors">
                                    esborra els filtres
                                </button>
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                            {filteredVideos.map(video => (
                                <OriginalVideoCard
                                    key={video.id}
                                    video={video}
                                    isOwn={video.userId === String(currentUser?.id)}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onLike={handleLike}
                                    onView={handleView}
                                    onOpenCreator={setCreatorToShow}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>

            <HomeFooter />

            {/* ── Personal Panel ────────────────────────────────────────────── */}
            <PersonalPanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
                onEditVideo={handleEdit}
                onDeleteVideo={handleDelete}
                allVideos={videos}
            />

            {/* ── Creator Modal ──────────────────────────────────────────────── */}
            {creatorToShow && (
                <CreatorModal
                    creator={creatorToShow}
                    allVideos={videos}
                    onClose={() => setCreatorToShow(null)}
                />
            )}

            {/* ── Upload / Edit Modal ────────────────────────────────────────── */}
            {showModal && (
                <VideoFormModal
                    initialData={editingVideo}
                    onClose={() => { setShowModal(false); setEditingVideo(null) }}
                    onSave={handleSave}
                />
            )}
        </div>
        </div>
    )
}
