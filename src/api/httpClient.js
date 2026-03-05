// src/api/httpClient.js
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api").replace(/\/$/, "");

export { API_BASE_URL };

export async function httpClient(path, options = {}) {
    const token = localStorage.getItem("authToken");

    const config = {
        method: options.method || "GET",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...options,
    };

    const response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, config);

    let data = null;
    try {
        data = await response.json();
    } catch {
        // response without JSON body
    }

    if (!response.ok) {
        const message = data?.error || `HTTP ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}