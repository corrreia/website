import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // In the Cloudflare Workers environment, we access the env through the context
        // For OpenNext on Cloudflare, we need to check the runtime context differently
        const runtime = process.env.NEXTJS_ENV;

        if (runtime === 'production' && typeof globalThis !== 'undefined' && 'CHAT_ROOM' in globalThis) {
            const chatRoomNamespace = (globalThis as Record<string, unknown>).CHAT_ROOM as DurableObjectNamespace;

            // Create or get the chat room instance (using a fixed ID for global chat)
            const chatRoomId = chatRoomNamespace.idFromName('global-chat');
            const chatRoom = chatRoomNamespace.get(chatRoomId);

            // Forward the request to the Durable Object
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
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
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