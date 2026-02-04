// src/components/Sidebar/SideBarCompte.jsx
export default function SideBarCompte({ active = "inici", onSelect }) {
  const items = [
    { id: "inici", label: "Inici", icon: HomeIcon, color: "bg-blue-100 text-blue-600" },
    { id: "info", label: "Informació personal", icon: UserIcon, color: "bg-green-100 text-green-700" },
    { id: "seguretat", label: "Seguretat i inici de sessió", icon: LockIcon, color: "bg-sky-100 text-sky-700" },
    { id: "contrasenya", label: "Contrasenya", icon: KeyIcon, color: "bg-indigo-100 text-indigo-700" },
    { id: "connexions", label: "Connexions de tercers", icon: LinkIcon, color: "bg-cyan-100 text-cyan-700" },
    { id: "privadesa", label: "Dades i privadesa", icon: ShieldIcon, color: "bg-purple-100 text-purple-700" },
    { id: "pagaments", label: "Pagaments i subscripcions", icon: CardIcon, color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <aside className="sticky top-4 self-start">
      <div className="mb-3 pl-2 text-sm font-semibold text-slate-800">Playmon Compte</div>

      <nav className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5">
        <div className="flex flex-col gap-1">
          {items.map((it) => {
            const isActive = active === it.id;
            const Icon = it.icon;

            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onSelect?.(it.id)}
                className={[
                  "group flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-sm transition",
                  isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid h-9 w-9 place-items-center rounded-full",
                    isActive ? "bg-blue-100 text-blue-700" : it.color,
                  ].join(" ")}
                >
                  <Icon />
                </span>

                <span className={isActive ? "font-semibold" : "font-medium"}>
                  {it.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

/* Iconos en format SVG */
function HomeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 21a8 8 0 0 1 16 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6.5 11h11A1.5 1.5 0 0 1 19 12.5v7A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5v-7A1.5 1.5 0 0 1 6.5 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 8a5 5 0 1 1-9.6 2H3v4h3v3h3v-3h3.4A5 5 0 0 1 21 8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 20 6v7c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
