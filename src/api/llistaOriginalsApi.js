import { httpClient } from "./httpClient";

export const llistaOriginalsApi = {
    getAll: () => httpClient("/llista-originals"),
    add: (video) => httpClient("/llista-originals", {
        method: "POST",
        body: JSON.stringify({
            video_id: video.id,
            title: video.title,
            thumbnail_url: video.thumbnailDataUrl || null,
        }),
    }),
    remove: (videoId) => httpClient(`/llista-originals/${videoId}`, { method: "DELETE" }),
};
