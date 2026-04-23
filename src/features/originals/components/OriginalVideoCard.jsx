import React, { useState } from 'react'
import { HiPlay, HiPencil, HiTrash, HiFilm, HiUser, HiHeart, HiEye, HiShare, HiBookmark } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '@/api/authApi'

function formatDate(isoString) {
    const d = new Date(isoString)
    return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function OriginalVideoCard({ video, isOwn, onEdit, onDelete, onLike, onView, onOpenCreator, isSaved, onToggleSave }) {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [likeAnim, setLikeAnim] = useState(false)
    const [saveAnim, setSaveAnim] = useState(false)
    const [copied, setCopied] = useState(false)

    const currentUser = getCurrentUser()
    const navigate = useNavigate()
    const likes = video.likes ?? []
    const views = video.views ?? 0
    const isLiked = currentUser ? likes.includes(String(currentUser.id)) : false

    const handleLike = (e) => {
        e.stopPropagation()
        setLikeAnim(true)
        setTimeout(() => setLikeAnim(false), 300)
        onLike?.(video.id)
    }

    const handleSave = (e) => {
        e.stopPropagation()
        setSaveAnim(true)
        setTimeout(() => setSaveAnim(false), 300)
        onToggleSave?.(video.id)
    }

    const handlePlayClick = (e) => {
        e.stopPropagation()
        onView?.(video.id)
        navigate(`/play/${video.id}`, {
            state: {
                id: video.id,
                titol: video.title,
                descripcio: video.description,
                poster: video.thumbnailDataUrl || null,
                fonts: { hls: null, mp4: video.videoUrl },
                genere: video.category || null,
                any: null,
                duracioText: null,
                keepOnEnd: true,
                isOriginal: true,
            }
        })
    }

    const handleCreatorClick = (e) => {
        e.stopPropagation()
        onOpenCreator?.({ userId: video.userId, username: video.username, userAvatar: video.userAvatar })
    }

    const handleShare = async (e) => {
        e.stopPropagation()
        const url = `${window.location.origin}/originals`
        const shareData = { title: video.title, text: `Mira "${video.title}" a Playmon Originals`, url }
        try {
            if (navigator.share && navigator.canShare?.(shareData)) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(url)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }
        } catch {
            // user cancelled share or clipboard blocked — silent fail
        }
    }

    return (
        <div
            onClick={handlePlayClick}
            className="group relative bg-[#1A1A1A] border border-white/8 rounded-2xl overflow-hidden cursor-pointer
                        hover:border-white/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">

            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-[#0d0d0d]">
                {video.thumbnailDataUrl ? (
                    <img src={video.thumbnailDataUrl} alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #1a0f00 0%, #0d0d0d 60%, #1a1000 100%)' }}>
                        <HiFilm className="text-[#CC8400]/30 text-5xl" />
                    </div>
                )}

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                flex items-center justify-center"
                    onClick={handlePlayClick}>
                    <div className="w-14 h-14 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm
                                    flex items-center justify-center hover:bg-[#CC8400]/70 hover:border-[#CC8400]
                                    transition-all duration-200 cursor-pointer">
                        <HiPlay className="text-white text-2xl translate-x-0.5" />
                    </div>
                </div>

                {/* Views counter — top left */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm
                                rounded-full px-2 py-0.5">
                    <HiEye className="text-white/60 text-[10px]" />
                    <span className="text-white/60 text-[10px] font-medium">{views}</span>
                </div>

                {/* Category badge */}
                {video.category && (
                    <div className="absolute top-2 right-2">
                        <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full
                                         bg-black/70 backdrop-blur-sm border border-white/15 text-white/80">
                            {video.category}
                        </span>
                    </div>
                )}

                {/* Own content badge */}
                {isOwn && !video.category && (
                    <div className="absolute top-2 right-2">
                        <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full
                                         bg-[#CC8400]/90 text-black">
                            El meu
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-1.5 group-hover:text-[#CC8400] transition-colors duration-200">
                    {video.title}
                </h3>
                <p className="text-white/45 text-xs leading-relaxed line-clamp-2 mb-3">
                    {video.description}
                </p>

                {/* Bottom row: author + date + like */}
                <div className="flex items-center gap-2">
                    {/* Author (clicable) */}
                    <button onClick={(e) => { e.stopPropagation(); handleCreatorClick(e) }}
                        className="flex items-center gap-1.5 min-w-0 flex-1 hover:opacity-80 transition-opacity">
                        {video.userAvatar ? (
                            <img src={video.userAvatar} alt={video.username}
                                className="w-5 h-5 rounded-full object-cover border border-white/15 flex-shrink-0" />
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-[#CC8400]/20 border border-[#CC8400]/30 flex items-center justify-center flex-shrink-0">
                                <HiUser className="text-[#CC8400] text-[9px]" />
                            </div>
                        )}
                        <span className="text-white/50 text-xs truncate hover:text-white/80 transition-colors">
                            {video.username}
                        </span>
                    </button>

                    <span className="text-white/25 text-[10px] flex-shrink-0">{formatDate(video.createdAt)}</span>

                    {/* Like button */}
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 flex-shrink-0
                            ${likeAnim ? 'scale-125' : 'scale-100'}
                            ${isLiked
                                ? 'text-[#CC8400] bg-[#CC8400]/10'
                                : 'text-white/40 hover:text-[#CC8400] hover:bg-[#CC8400]/8'
                            }`}
                    >
                        <HiHeart className={`text-sm transition-all duration-200 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="text-[10px] font-semibold">{likes.length}</span>
                    </button>

                    {/* Bookmark button */}
                    <button
                        onClick={handleSave}
                        className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 flex-shrink-0
                            ${saveAnim ? 'scale-125' : 'scale-100'}
                            ${isSaved
                                ? 'text-[#CC8400] bg-[#CC8400]/10'
                                : 'text-white/40 hover:text-[#CC8400] hover:bg-[#CC8400]/8'
                            }`}
                        title={isSaved ? 'Eliminar de la llista' : 'Guardar a la llista'}
                    >
                        <HiBookmark className={`text-sm transition-all duration-200 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    {/* Share button */}
                    <div className="relative flex-shrink-0">
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200
                                       text-white/40 hover:text-white/80 hover:bg-white/8"
                        >
                            <HiShare className="text-sm" />
                        </button>
                        {copied && (
                            <div className="absolute bottom-full right-0 mb-1.5 px-2 py-1 rounded-lg bg-[#1A1A1A] border border-white/15
                                            text-white/80 text-[10px] font-medium whitespace-nowrap shadow-lg pointer-events-none">
                                Copiat!
                            </div>
                        )}
                    </div>
                </div>

                {/* Own actions */}
                {isOwn && (
                    <div onClick={(e) => e.stopPropagation()} className="mt-3 pt-3 border-t border-white/8 flex gap-2">
                        {confirmDelete ? (
                            <>
                                <span className="text-white/50 text-xs flex-1 self-center">Confirmar?</span>
                                <button onClick={() => setConfirmDelete(false)}
                                    className="px-3 py-1.5 rounded-lg text-xs text-white/60 border border-white/15 hover:bg-white/8 transition-colors">
                                    No
                                </button>
                                <button onClick={() => onDelete(video.id)}
                                    className="px-3 py-1.5 rounded-lg text-xs text-white bg-red-600/80 hover:bg-red-600 transition-colors font-medium">
                                    Eliminar
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => onEdit(video)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/70 border border-white/15
                                               hover:border-[#CC8400]/50 hover:text-[#CC8400] hover:bg-[#CC8400]/8 transition-all duration-200">
                                    <HiPencil className="text-sm" /> Editar
                                </button>
                                <button onClick={() => setConfirmDelete(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/70 border border-white/15
                                               hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200">
                                    <HiTrash className="text-sm" /> Eliminar
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
