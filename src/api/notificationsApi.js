import { httpClient } from './httpClient'

export async function getNotifications() {
    return httpClient('/notifications')
}

export async function markRead(notifId) {
    return httpClient(`/notifications/${notifId}/read`, { method: 'POST' })
}

export async function markAllRead() {
    return httpClient('/notifications/read-all', { method: 'POST' })
}

export async function deleteNotification(notifId) {
    return httpClient(`/notifications/${notifId}`, { method: 'DELETE' })
}

export async function adminCreateNotification({ title, message, type, user_id = null }) {
    return httpClient('/admin/notifications', {
        method: 'POST',
        body: JSON.stringify({ title, message, type, user_id }),
    })
}
