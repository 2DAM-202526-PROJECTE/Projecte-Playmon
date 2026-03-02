import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideBarCompte from "@/features/compte/perfil/components/SideBarCompte";
import { httpClient } from "@/api/httpClient";
import { getCurrentUser } from "@/api/authApi";
import { uploadVideo } from "@/api/videosApi";

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState("admin-dashboard");
    const location = useLocation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [apiLatencyMs, setApiLatencyMs] = useState(null);
    const [lastSync, setLastSync] = useState("");
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [videoPublic, setVideoPublic] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadFeedback, setUploadFeedback] = useState("");
    const [uploadError, setUploadError] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadDashboardData = async () => {
            setLoading(true);
            setError("");

            const start = performance.now();

            try {
                const [usersCountResult, videosCountResult, usersResult, videosResult] = await Promise.allSettled([
                    httpClient("/stats/users/count"),
                    httpClient("/stats/videos/count"),
                    httpClient("/users"),
                    httpClient("/videos"),
                ]);

                const usersList = usersResult.status === "fulfilled"
                    ? (Array.isArray(usersResult.value) ? usersResult.value : usersResult.value?.users || [])
                    : [];

                const videosList = videosResult.status === "fulfilled"
                    ? (Array.isArray(videosResult.value) ? videosResult.value : videosResult.value?.videos || [])
                    : [];

                const usersFromCount = usersCountResult.status === "fulfilled"
                    ? Number(usersCountResult.value?.count ?? 0)
                    : usersList.length;

                const videosFromCount = videosCountResult.status === "fulfilled"
                    ? Number(videosCountResult.value?.count ?? 0)
                    : videosList.length;

                const normalizedUsers = usersList.slice(0, Math.max(usersFromCount, usersList.length));
                const normalizedVideos = videosList.slice(0, Math.max(videosFromCount, videosList.length));

                if (mounted) {
                    setUsers(normalizedUsers);
                    setVideos(normalizedVideos);
                    setApiLatencyMs(Math.round(performance.now() - start));
                    setLastSync(new Date().toLocaleString());
                }
            } catch (e) {
                if (mounted) {
                    setError(e?.message || "No s'han pogut carregar dades del dashboard");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadDashboardData();

        return () => {
            mounted = false;
        };
    }, []);

    const metrics = useMemo(() => {
        const totalUsers = users.length;
        const adminUsers = users.filter((user) => (user?.role || "").toLowerCase() === "admin").length;
        const totalVideos = videos.length;
        const publicVideos = videos.filter((video) => video?.is_public === true).length;

        return [
            { label: "Usuaris totals", value: totalUsers, route: "/dashboard/users" },
            { label: "Admins", value: adminUsers, route: "/dashboard/admins" },
            { label: "Vídeos totals", value: totalVideos, route: "/dashboard/videos" },
            { label: "Vídeos públics", value: publicVideos, route: "/dashboard/public-videos" },
        ];
    }, [users, videos]);

    const selectedRoute = useMemo(() => {
        const path = location.pathname;
        const allowedRoutes = [
            "/dashboard/users",
            "/dashboard/admins",
            "/dashboard/videos",
            "/dashboard/public-videos",
        ];
        return allowedRoutes.includes(path) ? path : "/dashboard/users";
    }, [location.pathname]);

    const detailConfig = useMemo(() => {
        if (selectedRoute === "/dashboard/admins") {
            const rows = users.filter((user) => (user?.role || "").toLowerCase() === "admin");
            return {
                title: "Registres d'admins",
                columns: ["Nom", "Email", "Rol"],
                rows: rows.map((user) => [
                    user?.name || user?.username || "",
                    user?.email || "",
                    user?.role || "",
                ]),
            };
        }

        if (selectedRoute === "/dashboard/videos") {
            return {
                title: "Registres de vídeos totals",
                columns: ["ID", "Títol", "Públic"],
                rows: videos.map((video) => [
                    video?.id ?? "",
                    video?.title || "",
                    video?.is_public ? "Sí" : "No",
                ]),
            };
        }

        if (selectedRoute === "/dashboard/public-videos") {
            const rows = videos.filter((video) => video?.is_public === true);
            return {
                title: "Registres de vídeos públics",
                columns: ["ID", "Títol", "Data"],
                rows: rows.map((video) => [
                    video?.id ?? "",
                    video?.title || "",
                    video?.created_at || "",
                ]),
            };
        }

        return {
            title: "Registres d'usuaris",
            columns: ["Nom", "Email", "Rol"],
            rows: users.map((user) => [
                user?.name || user?.username || "",
                user?.email || "",
                user?.role || "",
            ]),
        };
    }, [selectedRoute, users, videos]);

    const handleUploadVideo = async (event) => {
        event.preventDefault();
        setUploadFeedback("");
        setUploadError("");

        if (!videoFile) {
            setUploadError("Selecciona un vídeo abans de pujar-lo");
            return;
        }

        const authUser = getCurrentUser();
        if (!authUser?.id) {
            setUploadError("No s'ha pogut identificar l'usuari autenticat");
            return;
        }

        try {
            setUploadingVideo(true);

            await uploadVideo({
                file: videoFile,
                title: videoTitle,
                description: videoDescription,
                isPublic: videoPublic,
                userId: authUser.id,
            });

            const videosResult = await httpClient("/videos");
            const videosList = Array.isArray(videosResult)
                ? videosResult
                : videosResult?.videos || [];
            setVideos(videosList);
            setLastSync(new Date().toLocaleString());

            setUploadFeedback("Vídeo pujat correctament");
            setVideoTitle("");
            setVideoDescription("");
            setVideoFile(null);
            setVideoPublic(false);
        } catch (uploadException) {
            setUploadError(uploadException?.message || "Error pujant el vídeo");
        } finally {
            setUploadingVideo(false);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <div className="mx-auto grid max-w-300 grid-cols-1 gap-6 px-5 py-7 lg:grid-cols-[280px_1fr]">
                <SideBarCompte active={activeSection} onSelect={setActiveSection} />

                <main className="flex min-w-0 flex-col gap-5">
                    <header className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-white">Admin Dashboard</h1>
                        <p className="text-sm text-white/70">Panell administració</p>
                    </header>

                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {metrics.map((field) => (
                            <article
                                key={field.label}
                                className="rounded-2xl bg-[#303134] p-5 ring-1 ring-white/10"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-white/80">{field.label}</div>
                                    <button
                                        type="button"
                                        onClick={() => navigate(field.route)}
                                        className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/15"
                                    >
                                        Veure
                                    </button>
                                </div>
                                <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
                                    {loading ? "..." : field.value}
                                </div>
                            </article>
                        ))}
                    </section>

                    <section>
                        <article className="rounded-2xl bg-[#303134] p-5 ring-1 ring-white/10">
                            <h2 className="text-base font-semibold text-white">{detailConfig.title}</h2>

                            <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10">
                                <table className="w-full border-collapse bg-[#202124] text-left text-sm">
                                    <thead className="bg-white/5 text-white/70">
                                        <tr>
                                            {detailConfig.columns.map((column) => (
                                                <th key={column} className="px-4 py-3 font-semibold">{column}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr className="border-t border-white/10">
                                                <td className="px-4 py-6 text-white/60" colSpan={detailConfig.columns.length}>
                                                    Carregant registres...
                                                </td>
                                            </tr>
                                        ) : detailConfig.rows.length === 0 ? (
                                            <tr className="border-t border-white/10">
                                                <td className="px-4 py-6 text-white/60" colSpan={detailConfig.columns.length}>
                                                    No hi ha registres.
                                                </td>
                                            </tr>
                                        ) : (
                                            detailConfig.rows.map((row, rowIndex) => (
                                                <tr key={`${selectedRoute}-${rowIndex}`} className="border-t border-white/10">
                                                    {row.map((cell, cellIndex) => (
                                                        <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 text-white/80">
                                                            {String(cell)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </article>
                    </section>

                    <section>
                        <article className="rounded-2xl bg-[#303134] p-5 ring-1 ring-white/10">
                            <h2 className="text-base font-semibold text-white">Pujar vídeo</h2>

                            <form className="mt-4 grid grid-cols-1 gap-3" onSubmit={handleUploadVideo}>
                                <input
                                    type="text"
                                    value={videoTitle}
                                    onChange={(event) => setVideoTitle(event.target.value)}
                                    placeholder="Títol"
                                    className="rounded-xl bg-[#202124] px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40"
                                />

                                <textarea
                                    value={videoDescription}
                                    onChange={(event) => setVideoDescription(event.target.value)}
                                    placeholder="Descripció"
                                    rows={3}
                                    className="rounded-xl bg-[#202124] px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40"
                                />

                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(event) => setVideoFile(event.target.files?.[0] || null)}
                                    className="rounded-xl bg-[#202124] px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white/90"
                                />

                                <label className="flex items-center gap-2 text-sm text-white/80">
                                    <input
                                        type="checkbox"
                                        checked={videoPublic}
                                        onChange={(event) => setVideoPublic(event.target.checked)}
                                        className="h-4 w-4 rounded border-white/20 bg-[#202124]"
                                    />
                                    Fer públic
                                </label>

                                {uploadError ? (
                                    <div className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-200 ring-1 ring-rose-500/30">
                                        {uploadError}
                                    </div>
                                ) : null}

                                {uploadFeedback ? (
                                    <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 ring-1 ring-emerald-500/30">
                                        {uploadFeedback}
                                    </div>
                                ) : null}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={uploadingVideo}
                                        className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {uploadingVideo ? "Pujant..." : "Pujar vídeo"}
                                    </button>
                                </div>
                            </form>
                        </article>
                    </section>

                    <section>
                        <article className="rounded-2xl bg-[#303134] p-5 ring-1 ring-white/10">
                            <h2 className="text-base font-semibold text-white">Salut del sistema</h2>

                            {error ? (
                                <div className="mt-4 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-200 ring-1 ring-rose-500/30">
                                    {error}
                                </div>
                            ) : (
                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                                        <div className="text-sm font-semibold text-white/80">API</div>
                                        <div className="mt-1 text-sm text-white/70">
                                            {loading ? "Comprovant..." : "Operativa"}
                                        </div>
                                        <div className="mt-1 text-xs text-white/50">
                                            {loading || apiLatencyMs == null ? "" : `Latència: ${apiLatencyMs}ms`}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                                        <div className="text-sm font-semibold text-white/80">Base de dades</div>
                                        <div className="mt-1 text-sm text-white/70">
                                            {loading ? "Comprovant..." : "Connectada"}
                                        </div>
                                        <div className="mt-1 text-xs text-white/50">
                                            {loading ? "" : `Usuaris: ${metrics[0].value} · Vídeos: ${metrics[2].value}`}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                                        <div className="text-sm font-semibold text-white/80">Última sincronització</div>
                                        <div className="mt-1 text-sm text-white/70">{loading ? "..." : lastSync}</div>
                                        <div className="mt-1 text-xs text-white/50">Dades actualitzades des de l'API</div>
                                    </div>
                                </div>
                            )}
                        </article>
                    </section>
                </main>
            </div>
        </div>
    );
}
