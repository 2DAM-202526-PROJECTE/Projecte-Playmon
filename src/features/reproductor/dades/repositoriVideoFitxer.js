import { VIDEOS_FITXER } from "./videosFitxer";

/** @returns {import("../domini/repositoriVideo.port").RepositoriVideoPort} */
export function creaRepositoriVideoFixer() {
  return {
    async obtenirPerId(id) {
      await new Promise((r) => setTimeout(r, 80)); // latència simulada
      const v = VIDEOS_FITXER.find((x) => x.id === id);
      if (!v) {
        const e = new Error("No s'ha trobat el vídeo.");
        e.code = "VIDEO_NOT_FOUND";
        throw e;
      }
      return v;
    },
  };
}