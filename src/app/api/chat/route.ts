import { NextRequest } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET(request: NextRequest) {
    try {
        // Get Cloudflare context to access environment bindings
        const cf = await getCloudflareContext();

        if (cf?.env?.WEBSITE_DO) {
            // Create or get the chat room instance (using a fixed ID for global chat)
            const chatRoomId = cf.env.WEBSITE_DO.idFromName('global-chat');
            const chatRoom = cf.env.WEBSITE_DO.get(chatRoomId);

            // Handle WebSocket upgrade
            if (request.headers.get('Upgrade') === 'websocket') {
                return await chatRoom.fetch(request);
            }

            // Handle regular HTTP requests (status checks)
            return await chatRoom.fetch(request);
        }

        // For development/local testing, return a mock response with connection info
        return new Response(JSON.stringify({
            error: 'Chat service not available in development mode',
            message: 'Real-time chat is only available when deployed to Cloudflare',
            activeConnections: 0,
            status: 'development'
        }), {
            status: 503,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Upgrade, Connection, Sec-WebSocket-Key, Sec-WebSocket-Version, Sec-WebSocket-Protocol',
            }
        });
    } catch (error) {
        console.error('Error in chat route:', error);
        return new Response(JSON.stringify({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Upgrade, Connection, Sec-WebSocket-Key, Sec-WebSocket-Version, Sec-WebSocket-Protocol',
        },
    });
} 