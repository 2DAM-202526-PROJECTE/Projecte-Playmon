import { useNavigate, useParams } from "react-router-dom";
import { useVideoAsset } from "../hooks/useVideoAsset";
import Reproductor from "./Reproductor";

export default function PantallaReproduccio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { dades: video, carregant, error } = useVideoAsset(id);

  if (carregant) {
    return (
      <div className="min-h-screen bg-black text-white grid place-items-center">
        <div className="text-sm text-white/70">Carregant…</div>
      </div>
    );
  }

  if (error) {
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
        onTornar={() => navigate(-1)}
        onFinal={() => console.log("Final")}
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