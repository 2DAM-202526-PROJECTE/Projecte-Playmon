import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { playmonSeguirViendoApi } from '@/api/playmonSeguirViendoApi'
import { isLoggedIn } from '@/api/authApi'

const PlaymonSeguirViendoContext = createContext(null)

export function PlaymonSeguirViendoProvider({ children }) {
    const [seguirViendo, setSeguirViendo] = useState([])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        if (!isLoggedIn()) { setLoading(false); return }
        try {
            const data = await playmonSeguirViendoApi.getAll()
            setSeguirViendo(Array.isArray(data) ? data : [])
        } catch (err) {
            if (err?.status === 401) {
                localStorage.removeItem('authToken')
                localStorage.removeItem('authUser')
                window.location.href = '/login'
                return
            }
            setSeguirViendo([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const getProgress = useCallback((videoId) => {
        const item = seguirViendo.find(i => String(i.video_id) === String(videoId))
        return item?.progress || 0
    }, [seguirViendo])

    const saveProgress = useCallback(async (video, progress, duration) => {
        setSeguirViendo(prev => {
            const filtered = prev.filter(i => String(i.video_id) !== String(video.id))
            return [{ video_id: Number(video.id), title: video.title, thumbnail_url: video.thumbnailDataUrl || video.poster || null, progress, duration, updated_at: new Date().toISOString() }, ...filtered]
        })
        try { await playmonSeguirViendoApi.save(video, progress, duration) }
        catch { /* silent */ }
    }, [])

    const removeProgress = useCallback(async (videoId) => {
        setSeguirViendo(prev => prev.filter(i => String(i.video_id) !== String(videoId)))
        try { await playmonSeguirViendoApi.remove(videoId) }
        catch { /* silent */ }
    }, [])

    return (
        <PlaymonSeguirViendoContext.Provider value={{ seguirViendo, loading, getProgress, saveProgress, removeProgress, refresh: load }}>
            {children}
        </PlaymonSeguirViendoContext.Provider>
    )
}

export function usePlaymonSeguirViendo() {
    const ctx = useContext(PlaymonSeguirViendoContext)
    if (!ctx) throw new Error('usePlaymonSeguirViendo must be used within PlaymonSeguirViendoProvider')
    return ctx
}
