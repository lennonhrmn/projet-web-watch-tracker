import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import WatchCard from './WatchCard';
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";

interface WatchListProps {
  data: Record<string, any>[];
  title: string;
  type: string;
}

const WatchList : React.FC<WatchListProps> = ({ data, title, type }) => {
  const [startIndex, setStartIndex] = useState(0);

  if (isEmpty(data)) {
    return null;
  }

  const canGoNext = startIndex < data.length - 6;
  const canGoPrev = startIndex > 0;

  const handleNextClick = () => {
    if (canGoNext) {
      setStartIndex(startIndex + 3);
    }
  };

  const handlePrevClick = () => {
    if (canGoPrev) {
      setStartIndex(startIndex - 3);
    }
  };

  return (
    <div className='px-4 mb-5 space-y-2'>
      <p className='text-white test-md md:text-xl lg:text-2xl font-seminold'>
        {title}
      </p>
      <div className='flex flex-row'>
        <FaRegArrowAltCircleLeft className={`text-white mr-2 mt-24 cursor-pointer ${!canGoPrev && 'opacity-50'}`} size={30} onClick={handlePrevClick}/>
        <div className='grid grid-cols-6 gap-3'>
            {data.slice(startIndex, startIndex + 6).map((item, index) => (
            <WatchCard key={item?.id ?? 0} data={item} type={type}/>
            ))}
        </div>
        <FaRegArrowAltCircleRight className={`text-white ml-5 mt-24 cursor-pointer ${!canGoNext && 'opacity-50'}`} size={30} onClick={handleNextClick}/>
      </div>
    </div>
  )
}

export default WatchList;
