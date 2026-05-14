import { httpClient } from "./httpClient";

export const playmonSeguirViendoApi = {
    getAll: () => httpClient("/playmon-seguir-viendo"),
    save: (video, progress, duration) => httpClient("/playmon-seguir-viendo", {
        method: "POST",
        body: JSON.stringify({
            video_id: video.id,
            title: video.title,
            thumbnail_url: video.thumbnailDataUrl || video.poster || null,
            progress,
            duration,
        }),
    }),
    remove: (videoId) => httpClient(`/playmon-seguir-viendo/${videoId}`, { method: "DELETE" }),
};
