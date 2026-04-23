import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import GlobalApi from '@/Services/GlobalApi'
import Header from '@/components/Header'
import HeroVideo from './components/HeroVideo'
import ActionButtons from './components/ActionButtons'
import CastSection from './components/CastSection'
import RelatedContent from './components/RelatedContent'
import EpisodeList from './components/EpisodeList'

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

function TvDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [related, setRelated] = useState([])
    const [activeTab, setActiveTab] = useState('episodes')

    useEffect(() => {
        setLoading(true)
        GlobalApi.getTvDetails(id)
            .then(resp => setData(resp.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))

        GlobalApi.getRelatedSeries(id)
            .then(res => setRelated(res?.data?.results || []))
            .catch(() => setRelated([]))

        window.scrollTo(0, 0)
    }, [id])

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
                <p className='text-white/50 text-lg'>No s'ha pogut carregar la informació de la sèrie.</p>
            </div>
        )
    }

    const title = data.title || data.name || 'Sense títol'
    const overview = data.overview || 'Sense descripció disponible.'
    const releaseYear = (data.release_date || data.first_air_date || '').slice(0, 4)
    const genres = data.genres || []
    const cast = data.credits?.cast || []
    const crew = data.credits?.crew || []
    const trailerKey = data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key
        || data.videos?.results?.find(v => v.site === 'YouTube')?.key
    const seasons = data.seasons || []
    const numSeasons = data.number_of_seasons || seasons.filter(s => s.season_number > 0).length
    const numEpisodes = data.number_of_episodes || 0

    const tabs = [
        { key: 'episodes', label: 'Episodis' },
        { key: 'related', label: 'Relacionat' },
        { key: 'details', label: 'Repartiment' }
    ]

    return (
        <div className='min-h-screen relative'>
            <Header />

            {/* Hero amb video/backdrop */}
            <HeroVideo
                backdrop={data.backdrop_path}
                trailerKey={trailerKey}
                title={title}
            />

            {/* Contingut principal */}
            <div className='relative z-30 -mt-20 px-6 md:px-16'>
                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* Columna esquerra: Poster + badge sèrie */}
                    <div className='hidden lg:block flex-shrink-0 w-64'>
                        {data.poster_path && (
                            <div className='relative'>
                                <img
                                    src={data.poster_path?.startsWith('http') ? data.poster_path : IMAGE_BASE_URL + data.poster_path}
                                    alt={title}
                                    className='w-full rounded-xl shadow-2xl border border-white/10'
                                />
                                {/* Badge Sèrie */}
                                <div className='absolute top-3 left-3 bg-[#CC8400] text-black text-xs font-black px-2 py-1 rounded-md tracking-wide'>
                                    SÈRIE TV
                                </div>
                            </div>
                        )}

                        {/* Stats temporades/episodis */}
                        {(numSeasons > 0 || numEpisodes > 0) && (
                            <div className='mt-4 grid grid-cols-2 gap-2'>
                                {numSeasons > 0 && (
                                    <div className='bg-white/5 rounded-lg p-3 text-center border border-white/10'>
                                        <p className='text-2xl font-bold text-[#CC8400]'>{numSeasons}</p>
                                        <p className='text-white/50 text-xs mt-1'>Temporades</p>
                                    </div>
                                )}
                                {numEpisodes > 0 && (
                                    <div className='bg-white/5 rounded-lg p-3 text-center border border-white/10'>
                                        <p className='text-2xl font-bold text-[#CC8400]'>{numEpisodes}</p>
                                        <p className='text-white/50 text-xs mt-1'>Episodis</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Columna dreta */}
                    <div className='flex-1 min-w-0'>
                        {/* Acció buttons */}
                        <div className='mb-6'>
                            <ActionButtons movie={data} />
                        </div>

                        {/* Metadades */}
                        <div className='flex flex-wrap items-center gap-3 mb-4'>
                            {/* Badge SÈRIE (mòbil) */}
                            <span className='lg:hidden px-2 py-0.5 text-xs font-bold rounded bg-[#CC8400] text-black'>
                                SÈRIE TV
                            </span>
                            {releaseYear && (
                                <span className='text-white/60 text-sm'>{releaseYear}</span>
                            )}
                            {numSeasons > 0 && (
                                <span className='text-white/60 text-sm'>{numSeasons} Temporades</span>
                            )}
                            {data.status && (
                                <span className={`px-2 py-0.5 text-xs font-bold rounded border ${
                                    data.status === 'Returning Series'
                                        ? 'border-green-500/40 text-green-400'
                                        : 'border-white/40 text-white/80'
                                }`}>
                                    {data.status === 'Returning Series' ? '🟢 En emissió' :
                                     data.status === 'Ended' ? 'Finalitzada' : data.status}
                                </span>
                            )}
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
                            {activeTab === 'episodes' && (
                                <EpisodeList tvId={id} seasons={seasons} />
                            )}
                            {activeTab === 'related' && (
                                <RelatedContent movies={related} />
                            )}
                            {activeTab === 'details' && (
                                <CastSection cast={cast} crew={crew} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TvDetailPage
