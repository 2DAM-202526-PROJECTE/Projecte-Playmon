import { HiStar } from 'react-icons/hi2'

export default function CatalegHero({ icon: Icon, badge, title, subtitle }) {
    return (
        <section className='relative px-6 md:px-12 pt-2 pb-8 overflow-hidden'>
            <div
                className='absolute top-0 left-1/4 w-[500px] h-[220px] rounded-full opacity-[0.10] blur-3xl pointer-events-none'
                style={{ background: 'radial-gradient(ellipse, #CC8400 0%, transparent 70%)' }}
            />
            <div className='relative max-w-3xl'>
                <div
                    className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5'
                    style={{ background: 'rgba(204,132,0,0.08)', borderColor: 'rgba(204,132,0,0.3)' }}
                >
                    <Icon className='text-xs' style={{ color: '#CC8400' }} />
                    <span className='text-[11px] font-black tracking-[0.18em] uppercase' style={{ color: '#CC8400' }}>
                        {badge}
                    </span>
                    <HiStar className='text-xs' style={{ color: '#CC8400' }} />
                </div>

                <h1 className='text-4xl md:text-5xl font-black tracking-tight leading-none mb-4'>
                    <span className='text-white'>PLAYMON</span><br />
                    <span style={{
                        background: 'linear-gradient(135deg, #FFB800 0%, #CC8400 40%, #E09400 70%, #FFB800 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        {title}
                    </span>
                </h1>

                <p className='text-white/45 text-sm max-w-lg leading-relaxed'>{subtitle}</p>
            </div>
        </section>
    )
}
