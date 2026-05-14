export default function FilterBar({ genres, activeGenre, onSelect, labelTotes = 'Totes' }) {
    return (
        <div
            className='flex gap-2 px-6 md:px-12 mb-8 overflow-x-auto pb-1'
            style={{ scrollbarWidth: 'none' }}
        >
            <button
                onClick={() => onSelect(null)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                    ${activeGenre === null
                        ? 'bg-[#CC8400] border-[#CC8400] text-black'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                    }`}
            >
                {labelTotes}
            </button>

            {genres.map(genre => (
                <button
                    key={genre.id}
                    onClick={() => onSelect(genre.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                        ${activeGenre === genre.id
                            ? 'bg-[#CC8400] border-[#CC8400] text-black'
                            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                        }`}
                >
                    {genre.name}
                </button>
            ))}
        </div>
    )
}
