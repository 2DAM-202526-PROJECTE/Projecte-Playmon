import React, { useEffect, useState, useRef } from 'react'
import MovieCard from '@/components/MovieCard'

function UndoToast({ item, onUndo, onDismiss }) {
    const title = item?.title || item?.name || 'Element'
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4
                        bg-[#1e1e1e] border border-white/15 rounded-2xl px-5 py-3.5 shadow-2xl
                        backdrop-blur-sm min-w-[280px] max-w-[420px]">
            <p className="text-white/80 text-sm flex-1 truncate">
                <span className="text-white/45 mr-1">★</span>
                <span className="font-medium text-white/90">"{title}"</span>
                {' '}eliminat de favorits
            </p>
            <div className="flex items-center gap-3 flex-shrink-0">
                <button
                    onClick={onUndo}
                    className="text-[#CC8400] text-sm font-bold hover:text-[#E09400] transition-colors"
                >
                    Desfer
                </button>
                <button
                    onClick={onDismiss}
                    className="text-white/30 hover:text-white/60 text-lg leading-none transition-colors"
                >
                    ×
                </button>
            </div>
        </div>
    )
}

export default function CompteFavorits() {
    const [movies, setMovies] = useState([])
    const [undoItem, setUndoItem] = useState(null)
    const timerRef = useRef(null)

    const refresh = () =>
        setMovies(JSON.parse(localStorage.getItem('playmon_favorites') || '[]'))

    useEffect(() => { refresh() }, [])

    useEffect(() => {
        const handler = (e) => {
            const { action, item } = e.detail
            refresh()
            if (action === 'remove') {
                if (timerRef.current) clearTimeout(timerRef.current)
                setUndoItem(item)
                timerRef.current = setTimeout(() => setUndoItem(null), 5000)
            } else {
                setUndoItem(null)
                if (timerRef.current) clearTimeout(timerRef.current)
            }
        }
        window.addEventListener('playmon:favorites-changed', handler)
        return () => {
            window.removeEventListener('playmon:favorites-changed', handler)
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    const handleUndo = () => {
        if (!undoItem) return
        if (timerRef.current) clearTimeout(timerRef.current)
        const favorites = JSON.parse(localStorage.getItem('playmon_favorites') || '[]')
        favorites.push(undoItem)
        localStorage.setItem('playmon_favorites', JSON.stringify(favorites))
        window.dispatchEvent(new CustomEvent('playmon:favorites-changed', {
            detail: { action: 'add', item: undoItem }
        }))
        setUndoItem(null)
    }

    const handleDismiss = () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        setUndoItem(null)
    }

    return (
        <div className="space-y-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white">Favorits</h1>
                <p className="text-sm text-white/60 max-w-3xl">
                    Tot el contingut que has marcat com a favorit.
                </p>
            </header>

            <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6">
                {movies.length === 0 ? (
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
                            {movies.length} {movies.length === 1 ? 'favorit' : 'favorits'}
                        </p>
                        <div className="flex flex-wrap gap-4 md:gap-6">
                            {movies.map(movie => (
                                <div key={movie.id} className="flex-shrink-0">
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {undoItem && (
                <UndoToast item={undoItem} onUndo={handleUndo} onDismiss={handleDismiss} />
            )}
        </div>
    )
}
