import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useContent = (id: string, type: string) => {

    const { data, error, isLoading, mutate } = useSWR(`api/aniList/content?id=${id}&type=${type.toUpperCase()}`, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
        revalidateOnMount: false,
    });
    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export default useContent;