import { useState, useEffect } from 'react';

const useSearch = (query: string) => {
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (query.length >= 0) {
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
            } else {
                setResults([]);
            }
        };

        fetchData();
    }, [query]);

    return results;
};

export default useSearch;
