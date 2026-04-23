import { NavLink, useNavigate } from "react-router-dom";
import { HiShieldCheck as ShieldIcon } from "react-icons/hi2";
import { logout } from "@/api/authApi";

const items = [
  {
    to: "/compte/inici",
    label: "Inici",
    Icon: HomeIcon,
  },
  {
    to: "/compte/informacio-personal",
    label: "Informació personal",
    Icon: UserIcon,
  },
  {
    to: "/compte/llista",
    label: "Veure més tard",
    Icon: BookmarkIcon,
  },
  {
    to: "/compte/favorits",
    label: "Favorits",
    Icon: StarIcon,
  },
  {
    to: "/compte/historial",
    label: "Historial de visualització",
    Icon: HistoryIcon,
  },
  {
    to: "/compte/seguretat",
    label: "Seguretat i inici de sessió",
    Icon: LockIcon,
  },
  {
    to: "/compte/contrasenya",
    label: "Contrasenya",
    Icon: KeyIcon,
  },
  {
    to: "/compte/pagaments",
    label: "Pagaments i subscripcions",
    Icon: CardIcon,
  },
  {
    to: "/dashboard/users",
    label: "Dashboard Admin",
    Icon: ShieldIcon,
  },
];

export default function SideBarCompte() {
  const navigate = useNavigate();

  const tancarSessio = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="self-start">
      <div className="mb-4 pl-4 text-[11px] font-bold uppercase tracking-wider text-white/40">
        Configuració Playmon
      </div>

      <nav className="rounded-2xl bg-white/5 border border-white/10 p-2 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-1">
          {items.map(({ to, label, Icon }) => {
            // Check for admin role if it's the dashboard link
            if (label === "Dashboard Admin") {
                const user = JSON.parse(localStorage.getItem('authUser') || '{}');
                if (user.role !== 'admin') return null;
            }
            return (
              <NavLink
                key={to}
                to={to}
              className={({ isActive }) =>
                [
                  "group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm transition-all duration-300",
                  isActive
                    ? "bg-[#CC8400]/10 text-[#CC8400] border-l-[3px] border-[#CC8400]"
                    : "text-white/60 hover:text-white hover:bg-white/5",
                ].join(" ")
              }
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      "grid h-9 w-9 place-items-center rounded-lg transition-colors",
                      isActive ? "bg-[#CC8400]/20 text-[#CC8400]" : "bg-white/5 text-white/40 group-hover:text-white/80 group-hover:bg-white/10",
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
          )})}

          {/* Separador */}
          <div className="my-1 h-px bg-white/10" />

          {/* Tancar sessió */}
          <button
            type="button"
            onClick={tancarSessio}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm text-white/60 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white/40 transition-colors group-hover:bg-red-500/20 group-hover:text-red-400">
              <LogoutIcon />
            </span>
            <span className="font-medium">Tancar sessió</span>
          </button>
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
function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}
