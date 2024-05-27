import Navbar from '@/components/Navbar';
import PhotoALaUne from '@/components/PhotoALaUne';
import useWatchList from '@/hooks/useWatchList';
import React, { useState } from 'react';
import WatchList from '@/components/WatchList';
import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';

export async function getServerSideProps(context: NextPageContext) {
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

    const { data: trendingAnime = [] } = useWatchList("trendingAnime", "ANIME");
    const { data: popularAnime = [] } = useWatchList("popularAnime", "ANIME");
    const { data: finishedAnime = [] } = useWatchList("finishedContent", "ANIME");

    return (
        <>
            <Navbar />
            <div className="flex flex-row gap-8 mt-[10vh] mx-[3.2vw] relative z-10">
                <h1 className="text-white xs:text-[12px] sm2:text-2xl sm1:text-2xl md2:text-4xl md1:text-5xl lg:text-5xl xl:text-5xl">Anime</h1>
                <select id="genreSelect"
                    className="cursor-pointer xs:text-[10px] sm2:text-[16px] sm1:text-[18px] md1:text-2xl md2:text-2xl lg:text-3xl xl:text-3xl text-white bg-transparent hover:text-gray-300 translation"
                    onChange={handleGenreChange}
                    value={selectedGenre}>
                    <option value="Genre" className="bg-transparent hidden">Genre</option>
                    <option value="manga" className="bg-transparent">Shonen</option>
                    <option value="manga" className="bg-transparent">Seinen</option>
                    <option value="manga" className="bg-transparent">Shojo</option>
                    <option value="manga" className="bg-transparent">Josei</option>
                </select>
            </div>
            <PhotoALaUne category="anime" />
            <div className='flex flex-col justify'>
                <WatchList title="Trending now" data={trendingAnime} type="ANIME" />
                <WatchList title="Popular now" data={popularAnime} type="ANIME" />
                <WatchList title="Finished" data={finishedAnime} type="ANIME" />
            </div>
        </>
    );
};

export default AnimePage;