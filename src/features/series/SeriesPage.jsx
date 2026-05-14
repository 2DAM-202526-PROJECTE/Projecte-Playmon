import React, { useEffect, useState, useMemo } from 'react'
import MainLayout from '@/layouts/MainLayout'
import CatalegHero from '@/components/CatalegHero'
import FilterBar from '@/components/FilterBar'
import ContentGrid from '@/components/ContentGrid'
import GlobalApi from '@/Services/GlobalApi'
import { HiTv } from 'react-icons/hi2'

const SERIES_GENRES = [
    { id: 18,    name: 'Drama' },
    { id: 35,    name: 'Comèdia' },
    { id: 10759, name: 'Acció i Aventura' },
    { id: 10765, name: 'Fantasia i Sci-Fi' },
    { id: 80,    name: 'Crim' },
    { id: 9648,  name: 'Misteri' },
    { id: 99,    name: 'Documental' },
    { id: 16,    name: 'Animació' },
    { id: 10751, name: 'Família' },
    { id: 10762, name: 'Infantil' },
    { id: 10764, name: 'Reality' },
    { id: 10768, name: 'Guerra i Política' },
    { id: 37,    name: 'Western' },
]

function hasGenre(serie, genreId) {
    const genres = serie.genres || []
    return genres.some(g => (typeof g === 'object' ? g.id : g) === genreId)
}

export default function SeriesPage() {
    const [allSeries, setAllSeries] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeGenre, setActiveGenre] = useState(null)

    useEffect(() => {
        GlobalApi.getSeries()
            .then(res => setAllSeries(res?.data?.results || res?.data || []))
            .catch(() => setAllSeries([]))
            .finally(() => setLoading(false))
    }, [])

    const availableGenres = useMemo(() =>
        SERIES_GENRES.filter(g => allSeries.some(s => hasGenre(s, g.id))),
        [allSeries]
    )

    const filtered = useMemo(() =>
        activeGenre === null ? allSeries : allSeries.filter(s => hasGenre(s, activeGenre)),
        [allSeries, activeGenre]
    )

    const activeGenreName = activeGenre === null
        ? 'Totes'
        : availableGenres.find(g => g.id === activeGenre)?.name || ''

    return (
        <MainLayout>
            <div className='pb-16'>
                <CatalegHero
                    icon={HiTv}
                    badge="Catàleg complet"
                    title="SÈRIES"
                    subtitle={loading ? 'Carregant catàleg...' : `${filtered.length} sèries · ${activeGenreName}`}
                />
                <FilterBar
                    genres={availableGenres}
                    activeGenre={activeGenre}
                    onSelect={setActiveGenre}
                />
                <ContentGrid
                    items={filtered}
                    loading={loading}
                    emptyIcon={HiTv}
                    emptyText="Cap sèrie trobada"
                    emptySubtext={allSeries.length === 0 ? "El servidor de sèries s'està preparant. Torna aviat!" : undefined}
                    mediaType="tv"
                />
            </div>
        </MainLayout>
    )
}
