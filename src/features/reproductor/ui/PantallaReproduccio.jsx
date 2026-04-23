import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useVideoAsset } from "../hooks/useVideoAssets";
import Reproductor from "./Reproductor";
import { getCurrentUser } from "@/api/authApi";

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

  const [initialTime] = useState(() => {
    const historyKey = `playmon_continue_${currentUser?.id || 'guest'}`;
    const saved = localStorage.getItem(historyKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const currentId = videoDirecte ? videoDirecte.id : urlId;
        const history = Array.isArray(parsed) ? parsed : (parsed?.id ? [parsed] : []);
        const item = history.find(p => String(p.id) === String(currentId));
        if (item) return Number(item.savedTime);
      } catch (e) {}
    }
    return 0;
  });

  const handleTimeUpdate = (time) => {
    if (!video) return;
    const mediaType = location.pathname.includes('/tv') ? 'tv' : 'movie';
    const currentId = videoDirecte ? videoDirecte.id : urlId;
    const isOriginal = videoDirecte ? !!videoDirecte.isOriginal : true;
    
    if (time > 0 && !isOriginal) {
      const newItem = {
        id: currentId,
        title: video.titol,
        name: video.titol,
        backdrop_path: video.poster,
        poster_path: video.poster,
        media_type: mediaType,
        savedTime: time,
        completed: false
      };

      try {
        const historyKey = `playmon_continue_${currentUser?.id || 'guest'}`;
        const saved = localStorage.getItem(historyKey);
        let history = [];
        if (saved) {
          const parsed = JSON.parse(saved);
          history = Array.isArray(parsed) ? parsed : (parsed?.id ? [parsed] : []);
        }
        history = history.filter(item => String(item.id) !== String(currentId));
        history.unshift(newItem);
        localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 100)));
      } catch (e) {}
    }
  };

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
            try {
              const historyKey = `playmon_continue_${currentUser?.id || 'guest'}`;
              const saved = localStorage.getItem(historyKey);
              if (saved) {
                const parsed = JSON.parse(saved);
                let history = Array.isArray(parsed) ? parsed : (parsed?.id ? [parsed] : []);
                const currentId = videoDirecte ? videoDirecte.id : urlId;
                const isOriginal = videoDirecte ? !!videoDirecte.isOriginal : true;
                
                if (!isOriginal) {
                    const itemIndex = history.findIndex(item => String(item.id) === String(currentId));
                    if (itemIndex > -1) {
                      history[itemIndex].completed = true;
                      history[itemIndex].savedTime = 0;
                      localStorage.setItem(historyKey, JSON.stringify(history));
                    }
                }
              }
            } catch (e) {}
            if (!keepOnEnd) navigate(-1);
        }}
      />

      {/* <div className="mx-auto w-full max-w-[1100px] px-5 py-6">
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
      </div> */}
    </div>
  );
}