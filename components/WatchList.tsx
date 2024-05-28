import React, { useEffect, useRef, useState } from 'react';
import WatchCard from './WatchCard';
import { useSwipeable } from 'react-swipeable';
import { Triangle } from 'react-loader-spinner'
import { useWatchListNoHook } from '@/hooks/useWatchListNoHook';

interface WatchListProps {
  data: Record<string, any>[];
  title: string;
  type: string;
  category: string;
  genre?: string | null;
  listRef: React.RefObject<HTMLDivElement>;
}

const WatchList: React.FC<WatchListProps> = ({ data, title, type, category, genre = null, listRef }) => {
  const loaderRef = useRef(null);
  const [stopLoading, setStopLoading] = useState(false);
  const [content, setContent] = useState(data);
  const [page, setPage] = useState(1);
  const [watchListData, setWatchListData] = useState([]); // Initialize state variable for watchListData

  useEffect(() => {
    if (data.length) setContent(data);

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && data.length && !stopLoading) setPage(p => p + 1);
    });

    if (loaderRef.current && data.length) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [data, stopLoading]);

  useEffect(() => {
    if (!listRef.current || !data.length || page === 1) return;

    const getNewData = async () => {
      const newData = await useWatchListNoHook(category, type, genre, page); // Call the hook outside of useEffect
      setWatchListData(newData); // Update state variable with new data
      if (!newData.length) setStopLoading(true);

      setContent((prev) => [...prev, ...newData]);
    }

    getNewData()
  }, [page]); // Remove watchListData from dependency array

  let handlers = useSwipeable({
    onSwipedLeft: () => {
      if (listRef.current) {
        listRef.current.scrollBy({ left: 1000, behavior: 'smooth' });
      }
    },
    onSwipedRight: () => {
      if (listRef.current) {
        listRef.current.scrollBy({ left: -1000, behavior: 'smooth' });
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className='my-5 space-y-2'>
      <style jsx>{`
        .watchCardTitle::before {
          content: '';
          display: block;
          height: 1.5vw;
          width: 0.5rem;
          margin-right: 1rem;
          background-color: #ffffff;
        }
      `}</style>
      <div className="watchCardTitle text-[1.5vw] text-white opacity-90 ml-5 flex flex-row items-center justify-start">
        {title}
      </div>
      <div
        {...handlers}
        ref={listRef}
        className='grid grid-flow-col xs:auto-cols-[40%] sm2:auto-cols-[32%] sm1:auto-cols-[27%] md2:auto-cols-[23%] md1:auto-cols-[18%] lg:auto-cols-[15%] xl:auto-cols-[11%] gap-[1vw] overflow-x-scroll no-scrollbar px-5'>
        {content.map((item) => (
          <WatchCard key={item.id} data={item} type={type} />
        ))}
        <div ref={loaderRef} className="group bg-zinc-900 rounded-md overflow-hidden shadow-md relative not-draggable flex justify-center items-center flex-col gap-4">
          <Triangle color="#ffffff" />
          <div className="text-white text-xs">
            {stopLoading ? "No more content" : `Page ${page}`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchList;
