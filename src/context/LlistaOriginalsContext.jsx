import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { llistaOriginalsApi } from '@/api/llistaOriginalsApi'
import { isLoggedIn } from '@/api/authApi'

const LlistaOriginalsContext = createContext(null)

export function LlistaOriginalsProvider({ children }) {
    const [llista, setLlista] = useState([])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        if (!isLoggedIn()) { setLoading(false); return }
        try {
            const data = await llistaOriginalsApi.getAll()
            setLlista(Array.isArray(data) ? data : [])
        } catch (err) {
            if (err?.status === 401) {
                localStorage.removeItem('authToken')
                localStorage.removeItem('authUser')
                window.location.href = '/login'
                return
            }
            setLlista([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const isInLlista = useCallback((videoId) => {
        if (!videoId) return false
        return llista.some(i => String(i.video_id) === String(videoId))
    }, [llista])

    const toggleLlista = useCallback(async (video) => {
        const videoId = video.id
        if (isInLlista(videoId)) {
            setLlista(prev => prev.filter(i => String(i.video_id) !== String(videoId)))
            try { await llistaOriginalsApi.remove(videoId) }
            catch { load() }
        } else {
            const optimistic = { video_id: videoId, title: video.title, thumbnail_url: video.thumbnailDataUrl || null }
            setLlista(prev => [optimistic, ...prev])
            try { await llistaOriginalsApi.add(video) }
            catch { load() }
        }
    }, [isInLlista, load])

    return (
        <LlistaOriginalsContext.Provider value={{ llista, loading, isInLlista, toggleLlista, refresh: load }}>
            {children}
        </LlistaOriginalsContext.Provider>
    )
}

export function useLlistaOriginals() {
    const ctx = useContext(LlistaOriginalsContext)
    if (!ctx) throw new Error('useLlistaOriginals must be used within LlistaOriginalsProvider')
    return ctx
}
