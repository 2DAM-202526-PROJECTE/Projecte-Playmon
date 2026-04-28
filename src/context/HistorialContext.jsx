import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { historialApi } from '@/api/historialApi'
import { isLoggedIn } from '@/api/authApi'

const HistorialContext = createContext(null)

export function HistorialProvider({ children }) {
    const [historial, setHistorial] = useState([])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        if (!isLoggedIn()) { setLoading(false); return }
        try {
            const data = await historialApi.getAll()
            setHistorial(Array.isArray(data) ? data : [])
        } catch (err) {
            if (err?.status === 401) {
                localStorage.removeItem('authToken')
                localStorage.removeItem('authUser')
                window.location.href = '/login'
                return
            }
            setHistorial([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const addToHistorial = useCallback(async (movie) => {
        if (!isLoggedIn()) return
        const tmdbId = String(movie.id)
        const mediaType = movie.media_type || 'movie'

        setHistorial(prev => {
            const filtered = prev.filter(
                h => !(String(h.tmdb_id) === tmdbId && h.media_type === mediaType)
            )
            return [{ ...movie, tmdb_id: movie.id }, ...filtered]
        })

        try { await historialApi.add(movie) }
        catch { load() }
    }, [load])

    const removeFromHistorial = useCallback(async (tmdbId, mediaType) => {
        setHistorial(prev =>
            prev.filter(h => !(String(h.tmdb_id) === String(tmdbId) && h.media_type === mediaType))
        )
        try { await historialApi.remove(tmdbId, mediaType) }
        catch { load() }
    }, [load])

    return (
        <HistorialContext.Provider value={{ historial, loading, addToHistorial, removeFromHistorial }}>
            {children}
        </HistorialContext.Provider>
    )
}

export function useHistorial() {
    const ctx = useContext(HistorialContext)
    if (!ctx) throw new Error('useHistorial must be used within HistorialProvider')
    return ctx
}
