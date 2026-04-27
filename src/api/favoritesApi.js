import { httpClient } from "./httpClient";

export const favoritesApi = {
    getAll: () => httpClient("/favorites"),
    add: (movie) => httpClient("/favorites", {
        method: "POST",
        body: JSON.stringify({
            tmdb_id: movie.id,
            media_type: movie.media_type || "movie",
            title: movie.title || movie.name,
            poster_path: movie.poster_path || null,
            backdrop_path: movie.backdrop_path || null,
            overview: movie.overview || null,
            release_date: movie.release_date || null,
            first_air_date: movie.first_air_date || null,
            vote_average: movie.vote_average || null,
            genres: movie.genres || [],
        }),
    }),
    remove: (tmdbId, mediaType) =>
        httpClient(`/favorites/${tmdbId}/${mediaType || "movie"}`, { method: "DELETE" }),
};
