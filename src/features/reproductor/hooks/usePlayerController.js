import { useEffect, useMemo, useRef, useState } from "react";
import { ControladorPlayer } from "../player/controlador/ControladorPlayer";

export function usePlayerController({ fonts, initialTime = 0 }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const controlador = useMemo(() => new ControladorPlayer(), []);
  const [estat, setEstat] = useState({
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    loading: true,
    ended: false,
  });

  const [fontActiva, setFontActiva] = useState(null);
  const [errorCarrega, setErrorCarrega] = useState(null);

  useEffect(() => {
    controlador.setOnEstat(setEstat);
  }, [controlador]);

  useEffect(() => {
    const v = videoRef.current;
    const c = containerRef.current;
    if (!v || !c) return;

    controlador.attach({ videoEl: v, containerEl: c });

    return () => controlador.destrueix();
  }, [controlador]);

  useEffect(() => {
    let viu = true;

    async function carrega() {
      try {
        setErrorCarrega(null);
        if (!fonts) return;
        const res = await controlador.carregaFonts(fonts);
        if (viu) {
          setFontActiva(res.fontCarregada);
          if (initialTime > 0) {
            controlador.seekTo(initialTime);
          }
          await controlador.play();
        }
      } catch (e) {
        if (viu) setErrorCarrega(e);
      }
    }

    carrega();
    return () => {
      viu = false;
    };
  }, [controlador, fonts]);

  return {
    videoRef,
    containerRef,
    estat,
    fontActiva,
    errorCarrega,
    accions: {
      play: () => controlador.play(),
      pause: () => controlador.pause(),
      togglePlay: () => controlador.togglePlay(),
      seekTo: (s) => controlador.seekTo(s),
      setVolume: (v) => controlador.setVolume(v),
      toggleMuted: () => controlador.toggleMuted(),
      toggleFullscreen: () => controlador.toggleFullscreen(),
      togglePiP: () => controlador.togglePiP(),
    },
  };
}