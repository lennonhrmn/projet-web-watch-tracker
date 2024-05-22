import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { use } from "react";

const useContent = (id: string, type: string) => {

    const { data, error, isLoading, mutate } = useSWR(`api/content${type}?id=${id}`, fetcher, {
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