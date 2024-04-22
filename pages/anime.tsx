import Navbar from '@/components/Navbar';
import PhotoALaUne from '@/components/PhotoALaUne';
import useWatchList from '@/hooks/useWatchList';
import React, { useState } from 'react';
import WatchList from '@/components/WatchList';
import useFavorite from '@/hooks/useFavorite';

const AnimePage = () => {
    const [selectedGenre, setSelectedGenre] = useState("Genre");
    const { data: favorites = [] } = useFavorite();

    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGenre(event.target.value);
    };

    const { data: anime = [] } = useWatchList("anime");

    return (
        <div className='bg-black relative'>
            <Navbar />
            <PhotoALaUne category="anime"/>
            <div className="absolute top-24 z-10 flex gap-8 ml-16 ">
                <h1 className="text-white sm:text-2xl md:text-5xl">Anime</h1>
                <select id="genreSelect" 
                        className="cursor-pointer sm:text-1xl md:text-2xl mt-4 text-white bg-transparent hover:text-gray-300 translation"
                        onChange={handleGenreChange}
                        value={selectedGenre}>
                    <option value="Genre" className="bg-transparent">Genre</option>
                    <option value="anime" className="bg-transparent">Shonen</option>
                </select>
            </div>
            <div className='absolute z-11 ml-3 top-80 translate-y-32'>
                <WatchList title="Trending now" data={anime}/>
                <WatchList title="Favorites" data={favorites}/>
            </div>
        </div>
    );
};

export default AnimePage;