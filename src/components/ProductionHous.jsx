import React, { useRef, useState } from 'react'
import disney from '../assets/Images/disney.png'
import marvel from '../assets/Images/marvel.png'
import starwars from '../assets/Images/starwars.png'
import national from '../assets/Images/national.png'
import pixar from '../assets/Images/pixar.png'

import disneyVid from '../assets/Videos/disney.mp4'
import marvelVid from '../assets/Videos/marvel.mp4'
import starwarsVid from '../assets/Videos/starwars.mp4'
import nationalVid from '../assets/Videos/national.mp4'
import pixarVid from '../assets/Videos/pixar.mp4'

const studios = [
    { id: 1, image: disney, alt: 'Disney', video: disneyVid },
    { id: 2, image: marvel, alt: 'Marvel', video: marvelVid },
    { id: 3, image: starwars, alt: 'Star Wars', video: starwarsVid },
    { id: 4, image: national, alt: 'National Geographic', video: nationalVid },
    { id: 5, image: pixar, alt: 'Pixar', video: pixarVid },
]

function StudioCard({ image, alt, video }) {
    const [hovered, setHovered] = useState(false)
    const videoRef = useRef(null)

    const handleMouseEnter = () => {
        setHovered(true)
        if (videoRef.current) {
            videoRef.current.currentTime = 0
            videoRef.current.play().catch(() => { })
        }
    }

    const handleMouseLeave = () => {
        setHovered(false)
        if (videoRef.current) {
            videoRef.current.pause()
        }
    }

    return (
        <div
            className='group relative flex items-center justify-center
                flex-1 h-32 md:h-36 rounded-xl overflow-hidden cursor-pointer
                border border-white/10
                transition-all duration-400 ease-out'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Vídeo de fons */}
            <video
                ref={videoRef}
                src={video}
                muted
                loop
                playsInline
                preload="none"
                className='absolute inset-0 w-full h-full object-cover scale-110'
                style={{
                    opacity: hovered ? 0.7 : 0,
                    transition: 'opacity 0.5s ease',
                }}
            />

            {/* Overlay fosc sobre el vídeo */}
            <div
                className='absolute inset-0 bg-black/40 pointer-events-none'
                style={{
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                }}
            />

            {/* Fons fosc quan no hi ha vídeo */}
            <div
                className='absolute inset-0 bg-white/8 pointer-events-none'
                style={{ opacity: hovered ? 0 : 1, transition: 'opacity 0.5s ease' }}
            />

            {/* Vora taronja en hover */}
            <div
                className='absolute inset-0 rounded-xl pointer-events-none'
                style={{
                    boxShadow: hovered ? 'inset 0 0 0 1.5px rgba(204,132,0,0.6)' : 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                    transition: 'box-shadow 0.4s ease',
                }}
            />

            {/* Logo */}
            <img
                src={image}
                alt={alt}
                className='relative z-10 h-10 md:h-14 w-4/5 object-contain
                    brightness-0 invert
                    transition-all duration-400'
                style={{ opacity: hovered ? 1 : 0.4 }}
            />
        </div>
    )
}

function ProductionHous() {
    return (
        <section className='w-full px-[10%] md:px-[14%] mt-8 mb-6'>
            <div className='flex gap-2'>
                {studios.map(s => (
                    <StudioCard key={s.id} {...s} />
                ))}
            </div>
        </section>
    )
}

export default ProductionHous