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
import { FaCommentAlt, FaHeart, FaRegCheckCircle } from "react-icons/fa";
import DropdownList from '@/components/DropdownList';
import io, { Socket } from 'socket.io-client'; // Importation de socket.io-client
import useCurrentUser from '@/hooks/useCurrentUser';
import { Input } from 'postcss';
import { DefaultEventsMap } from '@socket.io/component-emitter';

interface Comment {
    id: String
    content: String
    // createdAt: Date
    userId: String
    contentId: String
    user: any
}

const ContentPage = () => {
    const router = useRouter();
    const { data: user } = useCurrentUser(); // Récupérer les données de l'utilisateur connecté
    let { id, type } = router.query;
    if (Array.isArray(id)) {
        id = id[0];
    }
    const [expanded, setExpanded] = useState(false);
    const { data: content, isLoading } = useContent(id as string ?? '', type as string ?? '');
    const [isMounted, setIsMounted] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
    const [readEpisodes, setReadEpisodes] = useState<Set<number>>(new Set()); // Liste des épisodes lus
    const [comments, setComments] = useState<Comment[]>([]); // Nouveau state pour stocker les commentaires
    const [commentsOpen, setCommentsOpen] = useState(false); // Variable d'état pour suivre si la section des commentaires est ouverte ou fermée
    const [commentContent, setCommentContent] = useState('');
    const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

    // Connexion au serveur de sockets
    useEffect(() => {
        if (user) {
            const s = socket ? socket : io('http://' + window.location.host.split(':')[0] + ':3001', {
                query: { contentId: id, type: "ANIME", user: JSON.stringify(user) }, // Envoyer l'ID du contenu et le type de contenu au serveur de sockets 
            })
            setSocket(s);

            s.on('restoreComments', (comments: Comment[]) => {
                setComments(comments); // Restaurer les commentaires précédents
                // console.log('Comments restored:', comments);
            });

            s.on('newComment', (comment: Comment) => {
                console.log('New comment received:', comments, comment);
                setComments(prevComments => {
                    const newComments = [...prevComments, comment];
                    return Array.from(new Set(newComments.map(c => JSON.stringify(c)))).map(c => JSON.parse(c));
                }); // Ajouter le nouveau commentaire à la liste des commentaires
            });
        }

        return () => {
            if (socket) socket.disconnect(); // Déconnexion du serveur de sockets lorsque le composant est démonté
        };
    }, []);

    const handleCommentSection = () => {
        setCommentsOpen(!commentsOpen); // Inverser l'état de la section des commentaires
    };

    const handleSubmitComment = (event: any) => {
        event.preventDefault();
        console.log(event);
        if (commentContent.trim().length === 0) {
            return;
        }
        const newComment: Comment = {
            id: crypto.randomUUID(),
            content: commentContent.trim(),
            // createdAt: new Date(),
            userId: user.id,
            contentId: id as string,
            user: user
        };
        if (!socket) {
            console.error('Socket connection not established');
            return;
        }
        socket.emit('newComment', newComment); // Envoyer le nouveau commentaire au serveur de sockets
        setCommentContent('');
    };

    const handleCommentContentChange = (event: any) => {
        setCommentContent(event.target.value);
    };

    const handleSaveEpisode = () => {
        if (selectedEpisode !== null) {
            const newEpisodes = new Set<number>(); // Créer un nouvel ensemble pour stocker les nouveaux épisodes lus
            for (let i = 1; i <= selectedEpisode; i++) {
                newEpisodes.add(i); // Ajouter chaque épisode jusqu'à l'épisode sélectionné inclusivement
            }
            setReadEpisodes(prevEpisodes => new Set([...Array.from(prevEpisodes), ...Array.from(newEpisodes)])); // Ajouter les nouveaux épisodes à l'ensemble existant
        } else {
            console.log("No episode selected");
        }
    };

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
        {
            title: { english: '', romaji: '' }, description: '', genres: [], status: '', episodes: '', startDate: { year: '', month: '', day: '' },
            coverImage: { large: '', extraLarge: '' }, bannerImage: '', updatedAt: '', nextAiringEpisode: { airingAt: '', timeUntilAiring: '', episode: '' },
            popularity: '', favourites: '', countryOfOrigin: '', sources: '', trailer: { site: '', thumbnail: '' }, studios: { node: { name: '' } }
        };

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
            <img src={bannerSrc} className='w-full h-auto top-0 left-0 absolute z-0 opacity-20' />
            <div className='absolute'>
                <FaCircleArrowLeft
                    size={40}
                    className='relative z-10 top-32 ml-5 text-white cursor-pointer'
                    onClick={handleBackButtonClick}
                />
                <div className='flex items-start z-2'>
                    <img src={coverImage.large} className={`${expanded ? 'w-full h-75 ml-32 mt-24 relative z-1' : 'ml-32 mt-24'} `} />
                    <div className={`${expanded ? 'relative ml-24 mt-20 z-3' : 'ml-24 mt-20'}`}>
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
                        <div className="text-white text-[14px] mt-3 w-[80%] drop-shadow-xl">
                            <p>{truncatedDescription}</p>
                            <div className='flex flex-row space-x-3'>
                                <button className="bg-white text-white bg-opacity-30 rounded-md mt-1 mb-1 py-1 px-1 w-auto text-xs font-semibold flex flex-row items-center hover:bg-opacity-20 transition" onClick={truncatedDescription.length > 200 ? toggleDescription : undefined}>
                                    {expanded ? (
                                        <>
                                            <CiUnread className='mr-1' />
                                            Read Less
                                        </>
                                    ) : (
                                        <>
                                            <CiRead className='mr-1' />
                                            Read More
                                        </>
                                    )}
                                </button>
                                <div className='mt-1'>
                                    <FavoriteButton contentId={typeof id === 'string' ? id : ''} type={''} />
                                </div>
                                <div className='flex flex-row items-center justify-center border border-white rounded-md mt-2 mb-2 p-1 space-x-1'>
                                    <p className='text-white text-xs'>{favourites}</p>
                                    <FaHeart className='text-red-500 text-1xl' />
                                </div>
                                <p className='text-white text-2xl'><ReactCountryFlag countryCode={countryOfOrigin} svg /></p>
                                <div className='flex flex-row space-x-3'>
                                    <DropdownList
                                        episodes={(episodes !== undefined && episodes !== null) ? episodes : nextAiringEpisode.episode - 1}
                                        onSelectEpisode={setSelectedEpisode}
                                        savedEpisodes={readEpisodes}
                                    />
                                    <FaRegCheckCircle size={25} className='mt-2' onClick={handleSaveEpisode} />
                                </div>
                            </div>
                        </div>
                        {genres && (
                            <div className="flex mt-2">
                                {genres.map((genre: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
                                    <div key={index} className="flex items-center justify-center border border-white rounded-md p-1 mr-1">
                                        <p className="text-white text-xs">{genre}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className='flex'>
                            <div className='border border-white rounded-md justify-center items-center flex p-1 mt-1 inline-flex'>
                                <p className='text-white text-xs'>Release year - {startDate.year}</p>
                            </div>
                            <div className='border border-white rounded-md justify-center items-center flex p-1 mt-1 ml-1 inline-flex'>
                                <p className='text-white text-xs'>Status - {status}</p>
                            </div>
                        </div>
                        {nextAiringEpisode && nextAiringEpisode.timeUntilAiring && (
                            <div className='border border-white rounded-md justify-center items-center flex p-1 mt-1 inline-flex'>
                                <p className='text-white text-xs'>Next episode - {formatTime(nextAiringEpisode.timeUntilAiring)}</p>
                            </div>
                        )}
                        {/* {type === 'ANIME' && (
                        <p className='text-white text-1xl'>Number of episodes - { content?.episodes }</p>
                    )}
                    {type === 'MANGA' && (
                        <p className='text-white text-1xl'>Number of chapters - { content?.chapters }</p>
                    )} */}
                        {/* <p className='text-white text-1xl'>Last updated - { updatedAt }</p> */}
                        {/* {nextAiringEpisode && nextAiringEpisode.episode && (
                        <p className='text-white text-1xl'>Next Episode - { nextAiringEpisode.episode }</p>)} */}
                        {/* <p className='text-white text-1xl'>Sources - { sources } (fonctionne pas ?)</p> */}
                        {/* <p className='text-white text-1xl'>Trailer link - { trailer.site } (pas terrible)</p> */}
                        {/* <p className='text-white text-1xl'>Studios - { studios.nodes.name } (pas terrible)</p> */}
                    </div>
                </div>
                <div className="comment-section">
                    <div className='flex flex-row space-x-2 mt-2 cursor-pointer hover:bg-white hover:bg-opacity-10 rounded-md p-1 w-32 justify-center items-center'
                        onClick={handleCommentSection}>
                        <h2 className='text-white'>Comments</h2>
                        <FaCommentAlt className='text-white mt-1.5' />
                    </div>
                    {commentsOpen && (
                        <div>
                            <ul>
                                {comments.map((comment: Comment, index: number) => (
                                    <li key={index}>
                                        <p className='text-white'>By: {comment?.user?.firstName ?? "Na"} {comment?.user?.lastName ?? "Na"}</p>
                                        <p className='text-white'>{comment.content}</p>
                                    </li>
                                ))}
                            </ul>
                            <form onSubmit={handleSubmitComment}>
                                <textarea
                                    className="mt-2 leading-relaxed block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    rows={4}
                                    value={commentContent}
                                    onChange={handleCommentContentChange}
                                    placeholder="Add a comment..."
                                />
                                <button
                                    type="submit"
                                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentPage;