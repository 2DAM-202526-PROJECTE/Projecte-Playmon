import React, { useState } from 'react'
import logo from '../assets/LogoProducteLandingPageTransparent.png'
import {
    HiHome,
    HiMagnifyingGlass,
    HiPlayCircle,
    HiStar,
    HiTv
} from "react-icons/hi2";
import { HiPlus, HiDotsVertical } from "react-icons/hi"
import HeaderItem from './HeaderItem'
import perfilDefecte from '../assets/perfilDefecte.png'

function Header() {
    const [toggle, setToggle] = useState(false)
    const menu = [
        {
            name: "HOME",
            icon: HiHome,
        },
        {
            name: "BUSCAR",
            icon: HiMagnifyingGlass,
        },
        {
            name: "ORIGINALS",
            icon: HiStar,
        },
        {
            name: "PELICULES",
            icon: HiPlayCircle,
        },
        {
            name: "SERIES",
            icon: HiTv,
        }
    ]
    return (
        <div className='relative flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black to-transparent'>
            {/* Logo */}
            <img src={logo} className="w-[80px] md:w-[100px] object-contain z-10" />

            {/* Desktop Nav — centrat absolut */}
            <div className='hidden md:flex gap-6 absolute left-1/2 -translate-x-1/2 items-center'>
                {menu.map((item, index) => (
                    <HeaderItem key={index} name={item.name} Icon={item.icon} />
                ))}
            </div>

            {/* Mobile Nav */}
            <div className='flex md:hidden gap-6 items-center'>
                <div className='flex md:hidden gap-8'>
                    {menu.map((item, index) => index < 3 && (
                        <HeaderItem key={index} name={''} Icon={item.icon} />
                    ))}
                    <div className='md:hidden' onClick={() => setToggle(!toggle)}>
                        <HeaderItem name={''} Icon={HiDotsVertical} />
                        {toggle ? <div className='absolute mt-3 bg-[#1A1A1A]
                        border-[1px] border-[#CC8400] p-3 px-5 py-4 z-50'>
                            {menu.map((item, index) => index > 2 && (
                                <HeaderItem key={index} name={item.name} Icon={item.icon} />
                            ))}
                        </div> : null}
                    </div>
                </div>
            </div>
            <img src={perfilDefecte} className="w-[40px] rounded-full" />
        </div>
    )
}

export default Header