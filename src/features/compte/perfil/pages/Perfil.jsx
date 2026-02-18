import { useState } from "react";
import SideBarCompte from "../components/SideBarCompte";
import PerfilCard from "../components/PerfilCard";
import defaultAvatar from '@/assets/aura.png';
import CameraIcon from '@/assets/camera_icon.svg';
import './Perfil.css'
import '/src/index.css'

export default function Perfil() {
  const [activeSection, setActiveSection] = useState("inici");

  // Placeholder per a l'usuari, despres canvia amb l'integracio de l'api
  const user = {
    name: "Eloi",
    email: "eloicortiella@iesebre.com",
    avatar: defaultAvatar,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-5 py-7 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <SideBarCompte active={activeSection} onSelect={setActiveSection} />

        {/* Contingut */}
        <main className="flex flex-col gap-5">
          {/* Header (títol + search) */}
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Gestionar compte
            </h1>

            <div className="flex w-full items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5 sm:max-w-[520px]">
              <span className="select-none text-slate-500">⌕</span>
              <input
                type="search"
                placeholder="Cerca al Compte"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </header>

          <PerfilCard
            user={user}
            cameraIcon={CameraIcon}
            onEditProfile={() => console.log("Editar perfil")}
            onChangePhoto={() => console.log("Canviar foto")}
            onManagePlan={() => console.log("Gestionar pla")}
          />
        </main>
      </div>
    </div>
  );
}
