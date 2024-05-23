import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useFavorite = (category: string) => {

    const { data, error, isLoading, mutate } = useSWR(`/api/favorites?category=${category}`, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,
    });


    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export default useFavorite;