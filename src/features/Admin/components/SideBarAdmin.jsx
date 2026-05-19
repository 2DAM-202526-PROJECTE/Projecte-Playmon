import { NavLink } from "react-router-dom";
import { HiUsers, HiRectangleGroup, HiBell, HiChartBar } from "react-icons/hi2";

const adminItems = [
  {
    to: "/dashboard/stats",
    label: "Estadístiques",
    Icon: HiChartBar,
  },
  {
    to: "/dashboard/users",
    label: "Usuaris",
    Icon: HiUsers,
  },
  {
    to: "/dashboard/multimedia",
    label: "Multimèdia",
    Icon: HiRectangleGroup,
  },
  // {
  //   to: "/dashboard/notificacions",
  //   label: "Notificacions",
  //   Icon: HiBell,
  // },
];

export default function SideBarAdmin() {
  return (
    <aside className="self-start">
      <div className="mb-4 pl-4 text-[11px] font-bold uppercase tracking-wider text-[#CC8400]">
        Panell d'Administració
      </div>

      <nav className="rounded-2xl bg-white/5 border border-white/10 p-2 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-1">
          {adminItems.map(({ to, label, Icon }) => (
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
            >
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      "grid h-9 w-9 place-items-center rounded-lg transition-colors",
                      isActive ? "bg-[#CC8400]/20 text-[#CC8400]" : "bg-white/5 text-white/40 group-hover:text-white/80 group-hover:bg-white/10",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
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
      
      <div className="mt-6">
          <NavLink
            to="/compte/inici"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-xs font-semibold text-white/40 hover:text-white transition-colors"
          >
            ← Tornar al compte
          </NavLink>
      </div>
    </aside>
  );
}
