import { useState, useEffect, useCallback, useRef } from 'react';

export interface ChatMessage {
    type: 'message' | 'welcome' | 'join' | 'quit';
    username?: string;
    message?: string;
    timestamp?: number;
}

export interface UseChatReturn {
    messages: ChatMessage[];
    isConnected: boolean;
    isConnecting: boolean;
    username: string | null;
    sendMessage: (message: string) => void;
    connect: () => void;
    disconnect: () => void;
    error: string | null;
}

export function useChat(): UseChatReturn {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.CONNECTING ||
            wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        setIsConnecting(true);
        setError(null);

        try {
            // Create WebSocket connection to our chat API
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsHost = process.env.NEXT_PUBLIC_WS_HOST || window.location.host;

            // For development, connect directly to the worker root
            // For production, this would connect to the deployed worker
            const wsUrl = process.env.NEXT_PUBLIC_WS_HOST
                ? `${protocol}//${wsHost}/ws`  // Direct to worker in development
                : `${protocol}//${wsHost}/api/chat`;  // Through Next.js API in production

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                setIsConnected(true);
                setIsConnecting(false);
                setError(null);
                console.log('Chat connected');
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data) as ChatMessage;

                    // Set username when we get the welcome message
                    if (data.type === 'welcome' && data.username) {
                        setUsername(data.username);
                    }

                    // Add message to chat
                    setMessages(prev => [...prev, data]);
                } catch (err) {
                    console.error('Error parsing chat message:', err);
                }
            };

            ws.onclose = () => {
                setIsConnected(false);
                setIsConnecting(false);
                console.log('Chat disconnected');

                // Attempt to reconnect after 3 seconds
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }

                reconnectTimeoutRef.current = setTimeout(() => {
                    if (!isConnected) {
                        connect();
                    }
                }, 3000);
            };

            ws.onerror = (error) => {
                console.error('Chat WebSocket error:', error);
                setError('Connection error');
                setIsConnecting(false);
            };

        } catch (err) {
            console.error('Error creating WebSocket:', err);
            setError('Failed to connect');
            setIsConnecting(false);
        }
    }, [isConnected]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        setIsConnected(false);
        setIsConnecting(false);
        setUsername(null);
        setMessages([]);
    }, []);

    const sendMessage = useCallback((message: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN && message.trim()) {
            wsRef.current.send(JSON.stringify({
                type: 'message',
                message: message.trim(),
            }));
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        messages,
        isConnected,
        isConnecting,
        username,
        sendMessage,
        connect,
        disconnect,
        error,
    };
} 