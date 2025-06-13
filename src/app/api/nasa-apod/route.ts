import { NextRequest, NextResponse } from 'next/server';

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

        const apodData = await response.json();

        // Process the data and add our proxy URLs for images
        if (apodData.media_type === 'image') {
            const processedData = {
                ...apodData,
                proxyUrl: `/api/nasa-image?url=${encodeURIComponent(apodData.url)}`,
                proxyHdUrl: apodData.hdurl ? `/api/nasa-image?url=${encodeURIComponent(apodData.hdurl)}` : undefined,
            };

            return NextResponse.json(processedData, {
                headers: {
                    'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                },
            });
        }

        // Return data as-is for non-image content (videos, etc.)
        return NextResponse.json(apodData, {
            headers: {
                'Cache-Control': 'public, max-age=3600',
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