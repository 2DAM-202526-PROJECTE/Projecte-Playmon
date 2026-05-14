import SidebarLayout from '@/layouts/SidebarLayout'
import SideBarCompte from '@/features/compte/perfil/components/SideBarCompte'

const decorativeElements = (
    <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(204,132,0,0.07) 0%, transparent 65%)' }} />
        <div className="absolute bottom-1/3 -left-40 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,184,0,0.04) 0%, transparent 70%)' }} />
        <div className="absolute top-0 left-1/2 w-[400px] h-[400px] rounded-full -translate-x-1/2"
            style={{ background: 'radial-gradient(circle, rgba(204,132,0,0.04) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.012]"
            style={{ backgroundImage: 'linear-gradient(rgba(204,132,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(204,132,0,0.8) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
    </div>
)

export default function CompteLayout() {
    return (
        <SidebarLayout
            sidebar={<SideBarCompte />}
            background="#080808"
            decorativeElements={decorativeElements}
            maxWidth="1200px"
        />
    )
}
