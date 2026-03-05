export default function ProgresSubscripcio({ steps, currentIndex }) {
  const progress = Math.round(((currentIndex + 1) / steps.length) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Pas {currentIndex + 1} de {steps.length}
        </span>
        <span>{progress}%</span>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {steps.map((s, idx) => {
          const isActive = idx === currentIndex;
          const isDone = idx < currentIndex;

          return (
            <span
              key={s.id}
              className={[
                "rounded-full px-3 py-1 text-xs font-medium",
                isActive
                  ? "bg-blue-600 text-white"
                  : isDone
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600",
              ].join(" ")}
            >
              {s.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
