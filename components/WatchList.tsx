import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import WatchCard from './WatchCard';
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";

interface WatchListProps {
  data: Record<string, any>[];
  title: string;
  type: string;
}

const WatchList: React.FC<WatchListProps> = ({ data, title, type }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [numCols, setNumCols] = useState(6); // Nombre de colonnes par défaut

  useEffect(() => {
    function handleResize() {
      // Détecter la largeur de l'écran et ajuster le nombre de colonnes en conséquence
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1280) {
        setNumCols(7);
      } else if (screenWidth >= 992) {
        setNumCols(6);
      } else if (screenWidth >= 848) {
        setNumCols(5);
      } else if (screenWidth >= 720) {
        setNumCols(4);
      } else if (screenWidth >= 587) {
        setNumCols(3);
      } else if (screenWidth >= 410) {
        setNumCols(2);
      } else {
        setNumCols(1);
      }
    }

    handleResize(); // Appeler une fois pour l'initialisation
    window.addEventListener('resize', handleResize); // Ajouter un écouteur d'événement de redimensionnement de fenêtre

    return () => window.removeEventListener('resize', handleResize); // Supprimer l'écouteur d'événement lors du démontage du composant
  }, []);

  if (isEmpty(data)) {
    return null;
  }

  // Calculez le nombre maximal de pages complètes
  const maxStartIndex = Math.floor((data.length - 1) / numCols) * numCols;
  const canGoNext = startIndex < maxStartIndex;
  const canGoPrev = startIndex > 0;

  const handleNextClick = () => {
    if (canGoNext) {
      setStartIndex(prevStartIndex => Math.min(prevStartIndex + numCols, maxStartIndex));
    }
  };

  const handlePrevClick = () => {
    if (canGoPrev) {
      setStartIndex(prevStartIndex => Math.max(prevStartIndex - numCols, 0));
    }
  };

  const getGridColsClass = (cols: number) => {
    switch (cols) {
      case 7:
        return 'xl:grid-cols-7 lg:grid-cols-6 md1:grid-cols-5 md2:grid-cols-4 sm1:grid-cols-3 sm2:grid-cols-2 grid-cols-1';
      case 6:
        return 'xl:grid-cols-7 lg:grid-cols-6 md1:grid-cols-5 md2:grid-cols-4 sm1:grid-cols-3 sm2:grid-cols-2 grid-cols-1';
      case 5:
        return 'xl:grid-cols-7 lg:grid-cols-6 md1:grid-cols-5 md2:grid-cols-4 sm1:grid-cols-3 sm2:grid-cols-2 grid-cols-1';
      case 3:
        return 'xl:grid-cols-7 lg:grid-cols-6 md1:grid-cols-5 md2:grid-cols-4 sm1:grid-cols-3 sm2:grid-cols-2 grid-cols-1';
      default:
        return 'xl:grid-cols-7 lg:grid-cols-6 md1:grid-cols-5 md2:grid-cols-4 sm1:grid-cols-3 sm2:grid-cols-2 grid-cols-1';
    }
  };

  return (
    <div className='px-4 mb-5 space-y-2 mt-2'>
      <div className="rounded-lg bg-white p-1 inline-block ml-10 opacity-90">
        <p className='text-black xs:text-[10px] sm2:text-xs sm1:text-md md2:text-md md1:text-xl lg:text-xl xl:text-xl font-semibold'>
          {title}
        </p>
      </div>
      <div className='flex flex-row'>
        <FaRegArrowAltCircleLeft className={`text-white mr-2 mt-24 cursor-pointer ${!canGoPrev && 'opacity-50'}`} size={30} onClick={handlePrevClick} />
        <div className={`grid ${getGridColsClass(numCols)} gap-3`}>
          {data.slice(startIndex, startIndex + numCols).map((item) => (
            <WatchCard key={item?.id ?? 0} data={item} type={type} />
          ))}
        </div>
        <FaRegArrowAltCircleRight className={`text-white ml-6 mt-24 cursor-pointer ${!canGoNext && 'opacity-50'}`} size={30} onClick={handleNextClick} />
      </div>
    </div>
  )
}

export default WatchList;
