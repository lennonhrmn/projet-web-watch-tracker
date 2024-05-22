import { NextPageContext } from "next"
import { getSession, useSession, } from "next-auth/react"
import React, { useEffect, useState } from 'react';
import useCurrentUser from "@/hooks/useCurrentUser";

import Navbar from "@/components/Navbar";
import { MdWavingHand } from "react-icons/md";
import WatchList from "@/components/WatchList";
import useFavorite from "@/hooks/useFavorite";
import WatchCard from "@/components/WatchCard";


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
    const [selectedStatus, setSelectedStatus] = useState("watchList");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedCategory = localStorage.getItem('selectedCategory');
            setSelectedCategory(storedCategory || "Anime");
        } else {
            setSelectedCategory("Anime");
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && selectedCategory) {
            localStorage.setItem('selectedCategory', selectedCategory);
        }
    }, [selectedCategory]);

    const { data: favorites = [], mutate } = useFavorite(selectedCategory || "Anime");

    useEffect(() => {
        if (selectedCategory) {
            mutate();
        }
    }, [selectedCategory, mutate]);

    const session = useSession();

    if (!selectedCategory) {
        return null;
    }

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value);
    };

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
                            value={selectedCategory}>
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
                        {selectedCategory === "Anime" && favorites.map((item: Record<string, any>) => (
                            <WatchCard key={item.id} data={item} type="ANIME" />
                        ))}
                        {selectedCategory === "Manga" && favorites.map((item: Record<string, any>) => (
                            <WatchCard key={item.id} data={item} type="MANGA" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Library;