import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { useVideoAsset } from "../hooks/useVideoAssets";
import Reproductor from "./Reproductor";
import { getCurrentUser } from "@/api/authApi";
import { useSeguirViendo } from "@/context/SeguirViendoContext";
import { useHistorial } from "@/context/HistorialContext";

export default function PantallaReproduccio() {
  const currentUser = getCurrentUser();
  const params = useParams();
  const urlId = params.id || params.videoId;
  const navigate = useNavigate();
  const location = useLocation();

  const videoDirecte = location.state?.fonts ? location.state : null;
  const keepOnEnd = location.state?.keepOnEnd ?? false;
  const { dades: videoBD, carregant, error } = useVideoAsset(videoDirecte ? null : urlId);

  const video = videoDirecte ?? videoBD;

  const { saveProgress, removeProgress, getProgress } = useSeguirViendo();
  const { addToHistorial } = useHistorial();
  const lastSaveRef = useRef(0);
  const isFinishedRef = useRef(false);
  const historialSavedRef = useRef(false);

  const [initialTime] = useState(() => {
    const currentId = videoDirecte ? videoDirecte.id : urlId;
    return getProgress(currentId);
  });

  const handleTimeUpdate = useCallback((time, duration) => {
    if (!video || isFinishedRef.current) return;
    const mediaType = videoDirecte?.media_type || (location.pathname.includes('/tv') ? 'tv' : 'movie');
    const currentId = videoDirecte ? videoDirecte.id : urlId;
    const isOriginal = videoDirecte ? !!videoDirecte.isOriginal : true;

    if (time > 0 && !isOriginal) {
      const movieObj = {
          id: currentId,
          title: video.titol,
          name: video.titol,
          poster_path: video.poster,
          backdrop_path: video.poster,
          media_type: mediaType
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
  }, [video, videoDirecte, urlId, location.pathname, addToHistorial, saveProgress]);

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

  return (
    <div className="min-h-screen bg-black text-white">
      <Reproductor
        titol={video.titol}
        poster={video.poster}
        fonts={video.fonts}
        initialTime={initialTime}
        onTimeUpdate={handleTimeUpdate}
        onTornar={() => navigate(-1)}
        onFinal={() => {
            isFinishedRef.current = true;
            const currentId = videoDirecte ? videoDirecte.id : urlId;
            const isOriginal = videoDirecte ? !!videoDirecte.isOriginal : true;
            const mediaType = videoDirecte?.media_type || (location.pathname.includes('/tv') ? 'tv' : 'movie');

            if (!isOriginal) {
                removeProgress(currentId, mediaType);
                navigate(`/${mediaType}/${currentId}`, { replace: true });
            } else if (!keepOnEnd) {
                navigate(-1);
            }
        }}
      />

      <div className="mx-auto w-full max-w-[1100px] px-5 py-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
          {video.any ? (
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
              {video.any}
            </span>
          ) : null}
          {video.genere ? (
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
              {video.genere}
            </span>
          ) : null}
          {video.duracioText ? (
            <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
              {video.duracioText}
            </span>
          ) : null}
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{video.titol}</h1>
        {video.descripcio ? (
          <p className="mt-2 max-w-3xl text-sm text-white/70">{video.descripcio}</p>
        ) : null}
      </div>
    </div>
  );
}