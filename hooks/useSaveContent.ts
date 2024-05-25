// hooks/useSaveContent.ts
import { useState } from 'react';
import axios from 'axios';

const useSaveContent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveEpisode = async (userId: string, contentId: string, lastContentWatch: number, lastContent: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/updateContent', { userId, contentId, lastContentWatch, lastContent });
            return response.data;
        } catch (err) {
            setError('Failed to save episode');
        } finally {
            setIsLoading(false);
        }
    };

    return { saveEpisode, isLoading, error };
};

export default useSaveContent;
