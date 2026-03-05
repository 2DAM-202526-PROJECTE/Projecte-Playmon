import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import GlobalApi from '@/Services/GlobalApi'
import Header from '@/components/Header'
import HeroVideo from './components/HeroVideo'
import ActionButtons from './components/ActionButtons'
import CastSection from './components/CastSection'
import RelatedContent from './components/RelatedContent'
import EpisodeList from './components/EpisodeList'
import { HiArrowLeft } from 'react-icons/hi2'

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

function MovieDetailPage() {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('related')

    const isTv = location.pathname.startsWith('/tv')

    useEffect(() => {
        setLoading(true)
        setActiveTab(isTv ? 'episodes' : 'related')

        const fetchData = isTv
            ? GlobalApi.getTvDetails(id)
            : GlobalApi.getMovieDetails(id)

        fetchData
            .then(resp => setData(resp.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))

        window.scrollTo(0, 0)
    }, [id, isTv])

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='w-12 h-12 border-3 border-[#CC8400] border-t-transparent rounded-full animate-spin' />
            </div>
        )
    }

    if (!data) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p className='text-white/50 text-lg'>No s'ha pogut carregar la informació.</p>
            </div>
        )
    }

    const title = data.title || data.name || 'Sense títol'
    const overview = data.overview || 'Sense descripció disponible.'
    const releaseYear = (data.release_date || data.first_air_date || '').slice(0, 4)
    const runtime = data.runtime || (data.episode_run_time && data.episode_run_time[0]) || 0
    const runtimeStr = runtime > 0 ? `${Math.floor(runtime / 60)}h ${runtime % 60}min` : null
    const genres = data.genres || []
    const voteAvg = data.vote_average || 0
    const cast = data.credits?.cast || []
    const crew = data.credits?.crew || []
    const trailerKey = data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key
        || data.videos?.results?.find(v => v.site === 'YouTube')?.key
    const related = data.recommendations?.results?.length > 0
        ? data.recommendations.results
        : data.similar?.results || []
    const seasons = data.seasons || []

    // Calificació d'edat simulada basada en adult flag i gèneres
    const getAgeRating = () => {
        if (data.adult) return '18+'
        const genreIds = genres.map(g => g.id)
        if (genreIds.includes(27) || genreIds.includes(53)) return '16+'
        if (genreIds.includes(80) || genreIds.includes(10752)) return '13+'
        if (genreIds.includes(16) || genreIds.includes(10751)) return 'TP'
        return '12+'
    }

    const tabs = isTv
        ? [
            { key: 'episodes', label: 'Episodis' },
            { key: 'related', label: 'Relacionat' },
            { key: 'details', label: 'Detalls' }
        ]
        : [
            { key: 'related', label: 'Relacionat' },
            { key: 'details', label: 'Detalls' }
        ]

    return (
        <div className='min-h-screen'>
            <Header />

            {/* Hero amb video/backdrop */}
            <HeroVideo
                backdrop={data.backdrop_path}
                trailerKey={trailerKey}
                title={title}
            />

            {/* Contingut principal */}
            <div className='relative z-30 -mt-20 px-6 md:px-16'>
                {/* Botó tornar */}
                <button
                    onClick={() => navigate(-1)}
                    className='flex items-center gap-2 text-white/60 hover:text-white
                               transition-colors duration-200 mb-6 text-sm'
                >
                    <HiArrowLeft className='text-lg' />
                    Tornar
                </button>

                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* Columna esquerra: Poster (visible en desktop) */}
                    <div className='hidden lg:block flex-shrink-0 w-64'>
                        <div className='sticky top-8'>
                            {data.poster_path && (
                                <img
                                    src={IMAGE_BASE_URL + data.poster_path}
                                    alt={title}
                                    className='w-full rounded-xl shadow-2xl
                                               border border-white/10'
                                />
                            )}
                        </div>
                    </div>

                    {/* Columna dreta: Info principal */}
                    <div className='flex-1 min-w-0'>
                        {/* Acció buttons */}
                        <div className='mb-6'>
                            <ActionButtons />
                        </div>

                        {/* Metadades */}
                        <div className='flex flex-wrap items-center gap-3 mb-4'>
                            {/* Puntuació */}
                            {voteAvg > 0 && (
                                <span className='flex items-center gap-1 text-[#CC8400] font-semibold text-sm'>
                                    ⭐ {voteAvg.toFixed(1)}
                                </span>
                            )}
                            {/* Any */}
                            {releaseYear && (
                                <span className='text-white/60 text-sm'>{releaseYear}</span>
                            )}
                            {/* Durada */}
                            {runtimeStr && (
                                <span className='text-white/60 text-sm'>{runtimeStr}</span>
                            )}
                            {/* Calificació edat */}
                            <span className='px-2 py-0.5 text-xs font-bold rounded
                                            border border-white/40 text-white/80'>
                                {getAgeRating()}
                            </span>
                        </div>

                        {/* Categories / gèneres */}
                        <div className='flex flex-wrap gap-2 mb-5'>
                            {genres.map(genre => (
                                <span
                                    key={genre.id}
                                    className='px-3 py-1 text-xs font-medium rounded-full
                                               bg-[#CC8400]/15 text-[#CC8400] border border-[#CC8400]/30'
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        {/* Descripció */}
                        <p className='text-white/80 text-sm md:text-base leading-relaxed mb-8 max-w-3xl'>
                            {overview}
                        </p>

                        {/* Tabs */}
                        <div className='border-b border-white/10 mb-6'>
                            <div className='flex gap-6'>
                                {tabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`pb-3 text-sm font-medium transition-all duration-300
                                            ${activeTab === tab.key
                                                ? 'text-white border-b-2 border-[#CC8400]'
                                                : 'text-white/50 hover:text-white/80'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contingut del tab */}
                        <div className='pb-16'>
                            {activeTab === 'related' && (
                                <RelatedContent movies={related} />
                            )}

                            {activeTab === 'details' && (
                                <CastSection cast={cast} crew={crew} />
                            )}

                            {activeTab === 'episodes' && isTv && (
                                <EpisodeList tvId={id} seasons={seasons} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieDetailPage
