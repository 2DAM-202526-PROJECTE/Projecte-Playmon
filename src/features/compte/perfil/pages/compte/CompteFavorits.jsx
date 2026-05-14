import { useState, useEffect } from 'react'
import { useFavorites } from '@/context/FavoritesContext'
import MovieCard from '@/components/MovieCard'

const ITEMS_PER_PAGE = 20;

export default function CompteFavorits() {
    const { favorites, loading, refresh } = useFavorites()
    const [page, setPage] = useState(1)

    useEffect(() => { refresh() }, [])

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
                        <svg className="w-16 h-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        <h3 className="text-xl font-medium text-white/60 mb-2">No tens cap favorit encara</h3>
                        <p className="text-white/40">Prem l'estrella ★ en qualsevol pel·lícula o sèrie per afegir-la als teus favorits.</p>
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
