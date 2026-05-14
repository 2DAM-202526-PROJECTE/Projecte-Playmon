import { useEffect, useState } from "react";
import SidebarLayout from '@/layouts/SidebarLayout'
import SideBarAdmin from "./components/SideBarAdmin";
import { httpClient } from "@/api/httpClient";

const decorativeElements = (
    <>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#CC8400]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
    </>
)

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const [usersResult, videosResult] = await Promise.allSettled([
                    httpClient("/users"),
                    httpClient("/videos"),
                ]);

                const usersList = usersResult.status === "fulfilled"
                    ? (Array.isArray(usersResult.value) ? usersResult.value : usersResult.value?.users || [])
                    : [];

                const videosList = videosResult.status === "fulfilled"
                    ? (Array.isArray(videosResult.value) ? videosResult.value : videosResult.value?.videos || [])
                    : [];

                if (mounted) {
                    setUsers(usersList);
                    setVideos(videosList);
                }
            } catch (e) {
                if (mounted) {
                    setError(e?.message || "No s'han pogut carregar dades del dashboard");
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadDashboardData();
        return () => { mounted = false; };
    }, []);

    return (
        <SidebarLayout
            sidebar={<SideBarAdmin />}
            background="linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #0d0a00 70%, #1a0f00 100%)"
            decorativeElements={decorativeElements}
            maxWidth="1300px"
            stickyAside
            error={error}
            outletContext={{ users, videos, loading, fetchUsers: () => {}, fetchVideos: () => {} }}
        />
    );
}
