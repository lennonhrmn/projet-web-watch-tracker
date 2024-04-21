import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const usePhoto = (category: string) => {
    const { data, error, isLoading } = useSWR(`/api/random?category=${category}`, fetcher, {
        revalidateOnFocus: false,
        revalidateIfScale: false,
        revalidateOnReconnect: false,
    });

    return {
        data,
        error,
        isLoading,
    };
}

export default usePhoto;