import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { watchlistApi } from '@/api/watchlistApi'
import { isLoggedIn } from '@/api/authApi'

const WatchlistContext = createContext(null)

export function WatchlistProvider({ children }) {
    const [watchlist, setWatchlist] = useState([])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        if (!isLoggedIn()) { setLoading(false); return }
        try {
            const data = await watchlistApi.getAll()
            setWatchlist(Array.isArray(data) ? data : [])
        } catch (err) {
            if (err?.status === 401) {
                localStorage.removeItem('authToken')
                localStorage.removeItem('authUser')
                window.location.href = '/login'
                return
            }
            setWatchlist([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const isInList = useCallback((tmdbId) => {
        if (!tmdbId) return false
        return watchlist.some(f => String(f.tmdb_id) === String(tmdbId) || String(f.id) === String(tmdbId))
    }, [watchlist])

    const toggleWatchlist = useCallback(async (movie) => {
        const tmdbId = movie.id
        const mediaType = movie.media_type || 'movie'
        if (isInList(tmdbId)) {
            setWatchlist(prev => prev.filter(f => String(f.tmdb_id) !== String(tmdbId) && String(f.id) !== String(tmdbId)))
            try { await watchlistApi.remove(tmdbId, mediaType) }
            catch { load() }
        } else {
            const optimistic = { ...movie, tmdb_id: tmdbId }
            setWatchlist(prev => [...prev, optimistic])
            try { await watchlistApi.add(movie) }
            catch { load() }
        }
    }, [isInList, load])

    return (
        <WatchlistContext.Provider value={{ watchlist, loading, isInList, toggleWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    )
}

export function useWatchlist() {
    const ctx = useContext(WatchlistContext)
    if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider')
    return ctx
}
