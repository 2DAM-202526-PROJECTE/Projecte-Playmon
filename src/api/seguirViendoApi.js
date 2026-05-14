import { httpClient } from "./httpClient";

export const seguirViendoApi = {
    getAll: () => httpClient("/seguir_viendo"),
    saveProgress: (movie, progress, duration) => httpClient("/seguir_viendo", {
        method: "POST",
        body: JSON.stringify({
            tmdb_id: movie.id,
            media_type: movie.media_type || "movie",
            title: movie.title || movie.name,
            poster_path: movie.poster_path || null,
            backdrop_path: movie.backdrop_path || null,
            progress: progress,
            duration: duration,
        }),
    }),
    remove: (tmdbId, mediaType) =>
        httpClient(`/seguir_viendo/${tmdbId}/${mediaType || "movie"}`, { method: "DELETE" }),
};
