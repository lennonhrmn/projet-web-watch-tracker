import usePhoto from "@/hooks/usePhoto";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useRouter } from "next/router";

interface PhotoALaUneProps {
    category: string;
    backgroundOnly?: boolean;
}

const PhotoALaUne = ({ category, backgroundOnly = false }: PhotoALaUneProps) => {
    const router = useRouter();
    const { data } = usePhoto(category);
    const categoryMAJ = category.toUpperCase();

    const handleInfoClick = () => {
        router.push({
            pathname: `/content${categoryMAJ}`,
            query: { id: data.key, type: categoryMAJ }
        });
    };

    return (<>
        <div className="absolute top-0 gradient-bg-bottom" style={{ width: "100%" }}>
            <video className="alaune w-full h-full object-cover -z-10" autoPlay loop muted poster={data?.imageUrl} />
        </div>
        {!backgroundOnly && (<div style={{ margin: '4.0vw', padding: '0vw' }} className="relative">
            <p
                style={{ fontSize: '3vw', width: '50%' }}
                className="
                    text-white
                    h-full
                    font-bold
                    drop-shadow-xl">
                {data?.title}
            </p>
            <p
                style={{ fontSize: '1.8vw', width: '70%', marginTop: '1vw' }}
                className="
                    text-white
                    drop-sahdow-xl">
                {data?.description}
            </p>
            <div
                style={{ marginTop: '1vw' }}
                className="
                    flex
                    flex-row
                    items-center          
                    gap-3">
                <button
                    onClick={handleInfoClick}
                    style={{ fontSize: '1.5vw', padding: '1vw' }}
                    className="
                        bg-white
                        text-white
                        bg-opacity-30
                        rounded-xl
                        w-auto
                        font-semibold
                        flex
                        flex-row
                        items-center
                        hover:bg-opacity-20
                        transition">
                    <AiOutlineInfoCircle className="mr-1" />
                    More Info
                </button>
            </div>
        </div>)}
    </>);
}

export default PhotoALaUne;