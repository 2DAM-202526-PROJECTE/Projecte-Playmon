import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { HiFilm, HiTv, HiPlayCircle, HiPlus, HiCheck, HiStar } from 'react-icons/hi2'
import TrailerModal from '@/features/detail/components/TrailerModal.jsx'
import { useFavorites } from '@/context/FavoritesContext'
import { useWatchlist } from '@/context/WatchlistContext'

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

const FAKE_VIDEOS = [
    'https://res.cloudinary.com/dm5tr3lwj/video/upload/v1772727103/playmon/playmon/arnau/03488cf4.mp4',
    'https://res.cloudinary.com/dm5tr3lwj/video/upload/v1772478821/playmon/playmon/arnau/8bb6e0cf.mp4',
    'https://res.cloudinary.com/dm5tr3lwj/video/upload/v1772561885/playmon/playmon/arnau/1453dd56.webm'
];

function MovieCard({ movie, isContinueWatching = false, noPopup = false }) {
    const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false)
    const [cardRect, setCardRect] = useState(null)
    const [showTrailer, setShowTrailer] = useState(false)
    const { isFav: isFavFn, toggleFav } = useFavorites()
    const { isInList, toggleWatchlist } = useWatchlist()
    const isFav = isFavFn(movie?.id)
    const inList = isInList(movie?.id)
    const timeoutRef = useRef(null)
    const cardRef = useRef(null)

    const isTv = movie?.media_type === 'tv' || (!movie?.title && !!movie?.name)

    const trailerKey = movie?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key
        || movie?.videos?.results?.find(v => v.site === 'YouTube')?.key

    const handleToggleFav = (e) => {
        e.stopPropagation()
        if (!movie) return
        toggleFav(movie)
    }

    const handleToggleList = (e) => {
        e.stopPropagation()
        if (!movie) return
        toggleWatchlist(movie)
    }

    const handleClick = () => {
        navigate(`/${isTv ? 'tv' : 'movie'}/${movie.id}`)
    }

    const handlePlay = (e) => {
        e.stopPropagation()
        navigate('/watch', {
            state: {
                id: movie.id,
                media_type: isTv ? 'tv' : 'movie',
                titol: movie.title || movie.name || 'Sense títol',
                poster: movie.backdrop_path || movie.poster_path || '',
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

    const imagePath = movie.backdrop_path || movie.poster_path
    const imageSrc = imagePath?.startsWith('http')
        ? imagePath
        : imagePath
            ? IMAGE_BASE_URL + imagePath
            : null

    if (!imageSrc) {
        return (
            <div
                onClick={handleClick}
                className='w-[200px] md:w-[280px] aspect-video rounded-lg cursor-pointer
                           bg-white/5 border border-white/10 flex flex-col items-center justify-center
                           hover:border-[#CC8400]/50 hover:bg-white/10 transition-all duration-200 group'
            >
                {isTv
                    ? <HiTv className='text-white/20 text-3xl mb-2 group-hover:text-white/40 transition-colors' />
                    : <HiFilm className='text-white/20 text-3xl mb-2 group-hover:text-white/40 transition-colors' />
                }
                <p className='text-white/30 text-xs text-center px-2 line-clamp-3 group-hover:text-white/50 transition-colors'>
                    {movie.title || movie.name}
                </p>
            </div>
        )
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const handleMouseEnter = () => {
        if (noPopup) return;
        timeoutRef.current = setTimeout(() => {
            if (cardRef.current) {
                setCardRect(cardRef.current.getBoundingClientRect())
                setIsHovered(true)
            }
        }, 400)
    }

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            setIsHovered(false)
        }, 50)
    }

    const popupStyle = cardRect ? {
        position: 'absolute',
        top: window.scrollY + cardRect.top + cardRect.height / 2,
        left: window.scrollX + cardRect.left + cardRect.width / 2,
        width: cardRect.width * 1.25,
        transform: 'translate(-50%, -50%)',
        zIndex: 99999,
    } : {}

    const hoverPortal = isHovered && cardRect ? createPortal(
        <div
            style={popupStyle}
            onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-[#121212] rounded-xl shadow-[0_25px_60px_rgba(0,0,0,1)]
                       border border-white/10 flex flex-col overflow-hidden animate-popupHover"
        >
            <div className="relative w-full aspect-video cursor-pointer" onClick={handleClick}>
                <img
                    src={imageSrc}
                    className='w-full h-full object-cover'
                    alt={movie.title || movie.name}
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent"></div>
            </div>

            <div className="px-4 pb-4 flex flex-col gap-2.5 bg-[#121212]">
                <h3 className="text-white font-bold text-sm md:text-base line-clamp-1">{movie.title || movie.name}</h3>

                <div className="flex items-center gap-2 mt-1">
                    <button onClick={handlePlay}
                            title={isContinueWatching ? "Reprendre" : "Reproduir"}
                            className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-white text-black font-semibold hover:bg-[#CC8400] hover:text-white transition-colors">
                        <HiPlayCircle className="text-2xl" />
                        <span className="text-xs md:text-sm">{isContinueWatching ? "Reprendre" : "Reproduir"}</span>
                    </button>
                    {trailerKey && (
                        <button onClick={(e) => { e.stopPropagation(); setIsHovered(false); setShowTrailer(true); }}
                                title="Veure Tràiler"
                                className="flex items-center justify-center p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20">
                            <HiFilm className="text-lg" />
                        </button>
                    )}
                    <button onClick={handleToggleList} title={inList ? "Eliminar de la llista" : "Afegir a veure més tard"}
                            className={`flex items-center justify-center p-2 rounded-full text-white transition-colors border
                                       ${inList ? 'bg-[#CC8400] border-[#CC8400]' : 'bg-white/10 hover:bg-white/20 border-white/20'}`}>
                        {inList ? <HiCheck className="text-lg" /> : <HiPlus className="text-lg" />}
                    </button>
                    <button onClick={handleToggleFav} title={isFav ? "Treure de favorits" : "Afegir a favorits"}
                            className={`flex items-center justify-center p-2 rounded-full transition-colors border
                                       ${isFav ? 'bg-[#CC8400] border-[#CC8400] text-black' : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'}`}>
                        <HiStar className="text-lg" />
                    </button>
                </div>

                <div className="flex items-center gap-2 text-[10px] md:text-xs text-white/50 font-medium">
                    <span className="text-[#CC8400] font-bold">PlayMon+</span>
                    <span className="border border-white/20 px-1 rounded-sm">HD</span>
                    <span>{movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0] || ''}</span>
                </div>

                <p className="text-white/70 text-[10px] md:text-xs line-clamp-3">
                    {movie.overview || "Sumèrgete dins d'aquest fascinant món audiovisual acompanyat pel millor so envoltant."}
                </p>
            </div>
        </div>,
        document.body
    ) : null

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative w-[200px] md:w-[280px] aspect-video flex-shrink-0 cursor-pointer rounded-lg"
            onClick={handleClick}
        >
            <img
                src={imageSrc}
                className={`w-full h-full border-[3px] border-transparent rounded-lg object-cover transition-opacity duration-200 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                alt={movie.title || movie.name}
            />
            {hoverPortal}

            {showTrailer && trailerKey && (
                <TrailerModal
                    trailerKey={trailerKey}
                    titol={movie.title || movie.name}
                    onTancar={() => setShowTrailer(false)}
                />
            )}
        </div>
    )
}

export default MovieCard
