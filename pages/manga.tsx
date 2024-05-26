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

const MangaPage = () => {
    const [selectedGenre, setSelectedGenre] = useState("Genre");
    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGenre(event.target.value);
    };

    const { data: trendingManga = [] } = useWatchList("trendingManga");
    const { data: popularManga = [] } = useWatchList("popularManga");

    return (
        <div className='bg-black relative'>
            <Navbar />
            <PhotoALaUne category="manga" />
            <div className="absolute xl:top-24 lg:top-24 md1:top-24 md2:top-20 sm1:top-20 sm2:top-20 xs:top-16 z-10 flex gap-8 xl:ml-16 lg:ml-16 md1:ml-16 md2:ml-16 sm1:ml-8 sm2:ml-5 xs:ml-5 ">
                <h1 className="text-white xs:text-[12px] sm2:text-2xl sm1:text-2xl md2:text-4xl md1:text-5xl lg:text-5xl xl:text-5xl">Manga</h1>
                <div className='relative'>
                    <select id="genreSelect"
                        className="cursor-pointer xs:text-[10px] sm2:text-1md sm1:text-1xl md2:text-1xl md1:text-2xl md2:text-2xl lg:text-3xl xl:text-3xl absolute bottom-0 text-white bg-transparent hover:text-gray-300 translation"
                        onChange={handleGenreChange}
                        value={selectedGenre}>
                        <option value="Genre" className="bg-transparent">Genre</option>
                        <option value="manga" className="bg-transparent">Shonen</option>
                    </select>
                </div>
            </div>
            <div className='absolute z-11 ml-3 xl:top-64 lg:top-64 md1:top-64 md2:top-60 sm1:top-52 sm2:top-32 xs:top-12 flex flex-col justify-center translate-y-32'>
                <WatchList title="Trending now" data={trendingManga} type="MANGA" />
                <WatchList title="Popular now" data={popularManga} type="MANGA" />
            </div>
        </div>
    );
};

export default MangaPage;