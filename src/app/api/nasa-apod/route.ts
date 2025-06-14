import { NextRequest, NextResponse } from 'next/server';

interface NasaApodData {
    date: string;
    explanation: string;
    hdurl?: string;
    media_type: 'image' | 'video';
    service_version: string;
    title: string;
    url: string;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date'); // Optional: allow fetching specific dates

        // Get NASA API key from environment variables
        const nasaApiKey = process.env.NASA_API_KEY || 'DEMO_KEY';

        // Build NASA APOD API URL
        let nasaUrl = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`;
        if (date) {
            nasaUrl += `&date=${date}`;
        }

        // Fetch from NASA API
        const response = await fetch(nasaUrl);

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch from NASA API' },
                { status: response.status }
            );
        }

        const apodData = await response.json() as NasaApodData;

        // Return the data as-is with proper CORS headers
        return NextResponse.json(apodData, {
            headers: {
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });

    } catch (error) {
        console.error('Error fetching NASA APOD:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 