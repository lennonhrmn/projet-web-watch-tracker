// hooks/useFetchLastEpisode.ts
import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

const useFetchLastEpisode = (userId: string, contentId: string) => {
    const { data, error, isLoading } = useSWR(
        userId && contentId ? `/api/lastEpisode?userId=${userId}&contentId=${contentId}` : null,
        fetcher
    );

    return {
        lastEpisode: data?.lastEpisode,
        isLoading,
        error,
    };
};

export default useFetchLastEpisode;
