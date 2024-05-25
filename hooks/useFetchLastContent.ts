// hooks/useFetchLastContent.ts
import useSWR from 'swr';
import fetcher from '@/lib/fetcher';
import { last } from 'lodash';

const useFetchLastContent = (userId: string, contentId: string) => {
    const { data, error, isLoading } = useSWR(
        userId && contentId ? `/api/lastContentWatched?userId=${userId}&contentId=${contentId}` : null,
        fetcher
    );

    return {
        lastContentWatched: data?.lastContentWatch,
        lastContent: data?.lastContent,
        isLoading,
        error,
        data,
    };
};

export default useFetchLastContent;
