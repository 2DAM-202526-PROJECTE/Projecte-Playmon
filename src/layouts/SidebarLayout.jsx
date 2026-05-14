import { Outlet } from 'react-router-dom'
import HeaderCompte from '@/components/HeaderCompte'
import logo from '@/assets/LogoProducteLandingPageTransparent.png'

export default function SidebarLayout({
    sidebar,
    outletContext,
    background = '#080808',
    decorativeElements = null,
    maxWidth = '1200px',
    stickyAside = false,
    error = null,
}) {
    return (
        <div className="min-h-screen relative overflow-x-hidden" style={{ background }}>
            {decorativeElements}

            <div className="relative z-10">
                <HeaderCompte logoSrc={logo} appName="Playmon" mostrarMenu={false} />
                <div
                    className="mx-auto grid grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[280px_1fr]"
                    style={{ maxWidth }}
                >
                    <aside className={stickyAside ? 'sticky top-24 h-fit' : undefined}>
                        {sidebar}
                    </aside>
                    <main className="flex min-w-0 flex-col gap-8">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-200 p-4 rounded-2xl text-sm">
                                {error}
                            </div>
                        )}
                        <Outlet context={outletContext} />
                    </main>
                </div>
            </div>
        </div>
    )
}
