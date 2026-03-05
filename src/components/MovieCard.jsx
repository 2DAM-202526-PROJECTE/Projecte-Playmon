import React from 'react'
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

function MovieCard({ movie }) {
    return (
        <>
            <img src={IMAGE_BASE_URL + movie.poster_path}
                className='w-[110px] md:w-[195px] border-[3px]
                border-transparent hover:border-gray-400 cursor-pointer rounded-lg
                hover:shadow-[0_0_22px_rgba(156,163,175,0.45)]
                transition-all duration-150 ease-in-out' />
        </>
    )
}

export default MovieCard