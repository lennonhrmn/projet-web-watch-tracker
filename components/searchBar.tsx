import useSearch from '@/hooks/useSearch';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FaBook } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { GoVideo } from "react-icons/go";

const SearchBar = () => {
  const [searchFormActive, setSearchFormActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = useSearch(searchQuery);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // State pour la largeur de la fenêtre

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchQuery.trim());
  };

  const handleSearchContent = (resultId: string, resultType: string) => {
    router.push({
      pathname: `/content${resultType}`,
      query: { id: resultId, type: resultType }
    });

    setSearchQuery('');
  };

  const searchBarWidth = windowWidth < 780 ? '8vw' : '20vw';

  return (
    <>
      {!searchFormActive && (
        <div
          className="flex flex-row ml-auto gap-7 items-center cursor-pointer text-white"
          onClick={() => setSearchFormActive(!searchFormActive)}
        >
          <BsSearch />
        </div>
      )}
      {searchFormActive && (
        <>
          <form onSubmit={handleSearch} className="flex flex-row ml-2 gap-2 items-center">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-gray-200 bg-transparent focus:outline-none border-b-2 border-gray-400"
              style={{ width: searchBarWidth }}
            />
          </form>
          <div
            className="flex flex-row ml-3 items-center cursor-pointer text-white"
            onClick={() => {
              setSearchFormActive(false)
              setSearchQuery('');
            }}
          >
            <RxCross2 />
          </div>
          <div className="absolute right-16 text-white top-14 bg-black border rounded-b-lg border-gray-300 shadow-lg z-50">
            {searchResults.map((result, index) => (
              <div key={index} className="p-1 hover:bg-gray-600 flex flex-row gap-1" onClick={() => {
                handleSearchContent(result.id, result.type);
                setSearchFormActive(false);
              }}>
                <img src={result.coverImage.medium} className="w-6 h-8" alt="cover" />
                {result.type === 'ANIME' ? (
                  <GoVideo className='w-6 mt-1.5' />
                ) : (
                  <FaBook className='w-6 mt-1.5' />
                )}
                <p className='mt-0.5'>
                  {result.title.english || result.title.romaji}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )

}

export default SearchBar;