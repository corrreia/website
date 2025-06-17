# Real-Time Chat Website

A Next.js website with real-time chat functionality using Cloudflare Durable Objects and Workers.

## Architecture

- **Main App**: Next.js website deployed on Cloudflare Workers
- **Chat Service**: Durable Object worker for real-time WebSocket chat
- **Database**: In-memory storage with WebSocket state persistence (via Cloudflare Durable Objects)

## Features

- **Real-time messaging**: WebSocket-based chat with instant message delivery
- **Auto-generated usernames**: Random username assignment for anonymous chat
- **Connection status**: Visual indicators for connection state
- **Message history**: Persistent chat history during active sessions (mo messages are storesd)
- **User join/leave notifications**: Real-time notifications when users connect/disconnect
- **Message validation**: Input sanitization and length limits
- **Auto-reconnection**: Automatic WebSocket reconnection on connection loss
- **NASA APOD**: Diferent backgrounds every day!

## Chat System Details

The chat system is built using:

- **Durable Objects**: For WebSocket state management and message broadcasting
- **WebSocket API**: Real-time bidirectional communication
- **Next.js API Routes**: WebSocket upgrade handling
- **React Hooks**: Client-side state management and real-time updates

