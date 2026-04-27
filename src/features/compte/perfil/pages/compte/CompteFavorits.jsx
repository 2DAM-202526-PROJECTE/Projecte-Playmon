import { useState } from 'react'
import { useFavorites } from '@/context/FavoritesContext'
import MovieCard from '@/components/MovieCard'

const ITEMS_PER_PAGE = 8

export default function CompteFavorits() {
    const { favorites, loading } = useFavorites()
    const [page, setPage] = useState(1)

    const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE)
    const currentItems = favorites.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <div className="space-y-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white">Favorits</h1>
                <p className="text-sm text-white/60 max-w-3xl">
                    Tot el contingut que has marcat com a favorit.
                </p>
            </header>

            <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#CC8400] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-white/[0.08]"
                            style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <svg className="w-8 h-8 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white/50 mb-1">No tens cap favorit</h3>
                        <p className="text-sm text-white/30 max-w-xs">
                            Prem la icona d'estrella a les pel·lícules i sèries per afegir-les aquí.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-white/35 mb-5 uppercase tracking-widest font-semibold">
                            {favorites.length} {favorites.length === 1 ? 'favorit' : 'favorits'}
                        </p>

                        <div className="flex flex-wrap gap-4">
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
