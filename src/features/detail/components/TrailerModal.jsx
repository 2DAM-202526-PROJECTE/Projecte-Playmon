import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function TrailerModal({ trailerKey, titol, onTancar }) {
    const iframeRef = useRef(null)
    const containerRef = useRef(null)
    const [playing, setPlaying] = useState(true)
    const [muted, setMuted] = useState(true)
    const [volume, setVolume] = useState(80)
    const [fullscreen, setFullscreen] = useState(false)
    const [mostraControls, setMostraControls] = useState(true)
    const timerRef = useRef(null)
    const unmuteTimerRef = useRef(null)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onTancar() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onTancar])

    useEffect(() => {
        const onChange = () => setFullscreen(!!document.fullscreenElement)
        document.addEventListener('fullscreenchange', onChange)
        return () => document.removeEventListener('fullscreenchange', onChange)
    }, [])

    // Desmutar automàticament un cop el player de YouTube s'ha inicialitzat.
    // El navegador ho permet perquè l'usuari ha fet clic just abans d'obrir el modal.
    useEffect(() => {
        unmuteTimerRef.current = setTimeout(() => {
            iframeRef.current?.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*'
            )
            iframeRef.current?.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func: 'setVolume', args: [80] }), '*'
            )
            setMuted(false)
        }, 2000)
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            if (unmuteTimerRef.current) clearTimeout(unmuteTimerRef.current)
        }
    }, [])

    // mute=1 és imprescindible perquè els navegadors permetin l'autoplay
    const embedUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&rel=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`

    const sendYT = (func, args = []) => {
        iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func, args }), '*'
        )
    }

    const handleTogglePlay = () => {
        const ara = !playing
        sendYT(ara ? 'playVideo' : 'pauseVideo')
        setPlaying(ara)
    }

    const handleToggleMute = () => {
        const ara = !muted
        sendYT(ara ? 'mute' : 'unMute')
        if (!ara && volume === 0) { setVolume(80); sendYT('setVolume', [80]) }
        setMuted(ara)
    }

    const handleVolume = (e) => {
        const v = Number(e.target.value)
        setVolume(v)
        sendYT('setVolume', [v])
        if (v === 0) { setMuted(true); sendYT('mute') }
        else if (muted) { setMuted(false); sendYT('unMute') }
    }

    const handleFullscreen = () => {
        if (!document.fullscreenElement) containerRef.current?.requestFullscreen()
        else document.exitFullscreen()
    }

    const mostraAmbTimeout = () => {
        setMostraControls(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setMostraControls(false), 2500)
    }

    return createPortal(
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] bg-black overflow-hidden"
            onMouseMove={mostraAmbTimeout}
        >
            {/* iframe YouTube lleugerament sobredimensionat per tallar els elements UI de YouTube (títol, logo, recomanacions) */}
            <iframe
                ref={iframeRef}
                className="absolute"
                style={{ width: '120%', height: '120%', top: '-10%', left: '-10%' }}
                src={embedUrl}
                title={titol}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
            />
            {/* Capa transparent que bloqueja el HUD de YouTube */}
            <div className="absolute inset-0 z-[1]" onClick={handleTogglePlay} />

            {/* Barra de controls inferior */}
            <div
                className={[
                    'absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-8 py-6',
                    'bg-gradient-to-t from-black/80 to-transparent',
                    'transition-opacity duration-300 pointer-events-none',
                    mostraControls ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
            >
                {/* Play / Pausa */}
                <button
                    onClick={handleTogglePlay}
                    className="pointer-events-auto text-white hover:text-white/80 transition"
                    title={playing ? 'Pausar' : 'Reproduir'}
                >
                    {playing ? (
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                {/* Volum + Pantalla completa */}
                <div className="pointer-events-auto flex items-center gap-5">
                    {/* Slider volum + mute */}
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min={0} max={100} step={1}
                            value={muted ? 0 : volume}
                            onChange={handleVolume}
                            className="w-24 accent-white h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                        />
                        <button
                            onClick={handleToggleMute}
                            className="text-white/90 hover:text-white transition"
                            title={muted ? 'Activar so' : 'Silenciar'}
                        >
                            {muted || volume === 0 ? (
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                </svg>
                            ) : (
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Pantalla completa */}
                    <button
                        onClick={handleFullscreen}
                        className="text-white/90 hover:text-white transition"
                        title={fullscreen ? 'Sortir de pantalla completa' : 'Pantalla completa'}
                    >
                        {fullscreen ? (
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                            </svg>
                        ) : (
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
