import { useState, useEffect, useCallback } from 'react';

interface ApodData {
    title: string;
    explanation: string;
    url: string;
    hdurl?: string;
    media_type: 'image' | 'video';
    date: string;
    copyright?: string;
}

interface UseNasaApodReturn {
    apod: ApodData | null;
    isLoading: boolean;
    error: string | null;
    currentDate: string;
    goToPreviousDay: () => void;
    goToNextDay: () => void;
    canGoBack: boolean;
    canGoForward: boolean;
}

// NASA APOD started on June 16, 1995
const APOD_START_DATE = '1995-06-16';

function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

function isValidApodDate(dateString: string): boolean {
    const date = new Date(dateString);
    const startDate = new Date(APOD_START_DATE);
    const today = new Date();

    return date >= startDate && date <= today;
}

export function useNasaApod(): UseNasaApodReturn {
    const [apod, setApod] = useState<ApodData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState<string>(formatDate(new Date()));

    const fetchApod = useCallback(async (date: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Call our server API with date parameter
            const url = `/api/nasa-apod${date ? `?date=${date}` : ''}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json() as ApodData;

            // Only use image media type for backgrounds
            if (data.media_type === 'image') {
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
    }, []);

    const goToPreviousDay = useCallback(() => {
        const current = new Date(currentDate);
        current.setDate(current.getDate() - 1);
        const newDate = formatDate(current);

        if (isValidApodDate(newDate)) {
            setCurrentDate(newDate);
        }
    }, [currentDate]);

    const goToNextDay = useCallback(() => {
        const current = new Date(currentDate);
        current.setDate(current.getDate() + 1);
        const newDate = formatDate(current);

        if (isValidApodDate(newDate)) {
            setCurrentDate(newDate);
        }
    }, [currentDate]);

    // Check if navigation is possible
    const canGoBack = useCallback(() => {
        const current = new Date(currentDate);
        current.setDate(current.getDate() - 1);
        return isValidApodDate(formatDate(current));
    }, [currentDate]);

    const canGoForward = useCallback(() => {
        const current = new Date(currentDate);
        current.setDate(current.getDate() + 1);
        return isValidApodDate(formatDate(current));
    }, [currentDate]);

    // Fetch APOD when currentDate changes
    useEffect(() => {
        fetchApod(currentDate);
    }, [currentDate, fetchApod]);

    return {
        apod,
        isLoading,
        error,
        currentDate,
        goToPreviousDay,
        goToNextDay,
        canGoBack: canGoBack(),
        canGoForward: canGoForward()
    };
} 