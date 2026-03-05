import React from 'react'
import Generes from './Constant/GenresList'
import MovieList from './MovieList'

function GenreMovieList() {
  return (
    <div >
      {Generes.map((genere) => (
        <div key={genere.id} className='px-8 p-8 md:px-16'>
          <h2 className='text-[20px] font-bold text-white'>{genere.name}</h2>
          <MovieList genderId={genere.id} />
        </div>
      ))}
    </div>
  )
}

export default GenreMovieList