import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/LogoProducteLandingPageTransparent.png'
import {
    HiHome,
    HiMagnifyingGlass,
    HiPlayCircle,
    HiStar,
    HiTv,
} from "react-icons/hi2";
import { HiPlus, HiDotsVertical } from "react-icons/hi"
import HeaderItem from './HeaderItem'
import SearchOverlay from '@/features/search/SearchOverlay'
import ProfileDropdown from './ProfileDropdown';
function Header() {
    const [toggle, setToggle] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const isDetailPage = location.pathname.startsWith('/movie') || location.pathname.startsWith('/tv')

    const menu = [
        {
            name: "HOME",
            icon: HiHome,
            path: "/"
        },
        {
            name: "BUSCAR",
            icon: HiMagnifyingGlass,
            action: () => setIsSearchOpen(true)
        },
        {
            name: "PLAYMON ORIGINALS",
            icon: HiStar,
            path: "/originals"
        },
        {
            name: "PELICULES",
            icon: HiPlayCircle,
            path: "/pelicules"
        },
        {
            name: "SERIES",
            icon: HiTv,
            path: "/series"
        }
    ]

    const checkActive = (item) => {
        if (isSearchOpen && item.action) return true
        if (!item.path) return false
        if (item.path === '/') return location.pathname === '/'
        return location.pathname.startsWith(item.path)
    }

    return (
        <div className={`h-[80px] w-full z-50 flex items-center justify-between px-6 transition-all duration-500
            ${isDetailPage
                ? 'absolute top-0 bg-gradient-to-b from-black/90 via-black/40 to-transparent'
                : 'sticky top-0 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.6)]'
            }`}
        >
            {/* Logo */}
            <img
                src={logo}
                className="h-[60px] md:h-[75px] w-auto object-contain z-10 cursor-pointer drop-shadow-lg"
                onClick={() => navigate('/')}
                alt="Logo"
            />

            {/* Desktop Nav */}
            <div className='hidden md:flex gap-1 xl:gap-2 ml-8 flex-1'>
                {menu.map((item, index) => (
                    <HeaderItem key={index} name={item.name} Icon={item.icon} isActive={checkActive(item)} isDetailPage={isDetailPage} onClick={() => {
                        if (item.action) item.action()
                        else if (item.path) navigate(item.path)
                    }} />
                ))}
            </div>

            {/* Mobile Nav */}
            <div className='flex md:hidden gap-4 items-center flex-1 justify-end mr-4'>
                <div className='flex gap-4'>
                    {menu.map((item, index) => index < 3 && (
                        <HeaderItem key={index} name={''} Icon={item.icon} isActive={checkActive(item)} isDetailPage={isDetailPage} onClick={() => {
                            if (item.action) item.action()
                            else if (item.path) navigate(item.path)
                        }} />
                    ))}
                    <div className='md:hidden relative' onClick={() => setToggle(!toggle)}>
                        <HeaderItem name={''} Icon={HiDotsVertical} isActive={toggle} isDetailPage={isDetailPage} />
                        {toggle ? <div className='absolute right-0 top-12 mt-3 bg-[#191e25] rounded-xl shadow-2xl
                        border border-white/10 p-2 z-50 flex flex-col min-w-[200px]'>
                            {menu.map((item, index) => index > 2 && (
                                <HeaderItem key={index} name={item.name} Icon={item.icon} isActive={checkActive(item)} isDetailPage={isDetailPage} onClick={() => {
                                    if (item.action) item.action()
                                    else if (item.path) navigate(item.path)
                                }} />
                            ))}
                        </div> : null}
                    </div>
                </div>
            </div>

            {/* Perfil amb desplegable */}
            <div className="flex justify-end">
                <ProfileDropdown />
            </div>

            {/* Modal Superposada del Cercador Universal */}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    )
}

export default Header
