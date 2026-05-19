import { SUBTITLE_FONTS, SUBTITLE_COLORS, SUBTITLE_BGS, PLAYER_RED } from "./playerConstants";

export function SubtitleOverlay({ state, cues, scale = 1 }) {
  if (state.subLang === 'off' || !cues || cues.length === 0) return null;
  const t = state.currentTime + state.subSyncMs / 1000;
  const cue = cues.find((c) => t >= c.start && t < c.end);
  if (!cue) return null;

  const font = SUBTITLE_FONTS.find((f) => f.id === state.subFont)?.family;
  const color = SUBTITLE_COLORS.find((c) => c.id === state.subColor)?.color;
  const bgDef = SUBTITLE_BGS.find((b) => b.id === state.subBg);
  const isShadow = bgDef?.value === 'shadow';

  const style = {
    fontFamily: font,
    color,
    fontSize: state.subSize * scale,
    lineHeight: 1.25,
    fontWeight: 500,
    letterSpacing: '0.005em',
    textAlign: 'center',
    padding: bgDef.value === 'transparent' || isShadow ? '0' : `${6 * scale}px ${14 * scale}px`,
    borderRadius: 6 * scale,
    background: isShadow || bgDef.value === 'transparent' ? 'transparent' : bgDef.value,
    textShadow: isShadow
      ? `0 0 4px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.85), 0 0 1px rgba(0,0,0,1)`
      : 'none',
    whiteSpace: 'pre-line',
    maxWidth: '80%',
    pointerEvents: 'none',
  };

  const pos = state.subPosition === 'top'
    ? { top: `${10 * scale}%`, bottom: 'auto' }
    : { bottom: `${12 * scale}%`, top: 'auto' };

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, ...pos,
      display: 'flex', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 4,
    }}>
      <div style={style}>{cue.text}</div>
    </div>
  );
}

export function SubtitlePreview({ state }) {
  const font = SUBTITLE_FONTS.find((f) => f.id === state.subFont)?.family;
  const color = SUBTITLE_COLORS.find((c) => c.id === state.subColor)?.color;
  const bgDef = SUBTITLE_BGS.find((b) => b.id === state.subBg);
  const isShadow = bgDef?.value === 'shadow';

  return (
    <div style={{
      position: 'relative',
      height: 120, borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${PLAYER_RED.border}`,
      background: 'linear-gradient(135deg, #1c2535 0%, #2d3a4f 35%, #3d2b35 75%, #1a1614 100%)',
      display: 'flex', alignItems: state.subPosition === 'top' ? 'flex-start' : 'flex-end',
      justifyContent: 'center',
      padding: 14,
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.4,
        background: 'radial-gradient(circle at 25% 30%, rgba(255,180,120,0.18), transparent 50%), radial-gradient(circle at 70% 70%, rgba(80,140,200,0.15), transparent 55%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        fontFamily: font, color, fontSize: state.subSize, fontWeight: 500,
        textAlign: 'center', lineHeight: 1.2,
        padding: bgDef.value === 'transparent' || isShadow ? '0' : '5px 12px',
        background: isShadow || bgDef.value === 'transparent' ? 'transparent' : bgDef.value,
        borderRadius: 6,
        textShadow: isShadow ? '0 0 4px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.85)' : 'none',
        position: 'relative', zIndex: 1,
      }}>
        Així es veuran els subtítols
      </div>
    </div>
  );
}
