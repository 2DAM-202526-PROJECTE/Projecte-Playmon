import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import MovieCard from '@/components/MovieCard';
import GlobalApi from '@/Services/GlobalApi';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

const TIPUS = [
    { key: 'all',   label: 'Tot' },
    { key: 'movie', label: 'Pel·lícules' },
    { key: 'tv',    label: 'Sèries' },
]

// Extreu gèneres d'un item (usa item.genres que és l'array normalitzat de mapMovie)
const getItemGenres = (item) => Array.isArray(item?.genres) ? item.genres : [];

export default function SearchOverlay({ isOpen, onClose }) {
    const [query, setQuery]             = useState('');
    const [results, setResults]         = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [genres, setGenres]           = useState([]);
    const [genreFilter, setGenreFilter] = useState(null);
    const [typeFilter, setTypeFilter]   = useState('all');
    const [loading, setLoading]         = useState(false);
    const [loadingSug, setLoadingSug]   = useState(true); // true: spinner al primer render
    const [error, setError]             = useState('');

    // Tanca amb Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    // Overflow body + càrrega de suggestions en obrir
    useEffect(() => {
        if (!isOpen) {
            setQuery(''); setResults([]); setTypeFilter('all'); setGenreFilter(null);
            document.body.style.overflow = 'unset';
            return;
        }
        document.body.style.overflow = 'hidden';
        loadSuggestions();
    }, [isOpen]);

    const loadSuggestions = async () => {
        setLoadingSug(true);
        try {
            const [movRes, tvRes] = await Promise.all([
                GlobalApi.getMovies().catch(() => ({ data: { results: [] } })),
                GlobalApi.getSeries().catch(() => ({ data: { results: [] } })),
            ]);
            const movies = (movRes.data?.results || []).slice(0, 6).map(m => ({ ...m, media_type: 'movie' }));
            const series = (tvRes.data?.results || []).slice(0, 6).map(s => ({ ...s, media_type: 'tv' }));
            const all = [...movies, ...series];
            setSuggestions(all);

            // Extreu gèneres de item.genres (camp normalitzat per mapMovie)
            const genreMap = {};
            all.forEach(item => {
                getItemGenres(item).forEach(g => {
                    if (g?.name && g?.id != null) genreMap[String(g.id)] = g.name;
                });
            });
            setGenres(
                Object.entries(genreMap)
                    .map(([id, name]) => ({ id, name }))
                    .sort((a, b) => a.name.localeCompare(b.name))
            );
        } finally {
            setLoadingSug(false);
        }
    };

    // Debounce cerca
    useEffect(() => {
        if (!isOpen) return;
        const id = setTimeout(() => {
            if (query.length > 1) {
                setLoading(true); setError('');
                GlobalApi.searchGlobal(query)
                    .then(res => { setResults(res.data.results || []); setLoading(false); })
                    .catch(() => { setError('No es pot connectar.'); setResults([]); setLoading(false); });
            } else {
                setResults([]);
            }
        }, 400);
        return () => clearTimeout(id);
    }, [query, isOpen]);

    // Suggestions filtrades per gènere actiu
    const filteredSuggestions = useMemo(() => {
        if (!genreFilter) return suggestions;
        return suggestions.filter(item =>
            getItemGenres(item).some(g => String(g?.id) === genreFilter)
        );
    }, [suggestions, genreFilter]);

    // Gèneres extrets dels resultats de cerca
    const searchGenres = useMemo(() => {
        if (query.length <= 1) return [];
        const map = {};
        results.forEach(item => {
            getItemGenres(item).forEach(g => {
                if (g?.name && g?.id != null) map[String(g.id)] = g.name;
            });
        });
        return Object.entries(map).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
    }, [results, query]);

    // Resultats filtrats per tipus i gènere
    const filteredResults = useMemo(() => {
        return results.filter(item => {
            if (typeFilter !== 'all' && item.media_type !== typeFilter) return false;
            if (genreFilter) {
                const ids = getItemGenres(item).map(g => String(g?.id));
                if (!ids.includes(genreFilter)) return false;
            }
            return true;
        });
    }, [results, typeFilter, genreFilter]);

    if (!isOpen) return null;

    const isSearching = query.length > 1;
    const showSearchFilters = isSearching && results.length > 0 && !loading;
    const toggleGenre = (id) => setGenreFilter(prev => prev === id ? null : id);
    const activeGenreName = genres.find(g => g.id === genreFilter)?.name
        || searchGenres.find(g => g.id === genreFilter)?.name;

    return createPortal(
        <div
            className="fixed left-0 right-0 bottom-0 z-[100]"
            style={{ top: '80px', background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
            onClick={onClose}
        >
            <div
                className="h-full overflow-y-auto"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onClick={e => e.stopPropagation()}
            >
            <div
                className="relative mx-auto max-w-5xl px-4 md:px-8 pt-6 pb-10"
            >
                {/* Input */}
                <div className="flex items-center gap-3 bg-white/[0.06] border border-white/[0.12] rounded-2xl px-5 py-3.5 focus-within:border-white/25 focus-within:bg-white/[0.08] transition-all">
                    <HiMagnifyingGlass className="text-white/35 text-xl flex-shrink-0" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Busca pel·lícules, sèries..."
                        autoFocus
                        className="flex-1 bg-transparent text-white text-lg font-light outline-none placeholder:text-white/25"
                    />
                    {(query || genreFilter) && (
                        <button
                            onClick={() => { setQuery(''); setGenreFilter(null); }}
                            className="text-white/25 hover:text-white/60 transition-colors flex-shrink-0"
                        >
                            <HiXMark className="text-lg" />
                        </button>
                    )}
                </div>

                {/* Gènere actiu */}
                {genreFilter && activeGenreName && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-white/30">Filtrant per:</span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CC8400]/20 border border-[#CC8400]/50 text-[#CC8400] text-xs font-semibold">
                            {activeGenreName}
                            <button onClick={() => setGenreFilter(null)} className="hover:opacity-70 leading-none">
                                <HiXMark className="text-xs" />
                            </button>
                        </span>
                    </div>
                )}

                {/* ── ESTAT INICIAL ── */}
                {!isSearching && (
                    <div className="mt-6">
                        {loadingSug ? (
                            <div className="flex justify-center py-12">
                                <div className="w-5 h-5 border-2 border-white/15 border-t-[#CC8400] rounded-full animate-spin" />
                            </div>
                        ) : (
                            <>
                                {genres.length > 0 && (
                                    <div className="mb-7">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 mb-3">
                                            Navega per gènere
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {genres.map(g => (
                                                <button
                                                    key={g.id}
                                                    onClick={() => toggleGenre(g.id)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                        genreFilter === g.id
                                                            ? 'bg-[#CC8400] border-[#CC8400] text-black'
                                                            : 'border-white/[0.10] text-white/45 hover:text-white hover:border-white/30 hover:bg-white/[0.05]'
                                                    }`}
                                                >
                                                    {g.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 mb-4">
                                    {genreFilter ? activeGenreName : 'Populars ara'}
                                </p>

                                {filteredSuggestions.length > 0 ? (
                                    <div className="flex flex-wrap gap-4">
                                        {filteredSuggestions.map(movie => (
                                            <div key={`${movie.id}-${movie.media_type}`} className="flex flex-col gap-1.5">
                                                <MovieCard movie={movie} noPopup />
                                                <p className="text-white/50 text-[11px] font-medium text-center line-clamp-1 px-1"
                                                   style={{ width: '200px' }}>
                                                    {movie.title || movie.name}
                                                </p>
                                                {movie.media_type === 'tv' && (
                                                    <span className="text-[9px] text-[#CC8400]/60 font-semibold uppercase tracking-wider text-center">Sèrie</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : genreFilter ? (
                                    <p className="text-white/25 text-sm">Cap títol amb aquest gènere a la selecció.</p>
                                ) : null}
                            </>
                        )}
                    </div>
                )}

                {/* ── ESTAT CERCA ── */}
                {isSearching && (
                    <div className="mt-5">
                        {showSearchFilters && (
                            <div className="space-y-2 mb-5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {TIPUS.map(t => (
                                        <button
                                            key={t.key}
                                            onClick={() => setTypeFilter(t.key)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                                                typeFilter === t.key
                                                    ? 'bg-[#CC8400] border-[#CC8400] text-black'
                                                    : 'border-white/[0.12] text-white/50 hover:text-white hover:border-white/30'
                                            }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                    <span className="ml-auto text-xs text-white/25 font-medium">
                                        {filteredResults.length} {filteredResults.length === 1 ? 'resultat' : 'resultats'}
                                    </span>
                                </div>
                                {searchGenres.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {searchGenres.map(g => (
                                            <button
                                                key={g.id}
                                                onClick={() => toggleGenre(g.id)}
                                                className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all ${
                                                    genreFilter === g.id
                                                        ? 'bg-white/15 border-white/40 text-white'
                                                        : 'border-white/[0.08] text-white/35 hover:text-white/60 hover:border-white/20'
                                                }`}
                                            >
                                                {g.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {loading && (
                            <div className="flex justify-center mt-10">
                                <div className="w-6 h-6 border-2 border-white/15 border-t-[#CC8400] rounded-full animate-spin" />
                            </div>
                        )}

                        {error && <p className="text-center text-yellow-500/70 text-sm mt-6">{error}</p>}

                        {!loading && filteredResults.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {filteredResults.slice(0, 18).map(movie => (
                                    <div key={`${movie.id}-${movie.media_type}`} className="flex flex-col gap-1.5">
                                        <MovieCard movie={movie} noPopup />
                                        <p className="text-white/60 text-[11px] font-medium text-center line-clamp-1 px-1"
                                           style={{ width: '200px' }}>
                                            {movie.title || movie.name}
                                        </p>
                                        {movie.media_type === 'tv' && (
                                            <span className="text-[9px] text-[#CC8400]/60 font-semibold uppercase tracking-wider text-center">Sèrie</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && results.length === 0 && !error && (
                            <div className="flex flex-col items-center mt-12 gap-2">
                                <HiMagnifyingGlass className="text-white/10 text-4xl" />
                                <p className="text-white/30 text-sm font-light">
                                    Sense resultats per a <span className="text-white/50">"{query}"</span>
                                </p>
                            </div>
                        )}

                        {!loading && results.length > 0 && filteredResults.length === 0 && (
                            <p className="text-center text-white/30 text-sm mt-10">
                                Cap resultat amb els filtres actuals.
                            </p>
                        )}
                    </div>
                )}
            </div>
            </div>
        </div>,
        document.body
    );
}
