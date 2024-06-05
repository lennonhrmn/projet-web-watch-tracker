import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';
import useCurrentUser from "@/hooks/useCurrentUser";
import Navbar from "@/components/Navbar";
import { MdWavingHand } from "react-icons/md";
import WatchCard from "@/components/WatchCard";
import useFavorite from "@/hooks/useFavorite";
import useFetchMultipleContent from "@/hooks/useFetchMultipleContent";
import PhotoALaUne from '@/components/PhotoALaUne';
import { Triangle } from 'react-loader-spinner';

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/anime",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

const Library = () => {
    const { data: user } = useCurrentUser();
    const name = user?.firstName;

    const getInitialCategory = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('selectedCategory') || 'Anime';
        }
        return 'Anime';
    };

    const getInitialStatus = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('selectedStatus') || 'watchList';
        }
        return 'watchList';
    };

    const [selectedStatus, setSelectedStatus] = useState<string>(getInitialStatus());
    const [selectedCategory, setSelectedCategory] = useState<string | null>(getInitialCategory);
    const { data: favorites = [], mutate, isLoading: isFavoritesLoading } = useFavorite(selectedCategory || "Anime");
    const { data: contentData, isLoading: isContentLoading, error } = useFetchMultipleContent(user?.id, favorites.map((item: any) => item.id));

    useEffect(() => {
        if (typeof window !== 'undefined' && selectedCategory) {
            localStorage.setItem('selectedCategory', selectedCategory);
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('selectedStatus', selectedStatus);
        }
    }, [selectedStatus]);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value);
    };

    // Show loading spinner while fetching favorites
    if ((isFavoritesLoading || isContentLoading) && favorites.length !== 0) {
        return (
            <div className="bg-black">
                <Navbar />
                <div className="pt-16 flex justify-center items-center h-screen">
                    <Triangle color="#ffffff" />
                </div>
            </div>
        );
    }

    // Check if there are no favorites after data is fetched
    if (favorites.length === 0) {
        return (
            <div className="bg-black">
                <Navbar />
                <PhotoALaUne category={selectedCategory?.toLocaleLowerCase() || ''} backgroundOnly={true} />
                <div className="pt-16">
                    <div className="
                    relative
                    flex 
                    mt-5 
                    justify-center 
                    text-white 
                    xl:text-3xl lg:text-3xl md1:text-3xl md2:text-2xl sm1:text-1xl sm2:text-1xl xs:text-1xl
                    xl:mt-5 lg:mt-5 md1:mt-4 md2:mt-4 sm1:mt-4 sm2:mt-3 xs:mt-3 
                    ">
                        <h1 className="mr-3">Welcome {name}</h1>
                        <MdWavingHand className="mt-1" />
                    </div>
                    <div className="relative">
                        <div className="xl:ml-16 lg:ml-16 md1:ml-16 md2:ml-16 sm1:ml-6 ml-5 pt-3 flex gap-8">
                            <h1 className="text-white xs:text-1xl sm2:text-1xl sm1:text-1xl md2:text-2xl md1:text-3xl">My Library</h1>
                            <select id="categorySelect"
                                className="cursor-pointer xs:text-1xl sm2:text-1xl sm1:text-1xl md2:text-2xl md1:text-3xl text-white bg-transparent hover:text-gray-300 translation"
                                onChange={handleCategoryChange}
                                value={selectedCategory || ''}>
                                <option value="Anime" className='text-black'>Anime</option>
                                <option value="Manga" className='text-black'>Manga</option>
                            </select>
                        </div>
                        <div className="xl:ml-16 lg:ml-16 md1:ml-16 md2:ml-16 sm1:ml-6 ml-5 pt-5 pb-5">
                            <select id="favoriteStatus"
                                className="
                                cursor-pointer 
                                xl:text-2xl lg:text-2xl md1:text-2xl md2:text-2xl sm1:text-1xl sm2:text-1xl xs:text-1xl text-white bg-transparent hover:text-gray-300 translation"
                                onChange={handleStatusChange}
                                value={selectedStatus}>
                                <option value="watchList" className='text-black'>WatchList</option>
                                <option value="currentlyWatching" className='text-black'>Currently Watching</option>
                                <option value="finishedWatching" className='text-black'>Finished Watching</option>
                            </select>
                        </div>
                        <div className="
                            relative
                            mt-5 
                            text-white 
                            xl:text-3xl lg:text-3xl md1:text-3xl md2:text-2xl sm1:text-1xl sm2:text-1xl xs:text-1xl
                            xl:mt-5 lg:mt-5 md1:mt-4 md2:mt-4 sm1:mt-4 sm2:mt-3 xs:mt-3 
                            xl:ml-16 lg:ml-16 md1:ml-16 md2:ml-16 sm1:ml-6 ml-5
                            ">
                            <p>No favorites at the moment, what are you waiting for !</p>
                            <p>Go check content by clicking on category or the search bar ;)</p>
                            <img src="/images/fond-ecran/noFavorites.jpg" alt="empty" className="mt-5 w-1/4 h-auto" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-black">
                <Navbar />
                <div className="pt-16 flex justify-center items-center h-screen">
                    Error loading data: {error.message}
                </div>
            </div>
        );
    }

    const filteredFavorites = favorites.filter((item: Record<string, any>) => {
        const contentId = item.id;
        const content = contentData.find((contentItem: { contentId: string }) => contentItem.contentId === contentId.toString());

        if (!content) {
            return false; // If content is not found, don't include it
        }

        const lastContentWatch = content.lastContentWatch || 0;
        const lastContentEpisode = content.lastContent || 0;

        if (selectedStatus === 'watchList' && lastContentWatch === 0) {
            return true;
        }

        if (selectedStatus === 'currentlyWatching' && lastContentWatch > 0 && lastContentWatch < lastContentEpisode) {
            return true;
        }

        if (selectedStatus === 'finishedWatching' && lastContentWatch === lastContentEpisode && lastContentEpisode !== 0) {
            return true;
        }

        return false;
    });

    return (
        <div className="bg-black">
            <Navbar />
            <PhotoALaUne category={selectedCategory?.toLocaleLowerCase() || ''} backgroundOnly={true} />
            <div className="pt-16">
                <div className="
                relative
                flex 
                mt-5 
                justify-center 
                text-white 
                xl:text-3xl lg:text-3xl md1:text-3xl md2:text-2xl sm1:text-1xl sm2:text-1xl xs:text-1xl
                xl:mt-5 lg:mt-5 md1:mt-4 md2:mt-4 sm1:mt-4 sm2:mt-3 xs:mt-3 
                ">
                    <h1 className="mr-3">Welcome {name}</h1>
                    <MdWavingHand className="mt-1" />
                </div>
                <div className="relative">
                    <div className="xl:ml-16 lg:ml-16 md1:ml-16 md2:ml-16 sm1:ml-6 ml-5 pt-3 flex gap-8">
                        <h1 className="text-white xs:text-1xl sm2:text-1xl sm1:text-1xl md2:text-2xl md1:text-3xl">My Library</h1>
                        <select id="categorySelect"
                            className="cursor-pointer xs:text-1xl sm2:text-1xl sm1:text-1xl md2:text-2xl md1:text-3xl text-white bg-transparent hover:text-gray-300 translation"
                            onChange={handleCategoryChange}
                            value={selectedCategory || ''}>
                            <option value="Anime" className='text-black'>Anime</option>
                            <option value="Manga" className='text-black'>Manga</option>
                        </select>
                    </div>
                    <div className="xl:ml-16 lg:ml-16 md1:ml-16 md2:ml-16 sm1:ml-6 ml-5 pt-5 pb-5">
                        <select id="favoriteStatus"
                            className="
                            cursor-pointer 
                            xl:text-2xl lg:text-2xl md1:text-2xl md2:text-2xl sm1:text-1xl sm2:text-1xl xs:text-1xl text-white bg-transparent hover:text-gray-300 translation"
                            onChange={handleStatusChange}
                            value={selectedStatus}>
                            <option value="watchList" className='text-black'>WatchList</option>
                            <option value="currentlyWatching" className='text-black'>Currently Watching</option>
                            <option value="finishedWatching" className='text-black'>Finished Watching</option>
                        </select>
                    </div>
                    <div
                        className="px-5 flex flex-wrap gap-5 justify-center watch-cards"
                    >
                        {filteredFavorites.map((item: Record<string, any>) => (
                            <WatchCard key={item.id} data={item} type={selectedCategory === "Anime" ? "ANIME" : "MANGA"} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Library;
