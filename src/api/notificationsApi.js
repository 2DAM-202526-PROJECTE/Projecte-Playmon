import { httpClient } from "./httpClient";

export function fetchNotifications() {
    return httpClient("/notifications");
}

export function markNotificationRead(id) {
    return httpClient(`/notifications/${id}/read`, { method: "POST" });
}

export function markAllNotificationsRead() {
    return httpClient("/notifications/read-all", { method: "POST" });
}

export function deleteNotification(id) {
    return httpClient(`/notifications/${id}`, { method: "DELETE" });
}
