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

    const currentUser = getCurrentUser();
    if (currentUser) return currentUser;

    const userFromToken = getUserFromToken(token);
    if (userFromToken) {
        localStorage.setItem(USER_KEY, JSON.stringify(userFromToken));
    }

    try {
        const userFromApi = await fetchCurrentUserData();
        return userFromApi || userFromToken;
    } catch {
        return userFromToken;
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
        console.error("Error fetching user data:", e);
        throw e;
    }
}