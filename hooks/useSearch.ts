import { useState, useEffect } from 'react';

const useSearch = (query: string) => {
    const [results, setResults] = useState<any[]>([]);
    const [prevQueryLength, setPrevQueryLength] = useState<number>(0);


    useEffect(() => {
        const fetchData = async () => {
            if (query.length >= 2 && query.length % 2 === 0 && query.length >= prevQueryLength) {
                try {
                    const response = await fetch(`/api/search?query=${query}`);
                    const data = await response.json();
                    if (data.length === 0) {
                        setResults([]);
                    } else {
                        setResults(data);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            setPrevQueryLength(query.length);
        };

        fetchData();
    }, [query]);

    return results;
};

export default useSearch;
