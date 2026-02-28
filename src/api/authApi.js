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
    return next;
}

export function isLoggedIn() {
    return !!getToken();
}