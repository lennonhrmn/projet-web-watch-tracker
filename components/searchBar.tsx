import useSearch from '@/hooks/useSearch';
import router from 'next/router';
import { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { RxCross2 } from 'react-icons/rx';

const SearchBar = () => {
    const [searchFormActive, setSearchFormActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchResults = useSearch(searchQuery);

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSearchQuery(searchQuery.trim());
      };
    
      const handleSearchContent = (resultId: string, resultType: string) => {
        router.push({
          pathname: "/content",
          query: { id: resultId, type: resultType}
        });

        setSearchQuery('');
      };

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
              <form onSubmit={handleSearch} className="flex flex-row ml-auto gap-2 items-center">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-gray-200 bg-transparent focus:outline-none border-b-2 border-gray-400 px-2"
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
              <div className="absolute right-5 text-white top-14 bg-black border rounded-b-lg border-gray-300 shadow-lg z-50">
                {searchResults.map((result, index) => (
                  <div key={index} className="p-1 hover:bg-gray-600 flex flex-row gap-1" onClick= {() => {
                    handleSearchContent(result.id, result.type);
                    setSearchFormActive(false);
                  }}>
                    <p className='mt-0.5'>
                    {result.title.english || result.title.romaji}
                    </p>
                    <p className='mt-0.5'>
                    ({result.type.toLowerCase()})
                    </p>
                    <img src={result.coverImage.medium} className="w-6 h-8"/>
                  </div>
                ))}
              </div>
            </>
          )}
      </>
    )

}

export default SearchBar;