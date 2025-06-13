import { useState, useEffect } from 'react';

interface ApodData {
    title: string;
    explanation: string;
    url: string;
    hdurl?: string;
    media_type: 'image' | 'video';
    date: string;
    copyright?: string;
    // Add local proxy URLs for CORS handling
    proxyUrl?: string;
    proxyHdUrl?: string;
}

interface UseNasaApodReturn {
    apod: ApodData | null;
    isLoading: boolean;
    error: string | null;
}

export function useNasaApod(): UseNasaApodReturn {
    const [apod, setApod] = useState<ApodData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApod = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Call our server API instead of NASA directly
                const response = await fetch('/api/nasa-apod');

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const data = await response.json();

                // Only use image media type for backgrounds
                if (data.media_type === 'image') {
                    // Data already includes proxy URLs from server
                    setApod(data);
                } else {
                    // If it's a video, we'll use the fallback background
                    setApod(null);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch APOD');
                setApod(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApod();
    }, []);

    return { apod, isLoading, error };
} 