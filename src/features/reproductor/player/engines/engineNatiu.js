export function creaEngineNatiu() {
  return {
    nom: "natiu",
    async carrega({ videoEl, url }) {
      videoEl.src = url;
      // Espera metadata (duració disponible)
      await new Promise((resolve, reject) => {
        const ok = () => cleanup(resolve);
        const ko = () => cleanup(() => reject(new Error("Error carregant font nativa")))();

        const cleanup = (fn) => {
          videoEl.removeEventListener("loadedmetadata", ok);
          videoEl.removeEventListener("error", ko);
          fn();
        };

        videoEl.addEventListener("loadedmetadata", ok, { once: true });
        videoEl.addEventListener("error", ko, { once: true });
      });
    },
    destrueix() {
      // res
    },
  };
}