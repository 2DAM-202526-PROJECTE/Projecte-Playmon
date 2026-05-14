import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { visitesOriginalsApi } from '@/api/visitesOriginalsApi'
import { isLoggedIn } from '@/api/authApi'

const VisitesOriginalsContext = createContext(null)

export function VisitesOriginalsProvider({ children }) {
    const [counts, setCounts] = useState({})
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        if (!isLoggedIn()) { setLoading(false); return }
        try {
            const data = await visitesOriginalsApi.getCounts()
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

    const getViewCount = useCallback((videoId) => {
        return counts[String(videoId)] ?? 0
    }, [counts])

    const recordView = useCallback(async (videoId) => {
        const sessionKey = `playmon_viewed_${videoId}`
        if (sessionStorage.getItem(sessionKey)) return
        sessionStorage.setItem(sessionKey, '1')

        // Optimistic update
        setCounts(prev => ({ ...prev, [String(videoId)]: (prev[String(videoId)] ?? 0) + 1 }))

        try {
            const res = await visitesOriginalsApi.recordView(videoId)
            // Sync with server count
            setCounts(prev => ({ ...prev, [String(videoId)]: res.view_count }))
        } catch {
            // Revert optimistic update on error
            setCounts(prev => ({ ...prev, [String(videoId)]: Math.max(0, (prev[String(videoId)] ?? 1) - 1) }))
        }
    }, [])

    return (
        <VisitesOriginalsContext.Provider value={{ getViewCount, recordView, loading }}>
            {children}
        </VisitesOriginalsContext.Provider>
    )
}

export function useVisitesOriginals() {
    const ctx = useContext(VisitesOriginalsContext)
    if (!ctx) throw new Error('useVisitesOriginals must be used within VisitesOriginalsProvider')
    return ctx
}
