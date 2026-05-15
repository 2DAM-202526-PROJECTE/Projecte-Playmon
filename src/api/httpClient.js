// src/api/httpClient.js
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api").replace(/\/$/, "");

export { API_BASE_URL };

// Endpoints públics: les seves 401 NO han de provocar logout
// (ex.: el propi POST /login retorna 401 amb credencials incorrectes).
const PUBLIC_PATHS = ["/login"];

function isPublicPath(path) {
    return PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}?`));
}

let isHandlingForcedLogout = false;

function forceLogout(reason) {
    if (isHandlingForcedLogout) return;
    isHandlingForcedLogout = true;

    try {
        // Neteja completa: no només auth, també qualsevol cache de feature
        // (favorits, historial, llistes...) que pugui haver-se desat amb prefix
        // o sense. Així evitem que la nova sessió hereti dades antigues.
        localStorage.clear();
        sessionStorage.clear();
    } catch {
        // ignore storage errors
    }

    // Avisem la resta de l'app (hooks que escolten auth:logout / auth:user-updated)
    window.dispatchEvent(new CustomEvent("auth:logout", { detail: { reason } }));
    window.dispatchEvent(new Event("auth:user-updated"));

    // Hard redirect a la pantalla de login. Evitem bucle si ja hi som.
    const onLogin = window.location.pathname === "/login" || window.location.pathname === "/";
    if (!onLogin) {
        window.location.replace("/login");
    }
}

export async function httpClient(path, options = {}) {
    const token = localStorage.getItem("authToken");

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const isPublic = isPublicPath(normalizedPath);

    const config = {
        method: options.method || "GET",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...options,
    };

    const response = await fetch(`${API_BASE_URL}${normalizedPath}`, config);

    let data = null;
    try {
        data = await response.json();
    } catch {
        // response without JSON body
    }

    if (!response.ok) {
        // Sessió revocada / token caducat / no proporcionat → logout immediat.
        // Excloem endpoints públics (login) on un 401 vol dir "credencials incorrectes",
        // no "sessió expirada".
        if (response.status === 401 && !isPublic && token) {
            forceLogout(data?.error || "unauthorized");
        }

        const message = data?.error || `HTTP ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}
