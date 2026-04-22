import React, { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ProveidorToast({ children }) {
  const [toasts, setToasts] = useState([]);

  const mostraToast = (toast) => {
    const id = crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
    const {
      tipus = "info", // "exit" | "error" | "info"
      titol = "",
      missatge = "",
      duracio = 3000,
    } = toast ?? {};

    const nou = { id, tipus, titol, missatge };
    setToasts((prev) => [...prev, nou]);

    if (duracio !== Infinity) {
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duracio);
    }
  };

  const tancaToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const value = useMemo(() => ({ mostraToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Contenidor de toasts */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex justify-center px-4"
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="flex w-full max-w-md flex-col gap-2">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onClose={() => tancaToast(t.id)} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast ha d’estar dins de <ProveidorToast />");
  return ctx;
}

function ToastItem({ toast, onClose }) {
  const { tipus, titol, missatge } = toast;

  const config = {
    exit: {
      border: 'rgba(52,211,153,0.25)',
      glow: 'rgba(52,211,153,0.08)',
      dot: '#34d399',
      dotGlow: 'rgba(52,211,153,0.4)',
      titleColor: '#6ee7b7',
      textColor: 'rgba(255,255,255,0.6)',
      accent: 'rgba(52,211,153,0.5)',
    },
    error: {
      border: 'rgba(248,113,113,0.25)',
      glow: 'rgba(248,113,113,0.08)',
      dot: '#f87171',
      dotGlow: 'rgba(248,113,113,0.4)',
      titleColor: '#fca5a5',
      textColor: 'rgba(255,255,255,0.6)',
      accent: 'rgba(248,113,113,0.5)',
    },
    info: {
      border: 'rgba(204,132,0,0.25)',
      glow: 'rgba(204,132,0,0.06)',
      dot: '#CC8400',
      dotGlow: 'rgba(204,132,0,0.4)',
      titleColor: '#fbbf24',
      textColor: 'rgba(255,255,255,0.6)',
      accent: 'rgba(204,132,0,0.5)',
    },
  }[tipus] ?? {
    border: 'rgba(255,255,255,0.12)',
    glow: 'rgba(255,255,255,0.03)',
    dot: '#9ca3af',
    dotGlow: 'rgba(156,163,175,0.3)',
    titleColor: 'rgba(255,255,255,0.9)',
    textColor: 'rgba(255,255,255,0.55)',
    accent: 'rgba(255,255,255,0.2)',
  };

  return (
    <div
      className="pointer-events-auto rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: 'rgba(10,10,10,0.92)',
        border: `1px solid ${config.border}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 20px ${config.glow}`,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Línia accent superior */}
      <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${config.accent}, transparent)` }} />

      <div className="flex items-start gap-3">
        {/* Dot amb glow */}
        <div className="mt-1 relative flex-shrink-0">
          <span className="block h-2.5 w-2.5 rounded-full" style={{ background: config.dot, boxShadow: `0 0 8px ${config.dotGlow}` }} />
        </div>

        <div className="min-w-0 flex-1">
          {titol ? (
            <div className="text-sm font-bold" style={{ color: config.titleColor }}>{titol}</div>
          ) : null}
          {missatge ? (
            <div className="mt-0.5 text-xs leading-relaxed" style={{ color: config.textColor }}>{missatge}</div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="grid h-6 w-6 place-items-center rounded-full text-xs transition-all"
          style={{ color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = ''; }}
          aria-label="Tancar notificació"
        >
          ✕
        </button>
      </div>
    </div>
  );
}