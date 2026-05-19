import { useEffect, useRef, useState } from "react";
import {
  PLAYER_RED, fmtTime, clamp,
} from "./playerConstants";
import {
  IconPlay, IconPause, IconSkipFwd, IconSkipBack,
  IconVolHigh, IconVolMid, IconVolLow, IconMute,
  IconFull, IconCaptions, IconSettings, IconPip, IconLockBig, IconMP4,
} from "./playerIcons";

export function PlayerControls({ state, actions, visible, progressStyle = 'thin', cinemaMode = false, title, subtitle, onBack }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
      transition: 'opacity 0.25s',
      background: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 18%, rgba(0,0,0,0.0) 65%, rgba(0,0,0,0.65) 100%)`,
    }}>
      {!cinemaMode && <TopBar title={title} subtitle={subtitle} onBack={onBack} />}
      {cinemaMode && <CinemaTitle title={title} subtitle={subtitle} />}

      {!cinemaMode && <CenterCluster state={state} actions={actions} />}
      <SkipFeedback kind={state.showSkipFb} />

      <BottomBar state={state} actions={actions} progressStyle={progressStyle} />
    </div>
  );
}

function TopBar({ title, subtitle, onBack }) {
  return (
    <header style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      padding: '18px 24px',
      display: 'flex', alignItems: 'center', gap: 14,
      color: '#fff',
    }}>
      <button title="Tornar" onClick={onBack} style={topIconBtn}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6"/></svg>
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.15, textShadow: '0 2px 8px rgba(0,0,0,0.55)' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.78)', textShadow: '0 1px 4px rgba(0,0,0,0.6)', marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: PLAYER_RED.text }}><IconMP4 size={12} /></span>
      </div>
    </header>
  );
}

const topIconBtn = {
  width: 40, height: 40, borderRadius: 10,
  background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center',
  fontFamily: 'inherit', backdropFilter: 'blur(6px)',
};

function CinemaTitle({ title, subtitle }) {
  return (
    <div style={{
      position: 'absolute', top: 20, left: 24, color: '#fff', pointerEvents: 'none',
    }}>
      <div style={{
        fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
        textShadow: '0 2px 8px rgba(0,0,0,0.6)',
      }}>
        {title}
        {subtitle && <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}> · {subtitle}</span>}
      </div>
    </div>
  );
}

function CenterCluster({ state, actions }) {
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      display: 'flex', alignItems: 'center', gap: 50,
      color: '#fff',
    }}>
      <button title="Enrere 10s" onClick={() => actions.skip(-10)} style={centerSecondaryBtn}>
        <IconSkipBack size={32} stroke={1.4} />
      </button>
      <button title={state.isPlaying ? 'Pausa (espai)' : 'Reproduir (espai)'} onClick={actions.togglePlay} style={centerPlayBtn}>
        {state.isPlaying ? <IconPause size={36} /> : <IconPlay size={36} style={{ marginLeft: 4 }} />}
      </button>
      <button title="Endavant 10s" onClick={() => actions.skip(10)} style={centerSecondaryBtn}>
        <IconSkipFwd size={32} stroke={1.4} />
      </button>
    </div>
  );
}

const centerPlayBtn = {
  width: 84, height: 84, borderRadius: '50%',
  background: 'rgba(0,0,0,0.42)', border: '1px solid rgba(255,255,255,0.22)',
  color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center',
  fontFamily: 'inherit', backdropFilter: 'blur(8px)',
  transition: 'transform 0.12s, background 0.12s',
};

const centerSecondaryBtn = {
  width: 60, height: 60, borderRadius: '50%',
  background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
  color: 'rgba(255,255,255,0.92)', cursor: 'pointer', display: 'grid', placeItems: 'center',
  fontFamily: 'inherit', backdropFilter: 'blur(4px)',
};

function SkipFeedback({ kind }) {
  if (!kind) return null;
  const isFwd = kind === '+10';
  return (
    <div style={{
      position: 'absolute', top: '50%', transform: 'translateY(-50%)',
      [isFwd ? 'right' : 'left']: '22%',
      display: 'grid', placeItems: 'center',
      color: '#fff', pointerEvents: 'none',
      animation: 'pm-skipfb 0.6s ease-out',
    }}>
      <div style={{
        width: 92, height: 92, borderRadius: '50%',
        background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center',
        border: `1px solid ${PLAYER_RED.borderHot}`,
        boxShadow: `0 0 40px rgba(232,144,48,0.4)`,
      }}>
        {isFwd ? <IconSkipFwd size={36} stroke={1.6} /> : <IconSkipBack size={36} stroke={1.6} />}
      </div>
      <div style={{ position: 'absolute', bottom: -22, fontSize: 13, fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>
        {isFwd ? '+10 s' : '−10 s'}
      </div>
    </div>
  );
}

function BottomBar({ state, actions, progressStyle }) {
  const { quality, playbackRate } = state;
  return (
    <footer style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      padding: '0 24px 18px',
      color: '#fff',
    }}>
      <Scrubber state={state} actions={actions} progressStyle={progressStyle} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <button title={state.isPlaying ? 'Pausa' : 'Reproduir'} onClick={actions.togglePlay} style={bottomBtn}>
          {state.isPlaying ? <IconPause size={20} /> : <IconPlay size={20} style={{ marginLeft: 2 }} />}
        </button>
        <button title="Enrere 10s" onClick={() => actions.skip(-10)} style={bottomBtn}><IconSkipBack size={20} stroke={1.6} /></button>
        <button title="Endavant 10s" onClick={() => actions.skip(10)} style={bottomBtn}><IconSkipFwd size={20} stroke={1.6} /></button>
        <VolumeBlock state={state} actions={actions} />

        <TimeBlock state={state} />

        <div style={{ flex: 1 }} />

        <button title="Velocitat" onClick={() => actions.openSettings('speed')} style={textBtn}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600 }}>{playbackRate}×</span>
        </button>
        <button title="Qualitat" onClick={() => actions.openSettings('quality')} style={textBtn}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>
            {quality === 'auto' ? 'AUTO' : quality.toUpperCase()}
          </span>
        </button>
        <button title="Subtítols" onClick={() => actions.openSettings('subtitles')} style={{ ...bottomBtn, position: 'relative' }}>
          <IconCaptions size={20} />
          {state.subLang !== 'off' && (
            <span style={{
              position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
              width: 18, height: 2, background: PLAYER_RED.red, borderRadius: 2,
            }} />
          )}
        </button>
        <button title="Picture-in-Picture" onClick={actions.togglePiP} style={bottomBtn}><IconPip size={20} /></button>
        <button title="Bloquejar pantalla" onClick={actions.lock} style={bottomBtn}><IconLockBig size={20} /></button>
        <button title="Configuració" onClick={() => actions.openSettings('main')} style={bottomBtn}><IconSettings size={20} /></button>
        <button title="Pantalla completa" onClick={actions.toggleFullscreen} style={bottomBtn}><IconFull size={20} /></button>
      </div>
    </footer>
  );
}

const bottomBtn = {
  width: 40, height: 40, borderRadius: 10,
  background: 'transparent', border: 'none',
  color: 'rgba(255,255,255,0.92)', cursor: 'pointer',
  display: 'grid', placeItems: 'center', fontFamily: 'inherit',
  transition: 'background 0.12s',
};

const textBtn = {
  height: 32, padding: '0 10px', borderRadius: 8,
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
  color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
  display: 'inline-flex', alignItems: 'center', gap: 6,
};

function VolumeBlock({ state, actions }) {
  const [hover, setHover] = useState(false);
  const eff = state.muted ? 0 : state.volume;
  const Ico = state.muted || eff === 0 ? IconMute : eff < 0.33 ? IconVolLow : eff < 0.66 ? IconVolMid : IconVolHigh;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <button title={state.muted ? 'Activar so' : 'Silenciar'} onClick={actions.toggleMute} style={bottomBtn}>
        <Ico size={20} />
      </button>
      <div style={{
        width: hover ? 96 : 0, overflow: 'hidden',
        transition: 'width 0.2s', marginLeft: hover ? 6 : 0,
        display: 'flex', alignItems: 'center',
      }}>
        <input type="range" min={0} max={1} step={0.01}
          value={eff}
          onChange={(e) => actions.setVolume(parseFloat(e.target.value))}
          style={{ width: 90, accentColor: '#fff' }}
        />
      </div>
    </div>
  );
}

function TimeBlock({ state }) {
  return (
    <div style={{
      marginLeft: 6, fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12.5, color: 'rgba(255,255,255,0.88)', letterSpacing: '0.02em',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span>{fmtTime(state.currentTime)}</span>
      <span style={{ color: 'rgba(255,255,255,0.35)' }}>/</span>
      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{fmtTime(state.duration)}</span>
    </div>
  );
}

function Scrubber({ state, actions, progressStyle }) {
  const trackRef = useRef(null);
  const [hover, setHover] = useState(null);
  const [drag, setDrag] = useState(false);

  const dur = state.duration || 1;
  const played = state.currentTime / dur;
  const buffered = (state.buffered || 0) / dur;

  const ratioFromEvent = (e) => {
    const el = trackRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return clamp((e.clientX - r.left) / r.width, 0, 1);
  };

  const onDown = (e) => {
    setDrag(true);
    actions.seekTo(ratioFromEvent(e) * dur);
  };

  useEffect(() => {
    if (!drag) return;
    const onMove = (e) => actions.seekTo(ratioFromEvent(e) * dur);
    const onUp = () => setDrag(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [drag, dur, actions]);

  const onMove = (e) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ratio = clamp((e.clientX - r.left) / r.width, 0, 1);
    setHover({ ratio, x: e.clientX - r.left });
  };

  const trackHeight = progressStyle === 'thick' ? 8 : 4;
  const isSegmented = progressStyle === 'segmented';

  return (
    <div
      ref={trackRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
      onMouseDown={onDown}
      style={{
        position: 'relative', height: 22,
        display: 'flex', alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <div style={{
        position: 'relative', width: '100%', height: trackHeight,
        background: isSegmented ? 'transparent' : 'rgba(255,255,255,0.20)',
        borderRadius: trackHeight,
        overflow: 'hidden',
      }}>
        {isSegmented && <Segments />}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0,
          width: `${buffered * 100}%`,
          background: 'rgba(255,255,255,0.35)',
        }} />
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0,
          width: `${played * 100}%`,
          background: PLAYER_RED.red,
          boxShadow: `0 0 12px ${PLAYER_RED.red}aa`,
        }} />
      </div>

      <div style={{
        position: 'absolute', left: `calc(${played * 100}% - 8px)`,
        width: 16, height: 16, borderRadius: '50%',
        background: PLAYER_RED.red,
        border: '2px solid #fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        transform: drag || hover ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.15s',
        pointerEvents: 'none',
      }} />

      {hover && !drag && <HoverPreview x={hover.x} time={hover.ratio * dur} />}
    </div>
  );
}

function Segments() {
  const stops = [0, 0.22, 0.47, 0.71, 0.90, 1];
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 3 }}>
      {stops.slice(0, -1).map((s, i) => {
        const w = (stops[i + 1] - s) * 100;
        return <div key={i} style={{ width: `${w}%`, height: '100%', background: 'rgba(255,255,255,0.20)', borderRadius: 4 }} />;
      })}
    </div>
  );
}

function HoverPreview({ x, time }) {
  return (
    <div style={{
      position: 'absolute', bottom: 24, left: x, transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      pointerEvents: 'none', zIndex: 5,
    }}>
      <div style={{
        width: 160, height: 90, borderRadius: 8, overflow: 'hidden',
        border: `1px solid ${PLAYER_RED.border}`,
        boxShadow: '0 10px 28px rgba(0,0,0,0.6)',
        position: 'relative',
        background: `linear-gradient(135deg, hsl(${(time * 9) % 360}, 24%, 22%), hsl(${(time * 9 + 60) % 360}, 18%, 14%))`,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at ${30 + (time * 3) % 40}% ${40 + (time * 5) % 30}%, rgba(255,200,140,0.32), transparent 50%), radial-gradient(circle at ${70 + (time * 2) % 20}% ${60 + (time * 4) % 30}%, rgba(80,120,200,0.22), transparent 55%)`,
        }} />
      </div>
      <div style={{
        padding: '3px 8px', borderRadius: 4,
        background: 'rgba(0,0,0,0.85)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, fontWeight: 600, color: '#fff',
        letterSpacing: '0.02em',
      }}>{fmtTime(time)}</div>
    </div>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('__pm-player-styles')) {
  const s = document.createElement('style');
  s.id = '__pm-player-styles';
  s.textContent = `
    @keyframes pm-skipfb {
      from { opacity: 0; transform: translateY(-50%) scale(0.7); }
      35%  { opacity: 1; transform: translateY(-50%) scale(1.05); }
      to   { opacity: 0; transform: translateY(-50%) scale(1.1); }
    }
    @keyframes pm-lock-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%      { transform: scale(1.06); opacity: 0.85; }
    }
  `;
  document.head.appendChild(s);
}
