import { useEffect, useMemo, useRef, useState } from "react";

export default function ReproductorVideo({
  src,
  poster,
  titol = "",
  onTornar,
  onFinal,
}) {
  const videoRef = useRef(null);
  const contenidorRef = useRef(null);

  const [estaReproduint, setEstaReproduint] = useState(false);
  const [tempsActual, setTempsActual] = useState(0);
  const [duracio, setDuracio] = useState(0);
  const [volum, setVolum] = useState(1);
  const [mut, setMut] = useState(false);
  const [mostraControls, setMostraControls] = useState(true);
  const [carregant, setCarregant] = useState(true);

  const timerControlsRef = useRef(null);

  const formatTemps = (seg) => {
    if (!Number.isFinite(seg)) return "0:00";
    const s = Math.floor(seg % 60).toString().padStart(2, "0");
    const m = Math.floor((seg / 60) % 60).toString();
    const h = Math.floor(seg / 3600);
    return h > 0 ? `${h}:${m.padStart(2, "0")}:${s}` : `${m}:${s}`;
  };

  const percent = useMemo(() => {
    if (!duracio) return 0;
    return Math.min(100, Math.max(0, (tempsActual / duracio) * 100));
  }, [tempsActual, duracio]);

  const mostrarControlsAmbTimeout = () => {
    setMostraControls(true);
    if (timerControlsRef.current) window.clearTimeout(timerControlsRef.current);
    timerControlsRef.current = window.setTimeout(() => {
      const v = videoRef.current;
      if (v && !v.paused) setMostraControls(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (timerControlsRef.current) window.clearTimeout(timerControlsRef.current);
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      setDuracio(v.duration || 0);
      setCarregant(false);
    };
    const onTime = () => setTempsActual(v.currentTime || 0);
    const onPlay = () => {
      setEstaReproduint(true);
      mostrarControlsAmbTimeout();
    };
    const onPause = () => setEstaReproduint(false);
    const onWaiting = () => setCarregant(true);
    const onPlaying = () => setCarregant(false);
    const onEnded = () => {
      setEstaReproduint(false);
      setMostraControls(true);
      onFinal?.();
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("ended", onEnded);

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("ended", onEnded);
    };
  }, [onFinal]);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) await v.play();
    else v.pause();
  };

  const canviarTemps = (nouTemps) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(duracio || 0, Math.max(0, nouTemps));
  };

  const toggleMut = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMut(v.muted);
  };

  const canviarVolum = (nv) => {
    const v = videoRef.current;
    if (!v) return;
    const valor = Math.min(1, Math.max(0, nv));
    v.volume = valor;
    setVolum(valor);
    if (valor > 0 && v.muted) {
      v.muted = false;
      setMut(false);
    }
  };

  const toggleFullscreen = async () => {
    const el = contenidorRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      await el.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  };

  const togglePiP = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      // Safari/Chrome suporten PiP de manera diferent, això és el camí general
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await v.requestPictureInPicture?.();
      }
    } catch {
      // si no hi ha suport, no fem res
    }
  };

  // Tecles ràpides tipus streaming
  useEffect(() => {
    const onKey = (e) => {
      // Evita interferir quan estàs escrivint en inputs
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (e.key === " " || e.key.toLowerCase() === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === "m") {
        toggleMut();
      } else if (e.key === "ArrowRight") {
        canviarTemps(tempsActual + 10);
      } else if (e.key === "ArrowLeft") {
        canviarTemps(tempsActual - 10);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tempsActual, duracio]);

  return (
    <div
      ref={contenidorRef}
      className="relative w-full bg-black"
      onMouseMove={mostrarControlsAmbTimeout}
      onClick={togglePlay}
    >
      {/* Vídeo */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-[56vw] max-h-[78vh] min-h-[260px] w-full object-contain"
        playsInline
      />

      {/* Gradient superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />

      {/* Gradient inferior */}
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

        <div className="truncate px-3 text-sm font-semibold text-white/90">
          {titol}
        </div>

        <div className="w-[84px]" />
      </div>

      {/* Spinner carregant */}
      {carregant ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      ) : null}

      {/* Controls bottom */}
      <div
        className={[
          "absolute inset-x-0 bottom-0 px-4 pb-4",
          "transition-opacity duration-150",
          mostraControls ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de progrés */}
        <div className="mb-3">
          <input
            type="range"
            min={0}
            max={duracio || 0}
            step="0.1"
            value={tempsActual}
            onChange={(e) => canviarTemps(Number(e.target.value))}
            className="w-full accent-white"
          />
          <div className="mt-1 flex justify-between text-xs text-white/70">
            <span>{formatTemps(tempsActual)}</span>
            <span>{formatTemps(duracio)}</span>
          </div>
        </div>

        {/* Botonera */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
            >
              {estaReproduint ? "Pausa" : "Reprodueix"}
            </button>

            <button
              type="button"
              onClick={toggleMut}
              className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
              title="Mút (M)"
            >
              {mut ? "🔇" : "🔊"}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step="0.01"
              value={mut ? 0 : volum}
              onChange={(e) => canviarVolum(Number(e.target.value))}
              className="w-28 accent-white"
              title="Volum"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => console.log("Subtítols (placeholder)")}
              className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
              title="Subtítols (placeholder)"
            >
              CC
            </button>

            <button
              type="button"
              onClick={togglePiP}
              className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
              title="Picture-in-Picture"
            >
              PiP
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
              title="Pantalla completa (F)"
            >
              ⛶
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-3 text-xs text-white/50">
          Tecles: espai/K (play), ←/→ (±10s), M (mút), F (fullscreen)
        </div>
      </div>
    </div>
  );
}