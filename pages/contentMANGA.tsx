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
import useSaveContent from '@/hooks/useSaveContent';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useSession } from 'next-auth/react';
import useFavorite from '@/hooks/useFavorite';
import useFetchLastContent from '@/hooks/useFetchLastContent';
import useDeleteComment from '@/hooks/useDeleteComment';
import { MdDelete } from 'react-icons/md';
import { Triangle } from 'react-loader-spinner';


interface Comment {
    id: String
    content: String
    userId: String
    contentId: String
    user: any
}



const ContentPage = () => {
    const [expanded, setExpanded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [commentsOpen, setCommentsOpen] = useState(false); // Variable d'état pour suivre si la section des commentaires est ouverte ou fermée
    const [readChapters, setReadChapters] = useState<Set<number>>(new Set()); // Liste des épisodes lus
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [comments, setComments] = useState<Comment[]>([]); // Nouveau state pour stocker les commentaires
    const [commentContent, setCommentContent] = useState('');
    const { deleteComment } = useDeleteComment();
    const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
    const router = useRouter();
    let { id, type } = router.query;
    const { data: user } = useCurrentUser(); // Récupérer les données de l'utilisateur connecté
    const { data: session, status: sessionStatus } = useSession(); // Récupérer les données de session de l'utilisateur connecté
    const { data: content, isLoading } = useContent(id as string, type as string || "MANGA");
    const { saveContent } = useSaveContent();
    const { lastContentWatched } = useFetchLastContent(user?.id as string, id as string);
    const [isFavorite, setIsFavorite] = useState(false); // Variable d'état pour suivre si le contenu a été ajouté aux favoris
    const { data: userFavorites } = useFavorite(type as string || "MANGA"); // Récupérer les favoris de l'utilisateur
    const isAdmin = user?.isAdmin;
    const [screenSize, setScreenSize] = useState<number | null>(null);

    const handleBeforeUnload = () => {
        if (socket) {
            console.log('Disconnecting socket');
            socket.disconnect();
        }
        console.log('resetting comments and comment content')
        setCommentContent('');
        setComments([]);
    };

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth);
        };

        // Vérifie si window est défini avant d'ajouter l'écouteur d'événements de redimensionnement
        if (typeof window !== 'undefined') {
            setScreenSize(window.innerWidth);
            window.addEventListener('resize', handleResize);
        }

        // Nettoie l'écouteur d'événements lors du démontage du composant
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    // Effectue une mise à jour de l'état isFavorite si le contenu est déjà dans les favoris de l'utilisateur
    useEffect(() => {
        if (userFavorites && userFavorites.some((favorite: { id: number }) => favorite.id === parseInt(id as string))) {
            setIsFavorite(true);
        } else {
            setIsFavorite(false);
        }
    }, [userFavorites, id]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (screenSize === null) {
            return; // Avoid executing further code if screenSize is null
        }
    }, [screenSize]); // Add screenSize to the dependency array

    useEffect(() => {
        if (router.isReady && isMounted && (!id || !type)) {
            router.push('/library');
        } else if (id && type) {
            mutate(`api/aniList/content?id=${id}&type=${type}`);
        }
    }, [id, mutate, router, isMounted, type]);

    useEffect(() => {
        if (lastContentWatched) {
            setSelectedChapter(lastContentWatched);
            // Mettre à jour readchapters pour refléter les épisodes jusqu'au dernier épisode lu
            const newchapters = new Set<number>();
            for (let i = 1; i <= lastContentWatched; i++) {
                newchapters.add(i);
            }
            setReadChapters(new Set([...Array.from(newchapters)]));
        }
    }, [lastContentWatched]);


    // Connexion au serveur de sockets
    useEffect(() => {
        if (user) {
            const s = socket ? socket : io('http://' + window.location.host, {
                query: { contentId: id, type: "MANGA", user: JSON.stringify(user) }, // Envoyer l'ID du contenu et le type de contenu au serveur de sockets 
            });
            setSocket(s);

            s.on('restoreComments', (comments: Comment[]) => {
                setComments(comments);
            });

            s.on('newComment', (comment: Comment) => {
                setComments(prevComments => {
                    const newComments = [...prevComments, comment];
                    return Array.from(new Set(newComments.map(c => JSON.stringify(c)))).map(c => JSON.parse(c));
                });
            });

            // Ajouter l'événement de déchargement de la page pour gérer la déconnexion du socket
            window.addEventListener('beforeunload', handleBeforeUnload);

        }
        // Nettoyer l'événement lors du démontage du composant
        return () => {
            if (socket) {
                socket.disconnect();
            }
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [id, user]);

    useEffect(() => {
        const handleRouteChange = () => {
            if (socket) {
                socket.disconnect();
            }
        };

        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [socket, router]);

    if (screenSize === null) {
        return <div>Loading...</div>;
    }

    // Fonction appelée lorsque le bouton FavoriteButton est cliqué
    const handleFavoriteButtonClick = () => {
        setIsFavorite(!isFavorite); // Inverser l'état de la variable d'état isFavorite
    };

    const handleCommentSection = () => {
        setCommentsOpen(!commentsOpen); // Inverser l'état de la section des commentaires
    };

    const handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (commentContent.trim().length === 0) {
            return;
        }
        const newComment: Comment = {
            id: `${Math.random()}`,
            content: commentContent.trim(),
            userId: user.id,
            contentId: id as string,
            user: user
        };
        if (!socket) {
            console.error('Socket connection not established');
            return;
        }
        socket.emit('newComment', newComment, (response: any) => {
            if (response.status === 'ok') {
                mutate(`api/content${type}?id=${id}`);
            }
        }); // Envoyer le nouveau commentaire au serveur de sockets
        setCommentContent('');
    };

    const handleCommentContentChange = (event: any) => {
        setCommentContent(event.target.value);
    };

    // Fonction pour supprimer un commentaire, seulement accessible pour les administrateurs
    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(commentId);
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    const toggleDescription = () => {
        setExpanded(!expanded);
    };

    const { title, description, genres, status, chapters, volumes, startDate, coverImage, bannerImage, updatedAt, popularity, favorites,
        countryOfOrigin, sources, trailer, studios } = content ??
        {
            title: { english: '', romaji: '' }, description: '', genres: [], status: '', chapters: '', volumes: '', startDate: { year: '', month: '', day: '' },
            coverImage: { large: '', extraLarge: '' }, bannerImage: '', updatedAt: '', popularity: '', favourites: '', countryOfOrigin: '', sources: '',
            trailer: { site: '', thumbnail: '' }, studios: { node: { name: '' } }
        };

    const truncatedDescription = (description ?? '').length > 200 && !expanded
        ? `${(description ?? '').slice(0, 200)}...`
        : (description ?? '');

    const showRomaji = title.romaji && title.romaji.toUpperCase() !== title.english.toUpperCase();

    const bannerSrc = bannerImage ? bannerImage : coverImage.extraLarge;

    let lastChapter = chapters ? chapters : 0;

    function formatTime(seconds: any) {
        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        return `${days} days ${hours} hours`;
    }

    const handleChapterClick = async (chapterNumber: number | null) => {
        setSelectedChapter(chapterNumber);
        if (chapterNumber === null) {
            return;
        }
        setReadChapters(prevChapters => {
            const newchapters = new Set<number>(Array.from(prevChapters));
            for (let i = 1; i <= chapterNumber; i++) {
                newchapters.add(i);
            }
            return newchapters;
        });

        // Appeler handleSavechapter ici pour sauvegarder l'épisode immédiatement après la sélection
        if (session?.user) {
            try {
                await saveContent(session.user.id, id as string, chapterNumber, lastChapter);
                console.log('chapter saved successfully');
            } catch (error) {
                console.error('Failed to save chapter', error);
            }
        } else {
            console.log("No chapter selected or user not logged in");
        }
    };

    const handleBackButtonClick = () => {
        handleBeforeUnload();
        router.back();
    };

    return (
        <div>
            <Navbar />
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <Triangle
                        height="100"
                        width="100"
                        color="#ffffff"
                        ariaLabel="triangle-loading"
                        visible={true}
                    />
                </div>
            ) : (screenSize !== null && screenSize >= 640) ? (
                <div className='relative'>
                    <img src={bannerSrc}
                        className='w-full h-auto object-cover -z-1 opacity-20 gradient-bg-bottom absolute'
                        style={{ maxHeight: '400px' }} />
                    <div className='
                        z-0
                        '>
                        <FaCircleArrowLeft
                            size={"4vw"}
                            className='relative z-10 top-[14vh] ml-[3vw] text-white cursor-pointer'
                            onClick={handleBackButtonClick}
                        />
                        <div className='flex items-start z-2'>
                            <img src={coverImage.large} className='w-[16vw] top-[10vh] ml-[10vw] relative z-1' />
                            <div className="relative top-[10vh] ml-[6vw] z-3">
                                <p className="
                                    text-white
                                    text-[3vw]
                                    w-[80%]
                                    font-bold
                                    drop-shadow-xl">
                                    {title.english}
                                </p>
                                {showRomaji && (
                                    <p className="
                                text-white
                                text-[2vw]
                                mt-[1vh]
                                w-[80%]
                                font-bold
                                drop-shadow-xl">
                                        {title.romaji}
                                    </p>
                                )}
                                <div className='text-white text-[1vw]'>
                                    <p className="
                                    text-white 
                                    text-[1.2vw]
                                    mt-[1vh]
                                    w-[80%] 
                                    drop-shadow-xl">
                                        {truncatedDescription}
                                    </p>
                                    <div className='flex flex-row items-center space-x-3 mt-[1vh]'>
                                        <button className="bg-white text-white bg-opacity-30 rounded-md p-[0.5vw] w-auto font-semibold flex flex-row items-center hover:bg-opacity-20 transition" onClick={truncatedDescription.length > 200 ? toggleDescription : undefined}>
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
                                        <div className='mt-[0vh] flex flex-row items-center' onClick={handleFavoriteButtonClick}>
                                            <FavoriteButton contentId={typeof id === 'string' ? id : ''} type={"MANGA"} />
                                        </div>
                                        {favorites !== undefined && (
                                            <div className='flex flex-row items-center justify-center border border-white rounded-md mt-2 mb-2 p-1 space-x-1'>
                                                <p className='text-white text-xs'>{favorites}</p>
                                                <FaHeart className='text-red-500 text-1xl' />
                                            </div>
                                        )}
                                        <p className='text-white text-[1.5vw] flex flex-row items-center'><ReactCountryFlag countryCode={countryOfOrigin} svg /></p>
                                        {isFavorite && (
                                            <div className='flex flex-row space-x-3'>
                                                <DropdownList
                                                    episodes={lastChapter}
                                                    onSelectEpisode={handleChapterClick}
                                                    savedEpisodes={readChapters}
                                                    selectedEpisode={selectedChapter}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {genres && (
                                    <div className="flex mt-[1vh]">
                                        {genres.map((genre: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
                                            <div key={index} className="flex items-center justify-center border border-white rounded-md p-1 mr-1">
                                                <p className="text-white text-[1vw]">{genre}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className='flex'>
                                    <div className='border border-white rounded-md justify-center items-center flex p-1 mt-1 inline-flex'>
                                        <p className='text-white text-[1vw]'>Release year - {startDate.year}</p>
                                    </div>
                                    <div className='border border-white rounded-md justify-center items-center flex p-1 mt-1 ml-1 inline-flex'>
                                        <p className='text-white text-[1vw]'>Status - {status}</p>
                                    </div>
                                </div>
                                <div className="w-[60%]">
                                    <div className='flex flex-row items-center space-x-2 cursor-pointer hover:bg-white hover:bg-opacity-10 rounded-md pt-1 w-[10vw] justify-center items-center'
                                        onClick={handleCommentSection}>
                                        <p className='text-white text-[1.5vw]'>Comments</p>
                                        <FaCommentAlt className='text-white text-[1.5vw] mt-[1vh]' />
                                    </div>
                                    {commentsOpen && (
                                        <div>
                                            {isAdmin ? (
                                                <ul>
                                                    {comments.map((comment: Comment, index: number) => (
                                                        <li key={index} className='flex'>
                                                            <MdDelete className='text-red-600 mt-1 mr-2 ml-2 cursor-pointer' onClick={() => handleDeleteComment(comment.id.toString())} />
                                                            <p className='text-white'>{comment?.user?.firstName ?? "Na"} {comment?.user?.lastName ?? "Na"} : {comment.content}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <ul>
                                                    {comments.map((comment: Comment, index: number) => (
                                                        <li key={index}>
                                                            <p className='text-white'>{comment?.user?.firstName ?? "Na"} {comment?.user?.lastName ?? "Na"} : {comment.content}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
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
                    </div>
                </div>
            ) : (
                <div className='relative'>
                    <img src={bannerSrc}
                        className='w-full h-auto object-cover -z-1 opacity-20 gradient-bg-bottom absolute'
                        style={{ maxHeight: '400px' }} />
                    <div className='z-0'>
                        <FaCircleArrowLeft
                            size={"6vw"}
                            className='relative z-10 top-[10vh] ml-[3vw] text-white cursor-pointer'
                            onClick={handleBackButtonClick}
                        />
                        <div className='flex flex-col items-center z-2'>
                            <img src={coverImage.large} className='w-[32vw] relative z-1 top-10' />
                            <div className="relative top-12 text-center z-3">
                                <p className="text-white text-[6vw] font-bold drop-shadow-xl">
                                    {title.english}
                                </p>
                                {showRomaji && (
                                    <p className="text-white text-[4vw] mt-2 font-bold drop-shadow-xl">
                                        {title.romaji}
                                    </p>
                                )}
                                <div className='text-white text-[3vw] mx-[3vw] mt-2'>
                                    <p className="text-white text-[3.5vw] drop-shadow-xl text-left">
                                        {truncatedDescription}
                                    </p>
                                    <button className="bg-white text-white text-left mt-[1vh] bg-opacity-30 rounded-md p-[2vw] w-auto font-semibold flex flex-row hover:bg-opacity-20 transition" onClick={truncatedDescription.length > 200 ? toggleDescription : undefined}>
                                        {expanded ? (
                                            <>
                                                <CiUnread className='mr-2' />
                                                Read Less
                                            </>
                                        ) : (
                                            <>
                                                <CiRead className='mr-2' />
                                                Read More
                                            </>
                                        )}
                                    </button>
                                    <div className='flex flex-col items-center space-y-3 mt-2'>
                                        <div className='flex flex-row space-x-3'>
                                            <div className='flex flex-row items-center' onClick={handleFavoriteButtonClick}>
                                                <FavoriteButton contentId={typeof id === 'string' ? id : ''} type={"MANGA"} />
                                            </div>
                                            {favorites !== undefined && (
                                                <div className='flex flex-row items-center justify-center border border-white rounded-md p-1 space-x-1'>
                                                    <p className='text-white text-[2.5vw]'>{favorites}</p>
                                                    <FaHeart className='text-red-500 text-[4vw]' />
                                                </div>
                                            )}
                                            <p className='text-white text-[4vw] flex flex-row items-center'><ReactCountryFlag countryCode={countryOfOrigin} svg /></p>
                                            {isFavorite && (
                                                <div className='flex flex-row items-center space-x-3'>
                                                    <DropdownList
                                                        episodes={lastChapter}
                                                        onSelectEpisode={handleChapterClick}
                                                        savedEpisodes={readChapters}
                                                        selectedEpisode={selectedChapter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {genres && (
                                    <div className="flex flex-wrap justify-center mt-2">
                                        {genres.map((genre: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
                                            <div key={index} className="flex items-center justify-center border border-white rounded-md p-2 m-1">
                                                <p className="text-white text-[2.5vw]">{genre}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className='flex flex-wrap justify-center'>
                                    <div className='border border-white rounded-md flex justify-center items-center p-2 mt-2 m-1'>
                                        <p className='text-white text-[2.5vw]'>Release year - {startDate.year}</p>
                                    </div>
                                    <div className='border border-white rounded-md flex justify-center items-center p-2 mt-2 m-1'>
                                        <p className='text-white text-[2.5vw]'>Status - {status}</p>
                                    </div>
                                </div>
                                <div className="w-[100%] mt-4">
                                    <div className='flex flex-row items-center cursor-pointer hover:bg-white hover:bg-opacity-10 rounded-md pt-2 w-[30vw] justify-center'
                                        onClick={handleCommentSection}>
                                        <p className='text-white text-[4vw]'>Comments</p>
                                        <FaCommentAlt className='text-white ml-[1vw] text-[4vw]' />
                                    </div>
                                    {commentsOpen && (
                                        <div className='mt-4 w-[80%]'>
                                            {isAdmin ? (
                                                <ul>
                                                    {comments.map((comment: Comment, index: number) => (
                                                        <li key={index} className='flex items-center'>
                                                            <MdDelete className='text-red-600 text-[6vw] cursor-pointer' onClick={() => handleDeleteComment(comment.id.toString())} />
                                                            <p className='text-white text-[3vw] ml-2'>{comment?.user?.firstName ?? "Na"} {comment?.user?.lastName ?? "Na"} : {comment.content}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <ul>
                                                    {comments.map((comment: Comment, index: number) => (
                                                        <li key={index}>
                                                            <p className='text-white text-[3vw] ml-2'>{comment?.user?.firstName ?? "Na"} {comment?.user?.lastName ?? "Na"} : {comment.content}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <form onSubmit={handleSubmitComment} className="mt-2">
                                                <textarea
                                                    className="leading-relaxed block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-[3vw]"
                                                    rows={4}
                                                    value={commentContent}
                                                    onChange={handleCommentContentChange}
                                                    placeholder="Add a comment..."
                                                />
                                                <button
                                                    type="submit"
                                                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-[3vw] font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Submit
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default ContentPage;