import Navbar from '@/components/Navbar';
import PhotoALaUne from '@/components/PhotoALaUne';
import { useWatchList } from '@/hooks/useWatchList';
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

const AnimePage = () => {
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

    const { data: trendingAnime = [] } = useWatchList("trendingAnime", "ANIME");
    const { data: popularAnime = [] } = useWatchList("popularAnime", "ANIME");
    const { data: newContentAnime = [] } = useWatchList("newContent", "ANIME");
    const { data: finishedAnime = [] } = useWatchList("finishedContent", "ANIME");
    const { data: actionContent = [] } = useWatchList("genreContent", "ANIME", "Action");
    const { data: adventureContent = [] } = useWatchList("genreContent", "ANIME", "Adventure");
    const { data: comedyContent = [] } = useWatchList("genreContent", "ANIME", "Comedy");
    const { data: dramaContent = [] } = useWatchList("genreContent", "ANIME", "Drama");
    const { data: ecchiContent = [] } = useWatchList("genreContent", "ANIME", "Ecchi");
    const { data: fantasyContent = [] } = useWatchList("genreContent", "ANIME", "Fantasy");
    const { data: romanceContent = [] } = useWatchList("genreContent", "ANIME", "Romance");
    const { data: sportsContent = [] } = useWatchList("genreContent", "ANIME", "Sports");
    const { data: supernaturalContent = [] } = useWatchList("genreContent", "ANIME", "Supernatural");
    const { data: shounenContent = [] } = useWatchList("tagContent", "ANIME", "Shounen");

    return (
        <>
            <Navbar />
            <div className="flex flex-row gap-8 mt-[10vh] ml-5 relative z-10">
                <h1 className="text-white xs:text-[12px] sm2:text-2xl sm1:text-2xl md2:text-4xl md1:text-5xl lg:text-5xl xl:text-5xl">Anime</h1>
                <select id="genreSelect"
                    className="cursor-pointer xs:text-[10px] sm2:text-[16px] sm1:text-[18px] md1:text-2xl md2:text-2xl lg:text-3xl xl:text-3xl text-white bg-transparent hover:text-gray-300 translation"
                    onChange={handleGenreChange}
                    value={selectedGenre}>
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
            <PhotoALaUne category="anime" />
            <div className='flex flex-col justify'>
                <WatchList title="Trending now" data={trendingAnime} type="ANIME" category="trendingAnime" listRef={trendingRef} />
                <WatchList title="Popular now" data={popularAnime} type="ANIME" category="popularAnime" listRef={popularRef} />
                <WatchList title="New Release" data={newContentAnime} type="ANIME" category="newContent" listRef={newContentRef} />
                <WatchList title="Finished" data={finishedAnime} type="ANIME" category="finishedContent" listRef={finishedRef} />
                <WatchList title="Action" data={actionContent} type="ANIME" category="genreContent" genre="Action" listRef={actionRef} />
                <WatchList title="Adventure" data={adventureContent} type="ANIME" category="genreContent" genre="Adventure" listRef={adventureRef} />
                <WatchList title="Comedy" data={comedyContent} type="ANIME" category="genreContent" genre="Comedy" listRef={comedyRef} />
                <WatchList title="Drama" data={dramaContent} type="ANIME" category="genreContent" genre="Drama" listRef={dramaRef} />
                <WatchList title="Ecchi" data={ecchiContent} type="ANIME" category="genreContent" genre="Ecchi" listRef={ecchiRef} />
                <WatchList title="Fantasy" data={fantasyContent} type="ANIME" category="genreContent" genre="Fantasy" listRef={fantasyRef} />
                <WatchList title="Romance" data={romanceContent} type="ANIME" category="genreContent" genre="Romance" listRef={romanceRef} />
                <WatchList title="Sports" data={sportsContent} type="ANIME" category="genreContent" genre="Sports" listRef={sportsRef} />
                <WatchList title="Supernatural" data={supernaturalContent} type="ANIME" category="genreContent" genre="Supernatural" listRef={supernaturalRef} />
                <WatchList title="Shōnen" data={shounenContent} type="ANIME" category="tagContent" genre="Shounen" listRef={shounenRef} />
            </div>
        </>
    );
};

export default AnimePage;
