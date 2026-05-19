export const PLAYER_RED = {
  bg: '#000',
  red: '#e89030',
  redHot: '#ffa84a',
  redDeep: '#c97318',
  panel: 'rgba(14,10,10,0.92)',
  panelSolid: '#141010',
  border: 'rgba(255,255,255,0.10)',
  borderMid: 'rgba(255,255,255,0.18)',
  borderHot: 'rgba(232,144,48,0.55)',
  text: '#f5f3f2',
  textDim: '#b5afad',
  textMute: '#7a7370',
  scrim: 'rgba(0,0,0,0.55)',
};

export const QUALITIES = [
  { id: 'auto', label: 'Auto', sub: 'Recomanat · qualitat adaptativa' },
  { id: '1080', label: '1080p', sub: 'Full HD · 8 Mbps' },
  { id: '720', label: '720p', sub: 'HD · 4 Mbps' },
  { id: '480', label: '480p', sub: 'SD · 1.5 Mbps' },
];

export const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const SUBTITLE_LANGS = [
  { id: 'off', label: 'Desactivats' },
  { id: 'ca', label: 'Català' },
  { id: 'es', label: 'Castellà' },
  { id: 'en', label: 'Anglès' },
];

export const SUBTITLE_FONTS = [
  { id: 'sans', label: 'Sans-serif', family: "'Outfit', system-ui, sans-serif" },
  { id: 'serif', label: 'Serif', family: "'Source Serif Pro', Georgia, serif" },
  { id: 'mono', label: 'Mono', family: "'JetBrains Mono', monospace" },
  { id: 'casual', label: 'Manuscrita', family: "'Caveat', cursive" },
];

export const SUBTITLE_COLORS = [
  { id: 'white', label: 'Blanc', color: '#ffffff' },
  { id: 'amber', label: 'Ambre', color: '#ffce5b' },
  { id: 'cyan', label: 'Cian', color: '#7be0ff' },
  { id: 'lime', label: 'Verd', color: '#a4f068' },
  { id: 'pink', label: 'Rosa', color: '#ff8fb6' },
];

export const SUBTITLE_BGS = [
  { id: 'none', label: 'Cap', value: 'transparent' },
  { id: 'shadow', label: 'Ombra', value: 'shadow' },
  { id: 'soft', label: 'Suau', value: 'rgba(0,0,0,0.45)' },
  { id: 'solid', label: 'Sòlid', value: 'rgba(0,0,0,0.85)' },
];

export function fmtTime(seconds) {
  let s = seconds;
  if (!isFinite(s) || s < 0) s = 0;
  const t = Math.floor(s);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = t % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
