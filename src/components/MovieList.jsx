import React, { useEffect, useRef, useState } from 'react'
import GlobalApi from '../Services/GlobalApi'
import MovieCard from './MovieCard'
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const GAP = 16  // gap-4 = 16px

function MovieList({ genderId }) {
    const [movies, setMoviesList] = useState([])
    const scrollRef = useRef(null)

    useEffect(() => {
        GlobalApi.getMoviesByGender(genderId).then(resp =>
            setMoviesList(resp.data.results)
        )
    }, [genderId])

    const getPageAmount = () => {
        const el = scrollRef.current
        if (!el || !el.firstChild) return 220
        const cardW = el.firstChild.offsetWidth + GAP
        return Math.floor(el.clientWidth / cardW) * cardW
    }
    const slideLeft = () => scrollRef.current.scrollBy({ left: -getPageAmount(), behavior: 'smooth' })
    const slideRight = () => scrollRef.current.scrollBy({ left: getPageAmount(), behavior: 'smooth' })

    return (
        <div className='hidden md:block relative'>

            {/* Fletxa esquerra — superposada */}
            <button
                onClick={slideLeft}
                className='absolute left-0 top-1/2 -translate-y-1/2 z-10
                           h-full px-2 flex items-center
                           bg-gradient-to-r from-black/60 to-transparent
                           text-white/70 hover:text-white
                           transition-all duration-200'
            >
                <IoChevronBackOutline className='text-[36px]' />
            </button>

            {/* Zona de scroll */}
            <div
                ref={scrollRef}
                className='flex overflow-x-auto gap-4 scrollbar-hide
                           snap-x snap-mandatory
                           py-4 px-10'
            >
                {movies.map((item, index) => (
                    <div key={index} className='snap-start flex-shrink-0'>
                        <MovieCard movie={item} />
                    </div>
                ))}
            </div>

            {/* Fletxa dreta — superposada */}
            <button
                onClick={slideRight}
                className='absolute right-0 top-1/2 -translate-y-1/2 z-10
                           h-full px-2 flex items-center
                           bg-gradient-to-l from-black/60 to-transparent
                           text-white/70 hover:text-white
                           transition-all duration-200'
            >
                <IoChevronForwardOutline className='text-[36px]' />
            </button>
        </div>
    )
}

export default MovieList
