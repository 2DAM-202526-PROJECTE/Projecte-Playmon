import { httpClient } from "./httpClient";

export function fetchSessions() {
    return httpClient("/users/me/sessions");
}

export function revokeSession(sessionId) {
    return httpClient(`/users/me/sessions/${sessionId}`, { method: "DELETE" });
}

export function revokeAllOtherSessions() {
    return httpClient("/users/me/sessions", { method: "DELETE" });
}

export function fetchLoginHistory(limit = 10) {
    return httpClient(`/users/me/login-history?limit=${limit}`);
}

export function fetchSecuritySettings() {
    return httpClient("/users/me/security");
}

export function updateSecuritySettings(payload) {
    return httpClient("/users/me/security", {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export function changePassword(currentPassword, newPassword) {
    return httpClient("/users/me/password", {
        method: "POST",
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
        }),
    });
}
