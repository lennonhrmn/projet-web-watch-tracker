import { useEffect, useState } from 'react';

const useWindow = () => {
    const [isWindow, setIsWindow] = useState(false);

    useEffect(() => {
        setIsWindow(true);
    }, []);

    return isWindow;
};
