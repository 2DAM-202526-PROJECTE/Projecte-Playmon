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

  const estil = {
    exit: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-red-200 bg-red-50 text-red-900",
    info: "border-slate-200 bg-white text-slate-900",
  }[tipus] ?? "border-slate-200 bg-white text-slate-900";

  const punt = {
    exit: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-slate-400",
  }[tipus] ?? "bg-slate-400";

  return (
    <div className={`pointer-events-auto rounded-2xl border p-4 shadow-lg ring-1 ring-black/5 ${estil}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${punt}`} />
        <div className="min-w-0 flex-1">
          {titol ? (
            <div className="text-sm font-semibold">{titol}</div>
          ) : null}
          {missatge ? (
            <div className="mt-1 text-sm opacity-90">{missatge}</div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-2 py-1 text-sm font-semibold opacity-70 hover:bg-black/5 hover:opacity-100"
          aria-label="Tancar notificació"
        >
          ✕
        </button>
      </div>
    </div>
  );
}