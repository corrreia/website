import { NextRequest } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET(request: NextRequest) {
    try {
        // Get Cloudflare context to access environment bindings
        const cf = await getCloudflareContext();

        console.log('Chat API - Cloudflare context:', {
            hasContext: !!cf,
            hasEnv: !!cf?.env,
            hasWebsiteDO: !!cf?.env?.WEBSITE_DO,
            envKeys: cf?.env ? Object.keys(cf.env) : []
        });

        if (cf?.env?.WEBSITE_DO) {
            // Create or get the chat room instance (using a fixed ID for global chat)
            const chatRoomId = cf.env.WEBSITE_DO.idFromName('global-chat');
            const chatRoom = cf.env.WEBSITE_DO.get(chatRoomId);

            console.log('Chat API - Forwarding request to Durable Object');

            // Handle WebSocket upgrade
            if (request.headers.get('Upgrade') === 'websocket') {
                return await chatRoom.fetch(request);
            }

            // Handle regular HTTP requests (status checks)
            return await chatRoom.fetch(request);
        }

        // For development/local testing, return a mock response with connection info
        console.log('Chat API - WEBSITE_DO not available, returning development response');
        return new Response(JSON.stringify({
            error: 'Chat service not available',
            message: 'Durable Object binding (WEBSITE_DO) not found. This could mean: 1) Running in development mode, 2) DO not properly deployed, or 3) Binding configuration issue',
            activeConnections: 0,
            status: 'unavailable',
            debug: {
                hasCloudflareContext: !!cf,
                hasEnv: !!cf?.env,
                envKeys: cf?.env ? Object.keys(cf.env) : []
            }
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
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
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