import { httpClient } from "./httpClient";

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export async function register(username, email, password) {
    return httpClient("/users", {
        method: "POST",
        body: JSON.stringify({
            username,
            name: username,
            email,
            role: "user",
            password,
        }),
    });
}

export async function login(usernameOrEmail, password) {
    const data = await httpClient("/login", {
        method: "POST",
        body: JSON.stringify({
            username: usernameOrEmail,
            password,
        }),
    });

    // Si l'usuari té 2FA, NO guardem token encara — només retornem el
    // challenge perquè el component cridi loginWith2FA(temp_token, code).
    if (data?.requires_2fa) return data;

    if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
    if (data?.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return data;
}

export async function loginWith2FA(tempToken, code) {
    const data = await httpClient("/login/2fa", {
        method: "POST",
        body: JSON.stringify({ temp_token: tempToken, code }),
    });
    if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
    if (data?.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function updateCurrentUser(patch) {
    const current = getCurrentUser() || {};
    const next = { ...current, ...patch };
    localStorage.setItem(USER_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("auth:user-updated"));
    return next;
}

export function isLoggedIn() {
    return !!getToken();
}

export function getUserFromToken(token = getToken()) {
    if (!token) return null;
    try {
        const [, payloadBase64] = token.split(".");
        if (!payloadBase64) return null;

        const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
        const payloadJson = atob(padded);
        const payload = JSON.parse(payloadJson);

        const nowInSeconds = Math.floor(Date.now() / 1000);
        if (payload?.exp && payload.exp < nowInSeconds) return null;

        return {
            id: payload?.id ?? null,
            username: payload?.username ?? "",
            email: payload?.email ?? "",
            role: payload?.role ?? "user",
        };
    } catch {
        return null;
    }
}

export async function ensureCurrentUser() {
    const token = getToken();
    if (!token) return null;

    // Sempre verifiquem contra servidor: si la sessió ha estat revocada des
    // d'un altre dispositiu, httpClient farà forceLogout i això llançarà 401.
    try {
        const userFromApi = await fetchCurrentUserData();
        return userFromApi || null;
    } catch (e) {
        // 401 → token invàlid o sessió revocada. No fem fallback a token decoded.
        if (e?.status === 401) return null;
        // Altres errors (xarxa caiguda...): fallback al cache local per no
        // expulsar l'usuari per un blip temporal.
        return getCurrentUser() || getUserFromToken(token);
    }
}

export async function fetchCurrentUserData() {
    try {
        const data = await httpClient("/users/me", {
            method: "GET",
        });
        if (data) {
            localStorage.setItem(USER_KEY, JSON.stringify(data));
        }
        return data;
    } catch (e) {
        throw e;
    }
}