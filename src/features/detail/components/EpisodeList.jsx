import React, { useEffect, useState } from 'react'
import GlobalApi from '@/Services/GlobalApi'

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300"

function EpisodeList({ tvId, seasons = [] }) {
    const [selectedSeason, setSelectedSeason] = useState(1)
    const [episodes, setEpisodes] = useState([])
    const [loading, setLoading] = useState(false)

    // Filtrem temporades "reals" (no especials)
    const realSeasons = seasons.filter(s => s.season_number > 0)

    useEffect(() => {
        if (!tvId || realSeasons.length === 0) return
        setLoading(true)
        GlobalApi.getTvSeason(tvId, selectedSeason)
            .then(resp => {
                setEpisodes(resp.data.episodes || [])
            })
            .catch(() => setEpisodes([]))
            .finally(() => setLoading(false))
    }, [tvId, selectedSeason])

    if (realSeasons.length === 0) {
        return <p className='text-white/50 text-sm'>No hi ha temporades disponibles.</p>
    }

    return (
        <div className='space-y-6'>
            {/* Selector de temporada */}
            <div className='flex items-center gap-3'>
                <select
                    value={selectedSeason}
                    onChange={e => setSelectedSeason(Number(e.target.value))}
                    className='bg-white/10 text-white border border-white/20 rounded-lg
                               px-4 py-2 text-sm focus:outline-none focus:border-[#CC8400]
                               cursor-pointer appearance-none'
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'white\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
                >
                    {realSeasons.map(s => (
                        <option key={s.season_number} value={s.season_number}
                            className='bg-[#1a1a1a]'>
                            Temporada {s.season_number}
                        </option>
                    ))}
                </select>
                <span className='text-white/50 text-sm'>
                    {episodes.length} episodis
                </span>
            </div>

            {/* Llista d'episodis */}
            {loading ? (
                <div className='flex justify-center py-8'>
                    <div className='w-8 h-8 border-2 border-[#CC8400] border-t-transparent rounded-full animate-spin' />
                </div>
            ) : (
                <div className='space-y-3'>
                    {episodes.map((ep) => (
                        <div
                            key={ep.id}
                            className='flex gap-4 p-3 rounded-xl bg-white/5 border border-white/10
                                       hover:bg-white/10 hover:border-[#CC8400]/30
                                       transition-all duration-300 cursor-pointer group'
                        >
                            {/* Thumbnail */}
                            <div className='flex-shrink-0 w-40 md:w-52 aspect-video rounded-lg overflow-hidden bg-white/5'>
                                {ep.still_path ? (
                                    <img
                                        src={IMAGE_BASE_URL + ep.still_path}
                                        alt={ep.name}
                                        className='w-full h-full object-cover
                                                   group-hover:scale-105 transition-transform duration-500'
                                    />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center text-white/20 text-xs'>
                                        Sense imatge
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className='flex-1 min-w-0 py-1'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <span className='text-[#CC8400] text-sm font-medium'>
                                        E{ep.episode_number}
                                    </span>
                                    <h4 className='text-white font-medium text-sm md:text-base truncate'>
                                        {ep.name}
                                    </h4>
                                </div>
                                {ep.runtime && (
                                    <span className='text-white/40 text-xs'>
                                        {ep.runtime} min
                                    </span>
                                )}
                                {ep.overview && (
                                    <p className='text-white/50 text-xs md:text-sm mt-1 line-clamp-2'>
                                        {ep.overview}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EpisodeList
