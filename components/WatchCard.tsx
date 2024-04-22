import React from "react";
import FavoriteButton from "./FavoriteButton";
import Link from "next/link";
import { useRouter } from "next/router";


interface WatchCardProps {
    data: Record<string, any>;
}

const WatchCard: React.FC<WatchCardProps> = ({ data }) => {
    
    const router = useRouter();

    const handleCardClick = () => {
        router.push({
            pathname: "/content",
            query: { title: data.title.english,
                    description: data.description,
                    coverImage: data.coverImage.large,
                    } 
        });
    };
    
    return (
        <div className="
            group 
            bg-zinc-900
            col-span
            relative
            rounded-md
            w-40
            h-38"
            onClick={handleCardClick}>
            <img src={data.coverImage.large} 
                       alt={data.title.english} 
                       className="cursor-pointer 
                       object-fill 
                       transition 
                       duration 
                       shadow-xl 
                       rounded-md 
                       group-hover:opacity-90 sm:group-hover:opacity-0 
                       delay-300 
                       w-full h-full"/>
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
                <img src={data.coverImage.large} alt={data.title.english} className="
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
                        <FavoriteButton contentId={data?.id ?? 0}/>
                        <p className="text-xs text-white">Add to library</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WatchCard;