import { useEffect, useRef, useState } from "react";
import { usePlayerController } from "@/features/reproductor/hooks/usePlayerController";

export default function Reproductor({ titol, poster, fonts, initialTime = 0, onTimeUpdate, onTornar, onFinal }) {
  const {
    videoRef,
    containerRef,
    estat,
    fontActiva,
    errorCarrega,
    accions,
  } = usePlayerController({ fonts, initialTime });

  const [mostraControls, setMostraControls] = useState(true);
  const timerRef = useRef(null);

  const formatTemps = (seg) => {
    if (!Number.isFinite(seg)) return "0:00";
    const s = Math.floor(seg % 60).toString().padStart(2, "0");
    const m = Math.floor((seg / 60) % 60).toString();
    const h = Math.floor(seg / 3600);
    return h > 0 ? `${h}:${m.toString().padStart(2, "0")}:${s}` : `${m}:${s}`;
  };

  const mostraAmbTimeout = () => {
    setMostraControls(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (estat.playing) setMostraControls(false);
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (estat.ended) {
        onFinal?.();
    } else if (estat.currentTime > 0) {
        onTimeUpdate?.(estat.currentTime);
    }
  }, [estat.ended, estat.currentTime, onFinal, onTimeUpdate]);

  // Tecles ràpides
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (e.key === " " || e.key.toLowerCase() === "k") {
        e.preventDefault();
        accions.togglePlay();
      } else if (e.key.toLowerCase() === "f") {
        accions.toggleFullscreen();
      } else if (e.key.toLowerCase() === "m") {
        accions.toggleMuted();
      } else if (e.key === "ArrowRight") {
        accions.seekTo(estat.currentTime + 10);
      } else if (e.key === "ArrowLeft") {
        accions.seekTo(estat.currentTime - 10);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [accions, estat.currentTime]);

  const onClickVideo = () => {
    accions.togglePlay();
    mostraAmbTimeout();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-black ${!mostraControls && estat.playing ? 'cursor-none' : ''}`}
      onMouseMove={mostraAmbTimeout}
      onClick={onClickVideo}
    >
      {/* Poster de fons mentre carrega */}
      {poster ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${poster})` }}
          aria-hidden="true"
        />
      ) : null}

      <video
        ref={videoRef}
        className="relative h-screen w-full bg-black object-contain"
        playsInline
      />

      {/* Top bar (Disney+ style) */}
      <div
        className={[
          "absolute inset-x-0 top-0 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/80 to-transparent",
          "transition-opacity duration-300",
          mostraControls ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onTornar}
            className="text-white/90 hover:text-white transition drop-shadow-md"
            title="Tornar enrere"
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="truncate text-xl font-bold text-white drop-shadow-lg tracking-wide">{titol}</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right text-xs font-semibold tracking-wider text-white bg-white/20 px-2 py-0.5 rounded">
            {fontActiva ? fontActiva.toUpperCase() : "AUTO"}
          </div>
          <button className="text-white/90 hover:text-white transition drop-shadow-md" title="Idioma i subtítols">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
               <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm2 8h4v2H6v-2zm6 0h6v2h-6v-2zm-6-4h12v2H6v-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Loading */}
      {estat.loading ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      ) : null}

      {/* Error càrrega */}
      {errorCarrega ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-red-500/80 p-4 text-sm text-white shadow-lg pointer-events-none z-20">
          Error carregant el stream: {errorCarrega.message}
        </div>
      ) : null}

      {/* Controls (Disney+ style) */}
      <div
        className={[
          "absolute inset-x-0 bottom-0 px-8 pb-8 pt-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent",
          "transition-opacity duration-300",
          mostraControls ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progrés */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 group flex items-center h-4">
             <input
                type="range"
                min={0}
                max={estat.duration || 0}
                step="0.1"
                value={estat.currentTime}
                onChange={(e) => accions.seekTo(Number(e.target.value))}
                className="w-full absolute inset-0 z-10 opacity-0 cursor-pointer"
             />
             {/* Visual Progress Bar */}
             <div className="w-full h-1.5 bg-white/20 rounded pointer-events-none">
                <div 
                  className="h-full bg-white rounded pointer-events-none" 
                  style={{ width: `${(estat.currentTime / (estat.duration || 1)) * 100}%` }} 
                />
             </div>
             {/* Handle */}
             <div 
               className="absolute top-1/2 -mt-2 h-4 w-4 bg-white rounded-full shadow pointer-events-none transition-transform group-hover:scale-125"
               style={{ left: `calc(${(estat.currentTime / (estat.duration || 1)) * 100}% - 8px)` }}
             />
          </div>
          <span className="text-white/80 text-sm font-medium w-16 text-right tracking-wide">
            {(estat.duration - estat.currentTime) > 0 ? `-${formatTemps(estat.duration - estat.currentTime)}` : '0:00'}
          </span>
        </div>

        {/* Botonera */}
        <div className="flex items-center justify-between">
           {/* Equilibrador esquerre */}
           <div className="flex-1 flex items-center justify-start gap-4">
              <span className="text-white text-sm font-medium tracking-wide">
                  {formatTemps(estat.currentTime)}
              </span>
           </div>
           
           {/* Controls Centrals (Rewind, Play/Pause, Forward) */}
           <div className="flex-1 flex items-center justify-center gap-8 text-white">
              <button 
                onClick={() => accions.seekTo(estat.currentTime - 10)} 
                className="text-white/90 hover:text-white transition transform hover:scale-110 drop-shadow-md relative flex items-center justify-center w-12 h-12"
                title="Retrocedir 10s"
              >
                 <svg className="w-10 h-10 absolute" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                 </svg>
                 <span className="text-[10px] font-bold mt-1 select-none absolute">10</span>
              </button>
              
              <button 
                onClick={accions.togglePlay} 
                className="text-white hover:text-white transition transform hover:scale-110 drop-shadow-lg"
                title={estat.playing ? "Pausar (Espai / K)" : "Reproduir (Espai / K)"}
              >
                 {estat.playing ? (
                    <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                 ) : (
                    <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M8 5v14l11-7z"/>
                    </svg>
                 )}
              </button>
              
              <button 
                onClick={() => accions.seekTo(estat.currentTime + 10)} 
                className="text-white/90 hover:text-white transition transform hover:scale-110 drop-shadow-md relative flex items-center justify-center w-12 h-12"
                title="Avançar 10s"
              >
                 <svg className="w-10 h-10 absolute transform -scale-x-100" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                 </svg>
                 <span className="text-[10px] font-bold mt-1 select-none absolute">10</span>
              </button>
           </div>
           
           {/* Controls Dreta (Volume, Settings, Fullscreen) */}
           <div className="flex-1 flex items-center justify-end gap-5">
              <div className="flex items-center gap-2 group relative">
                 <button 
                   onClick={accions.toggleMuted} 
                   className="text-white/90 hover:text-white transition drop-shadow-md"
                   title={estat.muted ? "Activar so (M)" : "Silenciar (M)"}
                 >
                    {(estat.muted || estat.volume === 0) ? (
                       <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                       </svg>
                    ) : (
                       <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                       </svg>
                    )}
                 </button>
                 {/* Volume slider control appear on hover */}
                 <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300 ease-in-out flex items-center h-8">
                    <input 
                      type="range" 
                      min={0} 
                      max={1} 
                      step={0.01} 
                      value={estat.muted ? 0 : estat.volume} 
                      onChange={(e) => accions.setVolume(Number(e.target.value))} 
                      className="w-20 accent-white h-1 bg-white/30 rounded-lg appearance-none cursor-pointer" 
                    />
                 </div>
              </div>

              <button 
                onClick={accions.toggleFullscreen} 
                className="text-white/90 hover:text-white transition drop-shadow-md"
                title="Pantalla completa (F)"
              >
                 <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                 </svg>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}