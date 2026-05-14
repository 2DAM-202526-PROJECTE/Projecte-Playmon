import { httpClient } from "./httpClient";

export const historialApi = {
    getAll: () => httpClient("/historial"),
    add: (movie) => httpClient("/historial", {
        method: "POST",
        body: JSON.stringify({
            tmdb_id: movie.id,
            media_type: movie.media_type || "movie",
            title: movie.title || movie.name,
            poster_path: movie.poster_path || null,
            backdrop_path: movie.backdrop_path || null,
        }),
    }),
    remove: (tmdbId, mediaType) =>
        httpClient(`/historial/${tmdbId}/${mediaType || "movie"}`, { method: "DELETE" }),
    clear: () => httpClient("/historial", { method: "DELETE" }),
};
