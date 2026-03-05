import React from 'react'
import Header from '@/components/Header'
import Slider from './components/Slider'
import ProductionHous from './components/ProductionHous'
import GenreMovieList from '@/components/GenreMovieList'
import HomeFooter from './components/HomeFooter'

function HomeLayout() {
    return (
        <div className='min-h-screen'>
            <Header />
            <main>
                <Slider />
                <ProductionHous />
                <GenreMovieList />
            </main>
            <HomeFooter />
        </div>
    )
}

export default HomeLayout
