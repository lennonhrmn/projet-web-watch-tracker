import React from "react";
import { CiHeart } from "react-icons/ci";
import FavoriteButton from "./FavoriteButton";


interface WatchCardProps {
    data: Record<string, any>;
}

const WatchCard: React.FC<WatchCardProps> = ({ data }) => {
    return (
        <div className="
            group 
            bg-zinc-900
            col-span
            relative
            rounded-md
            w-40
            h-38">
            <img src={data.imageUrl} alt={data.title} className="cursor-pointer object-contain transition duration shadow-xl rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 w-40 h-38"/>
            <div className="
                opacity-0
                absolute
                top-0
                transition
                duration-200
                z-10
                invisible
                sm:visible
                delay-300
                scale-0
                group-hover:scale-110
                group-hover:translate-y-[-4vw]
                group-hover:opacity-100
                ">
                <img src={data.imageUrl} alt={data.title} className="
                cursor-pointer 
                object-contain 
                transition 
                duration 
                shadow-xl 
                rounded-t-md 
                w-40
                h-38 
                "/>
                <div className="
                    z-10
                    bg-zinc-800
                    p-2
                    lg:p-4
                    absolute
                    w-full
                    transition
                    shadow-md
                    rounded-b-md">
                    <div className="flex flex-row items-center gap-3">
                        <FavoriteButton contentId={data?.id}/>
                        <p className="text-xs text-white">Add to library</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WatchCard;