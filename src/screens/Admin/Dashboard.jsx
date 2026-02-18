// src/pages/AdminDashboard.jsx
import { useMemo, useState, useEffect } from "react";

import SideBarCompte from "../../features/compte/perfil/components/SideBarCompte";


export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState("admin-dashboard");
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("tots");

    // --- API (PROVA) ---
    const USERS_URL = "https://playmonserver.vercel.app/api/users";
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState(null);

    useEffect(() => {
        const ac = new AbortController();

        (async () => {
            try {
                setUsersLoading(true);
                setUsersError(null);

                const res = await fetch(USERS_URL, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    signal: ac.signal,
                });

                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(`HTTP ${res.status} ${res.statusText} ${txt}`);
                }

                const data = await res.json();
                const list = Array.isArray(data) ? data : (data?.users ?? []);
                setUsers(list);

            } catch (e) {
                if (e.name !== "AbortError") setUsersError(e.message || "Error carregant usuaris");
            } finally {
                setUsersLoading(false);
            }
        })();

        return () => ac.abort();
    },
        []);



    // KPIs més "admin"
    const kpis = useMemo(
        () => [
            { label: "Usuaris totals", value: "1.284", hint: "+32 últims 7 dies", icon: "👥" },
            { label: "Llistes creades", value: "8.912", hint: "+210 últims 30 dies", icon: "🗂️" },
            { label: "Alertes actives", value: "423", hint: "17 crítiques", icon: "🚨" },
            { label: "Errors API (24h)", value: "6", hint: "p95 420ms", icon: "🧯" },
        ],
        []
    );

    // Dades placeholder de "tickets / incidències / cues"
    const items = useMemo(
        () => [
            {
                id: "INC-1042",
                title: "Sync preus Mercadona falla",
                owner: "system",
                priority: "Alta",
                status: "Obert",
                updated: "Fa 12m",
            },
            {
                id: "REQ-2231",
                title: "Nou rol 'Analyst' per informes",
                owner: "admin",
                priority: "Mitja",
                status: "En curs",
                updated: "Fa 2h",
            },
            {
                id: "INC-1033",
                title: "Timeouts en import CSV",
                owner: "support",
                priority: "Alta",
                status: "En curs",
                updated: "Ahir",
            },
            {
                id: "REQ-2198",
                title: "Exportació dashboard a PDF",
                owner: "product",
                priority: "Baixa",
                status: "Tancat",
                updated: "Fa 5 dies",
            },
        ],
        []
    );

    // Dades placeholder d'auditoria
    const audit = useMemo(
        () => [
            { who: "admin@exemple.com", action: "Va desactivar un usuari", when: "Fa 18m" },
            { who: "system", action: "Cron: refresh preus completat", when: "Fa 1h" },
            { who: "support@exemple.com", action: "Va escalar INC-1033", when: "Ahir" },
        ],
        []
    );

    const filteredItems = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter((it) => {
            const matchQuery =
                !q ||
                it.id.toLowerCase().includes(q) ||
                it.title.toLowerCase().includes(q) ||
                it.owner.toLowerCase().includes(q);

            const matchStatus = statusFilter === "tots" || it.status === statusFilter;

            return matchQuery && matchStatus;
        });
    }, [items, query, statusFilter]);

    const badgePriority = (p) => {
        const base =
            "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-black/5";
        if (p === "Alta") return `${base} bg-rose-100 text-rose-700`;
        if (p === "Mitja") return `${base} bg-amber-100 text-amber-800`;
        return `${base} bg-slate-100 text-slate-700`;
    };

    const badgeStatus = (s) => {
        const base =
            "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-black/5";
        if (s === "Obert") return `${base} bg-rose-100 text-rose-700`;
        if (s === "En curs") return `${base} bg-blue-100 text-blue-700`;
        return `${base} bg-emerald-100 text-emerald-700`;
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-5 py-7 lg:grid-cols-[280px_1fr]">
                {/* Sidebar */}
                <SideBarCompte active={activeSection} onSelect={setActiveSection} />

                {/* Contingut */}
                <main className="flex flex-col gap-5">
                    {/* Header */}
                    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Admin Dashboard
                            </h1>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-black/5">
                                Control Tower
                            </span>
                        </div>

                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                            <div className="flex w-full items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5 sm:w-[420px]">
                                <span className="select-none text-slate-500">⌕</span>
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Cerca incidències, IDs, owners..."
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="h-10 rounded-full bg-white px-4 text-sm shadow-sm ring-1 ring-black/5 outline-none"
                                >
                                    <option value="tots">Tots</option>
                                    <option value="Obert">Obert</option>
                                    <option value="En curs">En curs</option>
                                    <option value="Tancat">Tancat</option>
                                </select>

                                <button
                                    type="button"
                                    className="h-10 rounded-full bg-blue-600 px-4 text-sm font-semibold text-white hover:brightness-95"
                                >
                                    + Crear
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* KPIs */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {kpis.map((k) => (
                            <div
                                key={k.label}
                                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-700">{k.label}</div>
                                        <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                                            {k.value}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">{k.hint}</div>
                                    </div>
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-lg ring-1 ring-black/5">
                                        {k.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Grid principal */}
                    <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
                        {/* Taula / Cua de treball */}
                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">Cua de treball</h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Incidències, requests i tasques operatives (placeholder).
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-black/5 hover:bg-slate-200"
                                >
                                    Exportar
                                </button>
                            </div>

                            <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-black/5">
                                <table className="w-full border-collapse bg-white text-left text-sm">
                                    <thead className="bg-slate-50">
                                        <tr className="text-slate-600">
                                            <th className="px-4 py-3 font-semibold">ID</th>
                                            <th className="px-4 py-3 font-semibold">Títol</th>
                                            <th className="px-4 py-3 font-semibold">Owner</th>
                                            <th className="px-4 py-3 font-semibold">Prioritat</th>
                                            <th className="px-4 py-3 font-semibold">Estat</th>
                                            <th className="px-4 py-3 font-semibold">Actualitzat</th>
                                            <th className="px-4 py-3 font-semibold">Accions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredItems.map((it) => (
                                            <tr key={it.id} className="border-t border-black/5">
                                                <td className="px-4 py-3 font-mono text-xs text-slate-700">{it.id}</td>
                                                <td className="px-4 py-3">
                                                    <div className="font-semibold text-slate-900">{it.title}</div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-700">{it.owner}</td>
                                                <td className="px-4 py-3">
                                                    <span className={badgePriority(it.priority)}>{it.priority}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={badgeStatus(it.status)}>{it.status}</span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">{it.updated}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-black/10 hover:bg-slate-50"
                                                        >
                                                            Veure
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-black/10 hover:bg-slate-50"
                                                        >
                                                            Assignar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50"
                                                        >
                                                            Tancar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {filteredItems.length === 0 ? (
                                            <tr>
                                                <td className="px-4 py-6 text-sm text-slate-500" colSpan={7}>
                                                    No hi ha resultats amb aquests filtres. (Admin trist 😔)
                                                </td>
                                            </tr>
                                        ) : null}
                                    </tbody>
                                </table>
                            </div>

                            {/* Accions ràpides admin */}
                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <button
                                    type="button"
                                    className="rounded-2xl bg-slate-50 px-4 py-3 text-left ring-1 ring-black/5 hover:bg-slate-100"
                                >
                                    <div className="text-sm font-semibold text-slate-900">Gestió d'usuaris</div>
                                    <div className="mt-1 text-xs text-slate-500">Bloquejar, rols, permisos</div>
                                </button>

                                <button
                                    type="button"
                                    className="rounded-2xl bg-slate-50 px-4 py-3 text-left ring-1 ring-black/5 hover:bg-slate-100"
                                >
                                    <div className="text-sm font-semibold text-slate-900">Jobs / Cron</div>
                                    <div className="mt-1 text-xs text-slate-500">Refresh preus, imports</div>
                                </button>

                                <button
                                    type="button"
                                    className="rounded-2xl bg-slate-50 px-4 py-3 text-left ring-1 ring-black/5 hover:bg-slate-100"
                                >
                                    <div className="text-sm font-semibold text-slate-900">Observabilitat</div>
                                    <div className="mt-1 text-xs text-slate-500">Logs, traces, errors</div>
                                </button>
                            </div>
                        </div>

                        {/* Panell dret */}
                        <div className="flex flex-col gap-5">
                            {/* Estat del sistema */}
                            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                                <h2 className="text-base font-semibold text-slate-900">Salut del sistema</h2>
                                <p className="mt-1 text-sm text-slate-500">Resum ràpid (placeholder).</p>

                                <div className="mt-4 space-y-3">
                                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-black/5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-sm font-semibold text-slate-900">API</div>
                                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-black/5">
                                                OK
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500">p95: 420ms · errors: 6/24h</div>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-black/5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-sm font-semibold text-slate-900">DB</div>
                                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-black/5">
                                                OK
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500">Conn: 18 · lag: 0</div>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-black/5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-sm font-semibold text-slate-900">Workers</div>
                                            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800 ring-1 ring-black/5">
                                                DEGRADED
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500">2 retries · 1 job lent</div>
                                    </div>
                                </div>
                            </div>

                            {/* Usuaris (API) */}
                            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                                <h2 className="text-base font-semibold text-slate-900">Usuaris</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Dades carregades des de la teva API (prova).
                                </p>

                                {usersLoading ? (
                                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-black/5">
                                        Carregant usuaris...
                                    </div>
                                ) : null}

                                {usersError ? (
                                    <div className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200">
                                        Error: {usersError}
                                    </div>
                                ) : null}

                                {!usersLoading && !usersError ? (
                                    <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-black/5">
                                        <table className="w-full border-collapse bg-white text-left text-sm">
                                            <thead className="bg-slate-50">
                                                <tr className="text-slate-600">
                                                    <th className="px-4 py-3 font-semibold">Nom</th>
                                                    <th className="px-4 py-3 font-semibold">Email</th>
                                                    <th className="px-4 py-3 font-semibold">Rol</th>
                                                    <th className="px-4 py-3 font-semibold">Accions</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {users.map((u, idx) => (
                                                    <tr key={u.id ?? u.email ?? idx} className="border-t border-black/5">
                                                        <td className="px-4 py-3 font-semibold text-slate-900">
                                                            {u.name ?? u.nom ?? "—"}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-700">
                                                            {u.email ?? "—"}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-black/5">
                                                                {u.role ?? u.rol ?? "user"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-black/10 hover:bg-slate-50"
                                                                    onClick={() => console.log("Veure usuari:", u)}
                                                                >
                                                                    Veure
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50"
                                                                    onClick={() => console.log("Desactivar usuari:", u)}
                                                                >
                                                                    Desactivar
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {users.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-4 py-6 text-sm text-slate-500">
                                                            La teva API ha tornat un array buit.
                                                        </td>
                                                    </tr>
                                                ) : null}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : null}
                            </div>

                            {/* Auditoria */}
                            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                                <h2 className="text-base font-semibold text-slate-900">Auditoria</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Últimes accions amb impacte (placeholder).
                                </p>

                                <div className="mt-4 space-y-3">
                                    {audit.map((a, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-3"
                                        >
                                            <div className="text-sm font-semibold text-slate-900">{a.action}</div>
                                            <div className="mt-1 text-xs text-slate-500">
                                                {a.who} · {a.when}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Placeholder secció */}
                            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                                <div className="text-sm font-semibold text-slate-900">
                                    Secció seleccionada:{" "}
                                    <span className="font-mono text-slate-600">{activeSection}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
