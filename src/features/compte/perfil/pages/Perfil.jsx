// import { Outlet } from "react-router-dom";
// import SideBarCompte from "@/features/compte/perfil/components/SideBarCompte";
// import "./styles/Perfil.css";
// import "/src/index.css";

// export default function Perfil() {
//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-5 py-7 lg:grid-cols-[280px_1fr]">
//         {/* Sidebar */}
//         <aside className="lg:sticky lg:top-4 lg:self-start">
//           <SideBarCompte />
//         </aside>

//         {/* Contingut */}
//         <main className="flex min-w-0 flex-col gap-5">
//           {/* Header (títol + search) */}
//           <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
//               Gestionar compte
//             </h1>

//             <div className="flex w-full items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5 sm:max-w-[520px]">
//               <span className="select-none text-slate-500">⌕</span>
//               <input
//                 type="search"
//                 placeholder="Cerca al Compte"
//                 className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
//               />
//             </div>
//           </header>

//           {/* Secció renderitzada per rutes */}
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }
