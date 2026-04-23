import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Slider from './components/Slider'
import HomeFooter from './components/HomeFooter'
import MovieCard from '@/components/MovieCard'
import GlobalApi from '@/Services/GlobalApi'
import { getCurrentUser } from '@/api/authApi'
import { HiChevronLeft, HiChevronRight, HiArrowRight } from 'react-icons/hi2'

// ── Definició de les files de categories ──────────────────────────────────────
// subtitle: text descriptiu que veiem sota del títol (estil Netflix)
// badge: etiqueta de tipus visible a la capçalera (Pel·lícules / Sèries)
// linkTo: on porta el botó "Veure tot"
const CATEGORIES = [
    {
        title: 'Tendències ara',
        subtitle: 'El millor del moment',
        badge: 'PEL·LÍCULES',
        badgeColor: '#CC8400',
        color: '#CC8400',
        genreId: null,
        type: 'movie',
        linkTo: '/pelicules',
    },
    {
        title: 'Acció i Aventura',
        subtitle: "Per a qui estima l'adrenalina",
        badge: 'PEL·LÍCULES',
        badgeColor: '#CC8400',
        color: '#ef4444',
        genreId: 28,
        type: 'movie',
        linkTo: '/pelicules',
    },
    {
        title: 'Comèdia',
        subtitle: "Per fer un bon somriure",
        badge: 'PEL·LÍCULES',
        badgeColor: '#CC8400',
        color: '#f59e0b',
        genreId: 35,
        type: 'movie',
        linkTo: '/pelicules',
    },
    {
        title: 'Drama',
        subtitle: "Històries que et marcaran",
        badge: 'PEL·LÍCULES',
        badgeColor: '#CC8400',
        color: '#CC8400',
        genreId: 18,
        type: 'movie',
        linkTo: '/pelicules',
    },
    {
        title: 'Ciència Ficció',
        subtitle: "Universos que et faran pensar",
        badge: 'PEL·LÍCULES',
        badgeColor: '#CC8400',
        color: '#06b6d4',
        genreId: 878,
        type: 'movie',
        linkTo: '/pelicules',
    },
    {
        title: 'Animació',
        subtitle: 'Per a tota la família',
        badge: 'PEL·LÍCULES',
        badgeColor: '#CC8400',
        color: '#10b981',
        genreId: 16,
        type: 'movie',
        linkTo: '/pelicules',
    },
    {
        title: 'Sèries per al maratón',
        subtitle: "No podràs parar de veure-les",
        badge: 'SÈRIES',
        badgeColor: '#CC8400',
        color: '#CC8400',
        genreId: null,
        type: 'series',
        linkTo: '/series',
    },
    {
        title: 'Sèries de Comèdia',
        subtitle: "Episodis que alegren el dia",
        badge: 'SÈRIES',
        badgeColor: '#CC8400',
        color: '#f59e0b',
        genreId: 35,
        type: 'series',
        linkTo: '/series',
    },
    {
        title: 'Sèries de Drama',
        subtitle: "Personatges que et captivaran",
        badge: 'SÈRIES',
        badgeColor: '#CC8400',
        color: '#CC8400',
        genreId: 18,
        type: 'series',
        linkTo: '/series',
    },
    {
        title: 'Fantasia i Sci-Fi',
        subtitle: 'Mons impossibles fets realitat',
        badge: 'SÈRIES',
        badgeColor: '#CC8400',
        color: '#06b6d4',
        genreId: 10765,
        type: 'series',
        linkTo: '/series',
    },
]

// ── Capçalera de fila ─────────────────────────────────────────────────────────
function RowHeader({ title, subtitle, badge, badgeColor, color, linkTo }) {
    const navigate = useNavigate()
    return (
        <div className='flex items-end justify-between mb-4'>
            <div className='flex flex-col gap-1'>
                {/* Badge de tipus */}
                <span
                    className='text-[10px] font-black tracking-[0.15em] px-2 py-0.5 rounded-sm w-fit'
                    style={{ background: `${badgeColor}22`, color: badgeColor, border: `1px solid ${badgeColor}44` }}
                >
                    {badge}
                </span>
                {/* Títol principal */}
                <h2 className='text-white font-bold text-xl leading-tight'>{title}</h2>
                {/* Subtítol descriptiu */}
                <p className='text-white/40 text-xs font-normal'>{subtitle}</p>
            </div>

            {/* Botó Veure tot */}
            <button
                onClick={() => navigate(linkTo)}
                className='flex items-center gap-1.5 text-xs font-semibold tracking-wide
                           px-4 py-2 rounded-full border transition-all duration-200
                           hover:scale-105 active:scale-95 flex-shrink-0 mb-1'
                style={{
                    color: badgeColor,
                    borderColor: `${badgeColor}44`,
                    background: `${badgeColor}11`,
                }}
            >
                Veure tot
                <HiArrowRight className='text-sm' />
            </button>
        </div>
    )
}

// ── Fila horitzontal ──────────────────────────────────────────────────────────
function ContentRow({ title, subtitle, badge, badgeColor, color, genreId, type, linkTo }) {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const rowRef = useRef(null)

    useEffect(() => {
        let promise
        if (type === 'series') {
            promise = GlobalApi.getSeries()
        } else if (genreId) {
            promise = GlobalApi.getMoviesByGender(genreId)
        } else {
            promise = GlobalApi.getMovies()
        }

        promise
            .then(res => {
                let results = res?.data?.results || res?.data || []
                if (type === 'series' && genreId) {
                    results = results.filter(s => {
                        const cats = s.genres || []
                        return cats.some(g => (g.id || g) === genreId)
                    })
                }
                setItems(results.slice(0, 20))
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false))
    }, [genreId, type])

    const scroll = (dir) => {
        if (rowRef.current) {
            const scrollAmount = rowRef.current.clientWidth * 0.8;
            rowRef.current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' })
        }
    }

    if (!loading && items.length === 0) return null

    return (
        <section className='group/row px-6 md:px-12 py-6'>
            <RowHeader
                title={title}
                subtitle={subtitle}
                badge={badge}
                badgeColor={badgeColor}
                color={color}
                linkTo={linkTo}
            />

            {/* Contenidor scroll */}
            <div className='relative'>
                {/* Botó scroll esquerra */}
                <button
                    onClick={() => scroll(-1)}
                    aria-label="Desplaça a l'esquerra"
                    className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20
                               w-9 h-9 rounded-full bg-black/80 backdrop-blur-sm border border-white/20
                               flex items-center justify-center text-white
                               opacity-0 group-hover/row:opacity-100
                               hover:bg-black hover:scale-110 hover:border-white/40
                               transition-all duration-300'
                >
                    <HiChevronLeft className='text-lg' />
                </button>

                {/* Fila de targetes */}
                <div
                    ref={rowRef}
                    className='flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory'
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loading
                        ? [...Array(7)].map((_, i) => (
                            <div
                                key={i}
                                className='flex-shrink-0 w-[200px] md:w-[280px] aspect-video rounded-xl bg-white/5 animate-pulse snap-start'
                            />
                          ))
                        : items.map(item => (
                            <div key={item.id} className='flex-shrink-0 group/card relative snap-start'>
                                <MovieCard movie={item} />
                                {/* Overlay títol */}
                                <div className='absolute bottom-0 left-0 right-0 px-2 pb-2 pt-6
                                                bg-gradient-to-t from-black/90 via-black/50 to-transparent
                                                rounded-b-lg opacity-0 group-hover/card:opacity-100
                                                transition-opacity duration-200 pointer-events-none'>
                                    <p className='text-white text-[11px] font-medium truncate leading-tight'>
                                        {item.title || item.name}
                                    </p>
                                    {item.release_date && (
                                        <p className='text-white/50 text-[9px] mt-0.5'>
                                            {item.release_date?.slice(0, 4)}
                                        </p>
                                    )}
                                </div>
                            </div>
                          ))
                    }
                </div>

                {/* Botó scroll dreta */}
                <button
                    onClick={() => scroll(1)}
                    aria-label="Desplaça a la dreta"
                    className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20
                               w-9 h-9 rounded-full bg-black/80 backdrop-blur-sm border border-white/20
                               flex items-center justify-center text-white
                               opacity-0 group-hover/row:opacity-100
                               hover:bg-black hover:scale-110 hover:border-white/40
                               transition-all duration-300'
                >
                    <HiChevronRight className='text-lg' />
                </button>

                {/* Fade dret */}
                <div className='absolute right-0 top-0 bottom-1 w-16 pointer-events-none
                                bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent' />
            </div>

            {/* Separador */}
            <div className='mt-6 h-px bg-white/5' />
        </section>
    )
}

// ── Fila de Seguir Veient ───────────────────────────────────────────────────────
function ContinueWatchingRow() {
    const currentUser = getCurrentUser();
    const [savedItems, setSavedItems] = useState([]);

    useEffect(() => {
        const checkStorage = () => {
            const historyKey = `playmon_continue_${currentUser?.id || 'guest'}`;
            const saved = localStorage.getItem(historyKey);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Suportem tant el format antic de 1 objecte sol com el format de llista
                    let history = Array.isArray(parsed) ? parsed : (parsed?.id && parsed.id !== 'undefined' ? [parsed] : []);
                    history = history.filter(item => !item.completed);
                    setSavedItems(history);
                } catch (e) {
                    setSavedItems([]);
                }
            } else {
                setSavedItems([]);
            }
        };
        checkStorage();
        window.addEventListener('focus', checkStorage);
        return () => window.removeEventListener('focus', checkStorage);
    }, []);

    if (savedItems.length === 0) return null;

    return (
        <section className='group/row px-6 md:px-12 py-6'>
            <div className='flex items-end justify-between mb-4'>
                <div className='flex flex-col gap-1'>
                    <h2 className='text-white font-bold text-xl leading-tight'>Seguir viendo</h2>
                    <p className='text-[#CC8400] text-xs font-normal'>Reprendre per on ho vas deixar</p>
                </div>
            </div>

            <div className='flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {savedItems.map((item, i) => (
                    <div key={item.id || i} className='flex-shrink-0 group/card relative snap-start w-[200px] md:w-[280px]'>
                        <MovieCard movie={item} isContinueWatching={true} />
                        {item.savedTime > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-lg overflow-hidden z-10 pointer-events-none">
                                <div className="h-full bg-[#CC8400]" style={{ width: `${Math.min(100, (item.savedTime / 7) * 100)}%` }}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className='mt-6 h-px bg-white/5' />
        </section>
    );
}

// ── HomeLayout ─────────────────────────────────────────────────────────────────
function HomeLayout() {
    return (
        <div className='min-h-screen' style={{ background: '#0a0a0a' }}>
            <Header />
            <main className='pb-10'>
                <Slider />
                <ContinueWatchingRow />
                <div className='mt-6'>
                    {CATEGORIES.map((cat, i) => (
                        <ContentRow key={i} {...cat} />
                    ))}
                </div>
            </main>
            <HomeFooter />
        </div>
    )
}

export default HomeLayout
