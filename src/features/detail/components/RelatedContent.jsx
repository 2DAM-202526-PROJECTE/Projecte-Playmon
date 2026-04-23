import React from 'react'
import { useNavigate } from 'react-router-dom'

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300"

function RelatedContent({ movies = [] }) {
    const navigate = useNavigate()

    if (movies.length === 0) {
        return <p className='text-white/50 text-sm'>No s'han trobat continguts relacionats.</p>
    }

    const handleClick = (movie) => {
        const type = movie.media_type === 'tv' ? 'tv' : 'movie'
        navigate(`/${type}/${movie.id}`)
        window.scrollTo(0, 0)
    }

    return (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {movies.slice(0, 15).map((movie) => (
                <div
                    key={movie.id}
                    onClick={() => handleClick(movie)}
                    className='group cursor-pointer'
                >
                    <div className='relative aspect-[2/3] rounded-lg overflow-hidden
                                    bg-white/5 border border-transparent
                                    group-hover:border-gray-400
                                    group-hover:shadow-[0_0_22px_rgba(156,163,175,0.45)]
                                    transition-all duration-300'>
                        {movie.poster_path ? (
                            <img
                                src={IMAGE_BASE_URL + movie.poster_path}
                                alt={movie.title || movie.name}
                                className='w-full h-full object-cover
                                           group-hover:scale-105 transition-transform duration-500'
                            />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center text-white/20 text-sm'>
                                Sense imatge
                            </div>
                        )}
                    </div>
                    <p className='mt-2 text-white text-sm font-medium truncate'>
                        {movie.title || movie.name}
                    </p>
                    {movie.vote_average > 0 && (
                        <p className='text-white/50 text-xs'>
                            ⭐ {movie.vote_average.toFixed(1)}
                        </p>
                    )}
                </div>
            ))}
        </div>
    )
}

export default RelatedContent
