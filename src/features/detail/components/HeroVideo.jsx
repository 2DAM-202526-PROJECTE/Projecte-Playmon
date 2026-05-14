import React, { useState, useEffect, useRef } from 'react'
import { HiSpeakerXMark, HiSpeakerWave } from 'react-icons/hi2'

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

function HeroVideo({ backdrop, trailerKey, title }) {
    const [muted, setMuted] = useState(true)
    const [volume, setVolume] = useState(50) // valor de 0 a 100
    const [isHovered, setIsHovered] = useState(false)
    const [videoReady, setVideoReady] = useState(false)
    const iframeRef = useRef(null)

    // enablejsapi=1 és imprescindible per a que postMessage funcioni
    const heroEmbedUrl = trailerKey
        ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&rel=0&controls=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`
        : null

    useEffect(() => {
        setVideoReady(false)
        setMuted(true)
        if (!trailerKey) return
        const t = setTimeout(() => setVideoReady(true), 1500)
        return () => clearTimeout(t)
    }, [trailerKey])

    // Envia comandes a l'iframe de YouTube via YouTube JS API (postMessage)
    const sendYTCommand = (func, args = []) => {
        if (!iframeRef.current?.contentWindow) return
        iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func, args }),
            '*'
        )
    }

    const handleToggleMute = () => {
        const toggleTo = !muted;
        sendYTCommand(toggleTo ? 'mute' : 'unMute')
        // Si treiem el mute, assegurem que hi ha volum
        if (!toggleTo && volume === 0) {
            setVolume(50)
            sendYTCommand('setVolume', [50])
        }
        setMuted(toggleTo)
    }

    const handleVolumeChange = (e) => {
        const newVol = parseInt(e.target.value)
        setVolume(newVol)
        sendYTCommand('setVolume', [newVol])
        
        if (newVol === 0 && !muted) {
            setMuted(true)
            sendYTCommand('mute')
        } else if (newVol > 0 && muted) {
            setMuted(false)
            sendYTCommand('unMute')
        }
    }

    const backdropSrc = backdrop?.startsWith('http')
        ? backdrop
        : backdrop ? IMAGE_BASE_URL + backdrop : null

    return (
        <div className='relative w-full h-[65vh] md:h-[75vh] overflow-hidden bg-black'>

            {/* iFrame YouTube — sempre renderitzat i visible perquè Chrome permeti l'autoplay */}
            {heroEmbedUrl && (
                <div className='absolute inset-0'>
                    <iframe
                        ref={iframeRef}
                        className='absolute top-1/2 left-1/2 w-[177.78vh] min-w-full min-h-[56.25vw] h-auto -translate-x-1/2 -translate-y-1/2 pointer-events-none'
                        src={heroEmbedUrl}
                        title={title}
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                    />
                </div>
            )}

            {/* Backdrop estàtic — cobreix l'iframe per amagar la càrrega inicial, desapareix quan el vídeo arrenca */}
            {backdropSrc && (
                <div className='absolute inset-0 z-10 transition-opacity duration-1000 pointer-events-none'
                    style={{ opacity: videoReady ? 0 : 1 }}>
                    <img src={backdropSrc} alt={title}
                        className='w-full h-full object-cover object-center' />
                </div>
            )}

            {/* Gradients d'integració */}
            <div className='absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent z-20 pointer-events-none' />
            <div className='absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/70 via-transparent to-transparent z-20 pointer-events-none' />

            {/* Títol */}
            <div className='absolute bottom-0 left-0 right-0 z-30 px-6 md:px-16 pb-28 pointer-events-none'>
                <h1 className='text-4xl md:text-6xl font-black text-white drop-shadow-2xl mb-2 max-w-2xl leading-tight'>
                    {title}
                </h1>
            </div>

            {/* Grup Control Volum (Slider + Botó) */}
            {videoReady && trailerKey && (
                <div 
                    className='absolute bottom-8 right-8 z-[50] flex flex-col items-center gap-2 pointer-events-auto'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Slider de Volum (apareix amb hover només quan NO està silenciat) */}
                    <div className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden flex flex-col items-center justify-between
                                    bg-black/80 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/20
                                    ${(isHovered && !muted) ? 'h-[130px] w-10 py-3 opacity-100 scale-100' : 'h-0 w-10 py-0 opacity-0 scale-95 border-transparent'} `}
                         style={{ transformOrigin: 'bottom' }}
                    >
                        {/* Indicador de percentatge */}
                        <span className='text-white text-[10px] font-bold mt-1 tracking-tighter'>
                            {volume}
                        </span>

                        {/* Contenidor de rotació per la barra */}
                        <div className='flex-1 relative w-full flex items-center justify-center my-3'>
                            <input
                                type='range'
                                min='0' max='100'
                                value={volume}
                                onChange={handleVolumeChange}
                                className='absolute w-[70px] h-1.5 appearance-none bg-white/30 rounded-full outline-none
                                           cursor-pointer accent-[#CC8400] origin-center -rotate-90'
                                title={`Volum: ${volume}%`}
                            />
                        </div>

                    </div>

                    {/* Botó principal de Mute */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleMute();
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white
                                   bg-black/80 border-2 backdrop-blur-md transition-all duration-300
                                   ${muted ? 'border-white/30 hover:border-white/60' : 'border-[#CC8400] shadow-[0_0_15px_rgba(204,132,0,0.4)]'}
                                   hover:scale-110 active:scale-90`}
                        title={muted ? 'Activar so' : 'Silenciar'}
                    >
                        {muted || volume === 0
                            ? <HiSpeakerXMark className='text-xl opacity-80' />
                            : <HiSpeakerWave className='text-xl text-[#CC8400]' />
                        }
                    </button>
                </div>
            )}
        </div>
    )
}

export default HeroVideo
