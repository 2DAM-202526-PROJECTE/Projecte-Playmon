import { useState } from 'react'
import { useWatchlist } from '@/context/WatchlistContext'
import MovieCard from '@/components/MovieCard'

const ITEMS_PER_PAGE = 20;

export default function CompteLlista() {
    const { watchlist, loading } = useWatchlist()
    const [page, setPage] = useState(1)

    const totalPages = Math.ceil(watchlist.length / ITEMS_PER_PAGE)
    const currentItems = watchlist.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <div className="space-y-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white">Veure més tard</h1>
                <p className="text-sm text-white/60 max-w-3xl">
                    Totes les pel·lícules i sèries que has desat per a revisar-les.
                </p>
            </header>

            <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 min-h-[600px]">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#CC8400] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : watchlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <svg className="w-16 h-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <h3 className="text-xl font-medium text-white/60 mb-2">La teva llista està buida</h3>
                        <p className="text-white/40">Busca pel·lícules al catàleg i prem el botó '+' per començar a desar el teu contingut preferit.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-white/35 mb-5 uppercase tracking-widest font-semibold">
                            {watchlist.length} {watchlist.length === 1 ? 'element' : 'elements'}
                        </p>

                        <div className="flex flex-wrap gap-4 md:gap-6">
                            {currentItems.map(movie => (
                                <div key={movie.tmdb_id || movie.id} className="flex-shrink-0">
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/[0.06]">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white/60 border border-white/[0.08] hover:bg-white/[0.05] hover:text-white disabled:opacity-30 transition-all"
                                >
                                    ← Anterior
                                </button>
                                <span className="text-xs font-bold text-white/35 uppercase tracking-widest">
                                    Pàgina {page} de {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
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
