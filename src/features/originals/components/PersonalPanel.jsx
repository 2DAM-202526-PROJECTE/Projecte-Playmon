import React, { useState, useEffect } from 'react'
import {
    HiXMark, HiUser, HiFilm, HiBookmark, HiClock,
    HiPencil, HiTrash, HiPlay
} from 'react-icons/hi2'
import { getCurrentUser } from '@/api/authApi'
import { useNavigate } from 'react-router-dom'

function formatRelativeTime(isoString) {
    const diffMs = Date.now() - new Date(isoString)
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return 'Ara mateix'
    if (mins < 60) return `Fa ${mins} min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `Fa ${hours}h`
    const days = Math.floor(hours / 24)
    if (days === 1) return 'Ahir'
    if (days < 7) return `Fa ${days} dies`
    return new Date(isoString).toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' })
}

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

function VideoRow({ video, subtitle, actionIcon: ActionIcon, onAction, actionTitle, onPlay }) {
    return (
        <div className="flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group items-center">
            <div className="w-20 h-[45px] rounded-lg overflow-hidden flex-shrink-0 bg-[#0d0d0d] relative cursor-pointer"
                onClick={onPlay}>
                {video.thumbnailDataUrl
                    ? <img src={video.thumbnailDataUrl} alt={video.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#1a0f00,#0d0d0d)' }}>
                        <HiFilm className="text-[#CC8400]/30 text-lg" />
                    </div>
                }
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <HiPlay className="text-white text-base translate-x-0.5" />
                </div>
            </div>
            <div className="flex-1 min-w-0 cursor-pointer" onClick={onPlay}>
                <p className="text-white/85 text-xs font-medium truncate group-hover:text-[#CC8400] transition-colors">{video.title}</p>
                <p className="text-white/35 text-[10px] mt-0.5">{subtitle}</p>
            </div>
            {ActionIcon && (
                <button onClick={onAction}
                    title={actionTitle}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0 opacity-0 group-hover:opacity-100">
                    <ActionIcon className="text-xs" />
                </button>
            )}
        </div>
    )
}

function MyVideosList({ videos, onEdit, onDelete }) {
    if (videos.length === 0) return (
        <div className="flex flex-col items-center justify-center py-10 text-center px-2">
            <HiFilm className="text-white/15 text-3xl mb-2" />
            <p className="text-white/35 text-xs">Encara no has publicat cap vídeo a Playmon Originals.</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-1">
            {videos.map(video => (
                <div key={video.id}
                    className="flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="w-20 h-[45px] rounded-lg overflow-hidden flex-shrink-0 bg-[#0d0d0d]">
                        {video.thumbnailDataUrl
                            ? <img src={video.thumbnailDataUrl} alt={video.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg,#1a0f00,#0d0d0d)' }}>
                                <HiFilm className="text-[#CC8400]/30 text-lg" />
                            </div>
                        }
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white/85 text-xs font-medium truncate">{video.title}</p>
                        {video.category && (
                            <span className="text-[10px] text-[#CC8400]/70">{video.category}</span>
                        )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 items-start pt-0.5">
                        <button onClick={() => onEdit(video)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-white/50 hover:text-[#CC8400] hover:bg-[#CC8400]/10 transition-all">
                            <HiPencil className="text-xs" />
                        </button>
                        <button onClick={() => onDelete(video.id)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all">
                            <HiTrash className="text-xs" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

function HistoryList({ history, allVideos, onClearHistory }) {
    const navigate = useNavigate()
    const videoMap = Object.fromEntries(allVideos.map(v => [v.id, v]))
    const entries = history
        .map(h => ({ video: videoMap[h.videoId], watchedAt: h.watchedAt }))
        .filter(e => e.video)

    if (entries.length === 0) return (
        <div className="flex flex-col items-center justify-center py-12 text-center px-2">
            <HiClock className="text-white/15 text-4xl mb-3" />
            <p className="text-white/50 text-sm font-medium mb-1">Encara no hi ha res a l'historial</p>
            <p className="text-white/30 text-xs max-w-[200px]">Els vídeos d'Originals que vegis apareixeran aquí.</p>
        </div>
    )

    const handlePlay = (video) => {
        navigate(`/play/${video.id}`, {
            state: {
                id: video.id, titol: video.title, descripcio: video.description,
                poster: video.thumbnailDataUrl || null,
                fonts: { hls: null, mp4: video.videoUrl },
                genere: video.category || null, any: null, duracioText: null,
                keepOnEnd: true, isOriginal: true,
            }
        })
    }

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between mb-2">
                <p className="text-white/30 text-[10px] uppercase tracking-widest">{entries.length} {entries.length === 1 ? 'vídeo' : 'vídeos'}</p>
                <button onClick={onClearHistory}
                    className="text-[10px] text-white/30 hover:text-red-400 transition-colors px-2 py-0.5 rounded">
                    Esborrar historial
                </button>
            </div>
            {entries.map(({ video, watchedAt }) => (
                <VideoRow
                    key={video.id + watchedAt}
                    video={video}
                    subtitle={formatRelativeTime(watchedAt)}
                    onPlay={() => handlePlay(video)}
                />
            ))}
        </div>
    )
}

function WatchlistPanel({ watchlist, allVideos, onToggleWatchlist }) {
    const navigate = useNavigate()
    const videoMap = Object.fromEntries(allVideos.map(v => [v.id, v]))
    const saved = watchlist.map(id => videoMap[id]).filter(Boolean)

    if (saved.length === 0) return (
        <div className="flex flex-col items-center justify-center py-12 text-center px-2">
            <HiBookmark className="text-white/15 text-4xl mb-3" />
            <p className="text-white/50 text-sm font-medium mb-1">Encara no tens cap vídeo guardat</p>
            <p className="text-white/30 text-xs max-w-[200px]">Prem el bookmark a qualsevol vídeo per desar-lo aquí.</p>
        </div>
    )

    const handlePlay = (video) => {
        navigate(`/play/${video.id}`, {
            state: {
                id: video.id, titol: video.title, descripcio: video.description,
                poster: video.thumbnailDataUrl || null,
                fonts: { hls: null, mp4: video.videoUrl },
                genere: video.category || null, any: null, duracioText: null,
                keepOnEnd: true, isOriginal: true,
            }
        })
    }

    return (
        <div className="flex flex-col gap-1">
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">{saved.length} {saved.length === 1 ? 'vídeo guardat' : 'vídeos guardats'}</p>
            {saved.map(video => (
                <VideoRow
                    key={video.id}
                    video={video}
                    subtitle={video.username}
                    actionIcon={HiTrash}
                    actionTitle="Eliminar de la llista"
                    onAction={() => onToggleWatchlist(video.id)}
                    onPlay={() => handlePlay(video)}
                />
            ))}
        </div>
    )
}

export default function PersonalPanel({ isOpen, onClose, onEditVideo, onDeleteVideo, allVideos = [], history = [], watchlist = [], onToggleWatchlist, onClearHistory }) {
    const [activeTab, setActiveTab] = useState('videos')
    const user = getCurrentUser()

    const myVideos = allVideos.filter(v => v.userId === String(user?.id))

    const historyCount = history
        .map(h => allVideos.find(v => v.id === h.videoId))
        .filter(Boolean).length

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
                        icon={HiClock} label="Historial" count={historyCount} />
                    <Tab active={activeTab === 'watchlist'} onClick={() => setActiveTab('watchlist')}
                        icon={HiBookmark} label="Llista" count={watchlist.length} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
                    {activeTab === 'videos' && (
                        <MyVideosList videos={myVideos} onEdit={onEditVideo} onDelete={onDeleteVideo} />
                    )}
                    {activeTab === 'history' && (
                        <HistoryList history={history} allVideos={allVideos} onClearHistory={onClearHistory} />
                    )}
                    {activeTab === 'watchlist' && (
                        <WatchlistPanel watchlist={watchlist} allVideos={allVideos} onToggleWatchlist={onToggleWatchlist} />
                    )}
                </div>
            </div>
        </>
    )
}
