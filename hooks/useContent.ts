import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useContent = (id: string | string[] | undefined, type: string) => {
    if (!id && id === undefined) {
        return {
            data: null,
            error: null,
            isLoading: false,
            mutate: () => { },
        };
    }

    const { data, error, isLoading, mutate } = useSWR(`api/content${type}?id=${id}`, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    });


    return {
        data,
        error,
        isLoading,
        mutate,
    };
};

export default useContent;