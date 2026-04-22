import { useEffect, useState } from 'react'
import MovieCard from '@/components/MovieCard'

const ITEMS_PER_PAGE = 8

export default function CompteLlista() {
    const [movies, setMovies] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('playmon_watchlist') || '[]')
        setMovies(stored)
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
                    Veure més tard
                </h1>
                <p className="text-sm text-white/60 max-w-3xl">
                    Totes les pel·lícules i sèries que has desat per a revisar-les.
                </p>
            </header>

            <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
                {movies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white/50 mb-1">La teva llista està buida</h3>
                        <p className="text-sm text-white/30 max-w-xs">
                            Busca pel·lícules al catàleg i prem el botó '+' per desar el teu contingut preferit.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Comptador */}
                        <p className="text-xs text-white/35 mb-5 uppercase tracking-widest font-semibold">
                            {movies.length} {movies.length === 1 ? 'títol desat' : 'títols desats'}
                        </p>

                        {/* Grid */}
                        <div className="flex flex-wrap gap-4">
                            {currentItems.map(movie => (
                                <div key={movie.id} className="flex-shrink-0">
                                    <MovieCard movie={movie} />
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
