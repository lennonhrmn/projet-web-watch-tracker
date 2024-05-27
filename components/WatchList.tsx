import React from 'react';
import WatchCard from './WatchCard';
import { useSwipeable } from 'react-swipeable';

interface WatchListProps {
  data: Record<string, any>[];
  title: string;
  type: string;
}

const WatchList: React.FC<WatchListProps> = ({ data, title, type }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (ref.current) {
        ref.current.scrollBy({ left: 900, behavior: 'smooth' });
      }
    },
    onSwipedRight: () => {
      if (ref.current) {
        ref.current.scrollBy({ left: -900, behavior: 'smooth' });
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className='mb-5 space-y-2 mt-2'>
      <div className="rounded-lg bg-white p-1 inline-block ml-10 opacity-90">
        <p className='text-black xs:text-[10px] sm2:text-xs sm1:text-md md2:text-md md1:text-xl lg:text-xl xl:text-xl font-semibold'>
          {title}
        </p>
      </div>
      <div
        {...handlers}
        ref={ref}
        className='grid grid-flow-col auto-cols-[15%] gap-[1vw] overflow-x-scroll no-scrollbar px-5'>
        {data && data.map((item) => (
          <WatchCard key={item?.id ?? 0} data={item} type={type} />
        ))}
      </div>
    </div>
  );
}

export default WatchList;
