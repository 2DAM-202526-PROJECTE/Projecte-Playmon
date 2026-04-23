import React, { useEffect } from 'react'
import { HiXMark, HiUser, HiHeart, HiEye, HiFilm, HiVideoCamera } from 'react-icons/hi2'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w300'

function CreatorVideoCard({ video }) {
    const likes = video.likes?.length ?? 0
    const views = video.views ?? 0

    return (
        <div className="group bg-[#1A1A1A] border border-white/8 rounded-xl overflow-hidden
                        hover:border-white/20 transition-all duration-300">
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-[#0d0d0d]">
                {video.thumbnailDataUrl ? (
                    <img src={video.thumbnailDataUrl} alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #1a0f00 0%, #0d0d0d 60%, #1a1000 100%)' }}>
                        <HiFilm className="text-[#CC8400]/25 text-3xl" />
                    </div>
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5" />
                    </div>
                </div>
                {video.category && (
                    <div className="absolute top-1.5 left-1.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/70 border border-white/15 text-white/70">
                            {video.category}
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3">
                <p className="text-white/85 text-xs font-semibold line-clamp-2 mb-2 group-hover:text-[#CC8400] transition-colors">
                    {video.title}
                </p>
                <div className="flex items-center gap-3 text-white/35 text-[10px]">
                    <span className="flex items-center gap-1">
                        <HiHeart className="text-xs" /> {likes}
                    </span>
                    <span className="flex items-center gap-1">
                        <HiEye className="text-xs" /> {views}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default function CreatorModal({ creator, allVideos, onClose }) {
    const creatorVideos = allVideos.filter(v => v.userId === creator.userId)
    const totalLikes = creatorVideos.reduce((sum, v) => sum + (v.likes?.length ?? 0), 0)
    const totalViews = creatorVideos.reduce((sum, v) => sum + (v.views ?? 0), 0)

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl
                            max-h-[85vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex-shrink-0 px-6 pt-6 pb-5 border-b border-white/8">
                    <button onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/8 hover:bg-white/15
                                   flex items-center justify-center transition-colors">
                        <HiXMark className="text-white/70 text-lg" />
                    </button>

                    {/* Creator info */}
                    <div className="flex items-center gap-4">
                        {creator.userAvatar ? (
                            <img src={creator.userAvatar} alt={creator.username}
                                className="w-16 h-16 rounded-full object-cover border-2 border-[#CC8400]/40" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-[#CC8400]/15 border-2 border-[#CC8400]/30 flex items-center justify-center flex-shrink-0">
                                <HiUser className="text-[#CC8400] text-2xl" />
                            </div>
                        )}
                        <div>
                            <h2 className="text-white font-bold text-xl">{creator.username}</h2>
                            <p className="text-white/40 text-sm mt-0.5">Creador de Playmon Originals</p>
                            {/* Stats */}
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-white/50 text-xs">
                                    <HiVideoCamera className="text-sm" />
                                    {creatorVideos.length} {creatorVideos.length === 1 ? 'vídeo' : 'vídeos'}
                                </span>
                                <span className="flex items-center gap-1.5 text-white/50 text-xs">
                                    <HiHeart className="text-sm" />
                                    {totalLikes} likes
                                </span>
                                <span className="flex items-center gap-1.5 text-white/50 text-xs">
                                    <HiEye className="text-sm" />
                                    {totalViews} vistes
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Videos grid */}
                <div className="flex-1 overflow-y-auto px-6 py-5"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
                    {creatorVideos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <HiFilm className="text-white/15 text-4xl mb-3" />
                            <p className="text-white/40 text-sm">Aquest creador no té vídeos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {creatorVideos.map(video => (
                                <CreatorVideoCard key={video.id} video={video} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
