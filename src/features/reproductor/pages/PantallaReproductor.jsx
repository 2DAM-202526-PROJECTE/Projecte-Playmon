import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReproductorVideo from "../components/ReproductorVideo";

// ✅ Mock de contingut (després ho connectes a la teua API)
const CONTINGUTS = [
  {
    id: "1",
    titol: "Documental: Terres de l’Ebre",
    descripcio: "Un recorregut per paisatges, pobles i experiències úniques.",
    poster: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80",
    // vídeo demo públic (substitueix pel teu)
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    duracioText: "12 min",
    any: "2026",
    genere: "Documental",
  },
];

export default function PantallaReproduccio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const contingut = useMemo(() => {
    return CONTINGUTS.find((c) => c.id === id) ?? CONTINGUTS[0];
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white">
      <ReproductorVideo
        titol={contingut.titol}
        src={contingut.src}
        poster={contingut.poster}
        onTornar={() => navigate(-1)}
        onFinal={() => console.log("Final del vídeo")}
      />

      {/* Info sota el player (opcional però molt útil) */}
      <div className="mx-auto w-full max-w-[1100px] px-5 py-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
          <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
            {contingut.any}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
            {contingut.genere}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
            {contingut.duracioText}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          {contingut.titol}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          {contingut.descripcio}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:brightness-95"
            onClick={() => console.log("Continuar / recomençar")}
          >
            Reproduir
          </button>

          <button
            type="button"
            className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
            onClick={() => console.log("Afegir a llista")}
          >
            Afegir a la llista
          </button>
        </div>
      </div>
    </div>
  );
}