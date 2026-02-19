import React, { useEffect, useRef, useState } from 'react'
import Header from './Header'
import GlobalApi from '../Services/GlobalApi';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2"

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"
const screenWidht = window.innerWidth;

function Slider() {
    const [movieList, setMovieList] = useState([])
    const elementRef = useRef();
    useEffect(() => {
        getTrendingMovies();
    }, []);

    const getTrendingMovies = () => {
        GlobalApi.getTrendingVideos().then((resp) => {
            console.log(resp.data.results);
            setMovieList(resp.data.results)
        })
    }

    const sliderRight = (element) => {
        element.scrollLeft += screenWidht - 110;
    }
    const sliderLeft = (element) => {
        element.scrollLeft -= screenWidht - 110;
    }
    return (
        <div>
            <HiChevronLeft className="hidden md:block text-white hover:text-[#CC8400] text-[40px] absolute
            mx-8 mt-[148px] cursor-pointer transition-all duration-300 ease-in-out z-10"
                onClick={() => sliderLeft(elementRef.current)} />
            <HiChevronRight className="hidden md:block text-white hover:text-[#CC8400] text-[40px] absolute
            mx-8 mt-[148px] cursor-pointer right-0 transition-all duration-300 ease-in-out z-10"
                onClick={() => sliderRight(elementRef.current)} />

            <div className='flex overflow-x-auto w-full px-16 py-4
        scrollbar-hide scroll-smooth' ref={elementRef}>
                {movieList.map((item, index) => (
                    <img key={index} src={IMAGE_BASE_URL + item.backdrop_path}
                        className='min-w-full md:h-[310px] object-cover 
                    object-left-top mr-5 rounded-md hover:border-[4px] border-gray-400 transition-all
                    duration-100 ease-in-out'
                    />
                ))}
            </div>
        </div>
    )
}

export default Slider