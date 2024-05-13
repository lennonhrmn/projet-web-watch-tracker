import axios from "axios";
import React, { useCallback, useMemo } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorite from "@/hooks/useFavorite";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";
import { getSession, useSession } from "next-auth/react";

interface FavoriteButtonProps {
    contentId: string;
    type: string
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ contentId, type }) => {
    const { mutate: mutateFavorites } = useFavorite(type);
    const { data: currentUser, mutate } = useCurrentUser();
    const { data : currentSession } = useSession();

    const isFavorite = useMemo(() => {
        const list = currentUser?.favoriteIds || [];

        return list.includes(contentId);
    }, [currentUser, contentId]);

    const toggleFavorite = useCallback(async () => {
        let response;
        try {
            if (isFavorite) {
                response = await axios.delete("/api/favorite", { data: { contentId, session : currentSession }});
            } else {
                response = await axios.post("/api/favorite", { contentId, session : currentSession });
            }
        
            const updatedFavoriteIds = response?.data?.favoriteIds;
        
            mutate({ ...currentUser, favoriteIds: updatedFavoriteIds });
        
            mutateFavorites();
        } catch (error) {
            console.error('An error occurred while toggling the favorite status:', error);
        }}, [isFavorite, contentId, currentUser, mutate, mutateFavorites])

    const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

    return (
        <div 
            onClick={toggleFavorite}
            className="
            cursor-pointer
            group/item
            w-8
            h-8
            border-2
            rounded-full
            flex
            justify-center
            items-center
            transition
            hover:border-neutral-300
            ">
            <Icon size={15} className="text-white"/>
        </div>
    );
}

export default FavoriteButton;