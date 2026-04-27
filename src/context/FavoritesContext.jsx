import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { favoritesApi } from '@/api/favoritesApi'
import { isLoggedIn } from '@/api/authApi'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        if (!isLoggedIn()) { setLoading(false); return }
        try {
            const data = await favoritesApi.getAll()
            setFavorites(Array.isArray(data) ? data : [])
        } catch {
            setFavorites([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const isFav = useCallback((tmdbId) => {
        if (!tmdbId) return false;
        return favorites.some(f => String(f.tmdb_id) === String(tmdbId) || String(f.id) === String(tmdbId))
    }, [favorites])

    const toggleFav = useCallback(async (movie) => {
        const tmdbId = movie.id
        const mediaType = movie.media_type || 'movie'
        if (isFav(tmdbId)) {
            setFavorites(prev => prev.filter(f => String(f.tmdb_id) !== String(tmdbId) && String(f.id) !== String(tmdbId)))
            try { await favoritesApi.remove(tmdbId, mediaType) }
            catch { load() }
        } else {
            const optimistic = { ...movie, tmdb_id: tmdbId }
            setFavorites(prev => [...prev, optimistic])
            try { await favoritesApi.add(movie) }
            catch { load() }
        }
    }, [isFav, load])

    return (
        <FavoritesContext.Provider value={{ favorites, loading, isFav, toggleFav }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavorites() {
    const ctx = useContext(FavoritesContext)
    if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
    return ctx
}
