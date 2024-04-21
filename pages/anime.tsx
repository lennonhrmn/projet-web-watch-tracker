import Navbar from '@/components/Navbar';
import PhotoALaUne from '@/components/PhotoALaUne';
import useWatchList from '@/hooks/useWatchList';
import React, { useState } from 'react';
import WatchList from '@/components/WatchList';

const AnimePage = () => {
    const [selectedGenre, setSelectedGenre] = useState("Genre");

    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGenre(event.target.value);
    };

    const { data: anime = [] } = useWatchList("anime");

    return (
        <div>
            <div>
                <PhotoALaUne category="anime"/>
                <Navbar />
                <div className="relative z-10 flex gap-8 pt-28 ml-16 ">
                    <h1 className="text-white sm:text-2xl md:text-5xl">Anime</h1>
                    <select id="genreSelect" 
                            className="cursor-pointer sm:text-1xl md:text-2xl mt-4 text-white bg-transparent hover:text-gray-300 translation"
                            onChange={handleGenreChange}
                            value={selectedGenre}>
                                <option value="Genre" className="bg-transparent">Genre</option>
                                <option value="Series" className="bg-transparent">Shonen</option>
                    </select>
                </div>
            </div>
            <div className='relative z-11 ml-3 pt-72'>
                <WatchList title="Trending now" data={anime}/>
            </div>
        </div>
    );
};

export default AnimePage;