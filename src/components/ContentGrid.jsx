import MovieCard from '@/components/MovieCard'

export default function ContentGrid({ items, loading, emptyIcon: EmptyIcon, emptyText, emptySubtext, mediaType }) {
    if (loading) {
        return (
            <div className='flex justify-center py-32'>
                <div className='w-12 h-12 border-4 border-[#CC8400] border-t-transparent rounded-full animate-spin' />
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className='flex flex-col items-center py-32 text-center'>
                {EmptyIcon && <EmptyIcon className='text-white/10 text-6xl mb-4' />}
                <p className='text-white/40 text-xl'>{emptyText}</p>
                {emptySubtext && <p className='text-white/20 text-sm mt-2'>{emptySubtext}</p>}
            </div>
        )
    }

    return (
        <div className='px-6 md:px-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4'>
            {items.map(item => (
                <MovieCard
                    key={item.id}
                    movie={mediaType ? { ...item, media_type: mediaType } : item}
                />
            ))}
        </div>
    )
}
