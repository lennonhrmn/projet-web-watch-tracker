import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

const useFetchMultipleContent = (userId: string, contentIds: string[]) => {
    const { data, error } = useSWR(
        userId && contentIds.length > 0 ? `/api/multipleContent?userId=${userId}&contentIds=${contentIds.join(',')}` : null,
        fetcher
    );

    return {
        data,
        isLoading: !error && !data,
        error,
    };
};

export default useFetchMultipleContent;
