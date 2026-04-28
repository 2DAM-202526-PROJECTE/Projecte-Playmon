import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { seguirViendoApi } from '@/api/seguirViendoApi'
import { isLoggedIn } from '@/api/authApi'

const SeguirViendoContext = createContext(null)

export function SeguirViendoProvider({ children }) {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        if (!isLoggedIn()) { setLoading(false); return }
        try {
            const data = await seguirViendoApi.getAll()
            setHistory(Array.isArray(data) ? data : [])
        } catch (err) {
            if (err?.status === 401) {
                localStorage.removeItem('authToken')
                localStorage.removeItem('authUser')
                window.location.href = '/login'
                return
            }
            setHistory([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const saveProgress = useCallback(async (movie, progress, duration) => {
        const tmdbId = movie.id
        
        // Optimistic update
        setHistory(prev => {
            const existingIdx = prev.findIndex(h => String(h.tmdb_id) === String(tmdbId))
            const newEntry = { ...movie, tmdb_id: tmdbId, progress, duration, updated_at: new Date().toISOString() }
            
            if (existingIdx >= 0) {
                const next = [...prev]
                next[existingIdx] = { ...next[existingIdx], progress, duration, updated_at: new Date().toISOString() }
                // Sort by recently updated
                return next.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            } else {
                return [newEntry, ...prev]
            }
        })

        try {
            await seguirViendoApi.saveProgress(movie, progress, duration)
        } catch {
            load()
        }
    }, [load])

    const removeProgress = useCallback(async (tmdbId, mediaType = 'movie') => {
        setHistory(prev => prev.filter(h => String(h.tmdb_id) !== String(tmdbId)))
        try {
            await seguirViendoApi.remove(tmdbId, mediaType)
        } catch {
            load()
        }
    }, [load])

    const getProgress = useCallback((tmdbId) => {
        const item = history.find(h => String(h.tmdb_id) === String(tmdbId))
        return item ? item.progress : 0
    }, [history])

    return (
        <SeguirViendoContext.Provider value={{ history, loading, saveProgress, removeProgress, getProgress }}>
            {children}
        </SeguirViendoContext.Provider>
    )
}

export function useSeguirViendo() {
    const ctx = useContext(SeguirViendoContext)
    if (!ctx) throw new Error('useSeguirViendo must be used within SeguirViendoProvider')
    return ctx
}
