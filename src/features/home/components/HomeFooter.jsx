import React from 'react'
import logo from '@/assets/LogoProducteLandingPageTransparent.png'

function HomeFooter() {
    return (
        <footer className='relative mt-8 w-full overflow-hidden'>

            {/* Línia separadora amb gradient taronja */}
            <div className='h-px w-full bg-gradient-to-r from-transparent via-[#CC8400]/50 to-transparent' />

            {/* Fons */}
            <div className='bg-gradient-to-b from-black/60 to-[#0a0a0a] px-6 py-6
                            flex flex-col items-center gap-3'>

                {/* Logo + tagline centrats */}
                <img
                    src={logo}
                    alt='PlayMón'
                    className='w-[70px] object-contain opacity-80 hover:opacity-100 transition-opacity duration-300'
                />
                <p className='text-white/30 text-[11px] tracking-[0.25em] uppercase'>
                    Streaming · Cinema · Sèries
                </p>

                {/* Línia + copyright */}
                <div className='flex flex-col items-center gap-2 mt-1'>
                    <div className='h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent' />
                    <span className='text-white/20 text-[11px] tracking-widest'>
                        © {new Date().getFullYear()} PlayMón · Tots els drets reservats
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default HomeFooter
