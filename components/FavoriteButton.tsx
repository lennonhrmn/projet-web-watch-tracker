import axios from "axios";
import React, { useCallback, useMemo } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorite from "@/hooks/useFavorite";
import { AiOutlinePlus } from "react-icons/ai";

interface FavoriteButtonProps {
    contentId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ contentId }) => {
    return (
        <div className="
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
            <AiOutlinePlus size={20} className="text-white"/>
        </div>
    );
}

export default FavoriteButton;