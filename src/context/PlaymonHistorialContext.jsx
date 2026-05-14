import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { playmonHistorialApi } from '@/api/playmonHistorialApi'
import { isLoggedIn } from '@/api/authApi'

const PlaymonHistorialContext = createContext(null)

export function PlaymonHistorialProvider({ children }) {
    const [historial, setHistorial] = useState([])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        if (!isLoggedIn()) { setLoading(false); return }
        try {
            const data = await playmonHistorialApi.getAll()
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

    const addToHistorial = useCallback(async (video) => {
        // optimistic upsert: mou al principi
        setHistorial(prev => {
            const filtered = prev.filter(i => String(i.video_id) !== String(video.id))
            return [{ video_id: Number(video.id), title: video.title, thumbnail_url: video.thumbnailDataUrl || video.poster || null, updated_at: new Date().toISOString() }, ...filtered]
        })
        try { await playmonHistorialApi.add(video) }
        catch { load() }
    }, [load])

    return (
        <PlaymonHistorialContext.Provider value={{ historial, loading, addToHistorial, refresh: load }}>
            {children}
        </PlaymonHistorialContext.Provider>
    )
}

export function usePlaymonHistorial() {
    const ctx = useContext(PlaymonHistorialContext)
    if (!ctx) throw new Error('usePlaymonHistorial must be used within PlaymonHistorialProvider')
    return ctx
}
