import React, { useEffect, useState } from 'react'
import MovieCard from '@/components/MovieCard'
import { getCurrentUser } from '@/api/authApi'

export default function CompteHistorial() {
    const currentUser = getCurrentUser();
    const [movies, setMovies] = useState([])

    useEffect(() => {
        const historyKey = `playmon_continue_${currentUser?.id || 'guest'}`;
        const stored = localStorage.getItem(historyKey);
        let history = [];
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                history = Array.isArray(parsed) ? parsed : (parsed?.id && parsed.id !== 'undefined' ? [parsed] : []);
            } catch (e) {
                history = [];
            }
        }
        setMovies(history);
    }, [])

    return (
        <div className="bg-[#111] p-6 lg:p-8 rounded-2xl min-h-[600px] border border-white/5">
            <div className="mb-8 border-b border-white/10 pb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Historial de visualització</h1>
                    <p className="text-[#A0A0A0]">El registre de tot el contingut que has començat a veure recentment.</p>
                </div>
            </div>

            {movies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <svg className="w-16 h-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-medium text-white/60 mb-2">Sense historial</h3>
                    <p className="text-white/40">Encara no has reproduït cap pel·lícula o sèrie.</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-4 md:gap-6">
                    {movies.map(movie => (
                        <div key={movie.id} className="flex-shrink-0 animate-fade-in">
                            <MovieCard movie={movie} isContinueWatching={true} />
                            {/* Barra de progrés visual sobre la targeta de l'historial */}
                            {(movie.savedTime > 0 || movie.completed) && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-lg overflow-hidden z-10 pointer-events-none">
                                    <div className="h-full bg-[#CC8400]" style={{ width: movie.completed ? '100%' : `${Math.min(100, (movie.savedTime / 7) * 100)}%` }}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
