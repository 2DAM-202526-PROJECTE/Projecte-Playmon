import axios from "axios";

const movieBaseUrl = "https://api.themoviedb.org/3"
const api_key = "fdf457c53c98d9f517d0dc9ebb60c203"

const getTrendingVideos = () => axios.get(movieBaseUrl +
    "/trending/all/week?api_key=" + api_key);

const getMoviesByGender = (genreId) => axios.get(movieBaseUrl +
    "/discover/movie?api_key=" + api_key + "&with_genres=" + genreId);

export default {
    getTrendingVideos,
    getMoviesByGender
}