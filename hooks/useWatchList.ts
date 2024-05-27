import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useWatchList = (category: string, type: String, genre: String | null = null) => {

    let url = `/api/aniList/${category}?type=${type}`;
    if (genre) {
        url += `&genre=${genre}`;
    }

    const { data, error, isLoading } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    });

    return {
        data,
        error,
        isLoading,
    };
}

export default useWatchList;