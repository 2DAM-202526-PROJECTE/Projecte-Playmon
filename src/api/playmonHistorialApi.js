import { httpClient } from "./httpClient";

export const playmonHistorialApi = {
    getAll: () => httpClient("/playmon-historial"),
    add: (video) => httpClient("/playmon-historial", {
        method: "POST",
        body: JSON.stringify({
            video_id: video.id,
            title: video.title,
            thumbnail_url: video.thumbnailDataUrl || video.poster || null,
        }),
    }),
    remove: (videoId) => httpClient(`/playmon-historial/${videoId}`, { method: "DELETE" }),
};
