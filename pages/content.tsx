import Navbar from '@/components/Navbar';
import useContent from '@/hooks/useContent';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { CiRead } from "react-icons/ci";
import { CiUnread } from "react-icons/ci";
import { mutate } from 'swr';
import ReactCountryFlag from "react-country-flag";
import { FaCircleArrowLeft } from "react-icons/fa6";
import FavoriteButton from '@/components/FavoriteButton';


const ContentPage = () => {
    const router = useRouter();
    const { id, type } = router.query;
    const [expanded, setExpanded] = useState(false);
    const { data: content, isLoading } = useContent(id as string ?? '', type as string ?? '');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (router.isReady && id === undefined && isMounted) {
            router.push('/library');
        } else {
            mutate(`api/content${type}?id=${id}`);
        }
    }, [id, mutate, router, isMounted]);


    const toggleDescription = () => {
        setExpanded(!expanded);
    };

    const { title, description, genres, status, episodes, startDate, coverImage, bannerImage, updatedAt, nextAiringEpisode, popularity, favourites, 
    countryOfOrigin, sources, trailer, studios } = content ?? 
    { title: { english: '', romaji: '' }, description: '', genres: [], status: '', episodes: '', startDate: { year: '', month: '', day: ''}, 
    coverImage: { large: '', extraLarge: '' }, bannerImage: '', nextAiringEpisode: { airingAt: '', timeUntilAiring: '', episode: '' }, 
    popularity: '', favourites:'', countryOfOrigin : '', sources: '', trailer: { site: '', thumbnail: ''}, studios: { node: { name: ''}}};

    const truncatedDescription = (description ?? '').length > 200 && !expanded 
        ? `${(description ?? '').slice(0, 200)}...` 
        : (description ?? '');
    
    const showRomaji = title.romaji && title.romaji !== title.english;

    const bannerSrc = bannerImage ? bannerImage : coverImage.extraLarge;

    function formatTime(seconds: any) {
        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        return `${days} days ${hours} hours`;
    }

    const handleBackButtonClick = () => {
        console.log("Back button clicked");
        router.back();
    };

    return (
        <div className="">
            <Navbar />
            <img src={bannerSrc} className='w-full h-auto top-0 left-0 absolute z-0 opacity-20'/>
            <FaCircleArrowLeft 
                size={40} 
                className='relative z-10 top-32 ml-5 text-white cursor-pointer'
                onClick={handleBackButtonClick} 
            />
            <div className='flex items-start absolute z-2'>
                <img src={coverImage.large} className={`${expanded ? 'w-full h-75 top-24 left-[65%] relative z-1' : 'ml-32 mt-24'} `}/>
                <div className={`${expanded ? 'relative top-24 z-3 mr-32' : 'ml-32 mt-24'}`}>
                    <p className="
                        text-white
                        text-4xl
                        h-full
                        w-[60%]
                        font-bold
                        drop-shadow-xl">
                        {title.english}
                    </p>
                    {showRomaji && (
                        <p className="
                            text-white
                            md:text-1xl
                            mt-2
                            h-full
                            w-[40%]
                            font-bold
                            drop-shadow-xl">
                            {title.romaji}
                        </p>
                    )}
                    <p className="
                        text-white
                        text-[14px]
                        mt-3
                        w-[50%]
                        drop-sahdow-xl">
                        {truncatedDescription}
                        <div className='flex flex-row'>
                        <button className="
                                bg-white
                                text-white
                                bg-opacity-30
                                rounded-md
                                mt-1
                                mr-3
                                mb-1
                                py-1
                                px-1 
                                w-auto
                                text-xs
                                font-semibold
                                flex
                                flex-row
                                items-center
                                hover:bg-opacity-20
                                transition"
                                onClick={toggleDescription}>
                                {expanded ? (
                                    <>
                                        <CiUnread className='mr-1'/>
                                        Read Less
                                    </>
                                ) : (
                                    <>
                                        <CiRead className='mr-1'/>
                                        Read More
                                    </>
                                )}
                        </button>
                        <FavoriteButton contentId={typeof id === 'string' ? id : ''}/>
                        </div>
                    </p>
                    <p className='text-white text-1xl'>Genres - {genres.join(', ')}</p>
                    <p className='text-white text-1xl'>Release year - { startDate.year }</p>
                    <p className='text-white text-1xl'>Status - { status }</p>
                    {type === 'ANIME' && (
                        <p className='text-white text-1xl'>Number of episodes - { content?.episodes }</p>
                    )}
                    {type === 'MANGA' && (
                        <p className='text-white text-1xl'>Number of chapters - { content?.chapters }</p>
                    )}
                    <p className='text-white text-1xl'>Last updated - { updatedAt } (à modifier)</p>
                    <p className='text-white text-1xl'>Number of favourited - { favourites }</p>
                    {nextAiringEpisode && nextAiringEpisode.episode && (
                        <p className='text-white text-1xl'>Next Episode - { nextAiringEpisode.episode }</p>)}
                    {nextAiringEpisode && nextAiringEpisode.timeUntilAiring && (
                        <p className='text-white text-1xl'>Time until next episode - { formatTime(nextAiringEpisode.timeUntilAiring) }</p>
                    )}
                    <p className='text-white text-1xl'>Country of origin - <ReactCountryFlag countryCode={countryOfOrigin} svg /></p>
                    {/* <p className='text-white text-1xl'>Sources - { sources } (fonctionne pas ?)</p> */}
                    {/* <p className='text-white text-1xl'>Trailer link - { trailer.site } (pas terrible)</p> */}
                    {/* <p className='text-white text-1xl'>Studios - { studios.nodes.name } (pas terrible)</p> */}
                </div>
            </div>
        </div>
    );
};

export default ContentPage;
