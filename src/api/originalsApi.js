import { httpClient } from './httpClient'

export async function addToHistory(videoId) {
    return httpClient('/originals/history', {
        method: 'POST',
        body: JSON.stringify({ video_id: Number(videoId) }),
    })
}

export async function getHistory() {
    return httpClient('/originals/history')
}

export async function clearHistory() {
    return httpClient('/originals/history', { method: 'DELETE' })
}

export async function toggleWatchlist(videoId) {
    return httpClient(`/originals/watchlist/${videoId}`, { method: 'POST' })
}

export async function getWatchlist() {
    return httpClient('/originals/watchlist')
}
