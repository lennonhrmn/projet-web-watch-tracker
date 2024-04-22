import { NextPageContext } from "next"
import { getSession, } from "next-auth/react"
import React, { useState } from 'react';
import useCurrentUser from "@/hooks/useCurrentUser";

import Navbar from "@/components/Navbar";
import { MdWavingHand } from "react-icons/md";
import WatchList from "@/components/WatchList";
import useFavorite from "@/hooks/useFavorite";


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

const Library = () => {
    const { data: user } = useCurrentUser();
    const { data: favoriteIds } = useFavorite();
    const name = user?.firstName;
    const [selectedCategory, setSelectedCategory] = useState("Series");

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    return (
        <div className="bg-black">
            <Navbar/>
            <div className="pt-16">
                <div className="flex mt-5 justify-center text-white sm:text-2xl md:text-3xl">
                    <h1 className="mr-3">Welcome back {name}</h1>
                    <MdWavingHand className="mt-1"/>
                </div>
                <div className="ml-10 p-5">
                    <div className="flex gap-8">
                        <h1 className="text-white sm:text-2xl md:text-3xl">My Library</h1>
                        <select id="categorySelect" 
                                className="cursor-pointer sm:text-1xl md:text-2xl mt-1 text-white bg-black hover:text-gray-300 translation"
                                onChange={handleCategoryChange}
                                value={selectedCategory}>
                                    <option value="Series">Series</option>
                                    <option value="Anime">Anime</option>
                                    <option value="Manga">Manga</option>
                        </select>
                    </div>
                    <div>  
                        <h1 className="text-white sm:text-2xl md:text-3xl mt-8">{selectedCategory}</h1>
                    </div>
                    <div className="inline-block text-center space-y-4 sm:space-y-10">
                        <div className="rounded-lg bg-white p-1 mt-4 sm:mt-8">
                            <h1 className="text-black text-sm sm:text-1xl font-bold">Currently watching</h1>
                        </div>
                        <div className="rounded-lg bg-white p-1 mt-4 sm:mt-8">
                            <h1 className="text-black text-sm sm:text-1xl font-bold">Wish list</h1>
                            <WatchList title="Wish list" data={[]}/>
                        </div>
                        <div className="rounded-lg bg-white p-1 mt-4 sm:mt-8">
                            <h1 className="text-black text-sm sm:text-1xl font-bold">Finished watching</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Library;



