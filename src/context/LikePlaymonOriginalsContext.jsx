import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { likePlaymonOriginalsApi } from '@/api/likePlaymonOriginalsApi'
import { isLoggedIn } from '@/api/authApi'

const LikePlaymonOriginalsContext = createContext(null)

export function LikePlaymonOriginalsProvider({ children }) {
    const [myLikes, setMyLikes] = useState(new Set())
    const [counts, setCounts] = useState({})
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        if (!isLoggedIn()) { setLoading(false); return }
        try {
            const data = await likePlaymonOriginalsApi.getAll()
            setMyLikes(new Set(data.my_likes?.map(String) ?? []))
            setCounts(data.counts ?? {})
        } catch (err) {
            if (err?.status === 401) {
                localStorage.removeItem('authToken')
                localStorage.removeItem('authUser')
                window.location.href = '/login'
                return
            }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const isLiked = useCallback((videoId) => {
        return myLikes.has(String(videoId))
    }, [myLikes])

    const getLikeCount = useCallback((videoId) => {
        return counts[String(videoId)] ?? 0
    }, [counts])

    const toggleLike = useCallback(async (videoId) => {
        const id = String(videoId)
        if (myLikes.has(id)) {
            setMyLikes(prev => { const s = new Set(prev); s.delete(id); return s })
            setCounts(prev => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 1) - 1) }))
            try { await likePlaymonOriginalsApi.remove(videoId) }
            catch { load() }
        } else {
            setMyLikes(prev => new Set([...prev, id]))
            setCounts(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
            try { await likePlaymonOriginalsApi.add(videoId) }
            catch { load() }
        }
    }, [myLikes, load])

    return (
        <LikePlaymonOriginalsContext.Provider value={{ isLiked, getLikeCount, toggleLike, loading }}>
            {children}
        </LikePlaymonOriginalsContext.Provider>
    )
}

export function useLikePlaymonOriginals() {
    const ctx = useContext(LikePlaymonOriginalsContext)
    if (!ctx) throw new Error('useLikePlaymonOriginals must be used within LikePlaymonOriginalsProvider')
    return ctx
}
