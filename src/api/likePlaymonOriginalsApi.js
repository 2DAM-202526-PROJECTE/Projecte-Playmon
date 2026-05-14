import { httpClient } from "./httpClient";

export const likePlaymonOriginalsApi = {
    getAll: () => httpClient("/like-playmon-originals"),
    add: (videoId) => httpClient("/like-playmon-originals", {
        method: "POST",
        body: JSON.stringify({ video_id: videoId }),
    }),
    remove: (videoId) => httpClient(`/like-playmon-originals/${videoId}`, { method: "DELETE" }),
};
