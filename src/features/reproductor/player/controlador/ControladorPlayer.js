import { candidatesFonts } from "../../domini/seleccioFont";
import { creaEnginePerFont } from "../engines/creaEngine";

/**
 * SRP: aquest controlador només:
 * - carrega una font al <video> (amb engine)
 * - exposa comandaments (play/pause/seek/volume…)
 * - publica estat via callbacks
 *
 * UI no sap res de hls.js ni de com es carrega.
 */
export class ControladorPlayer {
  /** @type {HTMLVideoElement|null} */
  #videoEl = null;
  /** @type {HTMLElement|null} */
  #containerEl = null;
  /** @type {any|null} */
  #engine = null;

  /** @type {(s: any) => void} */
  #onEstat = () => {};

  setOnEstat(fn) {
    this.#onEstat = fn ?? (() => {});
  }

  attach({ videoEl, containerEl }) {
    this.#videoEl = videoEl;
    this.#containerEl = containerEl;
    this.#subscriuEvents();
  }

  async carregaFonts(fonts) {
    const v = this.#videoEl;
    if (!v) throw new Error("Video element no attachat.");

    // neteja engine anterior
    this.#netejaEngine();

    const candidates = candidatesFonts(fonts);
    let lastErr = null;

    for (const font of candidates) {
      const engine = creaEnginePerFont({ videoEl: v, font });
      if (!engine) {
        lastErr = new Error(`No hi ha engine per a ${font.tipus}`);
        continue;
      }

      try {
        this.#engine = engine;
        await engine.carrega({ videoEl: v, url: font.url });
        this.#emiteix(); // estat inicial
        return { fontCarregada: font.tipus };
      } catch (e) {
        lastErr = e;
        this.#netejaEngine();
        // prova següent font (fallback)
      }
    }

    throw lastErr ?? new Error("No s'ha pogut carregar cap font.");
  }

  destrueix() {
    this.#netejaEngine();
    this.#desubscriuEvents();
    this.#videoEl = null;
    this.#containerEl = null;
  }

  // Commands
  async play() {
    if (!this.#videoEl) return;
    await this.#videoEl.play();
  }
  pause() {
    this.#videoEl?.pause();
  }
  togglePlay() {
    if (!this.#videoEl) return;
    if (this.#videoEl.paused) return this.play();
    this.pause();
  }
  seekTo(seconds) {
    if (!this.#videoEl) return;
    this.#videoEl.currentTime = Math.max(0, Math.min(seconds, this.#videoEl.duration || seconds));
  }
  setVolume(v) {
    if (!this.#videoEl) return;
    const val = Math.max(0, Math.min(1, v));
    this.#videoEl.volume = val;
    if (val > 0 && this.#videoEl.muted) this.#videoEl.muted = false;
    this.#emiteix();
  }
  toggleMuted() {
    if (!this.#videoEl) return;
    this.#videoEl.muted = !this.#videoEl.muted;
    this.#emiteix();
  }
  async toggleFullscreen() {
    const el = this.#containerEl;
    if (!el) return;
    if (!document.fullscreenElement) await el.requestFullscreen?.();
    else await document.exitFullscreen?.();
  }
  async togglePiP() {
    const v = this.#videoEl;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await v.requestPictureInPicture?.();
    } catch {
      // ignore
    }
  }

  // Events video -> estat
  #handlers = null;

  #subscriuEvents() {
    const v = this.#videoEl;
    if (!v || this.#handlers) return;

    const emet = () => this.#emiteix();
    const onEnded = () => {
      this.#emiteix();
      // la UI decidirà què fer
    };

    this.#handlers = {
      timeupdate: emet,
      durationchange: emet,
      play: emet,
      pause: emet,
      waiting: emet,
      playing: emet,
      volumechange: emet,
      ended: onEnded,
      error: emet,
    };

    for (const [evt, fn] of Object.entries(this.#handlers)) {
      v.addEventListener(evt, fn);
    }
  }

  #desubscriuEvents() {
    const v = this.#videoEl;
    if (!v || !this.#handlers) return;
    for (const [evt, fn] of Object.entries(this.#handlers)) {
      v.removeEventListener(evt, fn);
    }
    this.#handlers = null;
  }

  #netejaEngine() {
    if (this.#engine?.destrueix) this.#engine.destrueix();
    this.#engine = null;
    if (this.#videoEl) {
      this.#videoEl.removeAttribute("src");
      this.#videoEl.load();
    }
  }

  #emiteix() {
    const v = this.#videoEl;
    if (!v) return;

    const loading = v.readyState < 3 && !v.paused; // aproximació útil
    this.#onEstat({
      playing: !v.paused,
      currentTime: v.currentTime || 0,
      duration: v.duration || 0,
      volume: v.volume ?? 1,
      muted: !!v.muted,
      loading,
      ended: v.ended,
    });
  }
}