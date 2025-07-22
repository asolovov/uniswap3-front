import { useEffect, useRef } from 'react';

export function useExchangeRate(
    getTokensSync: () => void,
    delay: number,
) {
    const savedCallback = useRef<(() => void) | null>(null);

    useEffect(() => {
        savedCallback.current = getTokensSync;
    }, [getTokensSync]);

    useEffect(() => {
        const id = setInterval(() => {
            savedCallback.current?.();
        }, delay);
        return () => clearInterval(id);
    }, [delay]);
}