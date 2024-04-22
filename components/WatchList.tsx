import React from 'react';
import { isEmpty } from 'lodash';
import WatchCard from './WatchCard';
// import { responsive } from './CarouselResponsive';
// import Carousel from 'react-multi-carousel';


interface WatchListProps {
    data: Record<string, any>[];
    title: string;
}

const WatchList : React.FC<WatchListProps> = ({ data, title }) => {

    if (isEmpty(data)) {
        console.log('No data');
        return null;
    }

    console.log(data);

    return (
        <div className='px-4 md:px-12 mb-5 space-y-2'>
            <p className='text-white test-md md:text-xl lg:text-2xl font-seminold'>
                {title}
            </p>
            <div className='grid grid-cols-5 gap-3'>
                {data.map((item) => (
                    <WatchCard key={item?.id ?? 0} data={item}/>
                ))}
            </div>

            {/* <Carousel responsive={responsive}>
                        {data.map((item) => (
                            <WatchCard key={item?.id ?? 0} data={item}/>
                        ))}
            </Carousel> */}
        </div>
    )
}

export default WatchList;