import { Fragment } from "react";
import {
  PLAYER_RED, QUALITIES, SPEEDS, SUBTITLE_LANGS, SUBTITLE_FONTS,
  SUBTITLE_COLORS, SUBTITLE_BGS, fmtTime,
} from "./playerConstants";
import {
  IconBolt, IconGlobe, IconCaptions, IconType, IconActivity,
} from "./playerIcons";
import { SubtitlePreview } from "./SubtitleOverlay";

export function SettingsSheet({ state, actions }) {
  const open = state.sheet === 'settings';
  return (
    <SheetFrame
      open={open}
      onClose={actions.closeSheet}
      title={titleFor(state.settingsView)}
      subtitle={subtitleFor(state.settingsView, state)}
      onBack={state.settingsView !== 'main' ? () => actions.goSettingsView('main') : null}
    >
      {state.settingsView === 'main' && <SettingsMain state={state} actions={actions} />}
      {state.settingsView === 'subtitles' && <SettingsSubtitles state={state} actions={actions} />}
      {state.settingsView === 'subtitleStyle' && <SettingsSubtitleStyle state={state} actions={actions} />}
      {state.settingsView === 'quality' && <SettingsQuality state={state} actions={actions} />}
      {state.settingsView === 'speed' && <SettingsSpeed state={state} actions={actions} />}
      {state.settingsView === 'stats' && <SettingsStats state={state} />}
    </SheetFrame>
  );
}

function titleFor(view) {
  return ({
    main: 'Configuració',
    subtitles: 'Subtítols',
    subtitleStyle: 'Estil dels subtítols',
    quality: 'Qualitat de vídeo',
    speed: 'Velocitat de reproducció',
    stats: 'Estadístiques',
  })[view];
}

function subtitleFor(view, s) {
  if (view === 'main') return 'Reproductor';
  if (view === 'subtitles') return 'Idioma i sincronia';
  if (view === 'subtitleStyle') return 'Tipografia, mida i fons';
  if (view === 'quality') return 'Connexió adaptativa HLS';
  if (view === 'speed') return `Actual: ${s.playbackRate}×`;
  if (view === 'stats') return 'En temps real';
  return '';
}

function SheetFrame({ open, onClose, title, subtitle, onBack, children }) {
  return (
    <Fragment>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, background: open ? 'rgba(0,0,0,0.35)' : 'transparent',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s', zIndex: 30,
        }}
      />
      <aside style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 420, maxWidth: '92%',
        background: 'linear-gradient(180deg, rgba(20,16,16,0.96), rgba(10,8,8,0.96))',
        borderLeft: `1px solid ${PLAYER_RED.border}`,
        boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(18px)',
        color: PLAYER_RED.text,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.32s cubic-bezier(.2,.85,.3,1)',
        zIndex: 31,
        display: 'flex', flexDirection: 'column',
      }}>
        <header style={{ padding: '20px 22px 16px', borderBottom: `1px solid ${PLAYER_RED.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            {onBack && (
              <button onClick={onBack} title="Tornar" style={iconBtnStyle({ size: 28 })}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6"/></svg>
              </button>
            )}
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', flex: 1 }}>{title}</h2>
            <button onClick={onClose} title="Tancar" style={iconBtnStyle({ size: 30 })}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <div style={{ fontSize: 12, color: PLAYER_RED.textMute, letterSpacing: '0.04em' }}>{subtitle}</div>
        </header>
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px 22px' }}>{children}</div>
      </aside>
    </Fragment>
  );
}

const iconBtnStyle = ({ size = 32 } = {}) => ({
  width: size, height: size, borderRadius: '50%',
  background: 'transparent', border: `1px solid ${PLAYER_RED.border}`,
  display: 'grid', placeItems: 'center',
  color: PLAYER_RED.text, cursor: 'pointer', fontFamily: 'inherit',
});

function SettingsRow({ icon: Ico, title, value, onClick, trailing }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, width: '100%',
      padding: '12px 12px', borderRadius: 12,
      background: 'transparent', border: `1px solid transparent`,
      color: PLAYER_RED.text, fontFamily: 'inherit', cursor: 'pointer',
      textAlign: 'left',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = PLAYER_RED.border; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
    >
      {Ico && (
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'grid', placeItems: 'center', color: PLAYER_RED.text }}>
          <Ico size={16} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{title}</div>
        {value && <div style={{ fontSize: 12, color: PLAYER_RED.textDim, marginTop: 2 }}>{value}</div>}
      </div>
      {trailing ?? <ChevronRight />}
    </button>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: PLAYER_RED.textMute }}>
      <path d="m9 6 6 6-6 6"/>
    </svg>
  );
}

function CheckMark() {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%',
      background: PLAYER_RED.red, display: 'grid', placeItems: 'center',
      boxShadow: `0 0 10px ${PLAYER_RED.red}55`,
    }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 6"/></svg>
    </div>
  );
}

function OptionRow({ title, sub, selected, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%',
      padding: '11px 12px', borderRadius: 12,
      background: selected ? 'rgba(232,144,48,0.10)' : 'transparent',
      border: `1px solid ${selected ? PLAYER_RED.borderHot : 'transparent'}`,
      color: PLAYER_RED.text, fontFamily: 'inherit', cursor: 'pointer',
      textAlign: 'left', transition: 'background 0.12s',
    }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: selected ? 600 : 500, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{title}</span>
          {badge && <span style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
            padding: '2px 6px', borderRadius: 4,
            background: `linear-gradient(135deg, ${PLAYER_RED.redHot}, ${PLAYER_RED.redDeep})`,
            color: '#fff',
          }}>{badge}</span>}
        </div>
        {sub && <div style={{ fontSize: 12, color: PLAYER_RED.textDim, marginTop: 2 }}>{sub}</div>}
      </div>
      {selected ? <CheckMark /> : <div style={{ width: 20, height: 20, borderRadius: '50%', border: `1.5px solid ${PLAYER_RED.borderMid}` }} />}
    </button>
  );
}

function SectionTitle({ children, hint }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '14px 6px 6px',
      fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
      color: PLAYER_RED.textMute, fontWeight: 600,
    }}>
      <span>{children}</span>
      {hint && <span style={{ fontSize: 11, letterSpacing: '0.04em', textTransform: 'none', color: PLAYER_RED.textDim, fontWeight: 500 }}>{hint}</span>}
    </div>
  );
}

function SettingsMain({ state, actions }) {
  const qLabel = QUALITIES.find((q) => q.id === state.quality)?.label ?? state.quality;
  const sLabel = SUBTITLE_LANGS.find((l) => l.id === state.subLang)?.label ?? '—';
  return (
    <Fragment>
      <SectionTitle>Reproducció</SectionTitle>
      <SettingsRow icon={IconBolt} title="Velocitat" value={`${state.playbackRate}×`} onClick={() => actions.goSettingsView('speed')} />
      <SettingsRow icon={IconGlobe} title="Qualitat" value={qLabel} onClick={() => actions.goSettingsView('quality')} trailing={<QualityPill q={state.quality} />} />
      <SectionTitle>Subtítols</SectionTitle>
      <SettingsRow icon={IconCaptions} title="Subtítols" value={sLabel} onClick={() => actions.goSettingsView('subtitles')} />
      <SettingsRow icon={IconType} title="Estil dels subtítols" value="Tipus, mida, color, fons" onClick={() => actions.goSettingsView('subtitleStyle')} />
      <SectionTitle>Diagnòstic</SectionTitle>
      <SettingsRow icon={IconActivity} title="Estadístiques de reproducció" value="Bitrate · buffer · frames" onClick={() => actions.goSettingsView('stats')} />
    </Fragment>
  );
}

function QualityPill({ q }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 5,
      color: PLAYER_RED.textDim,
      background: 'rgba(255,255,255,0.06)',
      border: `1px solid ${PLAYER_RED.border}`,
      marginRight: 8,
    }}>{q === 'auto' ? 'AUTO' : q.toUpperCase()}</span>
  );
}

function SettingsSubtitles({ state, actions }) {
  return (
    <Fragment>
      <SectionTitle hint={`Sincronia: ${state.subSyncMs >= 0 ? '+' : ''}${state.subSyncMs} ms`}>Idioma</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {SUBTITLE_LANGS.map((l) => (
          <OptionRow key={l.id} title={l.label}
            selected={state.subLang === l.id}
            onClick={() => actions.setSub('subLang', l.id)}
          />
        ))}
      </div>
      <SectionTitle>Sincronia</SectionTitle>
      <SyncSlider state={state} actions={actions} />
      <button onClick={() => actions.goSettingsView('subtitleStyle')} style={{
        marginTop: 14, padding: '12px 14px', width: '100%',
        background: 'transparent', border: `1px solid ${PLAYER_RED.borderMid}`,
        borderRadius: 12, color: PLAYER_RED.text, fontFamily: 'inherit',
        fontSize: 13, fontWeight: 500, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        Personalitzar l'estil <ChevronRight />
      </button>
    </Fragment>
  );
}

function SyncSlider({ state, actions }) {
  return (
    <div style={{ padding: '10px 6px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 12.5, color: PLAYER_RED.textDim }}>Avançar · Retardar</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: PLAYER_RED.text, fontFamily: "'JetBrains Mono', monospace" }}>
          {state.subSyncMs >= 0 ? '+' : ''}{state.subSyncMs} ms
        </span>
      </div>
      <input type="range" min={-3000} max={3000} step={100} value={state.subSyncMs}
        onChange={(e) => actions.setSub('subSyncMs', parseInt(e.target.value, 10))}
        style={{ width: '100%', accentColor: PLAYER_RED.red }}
      />
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        {[-500, -100, 0, 100, 500].map((d) => (
          <button key={d} onClick={() => actions.setSub('subSyncMs', d)} style={{
            flex: 1, padding: '7px 0', fontSize: 11.5,
            background: state.subSyncMs === d ? 'rgba(232,144,48,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${state.subSyncMs === d ? PLAYER_RED.borderHot : PLAYER_RED.border}`,
            borderRadius: 8, color: PLAYER_RED.text, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {d === 0 ? 'Reset' : `${d >= 0 ? '+' : ''}${d}ms`}
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingsSubtitleStyle({ state, actions }) {
  return (
    <Fragment>
      <SectionTitle>Vista prèvia</SectionTitle>
      <SubtitlePreview state={state} />

      <SectionTitle hint={`${state.subSize}px`}>Mida del text</SectionTitle>
      <div style={{ padding: '10px 6px 6px' }}>
        <input type="range" min={14} max={48} step={1} value={state.subSize}
          onChange={(e) => actions.setSub('subSize', parseInt(e.target.value, 10))}
          style={{ width: '100%', accentColor: PLAYER_RED.red }}
        />
      </div>

      <SectionTitle>Tipografia</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {SUBTITLE_FONTS.map((f) => (
          <button key={f.id} onClick={() => actions.setSub('subFont', f.id)} style={{
            padding: '12px 10px', borderRadius: 10,
            background: state.subFont === f.id ? 'rgba(232,144,48,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${state.subFont === f.id ? PLAYER_RED.borderHot : PLAYER_RED.border}`,
            color: PLAYER_RED.text, fontFamily: f.family, fontSize: 14, fontWeight: 500,
            cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: PLAYER_RED.textMute, marginBottom: 4, fontFamily: 'inherit' }}>{f.label}</div>
            <span style={{ fontFamily: f.family }}>Bon dia, món</span>
          </button>
        ))}
      </div>

      <SectionTitle>Color del text</SectionTitle>
      <div style={{ display: 'flex', gap: 8 }}>
        {SUBTITLE_COLORS.map((c) => (
          <button key={c.id} onClick={() => actions.setSub('subColor', c.id)} title={c.label} style={{
            width: 44, height: 44, borderRadius: '50%',
            background: c.color,
            border: `2px solid ${state.subColor === c.id ? PLAYER_RED.red : 'transparent'}`,
            boxShadow: `0 0 0 1px ${PLAYER_RED.border}, inset 0 0 0 2px rgba(0,0,0,0.15)`,
            cursor: 'pointer',
          }} />
        ))}
      </div>

      <SectionTitle>Fons</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {SUBTITLE_BGS.map((b) => (
          <button key={b.id} onClick={() => actions.setSub('subBg', b.id)} style={{
            padding: '10px 12px', borderRadius: 10,
            background: state.subBg === b.id ? 'rgba(232,144,48,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${state.subBg === b.id ? PLAYER_RED.borderHot : PLAYER_RED.border}`,
            color: PLAYER_RED.text, fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', textAlign: 'left',
          }}>{b.label}</button>
        ))}
      </div>

      <SectionTitle>Posició</SectionTitle>
      <div style={{ display: 'flex', gap: 6 }}>
        {[{ id: 'top', label: 'Dalt' }, { id: 'bottom', label: 'Baix' }].map((p) => (
          <button key={p.id} onClick={() => actions.setSub('subPosition', p.id)} style={{
            flex: 1, padding: '10px 12px', borderRadius: 10,
            background: state.subPosition === p.id ? 'rgba(232,144,48,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${state.subPosition === p.id ? PLAYER_RED.borderHot : PLAYER_RED.border}`,
            color: PLAYER_RED.text, fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>{p.label}</button>
        ))}
      </div>
    </Fragment>
  );
}

function SettingsQuality({ state, actions }) {
  return (
    <Fragment>
      <SectionTitle>Qualitat</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {QUALITIES.map((q) => (
          <OptionRow key={q.id} title={q.label} sub={q.sub} badge={q.badge}
            selected={state.quality === q.id}
            onClick={() => actions.setSub('quality', q.id)}
          />
        ))}
      </div>
    </Fragment>
  );
}

function SettingsSpeed({ state, actions }) {
  return (
    <Fragment>
      <SectionTitle hint={`${state.playbackRate}×`}>Velocitat</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '6px 0' }}>
        {SPEEDS.map((s) => (
          <button key={s} onClick={() => actions.setRate(s)} style={{
            padding: '14px 6px', borderRadius: 12,
            background: state.playbackRate === s ? 'rgba(232,144,48,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${state.playbackRate === s ? PLAYER_RED.borderHot : PLAYER_RED.border}`,
            color: state.playbackRate === s ? PLAYER_RED.text : PLAYER_RED.textDim,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 600,
            cursor: 'pointer',
            boxShadow: state.playbackRate === s ? `0 0 20px rgba(232,144,48,0.15)` : 'none',
          }}>
            {s}×
            {s === 1 && <div style={{ fontSize: 10, fontFamily: 'Outfit, sans-serif', color: PLAYER_RED.textMute, marginTop: 2, fontWeight: 500 }}>normal</div>}
          </button>
        ))}
      </div>
    </Fragment>
  );
}

function SettingsStats({ state }) {
  const buffer = state.buffered ? Math.max(0, state.buffered - state.currentTime).toFixed(1) : '0.0';
  return (
    <Fragment>
      <SectionTitle>Reproducció</SectionTitle>
      <StatRow k="Temps reproduït" v={fmtTime(state.currentTime)} />
      <StatRow k="Durada total" v={fmtTime(state.duration)} />
      <StatRow k="Velocitat" v={`${state.playbackRate}×`} />
      <SectionTitle>Xarxa</SectionTitle>
      <StatRow k="Buffer" v={`${buffer} s`} />
      <StatRow k="Qualitat" v={state.quality === 'auto' ? 'Auto (HLS)' : state.quality.toUpperCase()} />
    </Fragment>
  );
}

function StatRow({ k, v, mono }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 8px', borderBottom: `1px solid ${PLAYER_RED.border}`,
    }}>
      <span style={{ fontSize: 12.5, color: PLAYER_RED.textDim }}>{k}</span>
      <span style={{
        fontSize: 13, color: PLAYER_RED.text, fontWeight: 500,
        fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
      }}>{v}</span>
    </div>
  );
}
