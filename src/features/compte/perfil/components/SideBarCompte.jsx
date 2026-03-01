import { NavLink } from "react-router-dom";

const items = [
  {
    to: "/compte/inici",
    label: "Inici",
    Icon: HomeIcon,
    color: "bg-blue-100 text-blue-700",
  },
  {
    to: "/compte/informacio-personal",
    label: "Informació personal",
    Icon: UserIcon,
    color: "bg-green-100 text-green-700",
  },
  {
    to: "/compte/seguretat",
    label: "Seguretat i inici de sessió",
    Icon: LockIcon,
    color: "bg-sky-100 text-sky-700",
  },
  {
    to: "/compte/contrasenya",
    label: "Contrasenya",
    Icon: KeyIcon,
    color: "bg-indigo-100 text-indigo-700",
  },
  // {
  //   to: "/compte/connexions",
  //   label: "Connexions de tercers",
  //   Icon: LinkIcon,
  //   color: "bg-cyan-100 text-cyan-700",
  // },
  // {
  //   to: "/compte/privadesa",
  //   label: "Dades i privadesa",
  //   Icon: ShieldIcon,
  //   color: "bg-purple-100 text-purple-700",
  // },
  {
    to: "/compte/pagaments",
    label: "Pagaments i subscripcions",
    Icon: CardIcon,
    color: "bg-orange-100 text-orange-700",
  },
];

export default function SideBarCompte() {
  return (
    <aside className="self-start">
      <div className="mb-3 pl-2 text-sm font-semibold text-white-800">
        Playmon Compte
      </div>

      <nav className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5">
        <div className="flex flex-col gap-1">
          {items.map(({ to, label, Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "group flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-sm transition",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50",
                ].join(" ")
              }
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      "grid h-9 w-9 place-items-center rounded-full",
                      isActive ? "bg-blue-100 text-blue-700" : color,
                    ].join(" ")}
                  >
                    <Icon />
                  </span>

                  <span className={isActive ? "font-semibold" : "font-medium"}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}

/* ICONES SVG */
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 2l-2 2m0 0 3 3-2 2-3-3m2-2-7 7" />
      <circle cx="7" cy="17" r="3" />
      <path d="M10 17h4l2-2" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 4" />
      <path d="M14 11a5 5 0 0 0-7.07 0L5.52 12.41a5 5 0 1 0 7.07 7.07L14 20" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
