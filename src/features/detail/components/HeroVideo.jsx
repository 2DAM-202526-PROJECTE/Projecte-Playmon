import React, { useState } from 'react'

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

function HeroVideo({ backdrop, trailerKey, title }) {
    const [showTrailer, setShowTrailer] = useState(false)

    return (
        <div className='relative w-full h-[50vh] md:h-[70vh] overflow-hidden'>
            {showTrailer && trailerKey ? (
                <iframe
                    className='absolute inset-0 w-full h-full z-10'
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                    title={title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            ) : (
                <div className='absolute inset-0'>
                    <img
                        src={IMAGE_BASE_URL + backdrop}
                        alt={title}
                        className='w-full h-full object-cover object-center animate-slow-zoom'
                    />
                </div>
            )}

            {/* Gradient overlay inferior */}
            <div className='absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-20 pointer-events-none' />

            {/* Gradient lateral esquerre */}
            <div className='absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 to-transparent z-20 pointer-events-none' />

            {/* Contingut sobre el video */}
            <div className='absolute bottom-0 left-0 right-0 z-30 px-6 md:px-16 pb-8 md:pb-14'>
                <h1 className='text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-4 max-w-3xl'>
                    {title}
                </h1>

                {trailerKey && !showTrailer && (
                    <button
                        onClick={() => setShowTrailer(true)}
                        className='flex items-center gap-2 px-6 py-3 rounded-lg
                                   bg-white text-black font-semibold text-sm md:text-base
                                   hover:bg-white/90 transition-all duration-300
                                   shadow-lg hover:shadow-xl hover:scale-105'
                    >
                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z' />
                        </svg>
                        Veure Tràiler
                    </button>
                )}

                {showTrailer && (
                    <button
                        onClick={() => setShowTrailer(false)}
                        className='flex items-center gap-2 px-6 py-3 rounded-lg
                                   bg-white/20 text-white font-semibold text-sm md:text-base
                                   hover:bg-white/30 transition-all duration-300 backdrop-blur-sm'
                    >
                        ✕ Tancar tràiler
                    </button>
                )}
            </div>
        </div>
    )
}

export default HeroVideo
