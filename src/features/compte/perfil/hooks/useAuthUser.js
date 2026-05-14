import { useEffect, useState, useCallback } from "react";
import { getCurrentUser, updateCurrentUser } from "@/api/authApi";

const EVENT = "auth:user-updated";

export function useAuthUser() {
    const [user, setUser] = useState(() => getCurrentUser());

    useEffect(() => {
        const handler = () => setUser(getCurrentUser());
        window.addEventListener(EVENT, handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener(EVENT, handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    const patchUser = useCallback((patch) => {
        const next = updateCurrentUser(patch);
        setUser(next);
        return next;
    }, []);

    return [user, patchUser];
}
