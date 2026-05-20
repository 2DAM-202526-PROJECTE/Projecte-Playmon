import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useRef, useState, useCallback, useEffect } from "react";
import { useVideoAsset } from "../hooks/useVideoAssets";
import Reproductor from "./Reproductor";
import { useSeguirViendo } from "@/context/SeguirViendoContext";
import { useHistorial } from "@/context/HistorialContext";
import { usePlaymonHistorial } from "@/context/PlaymonHistorialContext";
import { usePlaymonSeguirViendo } from "@/context/PlaymonSeguirViendoContext";
import { getVideoSubtitles } from "@/api/videosApi";
import { parseVTT } from "../utils/parseVTT";

export default function PantallaReproduccio() {
  const params = useParams();
  const urlId = params.id || params.videoId;
  const navigate = useNavigate();
  const location = useLocation();

  const videoDirecte = location.state?.fonts ? location.state : null;
  const keepOnEnd = location.state?.keepOnEnd ?? false;
  // isOriginal works both when navigated with fonts (from OriginalVideoCard)
  // and without fonts (from HistoryList/WatchlistPanel via API fetch)
  const isOriginal = videoDirecte ? !!videoDirecte.isOriginal : !!location.state?.isOriginal;

  const { dades: videoBD, carregant, error } = useVideoAsset(videoDirecte ? null : urlId);
  const video = videoDirecte ?? videoBD;

  const { saveProgress, removeProgress, getProgress }             = useSeguirViendo();
  const { addToHistorial }                                         = useHistorial();
  const { addToHistorial: addToPlaymonHistorial }                  = usePlaymonHistorial();
  const { saveProgress: savePlaymonProgress,
          removeProgress: removePlaymonProgress,
          getProgress: getPlaymonProgress,
          loading: svLoading }                                     = usePlaymonSeguirViendo();

  const lastSaveRef       = useRef(0);
  const isFinishedRef     = useRef(false);
  const historialSavedRef = useRef(false);
  const lastTimeRef       = useRef(0);
  const lastDurationRef   = useRef(0);
  const currentVideoRef   = useRef(null);

  const currentId = videoDirecte ? videoDirecte.id : urlId;

  // Save progress on unmount: catches the case where user navigates away
  // between periodic saves (e.g., stops at t=3, first save was at t=1)
  useEffect(() => {
    return () => {
      if (isOriginal && !isFinishedRef.current && lastTimeRef.current > 0 && currentVideoRef.current) {
        savePlaymonProgress(currentVideoRef.current, lastTimeRef.current, lastDurationRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Non-originals: getProgress reads localStorage (sync, safe at init time)
  // Originals: getPlaymonProgress reads API data (async) — start null, set via effect
  const [initialTime, setInitialTime] = useState(
    () => isOriginal ? null : getProgress(currentId)
  );
  const didSetInitialTime = useRef(false);

  useEffect(() => {
    if (!isOriginal || svLoading || didSetInitialTime.current) return;
    didSetInitialTime.current = true;
    setInitialTime(getPlaymonProgress(currentId));
  }, [isOriginal, svLoading, getPlaymonProgress, currentId]);

  const [cues, setCues] = useState([]);

  useEffect(() => {
    if (!isOriginal || !currentId) { setCues([]); return; }
    let cancelled = false;
    (async () => {
      try {
        const subs = await getVideoSubtitles(currentId);
        console.log('[subtitles] list for video', currentId, subs);
        if (!subs.length) { if (!cancelled) setCues([]); return; }
        const pref = subs.find((s) => s.lang === 'ca') || subs.find((s) => s.lang === 'es') || subs[0];
        if (!pref?.vtt_url) {
          console.warn('[subtitles] no vtt_url in preferred subtitle', pref);
          return;
        }
        console.log('[subtitles] fetching VTT', pref.vtt_url);
        const r = await fetch(pref.vtt_url);
        if (!r.ok) {
          console.warn('[subtitles] VTT fetch failed', r.status, pref.vtt_url);
          return;
        }
        const text = await r.text();
        const parsed = parseVTT(text);
        console.log('[subtitles] parsed cues:', parsed.length);
        if (!cancelled) setCues(parsed);
      } catch (err) {
        console.error('[subtitles] load error', err);
        if (!cancelled) setCues([]);
      }
    })();
    return () => { cancelled = true; };
  }, [isOriginal, currentId]);

  const handleTimeUpdate = useCallback((time, duration) => {
    if (!video || isFinishedRef.current) return;

    if (isOriginal) {
      const videoObj = {
        id: currentId,
        title: video.titol,
        poster: video.poster,
        thumbnailDataUrl: video.poster,
      };

      currentVideoRef.current = videoObj;
      lastTimeRef.current = time;
      lastDurationRef.current = duration || 0;

      if (time >= 1 && !historialSavedRef.current) {
        historialSavedRef.current = true;
        addToPlaymonHistorial(videoObj);
      }

      if (time >= 1 && (lastSaveRef.current === 0 || Math.abs(time - lastSaveRef.current) >= 5)) {
        lastSaveRef.current = time;
        savePlaymonProgress(videoObj, time, duration || 0);
      }
    } else {
      const mediaType = videoDirecte?.media_type || (location.pathname.includes('/tv') ? 'tv' : 'movie');
      const movieObj = {
        id: currentId,
        title: video.titol,
        name: video.titol,
        poster_path: video.poster,
        backdrop_path: video.poster,
        media_type: mediaType,
      };

      if (time >= 1 && !historialSavedRef.current) {
        historialSavedRef.current = true;
        addToHistorial(movieObj);
      }

      if (time >= 1 && (lastSaveRef.current === 0 || Math.abs(time - lastSaveRef.current) >= 5)) {
        lastSaveRef.current = time;
        saveProgress(movieObj, time, duration || 120);
      }
    }
  }, [video, videoDirecte, currentId, isOriginal, location.pathname,
      addToHistorial, saveProgress,
      addToPlaymonHistorial, savePlaymonProgress]);

  if (!videoDirecte && carregant) {
    return (
      <div className="min-h-screen bg-black text-white grid place-items-center">
        <div className="text-sm text-white/70">Carregant…</div>
      </div>
    );
  }

  if (!videoDirecte && error) {
    return (
      <div className="min-h-screen bg-black text-white grid place-items-center px-6">
        <div className="w-full max-w-lg rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <div className="text-lg font-semibold">Error carregant el vídeo</div>
          <div className="mt-2 text-sm text-white/70">{error.message}</div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:brightness-95"
          >
            Tornar
          </button>
        </div>
      </div>
    );
  }

  // Wait for originals progress to load before mounting player (avoids seeking to 0)
  if (isOriginal && initialTime === null) {
    return (
      <div className="min-h-screen bg-black text-white grid place-items-center">
        <div className="text-sm text-white/70">Carregant…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Reproductor
        titol={video.titol}
        poster={video.poster}
        fonts={video.fonts}
        cues={cues}
        initialTime={initialTime}
        onTimeUpdate={handleTimeUpdate}
        onTornar={() => navigate(-1)}
        onFinal={() => {
          if (isFinishedRef.current) return;
          isFinishedRef.current = true;
          if (isOriginal) {
            removePlaymonProgress(currentId);
            if (!keepOnEnd) navigate(-1);
          } else {
            const mediaType = videoDirecte?.media_type || (location.pathname.includes('/tv') ? 'tv' : 'movie');
            removeProgress(currentId, mediaType);
            navigate(`/${mediaType}/${currentId}`, { replace: true });
          }
        }}
      />

      {/* <div className="mx-auto w-full max-w-[1100px] px-5 py-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
          {video.any ? (
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">{video.any}</span>
          ) : null}
          {video.genere ? (
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">{video.genere}</span>
          ) : null}
          {video.duracioText ? (
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">{video.duracioText}</span>
          ) : null}
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{video.titol}</h1>
        {video.descripcio ? (
          <p className="mt-2 max-w-3xl text-sm text-white/70">{video.descripcio}</p>
        ) : null}
      </div> */}
    </div>
  );
}
