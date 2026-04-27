import React, { useEffect, useState, useMemo, useRef } from 'react'
import Header from '@/components/Header'
import HomeFooter from '@/features/home/components/HomeFooter'
import MovieCard from '@/components/MovieCard'
import GlobalApi from '@/Services/GlobalApi'
import { HiFilm } from 'react-icons/hi2'

const MOVIE_GENRES = [
    { id: 28,    name: 'Acció i Aventura' },
    { id: 35,    name: 'Comèdia' },
    { id: 18,    name: 'Drama' },
    { id: 53,    name: 'Thriller' },
    { id: 27,    name: 'Terror' },
    { id: 878,   name: 'Ciència Ficció' },
    { id: 12,    name: 'Aventura' },
    { id: 16,    name: 'Animació' },
    { id: 14,    name: 'Fantasia' },
    { id: 80,    name: 'Crim' },
    { id: 10749, name: 'Romàntic' },
    { id: 10751, name: 'Família' },
    { id: 99,    name: 'Documental' },
    { id: 36,    name: 'Història' },
    { id: 9648,  name: 'Misteri' },
    { id: 10752, name: 'Bèl·lic' },
    { id: 37,    name: 'Western' },
]

function hasGenre(movie, genreId) {
    const genres = movie.genres || []
    return genres.some(g => (typeof g === 'object' ? g.id : g) === genreId)
}

export default function MoviesPage() {
    const [allMovies, setAllMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeGenre, setActiveGenre] = useState(null)
    const barRef = useRef(null)

    useEffect(() => {
        GlobalApi.getMovies()
            .then(res => setAllMovies(res?.data?.results || res?.data || []))
            .catch(() => setAllMovies([]))
            .finally(() => setLoading(false))
    }, [])

    const availableGenres = useMemo(() =>
        MOVIE_GENRES.filter(g => allMovies.some(m => hasGenre(m, g.id))),
        [allMovies]
    )

    const filtered = useMemo(() =>
        activeGenre === null
            ? allMovies
            : allMovies.filter(m => hasGenre(m, activeGenre)),
        [allMovies, activeGenre]
    )

    const activeGenreName = activeGenre === null
        ? 'Totes'
        : availableGenres.find(g => g.id === activeGenre)?.name || ''

    return (
        <div className='min-h-screen' style={{ background: '#0a0a0a' }}>
            <Header />

            <div className='pt-24 pb-16'>
                {/* Capçalera */}
                <div className='flex items-center gap-4 px-6 md:px-12 mb-6'>
                    <HiFilm className='text-[#CC8400] text-4xl flex-shrink-0' />
                    <div>
                        <h1 className='text-3xl font-black text-white'>Pel·lícules</h1>
                        <p className='text-white/40 text-sm mt-0.5'>
                            {loading
                                ? 'Carregant catàleg...'
                                : `${filtered.length} títols · ${activeGenreName}`}
                        </p>
                    </div>
                </div>

                {/* Barra de filtres */}
                <div
                    ref={barRef}
                    className='flex gap-2 px-6 md:px-12 mb-8 overflow-x-auto pb-1'
                    style={{ scrollbarWidth: 'none' }}
                >
                    {/* Totes */}
                    <button
                        onClick={() => setActiveGenre(null)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                            ${activeGenre === null
                                ? 'bg-[#CC8400] border-[#CC8400] text-black'
                                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                            }`}
                    >
                        Totes
                    </button>

                    {availableGenres.map(genre => (
                        <button
                            key={genre.id}
                            onClick={() => setActiveGenre(genre.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                                ${activeGenre === genre.id
                                    ? 'bg-[#CC8400] border-[#CC8400] text-black'
                                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                                }`}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>

                {/* Contingut */}
                {loading ? (
                    <div className='flex justify-center py-32'>
                        <div className='w-12 h-12 border-4 border-[#CC8400] border-t-transparent rounded-full animate-spin' />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className='flex flex-col items-center py-32 text-center'>
                        <HiFilm className='text-white/10 text-6xl mb-4' />
                        <p className='text-white/40 text-xl'>Cap pel·lícula trobada</p>
                    </div>
                ) : (
                    <div className='px-6 md:px-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4'>
                        {filtered.map(movie => (
                            <div key={movie.id} className='group/card relative'>
                                <MovieCard movie={movie} />
                                <div className='absolute bottom-0 left-0 right-0 px-2 pb-2 pt-8
                                                bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-lg
                                                opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 pointer-events-none'>
                                    <p className='text-white text-[11px] font-medium truncate'>{movie.title || movie.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <HomeFooter />
        </div>
    )
}
