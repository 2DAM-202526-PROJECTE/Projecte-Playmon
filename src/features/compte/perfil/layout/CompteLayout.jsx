import { Outlet } from "react-router-dom";
import SideBarCompte from "@/features/compte/perfil/components/SideBarCompte";
import HeaderCompte from "@/components/HeaderCompte";
import logo from "@/assets/LogoProducteLandingPageTransparent.png";

export default function CompteLayout() {
    return (
        <div className="min-h-screen bg-black">
            <HeaderCompte logoSrc={logo} appName="Playmon" />
            <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-5 py-7 lg:grid-cols-[280px_1fr]">
                <aside>
                    <SideBarCompte />
                </aside>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}