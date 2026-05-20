import { useCallback, useEffect, useRef, useState } from "react";
import { usePlayerController } from "@/features/reproductor/hooks/usePlayerController";
import { PLAYER_RED, clamp } from "./disseny/playerConstants";
import { PlayerControls } from "./disseny/PlayerControls";
import { SettingsSheet } from "./disseny/SettingsSheet";
import { SubtitleOverlay } from "./disseny/SubtitleOverlay";
import { LockOverlay } from "./disseny/LockOverlay";

export default function Reproductor({
  titol,
  subtitol,
  poster,
  fonts,
  cues,
  initialTime = 0,
  onTimeUpdate,
  onTornar,
  onFinal,
  overlayMode = "auto",
  progressStyle = "thin",
  cinemaMode = false,
}) {
  const { videoRef, containerRef, estat, fontActiva, errorCarrega, accions } =
    usePlayerController({ fonts, initialTime });

  const [buffered, setBuffered] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [sheet, setSheet] = useState(null);
  const [settingsView, setSettingsView] = useState("main");
  const [isLocked, setIsLocked] = useState(false);
  const [showSkipFb, setShowSkipFb] = useState(null);
  const [quality, setQuality] = useState("auto");

  const [subState, setSubState] = useState({
    subLang: cues && cues.length ? "ca" : "off",
    subSize: 24,
    subFont: "sans",
    subColor: "white",
    subBg: "shadow",
    subPosition: "bottom",
    subSyncMs: 0,
  });

  const subLangAutoSet = useRef(false);
  useEffect(() => {
    if (subLangAutoSet.current) return;
    if (cues && cues.length > 0) {
      subLangAutoSet.current = true;
      setSubState((s) => (s.subLang === "off" ? { ...s, subLang: "ca" } : s));
    }
  }, [cues]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onProgress = () => {
      if (v.buffered.length) {
        setBuffered(v.buffered.end(v.buffered.length - 1));
      }
    };
    v.addEventListener("progress", onProgress);
    return () => v.removeEventListener("progress", onProgress);
  }, [videoRef]);

  const setRate = useCallback(
    (r) => {
      const v = videoRef.current;
      if (v) v.playbackRate = r;
      setPlaybackRate(r);
    },
    [videoRef]
  );

  const flashSkip = useCallback((kind) => {
    setShowSkipFb(kind);
    setTimeout(() => setShowSkipFb((cur) => (cur === kind ? null : cur)), 600);
  }, []);

  const state = {
    isPlaying: estat.playing,
    currentTime: estat.currentTime,
    duration: estat.duration || 0,
    buffered,
    volume: estat.volume,
    muted: estat.muted,
    playbackRate,
    quality,
    sheet,
    settingsView,
    isLocked,
    showSkipFb,
    ...subState,
  };

  const actions = {
    togglePlay: accions.togglePlay,
    seekTo: (t) => accions.seekTo(clamp(t, 0, state.duration)),
    skip: (delta) => {
      accions.seekTo(clamp(estat.currentTime + delta, 0, state.duration));
      flashSkip(delta > 0 ? "+10" : "-10");
    },
    setVolume: accions.setVolume,
    toggleMute: accions.toggleMuted,
    toggleFullscreen: accions.toggleFullscreen,
    togglePiP: accions.togglePiP,
    setRate,
    openSettings: (view = "main") => {
      setSettingsView(view);
      setSheet("settings");
    },
    closeSheet: () => {
      setSheet(null);
      setSettingsView("main");
    },
    goSettingsView: (view) => setSettingsView(view),
    setSub: (k, val) => {
      if (k === "quality") setQuality(val);
      else setSubState((s) => ({ ...s, [k]: val }));
    },
    lock: () => setIsLocked(true),
    unlock: () => setIsLocked(false),
  };

  const [autoVisible, setAutoVisible] = useState(true);
  const idleTimer = useRef(null);

  const wakeControls = useCallback(() => {
    setAutoVisible(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (state.isPlaying && !state.sheet) {
      idleTimer.current = setTimeout(() => setAutoVisible(false), 3000);
    }
  }, [state.isPlaying, state.sheet]);

  useEffect(() => {
    wakeControls();
  }, [state.isPlaying, state.sheet, wakeControls]);

  const visible =
    overlayMode === "hidden"
      ? false
      : overlayMode === "visible"
      ? true
      : !state.isLocked && (autoVisible || !state.isPlaying || !!state.sheet);

  useEffect(() => {
    if (estat.ended) onFinal?.();
    else if (estat.currentTime > 0) onTimeUpdate?.(estat.currentTime, estat.duration);
  }, [estat.ended, estat.currentTime, estat.duration, onFinal, onTimeUpdate]);

  useEffect(() => {
    const onKey = (e) => {
      if (state.isLocked) return;
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          actions.togglePlay();
          break;
        case "ArrowLeft":
          actions.skip(-10);
          break;
        case "ArrowRight":
          actions.skip(10);
          break;
        case "ArrowUp":
          actions.setVolume(Math.min(1, estat.volume + 0.05));
          break;
        case "ArrowDown":
          actions.setVolume(Math.max(0, estat.volume - 0.05));
          break;
        case "m":
          actions.toggleMute();
          break;
        case "c":
          actions.openSettings("subtitles");
          break;
        case "f":
          actions.toggleFullscreen();
          break;
        case "Escape":
          if (state.sheet) actions.closeSheet();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isLocked, state.sheet, estat.volume]);

  return (
    <div
      ref={containerRef}
      onMouseMove={wakeControls}
      onMouseLeave={() =>
        state.isPlaying && !state.sheet && setAutoVisible(false)
      }
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
        fontFamily: "'Outfit', system-ui, sans-serif",
        color: PLAYER_RED.text,
        userSelect: "none",
        cursor: visible ? "default" : "none",
      }}
    >
      {poster && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: estat.loading ? 0.25 : 0,
            transition: "opacity 0.4s",
            pointerEvents: "none",
          }}
        />
      )}

      <video
        ref={videoRef}
        poster={poster}
        playsInline
        onClick={() => !state.isLocked && actions.togglePlay()}
        onDoubleClick={() => !state.isLocked && actions.skip(10)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          background: "#000",
        }}
      />

      <SubtitleOverlay state={state} cues={cues} />

      {!state.isLocked && (
        <PlayerControls
          state={state}
          actions={actions}
          visible={visible}
          progressStyle={progressStyle}
          cinemaMode={cinemaMode}
          title={titol}
          subtitle={subtitol || (fontActiva ? `Font: ${fontActiva.toUpperCase()}` : "")}
          onBack={onTornar}
        />
      )}

      {state.isLocked && <LockOverlay actions={actions} />}

      <SettingsSheet state={state} actions={actions} />

      {estat.loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 22px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${PLAYER_RED.border}`,
              color: PLAYER_RED.textDim,
              fontSize: 13,
            }}
          >
            <SpinnerDot /> Carregant flux…
          </div>
        </div>
      )}

      {errorCarrega && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(180,40,40,0.85)",
            padding: "14px 20px",
            borderRadius: 12,
            fontSize: 13,
            color: "#fff",
            zIndex: 40,
          }}
        >
          Error carregant el stream: {errorCarrega.message}
        </div>
      )}
    </div>
  );
}

function SpinnerDot() {
  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: PLAYER_RED.red,
        boxShadow: `0 0 12px ${PLAYER_RED.red}`,
        animation: "pm-lock-pulse 1.2s ease-in-out infinite",
      }}
    />
  );
}
