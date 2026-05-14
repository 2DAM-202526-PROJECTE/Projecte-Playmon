import React, { useEffect, useState, useMemo } from 'react'
import MainLayout from '@/layouts/MainLayout'
import CatalegHero from '@/components/CatalegHero'
import FilterBar from '@/components/FilterBar'
import ContentGrid from '@/components/ContentGrid'
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
        activeGenre === null ? allMovies : allMovies.filter(m => hasGenre(m, activeGenre)),
        [allMovies, activeGenre]
    )

    const activeGenreName = activeGenre === null
        ? 'Totes'
        : availableGenres.find(g => g.id === activeGenre)?.name || ''

    return (
        <MainLayout>
            <div className='pb-16'>
                <CatalegHero
                    icon={HiFilm}
                    badge="Catàleg complet"
                    title="PEL·LÍCULES"
                    subtitle={loading ? 'Carregant catàleg...' : `${filtered.length} títols · ${activeGenreName}`}
                />
                <FilterBar
                    genres={availableGenres}
                    activeGenre={activeGenre}
                    onSelect={setActiveGenre}
                />
                <ContentGrid
                    items={filtered}
                    loading={loading}
                    emptyIcon={HiFilm}
                    emptyText="Cap pel·lícula trobada"
                />
            </div>
        </MainLayout>
    )
}
