import { useState, useMemo, useEffect } from 'react'
import MovieCard from '@/components/MovieCard'
import { useHistorial } from '@/context/HistorialContext'

const FILTRES = [
    { key: 'all',   label: 'Totes' },
    { key: 'movie', label: 'Pel·lícules' },
    { key: 'tv',    label: 'Sèries' },
]

function getBucket(dateStr) {
    if (!dateStr) return 'Anteriors'
    const now = new Date()
    const d = new Date(dateStr)
    const diffDays = Math.floor((now - d) / 86400000)
    if (diffDays < 1)  return 'Avui'
    if (diffDays < 2)  return 'Ahir'
    if (diffDays < 7)  return 'Aquesta setmana'
    if (diffDays < 30) return 'Aquest mes'
    return 'Anteriors'
}

const BUCKET_ORDER = ['Avui', 'Ahir', 'Aquesta setmana', 'Aquest mes', 'Anteriors']
const INITIAL_VISIBLE = 5

export default function CompteHistorial() {
    const { historial, loading, refresh } = useHistorial()
    const [filtre, setFiltre] = useState('all')

    useEffect(() => { refresh() }, [])
    const [expandedBuckets, setExpandedBuckets] = useState({})

    const filtered = useMemo(() =>
        historial.filter(item => filtre === 'all' || item.media_type === filtre),
        [historial, filtre]
    )

    const grouped = useMemo(() => {
        const map = {}
        for (const item of filtered) {
            const bucket = getBucket(item.updated_at)
            if (!map[bucket]) map[bucket] = []
            map[bucket].push(item)
        }
        return BUCKET_ORDER.filter(b => map[b]?.length).map(b => ({ label: b, items: map[b] }))
    }, [filtered])

    const handleFiltre = (key) => {
        setFiltre(key)
        setExpandedBuckets({})
    }

    const toggleBucket = (label) =>
        setExpandedBuckets(prev => ({ ...prev, [label]: !prev[label] }))

    return (
        <div className="space-y-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                    Historial de visualització
                </h1>
                <p className="text-sm text-white/60 max-w-3xl">
                    Tot el contingut que has reproduït, agrupat per data.
                </p>
            </header>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 space-y-8">

                {/* Filtres + comptador */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex gap-2">
                        {FILTRES.map(f => (
                            <button
                                key={f.key}
                                onClick={() => handleFiltre(f.key)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                    filtre === f.key
                                        ? 'bg-[#CC8400] border-[#CC8400] text-black'
                                        : 'border-white/[0.12] text-white/50 hover:text-white hover:border-white/30'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    {!loading && filtered.length > 0 && (
                        <span className="text-xs text-white/30 font-semibold uppercase tracking-widest">
                            {filtered.length} {filtered.length === 1 ? 'títol' : 'títols'}
                        </span>
                    )}
                </div>

                {/* Contingut */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-white/[0.08]"
                             style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white/50 mb-1">Sense historial</h3>
                        <p className="text-sm text-white/30">Encara no has reproduït cap contingut.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {grouped.map(({ label, items }) => {
                            const isExpanded = !!expandedBuckets[label]
                            const visible = isExpanded ? items : items.slice(0, INITIAL_VISIBLE)
                            const hasMore = items.length > INITIAL_VISIBLE

                            return (
                                <div key={label}>
                                    {/* Capçalera del grup */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#CC8400]">
                                            {label}
                                        </span>
                                        <div className="flex-1 h-px bg-white/[0.06]" />
                                        <span className="text-xs text-white/25 font-medium">
                                            {items.length} {items.length === 1 ? 'títol' : 'títols'}
                                        </span>
                                    </div>

                                    {/* Grid de cartes */}
                                    <div className="flex flex-wrap gap-4">
                                        {visible.map(item => (
                                            <MovieCard
                                                key={`${item.tmdb_id}-${item.media_type}`}
                                                movie={item}
                                            />
                                        ))}
                                    </div>

                                    {/* Botó mostrar més / menys */}
                                    {hasMore && (
                                        <button
                                            onClick={() => toggleBucket(label)}
                                            className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors group"
                                        >
                                            <span className="h-px w-6 bg-white/20 group-hover:bg-white/40 transition-colors" />
                                            {isExpanded
                                                ? 'Mostrar menys'
                                                : `Mostrar ${items.length - INITIAL_VISIBLE} més`}
                                            <span className="h-px flex-1 max-w-[60px] bg-white/20 group-hover:bg-white/40 transition-colors" />
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
