import { useCallback, useEffect, useState } from "react";
import {
    fetchSessions,
    fetchLoginHistory,
    fetchSecuritySettings,
} from "@/api/securityApi";

export function useSecurityData() {
    const [sessions, setSessions] = useState([]);
    const [history, setHistory] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [s, h, st] = await Promise.all([
                fetchSessions().catch(() => []),
                fetchLoginHistory(10).catch(() => []),
                fetchSecuritySettings().catch(() => null),
            ]);
            setSessions(Array.isArray(s) ? s : []);
            setHistory(Array.isArray(h) ? h : []);
            setSettings(st);
        } catch (e) {
            setError(e?.message || "Error carregant dades de seguretat");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    return { sessions, history, settings, loading, error, reload, setSettings };
}
