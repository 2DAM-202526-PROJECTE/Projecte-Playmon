import React, { useState } from 'react'
import { HiPlus, HiCheck } from 'react-icons/hi'
import { HiHandThumbUp, HiHandThumbDown, HiShare } from 'react-icons/hi2'

function ActionButtons() {
    const [inList, setInList] = useState(false)
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)

    const handleLike = () => {
        setLiked(!liked)
        if (disliked) setDisliked(false)
    }

    const handleDislike = () => {
        setDisliked(!disliked)
        if (liked) setLiked(false)
    }

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
        } catch {
            // Fallback
        }
    }

    const btnBase = `flex items-center justify-center w-11 h-11 rounded-full
                     border border-white/30 transition-all duration-300
                     hover:border-[#CC8400] hover:scale-110 group`

    return (
        <div className='flex items-center gap-3'>
            {/* Afegir a la meva llista */}
            <button
                onClick={() => setInList(!inList)}
                className={`${btnBase} ${inList ? 'bg-[#CC8400] border-[#CC8400]' : 'bg-white/10 hover:bg-white/20'}`}
                title={inList ? 'Treure de la llista' : 'Afegir a la meva llista'}
            >
                {inList
                    ? <HiCheck className='text-white text-lg' />
                    : <HiPlus className='text-white text-lg' />
                }
            </button>

            {/* Like */}
            <button
                onClick={handleLike}
                className={`${btnBase} ${liked ? 'bg-[#CC8400] border-[#CC8400]' : 'bg-white/10 hover:bg-white/20'}`}
                title={"M'agrada"}
            >
                <HiHandThumbUp className='text-white text-lg' />
            </button>

            {/* Dislike */}
            <button
                onClick={handleDislike}
                className={`${btnBase} ${disliked ? 'bg-red-600 border-red-600' : 'bg-white/10 hover:bg-white/20'}`}
                title={"No m'agrada"}
            >
                <HiHandThumbDown className='text-white text-lg' />
            </button>

            {/* Compartir */}
            <button
                onClick={handleShare}
                className={`${btnBase} bg-white/10 hover:bg-white/20`}
                title='Compartir'
            >
                <HiShare className='text-white text-lg' />
            </button>
        </div>
    )
}

export default ActionButtons
