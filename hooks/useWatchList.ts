import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useWatchList = (category: string) => {
    // const { data, error, isLoading } = useSWR(`/api/watch?category=${category}`, fetcher, {
    //     revalidateOnFocus: false,
    //     revalidateIfStale: false,
    //     revalidateOnReconnect: false,
    // });

    const { data, error, isLoading } = useSWR(`/api/aniList/${category}`, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    });
    console.log(data);
    return {
        data,
        error,
        isLoading,
    };
}

export default useWatchList;