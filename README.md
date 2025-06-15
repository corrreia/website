# Real-Time Chat Website

A Next.js website with real-time chat functionality using Cloudflare Durable Objects and Workers.

## Architecture

- **Main App**: Next.js website deployed on Cloudflare Workers
- **Chat Service**: Durable Object worker for real-time WebSocket chat
- **Database**: In-memory storage with WebSocket state persistence

## Development

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI installed

### Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp env.example .env.local
```

3. Generate Cloudflare types:

```bash
npm run cf-typegen
```

### Development Mode

1. Start the durable object worker:

```bash
cd durable-object
npm run dev
```

2. In another terminal, start the main Next.js app:

```bash
npm run dev
```

## Deployment

### 1. Deploy the Durable Object Worker

First, deploy the chat service:

```bash
cd durable-object
npm run deploy
```

### 2. Deploy the Main Application

Deploy the Next.js website:

```bash
npm run deploy
```

## Features

- **Real-time messaging**: WebSocket-based chat with instant message delivery
- **Auto-generated usernames**: Random username assignment for anonymous chat
- **Connection status**: Visual indicators for connection state
- **Message history**: Persistent chat history during active sessions
- **User join/leave notifications**: Real-time notifications when users connect/disconnect
- **Message validation**: Input sanitization and length limits
- **Auto-reconnection**: Automatic WebSocket reconnection on connection loss

## Chat System Details

The chat system is built using:

- **Durable Objects**: For WebSocket state management and message broadcasting
- **WebSocket API**: Real-time bidirectional communication
- **Next.js API Routes**: WebSocket upgrade handling
- **React Hooks**: Client-side state management and real-time updates

### Message Types

- `welcome`: Sent when a user first connects
- `join`: Broadcast when a new user joins the chat
- `quit`: Broadcast when a user leaves the chat
- `message`: Regular chat messages between users

## Configuration

The system uses these key configuration files:

- `wrangler.jsonc`: Main app configuration with durable object bindings
- `durable-object/wrangler.jsonc`: Durable object worker configuration
- `durable-object/src/index.ts`: WebSocket chat implementation

## Local Development Notes

WebSocket functionality requires deployment to Cloudflare to work properly. In local development, the chat component will show a "development mode" message.
