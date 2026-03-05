import React, { useEffect, useRef, useState, useCallback } from 'react'
import GlobalApi from '../Services/GlobalApi'
import MovieCard from './MovieCard'
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const GAP = 16     // gap-4 = 16px
const GLOW_PAD = 28 // padding perquè el glow (22px shadow) no es talli

function MovieList({ genderId }) {
    const [movies, setMoviesList] = useState([])
    const [offset, setOffset] = useState(0)
    const [maxOffset, setMaxOffset] = useState(0)
    const [visibleCards, setVisibleCards] = useState(1)
    const wrapperRef = useRef(null)
    const trackRef = useRef(null)

    useEffect(() => {
        GlobalApi.getMoviesByGender(genderId).then(resp =>
            setMoviesList(resp.data.results)
        )
    }, [genderId])

    // Calcula quantes cartes caben i el maxOffset
    const measure = useCallback(() => {
        const wrapper = wrapperRef.current
        const track = trackRef.current
        if (!wrapper || !track || !track.firstChild) return

        const cardEl = track.querySelector('.card-item')
        if (!cardEl) return

        const cardW = cardEl.offsetWidth + GAP
        const visibleArea = wrapper.offsetWidth - (GLOW_PAD * 2)
        const fit = Math.floor(visibleArea / cardW)
        const totalCards = movies.length
        const totalW = totalCards * cardW - GAP
        const visibleW = fit * cardW - GAP

        setVisibleCards(fit > 0 ? fit : 1)

        // Establim la mida exacta del wrapper per no tenir espai sobrant
        if (fit > 0) {
            wrapper.style.width = `${visibleW + (GLOW_PAD * 2)}px`
        }

        // El maxOffset és la diferència entre el contingut total i el que es veu
        const newMax = Math.max(0, totalW - visibleW)
        setMaxOffset(newMax)

        // Si l'offset actual supera el nou max, ajustem
        setOffset(prev => Math.min(prev, newMax))
    }, [movies])

    // Mesura quan es carreguen les pel·lícules
    useEffect(() => {
        if (!movies.length) return
        const id = requestAnimationFrame(() => requestAnimationFrame(measure))
        return () => cancelAnimationFrame(id)
    }, [movies, measure])

    // Recalcula si canvia la mida de la finestra
    useEffect(() => {
        const ro = new ResizeObserver(() => requestAnimationFrame(measure))
        if (wrapperRef.current) ro.observe(wrapperRef.current)
        return () => ro.disconnect()
    }, [measure])

    const slideLeft = () => {
        const cardEl = trackRef.current?.querySelector('.card-item')
        if (!cardEl) return
        const cardW = cardEl.offsetWidth + GAP
        const pageW = visibleCards * cardW
        setOffset(prev => Math.max(0, prev - pageW))
    }

    const slideRight = () => {
        const cardEl = trackRef.current?.querySelector('.card-item')
        if (!cardEl) return
        const cardW = cardEl.offsetWidth + GAP
        const pageW = visibleCards * cardW
        setOffset(prev => Math.min(maxOffset, prev + pageW))
    }

    return (
        <div className='hidden md:flex items-center w-full'>
            {/* Fletxa esquerra */}
            <button
                onClick={slideLeft}
                className='flex-shrink-0 z-10 px-1
                           text-white/50 hover:text-white
                           transition-colors duration-200'
            >
                <IoChevronBackOutline className='text-[36px]' />
            </button>

            {/* Wrapper amb overflow-hidden – talla cartes parcials però NO ombres dins el padding */}
            <div
                ref={wrapperRef}
                className='overflow-hidden flex-1 min-w-0'
                style={{ padding: `0 ${GLOW_PAD}px` }}
            >
                {/* Track de cartes – overflow visible perquè les ombres es renderitzin */}
                <div
                    ref={trackRef}
                    className='flex gap-4 py-8'
                    style={{
                        transform: `translateX(-${offset}px)`,
                        transition: 'transform 0.4s ease-in-out',
                    }}
                >
                    {movies.map((item, index) => (
                        <div key={index} className='card-item flex-shrink-0'>
                            <MovieCard movie={item} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Fletxa dreta */}
            <button
                onClick={slideRight}
                className='flex-shrink-0 z-10 px-1
                           text-white/50 hover:text-white
                           transition-colors duration-200'
            >
                <IoChevronForwardOutline className='text-[36px]' />
            </button>
        </div>
    )
}

export default MovieList

