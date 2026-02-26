import { Outlet } from "react-router-dom";
import SideBarCompte from "@/features/compte/perfil/components/SideBarCompte";

export default function CompteLayout() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-5 py-7 lg:grid-cols-[280px_1fr]">
                <aside>
                    <SideBarCompte />
                </aside>
                <main>  {/*className="bg-white rounded-lg shadow-sm p-4"*/}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}