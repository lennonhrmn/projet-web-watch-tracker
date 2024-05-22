// hooks/useSaveEpisode.ts
import { useState } from 'react';
import axios from 'axios';

const useSaveEpisode = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveEpisode = async (userId: string, contentId: string, lastEpisode: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/updateEpisode', { userId, contentId, lastEpisode });
            return response.data;
        } catch (err) {
            setError('Failed to save episode');
        } finally {
            setIsLoading(false);
        }
    };

    return { saveEpisode, isLoading, error };
};

export default useSaveEpisode;
