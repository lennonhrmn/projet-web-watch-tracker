import usePhoto from "@/hooks/usePhoto";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useRouter } from "next/router";

interface PhotoALaUneProps {
    category: string;
}

const PhotoALaUne = ({ category }: PhotoALaUneProps) => {
    const router = useRouter();
    const { data } = usePhoto(category);
    const categoryMAJ = category.toUpperCase();

    const handleInfoClick = () => {
        router.push({
            pathname: `/content${categoryMAJ}`,
            query: { id: data.key, type: categoryMAJ }
        });
    };

    return (
        <div>
            <div className="relative">
                <video className="w-full" poster={data?.imageUrl} />
            </div>
            <div className="
                    absolute
                    xl:top-[25%] lg:top-[28%] md1:top-[33%] md2:top-[35%] sm1:top-[38%] sm2:top-[45%] xs:top-[40%]
                    lg:ml-16 md:ml-16 sm:ml-16 ml-16
                    ">
                <p className="
                        text-white
                        xl:text-4xl lg:text-4xl md1:text-4xl md2:text-4xl sm1:text-2xl sm2:text-1xl xs:text-[10px] 
                        h-full
                        xl:w-[40%] lg:w-[40%] md1:w-[40%] md2:w-[50%] sm1:w-[50%] sm2:w-[50%] w-[80%]
                        font-bold
                        drop-shadow-xl">
                    {data?.title}
                </p>
                <p className="
                        text-white
                        xl:text-[14px] lg:text-[14px] md1:text-[14px] md2:text-[14px] sm1:text-[12px] sm2:text-[10px] xs:text-[7px]
                        xl:mt-8 lg:mt-6 md1:mt-7 md2:mt-6 sm1:mt-3 sm2:mt-1 mt-1
                        xl:w-[50%] lg:w-[55%] md1:w-[60%] md2:w-[65%] sm1:w-[70%] sm2:w-[80%] w-[80%]
                        drop-sahdow-xl">
                    {data?.description}
                </p>
                <div className="
                        flex
                        flex-row
                        items-center
                        xl:mt-4 lg:mt-4 md1:mt-4 md2:mt-4 sm1:mt-4 sm2:mt-2 mt-2            
                        gap-3">
                    <button
                        onClick={handleInfoClick}
                        className="
                                bg-white
                                text-white
                                bg-opacity-30
                                rounded-md
                                xl:py-2 lg:py-2 md1:py-2 md2:py-2 sm1:py-2 sm2:py-1 py-1
                                xl:px-4 lg:px-4 md1:px-4 md2:px-4 sm1:px-4 sm2:px-3 px-3
                                w-auto
                                lg:text-xs lg:text-xs md1:text-xs md2:text-xs sm1:text-xs sm2:text-[10px] text-[10px]
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