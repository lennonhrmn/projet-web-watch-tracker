import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const ContentPage = () => {
    const router = useRouter();
    const { title, description, coverImage } = router.query;
    const [expanded, setExpanded] = useState(false);
    
    const image = Array.isArray(coverImage) ? coverImage[0] : coverImage;

    const toggleDescription = () => {
        setExpanded(!expanded);
    };

    const truncatedDescription = (description ?? '').length > 200 && !expanded 
        ? `${(description ?? '').slice(0, 200)}...` 
        : (description ?? '');
    
    console.log(title, description, coverImage);
    return (
        <div>
            <Navbar />
            <div className='flex items-start'>
                <img src={image} className={`${expanded ? 'w-full h-75 top-32 left-[65%] relative z-1' : 'ml-20 mt-32'} `}/>
                <div className={`${expanded ? 'relative top-32 z-3' : 'ml-32 mt-32'}`}>
                    <p className="
                        text-white
                        md:text-4xl
                        h-full
                        w-[40%]
                        font-bold
                        drop-shadow-xl">
                        {title}
                    </p>
                    <p className="
                        text-white
                        md:text-[14px]
                        mt-3
                        md:mt-8
                        md:w-[50%]
                        drop-sahdow-xl">
                        {truncatedDescription}
                        {(description?.length ?? 0) > 200 && (
                            <button 
                                className="text-blue-500 hover:underline focus:outline-none" 
                                onClick={toggleDescription}
                            >
                                {expanded ? 'Read Less' : 'Read More'}
                            </button>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContentPage;