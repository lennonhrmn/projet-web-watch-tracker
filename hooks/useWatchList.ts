import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useWatchList = (category: string, type: String) => {

    const { data, error, isLoading } = useSWR(`/api/aniList/${category}?type=${type}`, fetcher, {
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