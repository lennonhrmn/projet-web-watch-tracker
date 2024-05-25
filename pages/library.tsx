import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';
import useCurrentUser from "@/hooks/useCurrentUser";
import Navbar from "@/components/Navbar";
import { MdWavingHand } from "react-icons/md";
import WatchCard from "@/components/WatchCard";
import useFavorite from "@/hooks/useFavorite";
import useFetchMultipleContent from "@/hooks/useFetchMultipleContent"

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
    const { data: favorites = [], mutate } = useFavorite(selectedCategory || "Anime");

    const { data: contentData, isLoading, error } = useFetchMultipleContent(user?.id, favorites.map((item: any) => item.id));

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

    // Check if there are no favorites
    if (favorites.length === 0) {
        return (
            <div className="bg-black">
                <Navbar />
                <div className="pt-16">
                    <div className="flex mt-5 justify-center text-white sm:text-2xl md:text-3xl">
                        <h1 className="mr-3">Welcome {name}</h1>
                        <MdWavingHand className="mt-1" />
                    </div>
                    <div className='ml-10'>
                        <div className="p-5 flex gap-8">
                            <h1 className="text-white sm:text-2xl md:text-3xl">My Library</h1>
                            <select id="categorySelect"
                                className="cursor-pointer sm:text-1xl md:text-2xl mt-1 text-white bg-black hover:text-gray-300 translation"
                                onChange={handleCategoryChange}
                                value={selectedCategory || ''}>
                                <option value="Anime">Anime</option>
                                <option value="Manga">Manga</option>
                            </select>
                        </div>
                        <div className="p-5">
                            <select id="favoriteStatus"
                                className="cursor-pointer sm:text-1xl md:text-2xl mt-1 text-white bg-black hover:text-gray-300 translation"
                                onChange={handleStatusChange}
                                value={selectedStatus}>
                                <option value="watchList">WatchList</option>
                                <option value="currentlyWatching">Currently Watching</option>
                                <option value="finishedWatching">Finished Watching</option>
                            </select>
                        </div>
                        <div className='text-white p-5 space-y-1'>
                            <p>No favorites at the moment, what are you waiting for !</p>
                            <p>Go check content by clicking on category or the search bar ;)</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-black">
                <Navbar />
                <div className="pt-16 flex justify-center items-center h-screen">
                    Loading...
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
            <div className="pt-16">
                <div className="flex mt-5 justify-center text-white sm:text-2xl md:text-3xl">
                    <h1 className="mr-3">Welcome {name}</h1>
                    <MdWavingHand className="mt-1" />
                </div>
                <div>
                    <div className="ml-10 p-5 flex gap-8">
                        <h1 className="text-white sm:text-2xl md:text-3xl">My Library</h1>
                        <select id="categorySelect"
                            className="cursor-pointer sm:text-1xl md:text-2xl mt-1 text-white bg-black hover:text-gray-300 translation"
                            onChange={handleCategoryChange}
                            value={selectedCategory || ''}>
                            <option value="Anime">Anime</option>
                            <option value="Manga">Manga</option>
                        </select>
                    </div>
                    <div className="ml-10 p-5">
                        <select id="favoriteStatus"
                            className="cursor-pointer sm:text-1xl md:text-2xl mt-1 text-white bg-black hover:text-gray-300 translation"
                            onChange={handleStatusChange}
                            value={selectedStatus}>
                            <option value="watchList">WatchList</option>
                            <option value="currentlyWatching">Currently Watching</option>
                            <option value="finishedWatching">Finished Watching</option>
                        </select>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2 ml-10">
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
