import { useEffect, useState } from 'react'
import MovieCard from '@/components/MovieCard'
import { getCurrentUser } from '@/api/authApi'

const ITEMS_PER_PAGE = 8

export default function CompteHistorial() {
    const currentUser = getCurrentUser()
    const [movies, setMovies] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const key = `playmon_continue_${currentUser?.id || 'guest'}`
        const stored = localStorage.getItem(key)
        let history = []
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                history = Array.isArray(parsed)
                    ? parsed
                    : parsed?.id && parsed.id !== 'undefined' ? [parsed] : []
            } catch {
                history = []
            }
        }
        // Filtrem originals: TMDB sempre té backdrop_path amb ruta relativa ("/...")
        // Originals de Cloudinary tenen URL absoluta — els excloem
        const filtered = history.filter(item => {
            const path = item.backdrop_path || item.poster_path
            return !path || !path.startsWith('http')
        })
        setMovies(filtered)
    }, [])

    const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE)
    const currentItems = movies.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    return (
        <div className="space-y-6">
            {/* Capçalera */}
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                    Historial de visualització
                </h1>
                <p className="text-sm text-white/60 max-w-3xl">
                    El registre de tot el contingut que has començat a veure recentment.
                </p>
            </header>

            <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
                {movies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white/50 mb-1">Sense historial</h3>
                        <p className="text-sm text-white/30">Encara no has reproduït cap pel·lícula o sèrie.</p>
                    </div>
                ) : (
                    <>
                        {/* Comptador */}
                        <p className="text-xs text-white/35 mb-5 uppercase tracking-widest font-semibold">
                            {movies.length} {movies.length === 1 ? 'títol vist' : 'títols vistos'}
                        </p>

                        {/* Grid */}
                        <div className="flex flex-wrap gap-4">
                            {currentItems.map(movie => (
                                <div key={movie.id} className="relative flex-shrink-0">
                                    <MovieCard movie={movie} isContinueWatching={true} />
                                    {(movie.savedTime > 0 || movie.completed) && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden pointer-events-none">
                                            <div
                                                className="h-full"
                                                style={{
                                                    width: movie.completed ? '100%' : `${Math.min(100, (movie.savedTime / (movie.duration || 120)) * 100)}%`,
                                                    background: 'linear-gradient(90deg, #FFB800, #CC8400)'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Paginació */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/[0.06]">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white/60 border border-white/[0.08] hover:bg-white/[0.05] hover:text-white disabled:opacity-30 transition-all"
                                >
                                    ← Anterior
                                </button>
                                <span className="text-xs font-bold text-white/35 uppercase tracking-widest">
                                    Pàgina {currentPage} de {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white/60 border border-white/[0.08] hover:bg-white/[0.05] hover:text-white disabled:opacity-30 transition-all"
                                >
                                    Següent →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    )
}
