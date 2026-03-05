import React from 'react'

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w185"

function CastSection({ cast = [], crew = [] }) {
    const director = crew.find(c => c.job === 'Director')
    const producers = crew.filter(c => c.job === 'Producer').slice(0, 3)
    const topCast = cast.slice(0, 12)

    return (
        <div className='space-y-8'>
            {/* Repartiment principal */}
            <div>
                <h3 className='text-lg font-semibold text-white mb-4'>Repartiment</h3>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                    {topCast.map((actor) => (
                        <div key={actor.id} className='group text-center'>
                            <div className='w-full aspect-[2/3] rounded-lg overflow-hidden mb-2
                                            bg-white/5 border border-white/10
                                            group-hover:border-[#CC8400]/50 transition-all duration-300'>
                                {actor.profile_path ? (
                                    <img
                                        src={IMAGE_BASE_URL + actor.profile_path}
                                        alt={actor.name}
                                        className='w-full h-full object-cover
                                                   group-hover:scale-105 transition-transform duration-500'
                                    />
                                ) : (
                                    <div className='w-full h-full flex items-center justify-center text-white/30'>
                                        <svg className='w-12 h-12' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <p className='text-white text-sm font-medium truncate'>{actor.name}</p>
                            <p className='text-white/50 text-xs truncate'>{actor.character}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Director i Productors */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {director && (
                    <div className='bg-white/5 rounded-xl p-5 border border-white/10'>
                        <h4 className='text-sm font-medium text-[#CC8400] mb-2'>Direcció</h4>
                        <p className='text-white font-medium'>{director.name}</p>
                    </div>
                )}

                {producers.length > 0 && (
                    <div className='bg-white/5 rounded-xl p-5 border border-white/10'>
                        <h4 className='text-sm font-medium text-[#CC8400] mb-2'>Productors</h4>
                        <p className='text-white font-medium'>
                            {producers.map(p => p.name).join(', ')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CastSection
