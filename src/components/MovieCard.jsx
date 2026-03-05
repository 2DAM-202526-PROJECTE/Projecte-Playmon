import React from 'react'
import { useNavigate } from 'react-router-dom'
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

function MovieCard({ movie }) {
    const navigate = useNavigate()

    const handleClick = () => {
        // TMDB: movies have 'title', TV shows have 'name'
        const type = movie.title ? 'movie' : 'tv'
        navigate(`/${type}/${movie.id}`)
    }

    return (
        <img
            src={IMAGE_BASE_URL + movie.poster_path}
            onClick={handleClick}
            className='w-[110px] md:w-[195px] border-[3px]
            border-transparent hover:border-gray-400 cursor-pointer rounded-lg
            hover:shadow-[0_0_22px_rgba(156,163,175,0.45)]
            transition-all duration-150 ease-in-out'
            alt={movie.title || movie.name}
        />
    )
}

export default MovieCard