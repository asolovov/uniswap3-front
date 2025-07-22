'use client';

import { useEffect, useState } from 'react';

export default function LastUpdated({ lastUpdated }: { lastUpdated: Date }) {
    const [, forceRerender] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            forceRerender(n => n + 1);
        }, 1_000);

        return () => clearInterval(id);
    }, []);

    const secondsAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1_000);

    return (
        <span className="text-xs text-gray-400">
      Updated {secondsAgo}s ago
    </span>
    );
}