import Hls from "hls.js";

/**
 * Retorna una llista ordenada de candidates (HLS primer, després MP4).
 * Open/Closed: si demà afegeixes DASH, només afegeixes un nou candidat ací.
 */
export function candidatesFonts(fonts) {
  const c = [];
  if (fonts?.hls) c.push({ tipus: "hls", url: fonts.hls });
  if (fonts?.mp4) c.push({ tipus: "mp4", url: fonts.mp4 });
  return c;
}

/**
 * Decideix si el navegador pot reproduir HLS natiu (Safari/iOS) o si cal hls.js
 */
export function potHlsNatiu(videoEl) {
  if (!videoEl) return false;
  // Safari sol respondre ok a aquests MIME
  return (
    videoEl.canPlayType("application/vnd.apple.mpegurl") !== "" ||
    videoEl.canPlayType("application/x-mpegURL") !== ""
  );
}

export function potHlsAmbHlsJs() {
  return Hls.isSupported();
}