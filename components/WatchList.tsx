import React from 'react';
import { isEmpty } from 'lodash';
import WatchCard from './WatchCard';

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
        <div className='px-4 md:px-12 mt-0 space-y-2'>
            <p className='text-white test-md md:text-xl lg:text-2xl font-seminold'>
                {title}
            </p>
            <div className='grid grid-cols-6 gap-0'>
                {data.map((anime) => (
                    <WatchCard key={anime.id} data={anime}/>
                ))}
            </div>
        </div>
    )
}

export default WatchList;