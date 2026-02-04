// src/pages/Perfil.jsx
import { useState } from "react";
import SideBarCompte from "../../components/Sidebar/SideBarCompte";
import defaultAvatar from "../../assets/aura.png";

export default function Perfil() {
  const [activeSection, setActiveSection] = useState("inici");

  // Placeholder per a l'usuari, despres canvia amb l'integracio de l'api
  const user = {
    name: "Nom d'usuari",
    email: "Correu electrònic",
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
                placeholder="Cerca al Compte de Google"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </header>

          {/* Card perfil */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[180px_1fr]">
              <div className="flex justify-center md:justify-start">
                <div className="relative h-40 w-40 overflow-hidden rounded-full bg-slate-200">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Foto de perfil"
                      className="h-full w-full object-cover"
                    />
                  ) : null}

                  <button
                    type="button"
                    title="Canviar foto"
                    className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white shadow-md ring-1 ring-black/10 hover:bg-slate-50"
                  >
                    📷
                  </button>
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="text-xl font-semibold text-slate-900">{user.name}</div>
                <div className="mt-1 text-sm text-slate-500">{user.email}</div>

                <button
                  type="button"
                  className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:brightness-95"
                >
                  Editar perfil
                </button>
              </div>
            </div>
          </section>

          {/* Placeholder secció */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="text-sm font-semibold text-slate-900">
              Secció seleccionada:{" "}
              <span className="font-mono text-slate-600">{activeSection}</span>
            </div>
            {/* <p className="mt-2 text-sm text-slate-600">
              Aqui es pot renderitzar el component de la secció (Informació personal,
              Seguretat, Pagaments, etc.).
            </p> */}
          </section>
        </main>
      </div>
    </div>
  );
}
