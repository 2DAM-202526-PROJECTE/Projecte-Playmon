import Hls from "hls.js";

export function creaEngineHlsJs() {
  /** @type {Hls | null} */
  let hls = null;

  return {
    nom: "hls.js",
    async carrega({ videoEl, url }) {
      hls = new Hls({
        // opcional: pots afinar buffers ací
        // maxBufferLength: 30,
        // backBufferLength: 90,
      });

      await new Promise((resolve, reject) => {
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (data?.fatal) {
            reject(new Error(`HLS fatal: ${data.type ?? "unknown"}`));
          }
        });

        hls.attachMedia(videoEl);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(url);
          hls.on(Hls.Events.MANIFEST_PARSED, () => resolve());
        });
      });
    },
    destrueix() {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    },
  };
}