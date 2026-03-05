import { useEffect, useRef, useState } from "react";
import { usePlayerController } from "../hooks/usePlayerController";

export default function Reproductor({ titol, poster, fonts, onTornar, onFinal }) {
  const {
    videoRef,
    containerRef,
    estat,
    fontActiva,
    errorCarrega,
    accions,
  } = usePlayerController({ fonts });

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
    if (estat.ended) onFinal?.();
  }, [estat.ended, onFinal]);

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
      className="relative w-full bg-black"
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
        className="relative h-[56vw] max-h-[78vh] min-h-[260px] w-full object-contain"
        playsInline
        // important per CORS si tens CDN separat:
        crossOrigin="anonymous"
      />

      {/* Gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/75 to-transparent" />

      {/* Top bar */}
      <div
        className={[
          "absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3",
          "transition-opacity duration-150",
          mostraControls ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onTornar}
          className="rounded-full bg-black/40 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-black/55"
        >
          ← Tornar
        </button>

        <div className="truncate px-3 text-sm font-semibold text-white/90">{titol}</div>

        <div className="w-[96px] text-right text-xs text-white/60">
          {fontActiva ? fontActiva.toUpperCase() : ""}
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
        <div className="absolute inset-x-0 bottom-0 mx-4 mb-4 rounded-2xl bg-red-500/10 p-4 text-sm text-red-200 ring-1 ring-red-500/20">
          Error carregant el stream: {errorCarrega.message}
        </div>
      ) : null}

      {/* Controls */}
      <div
        className={[
          "absolute inset-x-0 bottom-0 px-4 pb-4",
          "transition-opacity duration-150",
          mostraControls ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progrés */}
        <div className="mb-3">
          <input
            type="range"
            min={0}
            max={estat.duration || 0}
            step="0.1"
            value={estat.currentTime}
            onChange={(e) => accions.seekTo(Number(e.target.value))}
            className="w-full accent-white"
          />
          <div className="mt-1 flex justify-between text-xs text-white/70">
            <span>{formatTemps(estat.currentTime)}</span>
            <span>{formatTemps(estat.duration)}</span>
          </div>
        </div>

        {/* Botonera */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={accions.togglePlay}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
            >
              {estat.playing ? "Pausa" : "Reprodueix"}
            </button>

            <button
              type="button"
              onClick={accions.toggleMuted}
              className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
              title="Mút (M)"
            >
              {estat.muted || estat.volume === 0 ? "🔇" : "🔊"}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={estat.muted ? 0 : estat.volume}
              onChange={(e) => accions.setVolume(Number(e.target.value))}
              className="w-28 accent-white"
              title="Volum"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={accions.togglePiP}
              className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
              title="Picture-in-Picture"
            >
              PiP
            </button>

            <button
              type="button"
              onClick={accions.toggleFullscreen}
              className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
              title="Pantalla completa (F)"
            >
              ⛶
            </button>
          </div>
        </div>

        <div className="mt-3 text-xs text-white/50">
          Tecles: espai/K (play), ←/→ (±10s), M (mút), F (fullscreen)
        </div>
      </div>
    </div>
  );
}