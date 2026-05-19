import { useState } from "react";
import { PLAYER_RED } from "./playerConstants";
import { IconLockBig } from "./playerIcons";

export function LockOverlay({ actions }) {
  const [hint, setHint] = useState(false);
  return (
    <div
      onClick={() => setHint(true)}
      style={{
        position: 'absolute', inset: 0, zIndex: 25,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)',
        display: 'grid', placeItems: 'center',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
          border: `1px solid ${PLAYER_RED.borderHot}`,
          display: 'grid', placeItems: 'center',
          color: '#fff',
          animation: hint ? 'pm-lock-pulse 0.5s ease-in-out' : 'none',
          boxShadow: `0 0 40px rgba(232,144,48,0.25)`,
        }}>
          <IconLockBig size={32} stroke={1.5} />
        </div>
        <div style={{ color: '#fff', fontSize: 15, fontWeight: 600, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
          Pantalla bloquejada
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12.5, maxWidth: 280 }}>
          {hint ? 'Mantén premut el botó per desbloquejar' : 'Toca la pantalla per veure les opcions'}
        </div>
        {hint && (
          <button
            onPointerDown={() => {
              const t = setTimeout(actions.unlock, 800);
              const cancel = () => { clearTimeout(t); window.removeEventListener('pointerup', cancel); };
              window.addEventListener('pointerup', cancel);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: 6, padding: '10px 22px', borderRadius: 999,
              background: 'rgba(232,144,48,0.18)',
              border: `1px solid ${PLAYER_RED.borderHot}`,
              color: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            <IconLockBig size={14} />
            Mantén premut per desbloquejar
          </button>
        )}
      </div>
    </div>
  );
}
