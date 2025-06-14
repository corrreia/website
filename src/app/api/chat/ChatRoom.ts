import { DurableObject } from "cloudflare:workers";

declare global {
    interface CloudflareEnv {
        CHAT_ROOM: DurableObjectNamespace;
    }
}

interface ChatMessage {
    username: string;
    message: string;
    timestamp: number;
}

interface WebSocketConnection {
    webSocket: WebSocket;
    username: string;
}

export class ChatRoom extends DurableObject {
    private connections: Set<WebSocketConnection> = new Set();

    constructor(ctx: DurableObjectState, env: CloudflareEnv) {
        super(ctx, env);
    }

    async fetch(request: Request): Promise<Response> {
        // Handle WebSocket upgrade
        if (request.headers.get("Upgrade") === "websocket") {
            const pair = new WebSocketPair();
            const [client, server] = Object.values(pair);

            // Generate random username
            const username = this.generateUsername();

            // Accept the WebSocket connection
            server.accept();

            // Store the connection
            const connection: WebSocketConnection = {
                webSocket: server,
                username,
            };
            this.connections.add(connection);

            // Handle WebSocket events
            server.addEventListener("message", (event) => {
                try {
                    const data = JSON.parse(event.data as string);
                    this.handleMessage(connection, data);
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
            });

            server.addEventListener("close", () => {
                this.connections.delete(connection);
                // Notify others that user left
                this.broadcastUserLeft(username);
            });

            server.addEventListener("error", () => {
                this.connections.delete(connection);
            });

            // Send welcome message to the new user
            server.send(JSON.stringify({
                type: "welcome",
                username: username,
                message: `Welcome! You are now connected as ${username}`,
                timestamp: Date.now(),
            }));

            // Notify others that a new user joined
            this.broadcastUserJoined(username);

            return new Response(null, {
                status: 101,
                webSocket: client,
            });
        }

        // Handle HTTP requests (for checking connection status)
        if (request.method === "GET") {
            return new Response(JSON.stringify({
                activeConnections: this.connections.size,
                status: "Chat room is active"
            }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response("Bad Request", { status: 400 });
    }

    private generateUsername(): string {
        // Generate 4-digit hexadecimal number
        const hex = Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0');
        return `user-${hex}`;
    }

    private handleMessage(sender: WebSocketConnection, data: { type: string; message?: string }) {
        if (data.type === "chat" && data.message && typeof data.message === "string") {
            // Validate message length (optional security measure)
            const message = data.message.trim();
            if (message.length === 0 || message.length > 500) {
                return;
            }

            const chatMessage: ChatMessage = {
                username: sender.username,
                message: message,
                timestamp: Date.now(),
            };

            // Broadcast to all connected users
            this.broadcastMessage(chatMessage);
        }
    }

    private broadcastMessage(message: ChatMessage) {
        const payload = JSON.stringify({
            type: "message",
            ...message,
        });

        // Send to all connected clients
        for (const connection of this.connections) {
            try {
                if (connection.webSocket.readyState === WebSocket.OPEN) {
                    connection.webSocket.send(payload);
                } else {
                    // Remove closed connections
                    this.connections.delete(connection);
                }
            } catch (error) {
                console.error("Error sending message:", error);
                this.connections.delete(connection);
            }
        }
    }

    private broadcastUserJoined(username: string) {
        const payload = JSON.stringify({
            type: "user_joined",
            username: username,
            message: `${username} joined the chat`,
            timestamp: Date.now(),
        });

        for (const connection of this.connections) {
            try {
                if (connection.webSocket.readyState === WebSocket.OPEN &&
                    connection.username !== username) {
                    connection.webSocket.send(payload);
                }
            } catch (error) {
                console.error("Error sending user joined message:", error);
            }
        }
    }

    private broadcastUserLeft(username: string) {
        const payload = JSON.stringify({
            type: "user_left",
            username: username,
            message: `${username} left the chat`,
            timestamp: Date.now(),
        });

        for (const connection of this.connections) {
            try {
                if (connection.webSocket.readyState === WebSocket.OPEN) {
                    connection.webSocket.send(payload);
                }
            } catch (error) {
                console.error("Error sending user left message:", error);
            }
        }
    }
} 