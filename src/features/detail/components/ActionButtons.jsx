import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiPlus, HiCheck } from 'react-icons/hi'
import { HiShare, HiPlayCircle, HiStar } from 'react-icons/hi2'
import TrailerModal from './TrailerModal'
import { useFavorites } from '@/context/FavoritesContext'

const FAKE_VIDEOS = [
    'https://res.cloudinary.com/dm5tr3lwj/video/upload/v1772727103/playmon/playmon/arnau/03488cf4.mp4',
    'https://res.cloudinary.com/dm5tr3lwj/video/upload/v1772478821/playmon/playmon/arnau/8bb6e0cf.mp4',
    'https://res.cloudinary.com/dm5tr3lwj/video/upload/v1772561885/playmon/playmon/arnau/1453dd56.webm'
];

function ActionButtons({ movie }) {
    const navigate = useNavigate()
    const [inList, setInList] = useState(false)
    const [copied, setCopied] = useState(false)
    const { isFav: isFavFn, toggleFav } = useFavorites()
    const isFav = isFavFn(movie?.id)
    const [showTrailer, setShowTrailer] = useState(false)

    const trailerKey = movie?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key
        || movie?.videos?.results?.find(v => v.site === 'YouTube')?.key

    const handlePlay = () => {
        navigate('/watch', {
            state: {
                id: movie.id,
                titol: movie.title || movie.name || 'Sense títol',
                poster: movie.poster_path || '',
                fonts: {
                    hls: null,
                    mp4: (movie.video_url && (movie.video_url.includes('.mp4') || movie.video_url.includes('.webm') || movie.video_url.includes('cloudinary')))
                        ? movie.video_url
                        : FAKE_VIDEOS[Math.abs(movie.id || 0) % FAKE_VIDEOS.length]
                },
                any: (movie.release_date || movie.first_air_date || '').slice(0, 4) || null,
                genere: movie.genres?.[0]?.name || null,
                duracioText: null,
            }
        })
    }

    useEffect(() => {
        if (!movie) return
        const watchlist = JSON.parse(localStorage.getItem('playmon_watchlist') || '[]')
        setInList(watchlist.some(m => m.id === movie.id))
    }, [movie])

    const handleToggleFav = () => {
        if (!movie) return
        toggleFav(movie)
    }

    const handleToggleList = () => {
        if (!movie) return
        const watchlist = JSON.parse(localStorage.getItem('playmon_watchlist') || '[]')
        if (inList) {
            localStorage.setItem('playmon_watchlist', JSON.stringify(watchlist.filter(m => m.id !== movie.id)))
            setInList(false)
            window.dispatchEvent(new CustomEvent('playmon:watchlist-changed', { detail: { action: 'remove', item: movie } }))
        } else {
            watchlist.push(movie)
            localStorage.setItem('playmon_watchlist', JSON.stringify(watchlist))
            setInList(true)
            window.dispatchEvent(new CustomEvent('playmon:watchlist-changed', { detail: { action: 'add', item: movie } }))
        }
    }

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2200)
        } catch {}
    }

    const iconBtnBase = `relative flex items-center justify-center w-11 h-11 rounded-full
                         border transition-all duration-300 hover:scale-110 active:scale-95 group`
    const iconBtnOff = `bg-white/10 border-white/30 hover:bg-white/20 hover:border-[#CC8400]`
    const iconBtnOn  = `bg-[#CC8400] border-[#CC8400] shadow-[0_0_20px_rgba(204,132,0,0.6)]`

    return (
        <>
            {showTrailer && trailerKey && (
                <TrailerModal
                    trailerKey={trailerKey}
                    titol={movie?.title || movie?.name || ''}
                    onTancar={() => setShowTrailer(false)}
                />
            )}

            <div className='flex items-center gap-3 flex-wrap'>
                <button
                    className='flex items-center gap-3 px-7 py-3.5 rounded-xl
                               bg-white text-black font-bold text-sm md:text-base
                               hover:bg-white/90 transition-all duration-200
                               shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    title='Reproduir'
                    onClick={handlePlay}
                >
                    <HiPlayCircle className='text-2xl flex-shrink-0' />
                    Reproduir
                </button>

                {trailerKey && (
                    <button
                        onClick={() => setShowTrailer(true)}
                        className='flex items-center gap-2 px-5 py-3.5 rounded-xl
                                   bg-white/15 text-white font-semibold text-sm md:text-base
                                   border border-white/30 backdrop-blur-sm
                                   hover:bg-white/25 hover:border-white/50
                                   transition-all duration-200 hover:scale-105 active:scale-95'
                        title='Veure tràiler oficial'
                    >
                        <svg className='w-4 h-4 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z' />
                        </svg>
                        Tràiler
                    </button>
                )}

                <div className='w-px h-8 bg-white/15 mx-1' />

                <button
                    onClick={handleToggleList}
                    className={`${iconBtnBase} ${inList ? iconBtnOn : iconBtnOff}`}
                    title={inList ? 'Treure de Veure més tard' : 'Afegir a Veure més tard'}
                >
                    {inList
                        ? <HiCheck className='text-black text-xl' />
                        : <HiPlus className='text-white text-xl' />
                    }
                </button>

                <button
                    onClick={handleToggleFav}
                    className={`${iconBtnBase} ${isFav ? iconBtnOn : iconBtnOff}`}
                    title={isFav ? 'Treure de favorits' : 'Afegir a favorits'}
                >
                    <HiStar className={`text-xl ${isFav ? 'text-black' : 'text-white'}`} />
                </button>

                <button onClick={handleShare} className={`${iconBtnBase} ${iconBtnOff}`} title='Compartir'>
                    <HiShare className='text-white text-lg' />
                    <span className='absolute -top-9 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs font-medium
                                      px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
                        Compartir
                    </span>
                    <div className={`absolute -top-11 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#CC8400] text-black text-xs font-bold
                                     whitespace-nowrap pointer-events-none shadow-lg transition-all duration-300
                                     ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                        Copiat!
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0
                                        border-l-[4px] border-l-transparent
                                        border-t-[4px] border-t-[#CC8400]
                                        border-r-[4px] border-r-transparent" />
                    </div>
                </button>
            </div>
        </>
    )
}

export default ActionButtons
