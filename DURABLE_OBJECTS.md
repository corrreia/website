# Durable Objects Setup

This project includes a Cloudflare Durable Object for real-time chat functionality.

## Structure

```
src/durable-objects/
├── types.ts          # Shared TypeScript interfaces
└── WebsiteDO.ts      # Durable Object implementation
```

## How It Works

1. **Durable Object Class**: The `WebsiteDO` class in `src/durable-objects/WebsiteDO.ts` handles WebSocket connections for the chat feature.

2. **Build Process**: 
   - OpenNext builds the Next.js app into a Cloudflare Worker
   - The `scripts/patch-worker.js` script runs after the build to inject the Durable Object export into the generated worker
   - This allows the DO class to be available in the same worker as the Next.js app

3. **Configuration**:
   - `wrangler.jsonc`: Defines the Durable Object binding (`WEBSITE_DO`) and migration
   - `cloudflare-env.d.ts`: Auto-generated TypeScript types for Cloudflare bindings

## Usage in Next.js

Access the Durable Object from API routes:

```typescript
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET(request: NextRequest) {
  const cf = await getCloudflareContext();
  const chatRoomId = cf.env.WEBSITE_DO.idFromName('global-chat');
  const chatRoom = cf.env.WEBSITE_DO.get(chatRoomId);
  return await chatRoom.fetch(request);
}
```

## Deployment

The Durable Object is automatically deployed with the Next.js app:

```bash
npm run deploy
```

This runs:
1. `opennextjs-cloudflare build` - Builds the Next.js app
2. `node scripts/patch-worker.js` - Adds DO export to the worker
3. `opennextjs-cloudflare deploy` - Deploys to Cloudflare

## Development

For local development, the chat feature requires deployment to Cloudflare as Durable Objects don't work in local dev mode.

## Features

The `WebsiteDO` Durable Object provides:

- WebSocket connection management
- Real-time message broadcasting
- User join/leave notifications
- Active user count tracking
- Automatic username generation
- Session persistence across reconnections
