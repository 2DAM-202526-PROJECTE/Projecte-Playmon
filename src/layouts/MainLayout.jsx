import Header from '@/components/Header'
import HomeFooter from '@/features/home/components/HomeFooter'

export default function MainLayout({ children }) {
    return (
        <div className='min-h-screen' style={{ background: '#0a0a0a' }}>
            <Header />
            {children}
            <HomeFooter />
        </div>
    )
}
