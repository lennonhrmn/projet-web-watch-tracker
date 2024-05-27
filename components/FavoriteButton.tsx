import axios from "axios";
import React, { useCallback } from "react";
import useFavorite from "@/hooks/useFavorite";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";
import { useSession } from "next-auth/react";

interface FavoriteButtonProps {
    contentId: string;
    type: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ contentId, type }) => {
    const { data: currentSession } = useSession();
    const { data: favorites, mutate: mutateFavorites } = useFavorite(type);

    let favoriteContent;

    if (favorites) {
        favoriteContent = favorites.find((favorite: { id: any }) => favorite.id == contentId)
    }

    let isFavorite = favoriteContent !== undefined;

    const toggleFavorite = useCallback(async () => {
        try {
            contentId = `${contentId}`

            if (isFavorite) {
                await axios.delete("/api/favorite", { data: { contentId, session: currentSession } });
            } else {
                await axios.post("/api/favorite", { contentId, type, session: currentSession });
            }

            // Mettre à jour les favoris après l'action
            mutateFavorites();

        } catch (error) {
            console.error('An error occurred while toggling the favorite status:', error);
        }
    }, [isFavorite, contentId, currentSession, mutateFavorites]);

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
            <Icon size={15} className="text-white" />
        </div>
    );
}

export default FavoriteButton;
