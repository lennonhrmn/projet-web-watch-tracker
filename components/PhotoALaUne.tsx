import usePhoto from "@/hooks/usePhoto";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useRouter } from "next/router";

interface PhotoALaUneProps {
    category: string;
}

const PhotoALaUne = ({ category } : PhotoALaUneProps) => {
    const router = useRouter();
    const { data } = usePhoto(category);
    const categoryMAJ = category.toUpperCase();

    const handleInfoClick = () => {
        router.push({
          pathname: `/content${categoryMAJ}`,
          query: { id: data.key, type: categoryMAJ}
        });
      };

    return (
        <div>
            <div className="relative">
                <video className="w-full" poster={data?.imageUrl}/>
            </div>
            <div className="
                    absolute
                    top-[30%]
                    ml-4
                    md:ml-16">
                    <p className="
                        text-white
                        md:text-4xl
                        h-full
                        w-[40%]
                        font-bold
                        drop-shadow-xl">
                        {data?.title}
                    </p>
                    <p className="
                        text-white
                        md:text-[14px]
                        mt-3
                        md:mt-8
                        md:w-[50%]
                        drop-sahdow-xl">
                        {data?.description}
                    </p>
                    <div className="
                        flex
                        flex-row
                        items-center
                        mt-3
                        md:mt-4
                        gap-3">
                        <button 
                        onClick={handleInfoClick}
                        className="
                                bg-white
                                text-white
                                bg-opacity-30
                                rounded-md
                                py-1 md:py-2
                                px-2 md:px-4
                                w-auto
                                text-xs
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
            </div>
        </div>
    );
}

export default PhotoALaUne;