import Navbar from '@/components/Navbar';
import PhotoALaUne from '@/components/PhotoALaUne';
import useWatchList from '@/hooks/useWatchList';
import React, { useState } from 'react';
import WatchList from '@/components/WatchList';
import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';

export async function getServerSideProps(context : NextPageContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/auth",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

const AnimePage = () => {
    const [selectedGenre, setSelectedGenre] = useState("Genre");
    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGenre(event.target.value);
    };

    const { data: trendingAnime = [] } = useWatchList("trendingAnime");
    const { data: popularAnime = [] } = useWatchList("popularAnime");

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
                <WatchList title="Trending now" data={trendingAnime} type="ANIME"/>
                <WatchList title="Popular now" data={popularAnime} type="ANIME"/>
            </div>
        </div>
    );
};

export default AnimePage;