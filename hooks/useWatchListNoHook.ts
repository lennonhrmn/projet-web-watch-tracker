import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useWatchListNoHook = (category: string, type: String, genre: String | null = null, page: number = 1) => {
    let url = `/api/aniList/${category}?type=${type}&page=${page}${genre ? `&genre=${genre}` : ''}`;

    return fetcher(url);
}

export { useWatchListNoHook };