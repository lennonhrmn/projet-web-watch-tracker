import Navbar from '@/components/Navbar';
import PhotoALaUne from '@/components/PhotoALaUne';
import useWatchList from '@/hooks/useWatchList';
import React, { useEffect, useRef, useState } from 'react';
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
    const navbarHeight = -120; // Hauteur de la navbar
    const [navbarOffset, setNavbarOffset] = useState(0);
    const trendingRef = useRef<HTMLDivElement>(null);
    const popularRef = useRef<HTMLDivElement>(null);
    const newContentRef = useRef<HTMLDivElement>(null);
    const finishedRef = useRef<HTMLDivElement>(null);
    const actionRef = useRef<HTMLDivElement>(null);
    const adventureRef = useRef<HTMLDivElement>(null);
    const comedyRef = useRef<HTMLDivElement>(null);
    const dramaRef = useRef<HTMLDivElement>(null);
    const ecchiRef = useRef<HTMLDivElement>(null);
    const fantasyRef = useRef<HTMLDivElement>(null);
    const romanceRef = useRef<HTMLDivElement>(null);
    const sportsRef = useRef<HTMLDivElement>(null);
    const supernaturalRef = useRef<HTMLDivElement>(null);
    const shounenRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const navbarElement = document.querySelector('Navbar');
        if (navbarElement instanceof HTMLElement) {
            setNavbarOffset(navbarElement.offsetHeight * (-2));
        }
    }, []);

    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGenre(event.target.value);
        // Faites défiler jusqu'à la watchlist correspondante
        let targetRef: React.RefObject<HTMLDivElement> | null = null;
        switch (event.target.value) {
            case "Action":
                targetRef = actionRef;
                break;
            case "Adventure":
                targetRef = adventureRef;
                break;
            case "Comedy":
                targetRef = comedyRef;
                break;
            case "Drama":
                targetRef = dramaRef;
                break;
            case "Ecchi":
                targetRef = ecchiRef;
                break;
            case "Fantasy":
                targetRef = fantasyRef;
                break;
            case "Romance":
                targetRef = romanceRef;
                break;
            case "Sports":
                targetRef = sportsRef;
                break;
            case "Supernatural":
                targetRef = supernaturalRef;
                break;
            case "Shōnen":
                targetRef = shounenRef;
                break;
            default:
                break;
        }
        // Si le ref cible existe, faites défiler jusqu'à lui
        if (targetRef && targetRef.current) {
            const targetPosition = targetRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: targetPosition + navbarHeight, behavior: 'smooth' });
        }
    };

    const { data: trendingManga = [] } = useWatchList("trendingManga", "MANGA");
    const { data: popularManga = [] } = useWatchList("popularManga", "MANGA");
    const { data: newContentManga = [] } = useWatchList("newContent", "MANGA");
    const { data: finishedManga = [] } = useWatchList("finishedContent", "MANGA");
    const { data: actionContent = [] } = useWatchList("genreContent", "MANGA", "Action");
    const { data: adventureContent = [] } = useWatchList("genreContent", "MANGA", "Adventure");
    const { data: comedyContent = [] } = useWatchList("genreContent", "MANGA", "Comedy");
    const { data: dramaContent = [] } = useWatchList("genreContent", "MANGA", "Drama");
    const { data: ecchiContent = [] } = useWatchList("genreContent", "MANGA", "Ecchi");
    const { data: fantasyContent = [] } = useWatchList("genreContent", "MANGA", "Fantasy");
    const { data: romanceContent = [] } = useWatchList("genreContent", "MANGA", "Romance");
    const { data: sportsContent = [] } = useWatchList("genreContent", "MANGA", "Sports");
    const { data: supernaturalContent = [] } = useWatchList("genreContent", "MANGA", "Supernatural");
    const { data: shounenContent = [] } = useWatchList("tagContent", "MANGA", "Shounen");

    return (
        <>
            <Navbar />
            <div className="flex flex-row gap-[3vw] mt-[10vh] ml-5 relative z-10">
                <h1
                    style={{ fontSize: '3vw' }}
                    className="text-white">Anime</h1>
                <select id="genreSelect"
                    style={{ marginTop: '0vh', fontSize: '3vw' }}
                    className='cursor-pointer text-white bg-transparent hover:text-gray-300 translation'
                    onChange={handleGenreChange}
                    value={selectedGenre}
                >
                    <option value="Genre" className="bg-transparent hidden">Genre</option>
                    <option value="Action" className="bg-transparent text-black">Action</option>
                    <option value="Adventure" className="bg-transparent text-black">Adventure</option>
                    <option value="Comedy" className="bg-transparent text-black">Comedy</option>
                    <option value="Drama" className="bg-transparent text-black">Drama</option>
                    <option value="Ecchi" className="bg-transparent text-black">Ecchi</option>
                    <option value="Fantasy" className="bg-transparent text-black">Fantasy</option>
                    <option value="Romance" className="bg-transparent text-black">Romance</option>
                    <option value="Sports" className="bg-transparent text-black">Sports</option>
                    <option value="Supernatural" className="bg-transparent text-black">Supernatural</option>
                    <option value="Shōnen" className="bg-transparent text-black">Shōnen</option>
                </select>
            </div>
            <PhotoALaUne category="manga" />
            <div className='flex flex-col justify'>
                <WatchList title="Trending now" data={trendingManga} type="MANGA" category="trendingManga" listRef={trendingRef} />
                <WatchList title="Popular now" data={popularManga} type="MANGA" category="popularManga" listRef={popularRef} />
                <WatchList title="New Release" data={newContentManga} type="MANGA" category="newContent" listRef={newContentRef} />
                <WatchList title="Finished" data={finishedManga} type="MANGA" category="finishedContent" listRef={finishedRef} />
                <WatchList title="Action" data={actionContent} type="MANGA" category="genreContent" genre="Action" listRef={actionRef} />
                <WatchList title="Adventure" data={adventureContent} type="MANGA" category="genreContent" genre="Adventure" listRef={adventureRef} />
                <WatchList title="Comedy" data={comedyContent} type="MANGA" category="genreContent" genre="Comedy" listRef={comedyRef} />
                <WatchList title="Drama" data={dramaContent} type="MANGA" category="genreContent" genre="Drama" listRef={dramaRef} />
                <WatchList title="Ecchi" data={ecchiContent} type="MANGA" category="genreContent" genre="Ecchi" listRef={ecchiRef} />
                <WatchList title="Fantasy" data={fantasyContent} type="MANGA" category="genreContent" genre="Fantasy" listRef={fantasyRef} />
                <WatchList title="Romance" data={romanceContent} type="MANGA" category="genreContent" genre="Romance" listRef={romanceRef} />
                <WatchList title="Sports" data={sportsContent} type="MANGA" category="genreContent" genre="Sports" listRef={sportsRef} />
                <WatchList title="Supernatural" data={supernaturalContent} type="MANGA" category="genreContent" genre="Supernatural" listRef={supernaturalRef} />
                <WatchList title="Shōnen" data={shounenContent} type="MANGA" category="tagContent" genre="Shounen" listRef={shounenRef} />
            </div>
        </>
    );
};

export default MangaPage;

