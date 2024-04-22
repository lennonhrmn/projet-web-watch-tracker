import axios from "axios";
import React, { useCallback, useMemo } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorite from "@/hooks/useFavorite";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";

interface FavoriteButtonProps {
    contentId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ contentId }) => {
    const { mutate: mutateFavorites } = useFavorite();
    const { data: currentUser, mutate } = useCurrentUser();

    const isFavorite = useMemo(() => {
        const list = currentUser?.favoriteIds || [];

        return list.includes(contentId);
    }, [currentUser, contentId]);

    const toggleFavorite = useCallback(async () => {
        let response;

        if (isFavorite) {
            response = await axios.delete("/api/favorite", { data: { contentId } });
        } else {
            response = await axios.post("/api/favorite", { contentId });
        }

        const updatedFavoriteIds = response?.data?.favoriteIds;

        mutate({ ...currentUser, favoriteIds: updatedFavoriteIds });

        mutateFavorites();
    }, [currentUser, contentId, isFavorite, mutate, mutateFavorites]);

    const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

    return (
        <div 
            onClick={toggleFavorite}
            className="
            cursor-pointer
            group/item
            w-5
            h-5
            lg:w-10
            lg:h-10
            border-2
            rounded-full
            flex
            justify-center
            items-center
            transition
            hover:border-neutral-300
            ">
            <Icon size={20} className="text-white"/>
        </div>
    );
}

export default FavoriteButton;