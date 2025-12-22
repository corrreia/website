import { DurableObject } from "cloudflare:workers";
import type { CloudflareEnv, ChatMessage } from "./types";

export class WebsiteDO extends DurableObject<CloudflareEnv> {
	private sessions: Map<WebSocket, { username: string }> = new Map();

	constructor(ctx: DurableObjectState, env: CloudflareEnv) {
		super(ctx, env);

		// Restore existing websocket connections
		this.ctx.getWebSockets().forEach((ws) => {
			const meta = ws.deserializeAttachment() as { username: string } | null;
			if (meta) {
				this.sessions.set(ws, meta);
			}
		});
	}

	/**
	 * Handle incoming requests to the Durable Object
	 */
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		// Handle WebSocket upgrade for /ws endpoint
		if (request.headers.get("Upgrade") === "websocket") {
			if (url.pathname === "/ws" || url.pathname === "/api/chat") {
				return this.handleWebSocketUpgrade(request);
			}
		}

		// Handle HTTP requests for status
		if (request.method === "GET") {
			return new Response(JSON.stringify({
				activeConnections: this.sessions.size,
				status: "Chat room is active",
				path: url.pathname,
				websocketEndpoints: ["/ws", "/api/chat"]
			}), {
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}

		return new Response("Not Found", { status: 404 });
	}

	/**
	 * Handle WebSocket upgrade and connection
	 */
	private handleWebSocketUpgrade(request: Request): Response {
		const url = new URL(request.url);
		const username = url.searchParams.get("username") || this.generateUsername();

		const pair = new WebSocketPair();
		const [client, server] = Object.values(pair);

		// Accept the WebSocket connection on the server side
		this.ctx.acceptWebSocket(server);

		// Store session data
		const sessionData = { username };
		server.serializeAttachment(sessionData);
		this.sessions.set(server, sessionData);

		// Send welcome message to the new user
		this.sendToSocket(server, {
			type: "welcome",
			username: username,
			message: `Welcome! You are connected as ${username}`,
			timestamp: Date.now(),
		});

		// Notify others that a new user joined
		this.broadcast({
			type: "join",
			username: username,
			message: `${username} joined the chat`,
			timestamp: Date.now(),
		}, username);

		// Send updated user count to all users
		this.broadcastUserCount();

		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}

	/**
	 * Handle incoming WebSocket messages
	 */
	async webSocketMessage(ws: WebSocket, message: string): Promise<void> {
		try {
			const data = JSON.parse(message) as ChatMessage;
			const session = this.sessions.get(ws);

			if (!session) return;

			if (data.type === "message" && data.message) {
				// Validate message
				const chatMessage = data.message.trim();
				if (chatMessage.length === 0 || chatMessage.length > 500) {
					return;
				}

				// Broadcast message to all users (including sender)
				this.broadcast({
					type: "message",
					username: session.username,
					message: chatMessage,
					timestamp: Date.now(),
				});
			}
		} catch (error) {
			console.error("Error parsing WebSocket message:", error);
		}
	}

	/**
	 * Handle WebSocket connection close
	 */
	async webSocketClose(ws: WebSocket): Promise<void> {
		const session = this.sessions.get(ws);
		if (session) {
			// Notify others that user left
			this.broadcast({
				type: "quit",
				username: session.username,
				message: `${session.username} left the chat`,
				timestamp: Date.now(),
			}, session.username);

			this.sessions.delete(ws);

			// Send updated user count to all users
			this.broadcastUserCount();
		}
	}

	/**
	 * Broadcast message to all connected clients
	 */
	private broadcast(message: ChatMessage, excludeUsername?: string): void {
		this.sessions.forEach((session, ws) => {
			if (excludeUsername && session.username === excludeUsername) {
				return; // Skip the sender if excluded
			}

			this.sendToSocket(ws, message);
		});
	}

	/**
	 * Send message to a specific WebSocket
	 */
	private sendToSocket(ws: WebSocket, message: ChatMessage): void {
		try {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify(message));
			} else {
				// Clean up closed connections
				this.sessions.delete(ws);
			}
		} catch (error) {
			console.error("Error sending message to WebSocket:", error);
			this.sessions.delete(ws);
		}
	}

	/**
	 * Broadcast current user count to all connected clients
	 */
	private broadcastUserCount(): void {
		this.broadcast({
			type: "user_count",
			userCount: this.sessions.size,
			timestamp: Date.now(),
		});
	}

	/**
	 * Generate a random username
	 */
	private generateUsername(): string {
		const adjectives = ['Quick', 'Bright', 'Cool', 'Swift', 'Bold', 'Smart'];
		const animals = ['Fox', 'Wolf', 'Eagle', 'Shark', 'Tiger', 'Lion'];
		const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
		const animal = animals[Math.floor(Math.random() * animals.length)];
		const num = Math.floor(Math.random() * 1000);
		return `${adj}${animal}${num}`;
	}
}
