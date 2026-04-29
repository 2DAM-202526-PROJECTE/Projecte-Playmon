import React, { useState, useEffect } from 'react'
import {
    HiXMark, HiUser, HiFilm, HiBookmark, HiClock,
    HiPencil, HiTrash
} from 'react-icons/hi2'
import { getCurrentUser } from '@/api/authApi'
import { useLlistaOriginals } from '@/context/LlistaOriginalsContext'
import { useNavigate } from 'react-router-dom'

// ─── Tab button ───────────────────────────────────────────────────────────────
function Tab({ active, onClick, icon: Icon, label, count }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap
                ${active
                    ? 'bg-[#CC8400]/15 text-[#CC8400] border border-[#CC8400]/30'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
                }`}
        >
            <Icon className="text-sm flex-shrink-0" />
            {label}
            {count != null && count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                    ${active ? 'bg-[#CC8400]/30 text-[#CC8400]' : 'bg-white/10 text-white/40'}`}>
                    {count}
                </span>
            )}
        </button>
    )
}

// ─── My videos list ───────────────────────────────────────────────────────────
function MyVideosList({ videos, onEdit, onDelete }) {
    const { isInLlista, toggleLlista } = useLlistaOriginals()

    if (videos.length === 0) return (
        <div className="flex flex-col items-center justify-center py-10 text-center px-2">
            <HiFilm className="text-white/15 text-3xl mb-2" />
            <p className="text-white/35 text-xs">Encara no has publicat cap vídeo a Playmon Originals.</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-2">
            {videos.map(video => {
                const inLlista = isInLlista(video.id)
                return (
                    <div key={video.id}
                        className="flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                        {/* Thumbnail */}
                        <div className="w-20 h-[45px] rounded-lg overflow-hidden flex-shrink-0 bg-[#0d0d0d]">
                            {video.thumbnailDataUrl
                                ? <img src={video.thumbnailDataUrl} alt={video.title} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg,#1a0f00,#0d0d0d)' }}>
                                    <HiFilm className="text-[#CC8400]/30 text-lg" />
                                </div>
                            }
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0 self-center">
                            <p className="text-white/85 text-xs font-medium truncate">{video.title}</p>
                            {video.category && (
                                <span className="text-[10px] text-[#CC8400]/70">{video.category}</span>
                            )}
                        </div>
                        {/* Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 items-center">
                            <button onClick={(e) => { e.stopPropagation(); toggleLlista(video) }}
                                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${inLlista ? 'text-[#CC8400] bg-[#CC8400]/10' : 'text-white/50 hover:text-[#CC8400] hover:bg-[#CC8400]/10'}`}
                                title={inLlista ? 'Treure de la llista' : 'Afegir a la llista'}
                            >
                                <HiBookmark className={`text-xs ${inLlista ? 'fill-current' : ''}`} />
                            </button>
                            <button onClick={() => onEdit(video)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-white/10 transition-all"
                                title="Editar vídeo">
                                <HiPencil className="text-xs" />
                            </button>
                            <button onClick={() => onDelete(video.id)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                title="Eliminar vídeo">
                                <HiTrash className="text-xs" />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function HistoryList() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center px-2">
            <HiClock className="text-white/15 text-4xl mb-3" />
            <p className="text-white/50 text-sm font-medium mb-1">Encara no hi ha res a l'historial</p>
            <p className="text-white/30 text-xs max-w-[200px]">Els vídeos d'Originals que vegis apareixeran aquí.</p>
        </div>
    )
}

function WatchlistPanel({ allVideos }) {
    const { llista, loading, toggleLlista } = useLlistaOriginals()
    const navigate = useNavigate()

    if (loading) return (
        <div className="flex justify-center py-10">
            <div className="w-5 h-5 border-2 border-white/15 border-t-[#CC8400] rounded-full animate-spin" />
        </div>
    )

    if (llista.length === 0) return (
        <div className="flex flex-col items-center justify-center py-12 text-center px-2">
            <HiBookmark className="text-white/15 text-4xl mb-3" />
            <p className="text-white/50 text-sm font-medium mb-1">Encara no tens cap vídeo guardat</p>
            <p className="text-white/30 text-xs max-w-[200px]">Prem el marcador en qualsevol vídeo per afegir-lo aquí.</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-2">
            {llista.map(item => (
                <div key={item.video_id}
                    className="flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => {
                        const originalVideo = allVideos.find(v => String(v.id) === String(item.video_id));
                        navigate(`/play/${item.video_id}`, {
                            state: { 
                                id: item.video_id, 
                                titol: item.title, 
                                poster: item.thumbnail_url, 
                                fonts: { hls: null, mp4: originalVideo ? originalVideo.videoUrl : null }, 
                                keepOnEnd: true, 
                                isOriginal: true 
                            }
                        });
                    }}>
                    <div className="w-20 h-[45px] rounded-lg overflow-hidden flex-shrink-0 bg-[#0d0d0d]">
                        {item.thumbnail_url
                            ? <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg,#1a0f00,#0d0d0d)' }}>
                                <HiFilm className="text-[#CC8400]/30 text-lg" />
                            </div>
                        }
                    </div>
                    <div className="flex-1 min-w-0 self-center">
                        <p className="text-white/85 text-xs font-medium truncate">{item.title}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 items-center">
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleLlista({ id: item.video_id, title: item.title, thumbnailDataUrl: item.thumbnail_url }) }}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Treure de la llista"
                        >
                            <HiTrash className="text-xs" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export default function PersonalPanel({ isOpen, onClose, onEditVideo, onDeleteVideo, allVideos = [] }) {
    const [activeTab, setActiveTab] = useState('videos')
    const user = getCurrentUser()

    const myVideos = allVideos.filter(v => v.userId === String(user?.id))

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`fixed top-0 right-0 h-full z-50 w-full max-w-sm bg-[#0f0f0f] border-l border-white/8
                             shadow-2xl flex flex-col transition-transform duration-300 ease-out
                             ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {user?.avatar
                            ? <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover border border-white/15" />
                            : <div className="w-8 h-8 rounded-full bg-[#CC8400]/20 border border-[#CC8400]/30 flex items-center justify-center">
                                <HiUser className="text-[#CC8400] text-sm" />
                            </div>
                        }
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">
                                {user?.username || user?.name || 'Usuari'}
                            </p>
                            <p className="text-white/40 text-xs">El meu espai</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
                    >
                        <HiXMark className="text-white/70 text-lg" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1.5 px-4 py-3 border-b border-white/8 flex-shrink-0 overflow-x-auto"
                    style={{ scrollbarWidth: 'none' }}>
                    <Tab active={activeTab === 'videos'} onClick={() => setActiveTab('videos')}
                        icon={HiFilm} label="Els meus vídeos" count={myVideos.length} />
                    <Tab active={activeTab === 'history'} onClick={() => setActiveTab('history')}
                        icon={HiClock} label="Historial" />
                    <Tab active={activeTab === 'watchlist'} onClick={() => setActiveTab('watchlist')}
                        icon={HiBookmark} label="Llista" />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
                    {activeTab === 'videos' && (
                        <MyVideosList videos={myVideos} onEdit={onEditVideo} onDelete={onDeleteVideo} />
                    )}
                    {activeTab === 'history' && <HistoryList />}
                    {activeTab === 'watchlist' && <WatchlistPanel allVideos={allVideos} />}
                </div>
            </div>
        </>
    )
}
