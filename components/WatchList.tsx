import React, { useEffect, useRef, useState } from 'react';
import WatchCard from './WatchCard';
import { useSwipeable } from 'react-swipeable';
import { Triangle } from 'react-loader-spinner';
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

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

  const url = `/api/aniList/${category}?type=${type}&page=${page}${genre ? `&genre=${genre}` : ''}`;
  const { data: newData, error } = useSWR(url, fetcher);

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
    if (newData && newData.length) {
      setContent((prev) => [...prev, ...newData]);
    } else if (newData && !newData.length) {
      setStopLoading(true);
    }
  }, [newData]);

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

  if (error) return <div>Error loading data</div>;

  return (
    <div className='my-5 space-y-2'>
      <style jsx>{`
        .watchCardTitle::before {
          content: '';
          display: block;
          height: 1.5vw;
          width: 1.0vw;
          margin-right: 1vw;
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
        {content.map((item, index) => (
          <WatchCard key={`${item.id}-${index}`} data={item} type={type} />
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
