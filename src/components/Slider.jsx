import React, { useEffect, useRef, useState, useCallback } from 'react'
import GlobalApi from '../Services/GlobalApi';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2"

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"
const AUTO_ADVANCE_MS = 6000;
const SLIDE_MS = 650;

// ITEM_W% és l'ample de cada imatge (% del contenidor visible).
// SIDE_W% és la previsualització de cada costat.
// ITEM_W + 2*SIDE_W = 100%
const ITEM_W = 76;  // % del contenidor
const SIDE_W = 12;  // % de cada costat

function Slider() {
    const [movieList, setMovieList] = useState([])
    // trackIdx: 0 = clon de la darrera, 1..N = originals, N+1 = clon de la primera
    const [trackIdx, setTrackIdx] = useState(1)
    const [noAnim, setNoAnim] = useState(false)  // desactiva transició per al salt del clon
    const timerRef = useRef(null)

    useEffect(() => {
        GlobalApi.getTrendingVideos().then(r => setMovieList(r.data.results))
    }, [])

    const total = movieList.length

    // Llista estesa: [clon_final, …originals…, clon_inicial]
    const extendedList = total > 0
        ? [movieList[total - 1], ...movieList, movieList[0]]
        : []

    const currentMovieIdx = Math.max(0, Math.min(trackIdx - 1, total - 1))

    // ── Quan aterrem al clon, saltem a l'original sense animació ──
    useEffect(() => {
        if (total === 0) return
        if (trackIdx === 0) {
            // Clon de la darrera → salt a la darrera real
            const t = setTimeout(() => {
                setNoAnim(true)
                setTrackIdx(total)
            }, SLIDE_MS)
            return () => clearTimeout(t)
        }
        if (trackIdx === total + 1) {
            // Clon de la primera → salt a la primera real
            const t = setTimeout(() => {
                setNoAnim(true)
                setTrackIdx(1)
            }, SLIDE_MS)
            return () => clearTimeout(t)
        }
    }, [trackIdx, total])

    // Reactiva animació el frame següent al salt
    useEffect(() => {
        if (!noAnim) return
        const raf = requestAnimationFrame(() => setNoAnim(false))
        return () => cancelAnimationFrame(raf)
    }, [noAnim])

    const goNext = useCallback(() => setTrackIdx(i => i + 1), [])
    const goPrev = useCallback(() => setTrackIdx(i => i - 1), [])

    const resetTimer = useCallback(() => {
        clearInterval(timerRef.current)
        timerRef.current = setInterval(goNext, AUTO_ADVANCE_MS)
    }, [goNext])

    useEffect(() => {
        if (total > 0) resetTimer()
        return () => clearInterval(timerRef.current)
    }, [total, resetTimer])

    const handleNav = (fn) => { fn(); resetTimer() }

    if (extendedList.length === 0) return null

    // ── Posicionament del filmstrip via CSS ──
    // El track té width:100% del contenidor.
    // Cada item té width: ITEM_W% del contenidor (= % del track).
    // translateX(%) és relatiu a l'amplada pròpia del track = amplada del contenidor.
    // Per centrar l'ítem `trackIdx` amb SIDE_W% de previsualització:
    //   offset = -(trackIdx × ITEM_W%) + SIDE_W%
    //   Ex: trackIdx=1 → calc(-76% + 12%) = -64% → item1 queda a 76%-64% = 12% des de l'esquerra ✓
    const translateX = `calc(-${trackIdx * ITEM_W}% + ${SIDE_W}%)`

    const trackStyle = {
        transform: `translateX(${translateX})`,
        transition: noAnim ? 'none' : `transform ${SLIDE_MS}ms cubic-bezier(0.77,0,0.18,1)`,
        willChange: 'transform',
        display: 'flex',
        height: '100%',
        width: '100%',
    }

    return (
        <div className='w-full px-6 md:px-10 mt-6 select-none'>
            <div className='transition-transform duration-500 ease-in-out hover:scale-[1.025]
                hover:shadow-[0_0_60px_rgba(204,132,0,0.2)]'>

                {/* Contenidor principal — fa el clip del filmstrip */}
                <div className='relative overflow-hidden rounded-2xl h-[220px] md:h-[440px] group'>

                    {/* ═══ UN ÚNIC DIV QUE LLISCA (filmstrip) ═══ */}
                    <div style={trackStyle}>
                        {extendedList.map((movie, idx) => {
                            const isCurrent = idx === trackIdx
                            return (
                                <div
                                    key={idx}
                                    className='flex-shrink-0 h-full relative overflow-hidden'
                                    style={{ width: `${ITEM_W}%` }}
                                >
                                    <img
                                        src={IMAGE_BASE_URL + movie?.backdrop_path}
                                        className='w-full h-full object-cover object-center'
                                        style={{
                                            filter: isCurrent
                                                ? 'brightness(1)'
                                                : 'brightness(0.35) blur(1px)',
                                            transition: `filter ${SLIDE_MS}ms ease`,
                                        }}
                                        alt={movie?.title || movie?.name}
                                    />
                                    {isCurrent && (
                                        <>
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent' />
                                            <p className='absolute bottom-4 left-5 text-white font-bold text-base md:text-xl drop-shadow-lg'>
                                                {movie?.title || movie?.name}
                                            </p>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Gradients de profunditat als costats */}
                    <div className='absolute left-0 top-0 h-full w-[12%] bg-gradient-to-r from-black/70 to-transparent pointer-events-none z-10' />
                    <div className='absolute right-0 top-0 h-full w-[12%] bg-gradient-to-l from-black/70 to-transparent pointer-events-none z-10' />

                    {/* Zones clicables als costats */}
                    <div className='absolute left-0 top-0 h-full w-[12%] cursor-pointer z-20'
                        onClick={() => handleNav(goPrev)} />
                    <div className='absolute right-0 top-0 h-full w-[12%] cursor-pointer z-20'
                        onClick={() => handleNav(goNext)} />

                    {/* Fletxa esquerra */}
                    <button
                        className='hidden md:flex absolute left-[9%] top-1/2 -translate-y-1/2 z-30
                            w-10 h-10 items-center justify-center rounded-full
                            bg-black/60 hover:bg-[#CC8400] text-white
                            transition-all duration-300 opacity-0 group-hover:opacity-100'
                        onClick={() => handleNav(goPrev)}
                    >
                        <HiChevronLeft className="text-[22px]" />
                    </button>

                    {/* Fletxa dreta */}
                    <button
                        className='hidden md:flex absolute right-[9%] top-1/2 -translate-y-1/2 z-30
                            w-10 h-10 items-center justify-center rounded-full
                            bg-black/60 hover:bg-[#CC8400] text-white
                            transition-all duration-300 opacity-0 group-hover:opacity-100'
                        onClick={() => handleNav(goNext)}
                    >
                        <HiChevronRight className="text-[22px]" />
                    </button>
                </div>

                {/* Dots indicadors */}
                <div className='flex justify-center gap-2 mt-3'>
                    {movieList.slice(0, 20).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleNav(() => setTrackIdx(idx + 1))}
                            className={`rounded-full transition-all duration-300
                                ${idx === currentMovieIdx
                                    ? 'w-6 h-2 bg-[#CC8400]'
                                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Slider