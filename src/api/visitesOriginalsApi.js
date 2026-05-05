import { httpClient } from "./httpClient";

export const visitesOriginalsApi = {
    getCounts: () => httpClient("/visites-originals/counts"),
    recordView: (videoId) => httpClient("/visites-originals", {
        method: "POST",
        body: JSON.stringify({ video_id: videoId }),
    }),
};
