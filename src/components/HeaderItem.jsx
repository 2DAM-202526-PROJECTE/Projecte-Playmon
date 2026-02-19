import React from 'react'

function HeaderItem({ name, Icon }) {
    return (
        <div className="text-[#CC8400] hover:text-white flex items-center gap-3
            text-[18px] font-bold cursor-pointer hover:underline underline-offset-8
            mb-2 transition-colors duration-200">
            <Icon />
            <h2 className='hidden md:block'>{name}</h2>
        </div>
    )
}

export default HeaderItem