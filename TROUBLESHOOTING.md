# Troubleshooting Guide

## "Server failed to respond" Error

If you're seeing this error in your chat interface, it means the Durable Object is not properly accessible. Here are the steps to diagnose and fix:

### 1. Check Deployment Status

Make sure you've deployed the application with the patched worker:

```bash
npm run deploy
```

This will:
1. Build the Next.js app
2. Patch the worker to include the DO export
3. Verify the DO export is present
4. Deploy to Cloudflare

### 2. Verify DO Export Locally

After building, you can verify the DO is properly exported:

```bash
npm run build
npm run patch-worker
npm run verify-do
```

The verify script will check if:
- ✅ The worker file exists
- ✅ The WebsiteDO class is present
- ✅ The export statement is included

### 3. Check Cloudflare Dashboard

1. Go to your Cloudflare Workers dashboard
2. Select your worker (`website`)
3. Check the "Durable Objects" tab
4. Verify that `WebsiteDO` is listed

### 4. Check Browser Console

Open your browser's developer console and look for:
- Connection errors
- WebSocket upgrade failures
- API response errors

The `/api/chat` endpoint now includes debug information:

```json
{
  "error": "Chat service not available",
  "message": "...",
  "debug": {
    "hasCloudflareContext": true/false,
    "hasEnv": true/false,
    "envKeys": ["WEBSITE_DO", "ASSETS", ...]
  }
}
```

### 5. Common Issues

#### Issue: "WEBSITE_DO binding not found"

**Cause**: The Durable Object binding is not configured or the DO class is not exported.

**Solution**:
1. Verify `wrangler.jsonc` has the correct binding:
   ```json
   "durable_objects": {
     "bindings": [
       {
         "name": "WEBSITE_DO",
         "class_name": "WebsiteDO"
       }
     ]
   }
   ```
2. Run `npm run patch-worker` to ensure the DO is exported
3. Redeploy: `npm run deploy`

#### Issue: "Running in development mode"

**Cause**: Durable Objects don't work in local Next.js dev mode.

**Solution**: Deploy to Cloudflare or use `npm run preview` for local testing with Wrangler.

#### Issue: "WebSocket upgrade failed"

**Cause**: The Durable Object's `fetch()` method is not handling WebSocket upgrades correctly.

**Solution**: Check that the DO's `handleWebSocketUpgrade()` method is being called and returns the correct response.

### 6. Manual Verification

You can test the Durable Object directly by making a request to the chat endpoint:

```bash
# Test status endpoint
curl https://your-domain.com/api/chat

# Should return something like:
# {
#   "activeConnections": 0,
#   "status": "Chat room is active",
#   "path": "/api/chat",
#   "websocketEndpoints": ["/ws", "/api/chat"]
# }
```

### 7. Re-patch and Redeploy

If all else fails, try a clean rebuild:

```bash
# Clean build artifacts
rm -rf .open-next .next

# Rebuild and deploy
npm run deploy
```

### 8. Check Logs

View real-time logs from your worker:

```bash
npx wrangler tail
```

Then try to connect to the chat and watch for errors.

## Need More Help?

If you're still experiencing issues:

1. Check the browser console for detailed error messages
2. Check Cloudflare Workers logs via `wrangler tail`
3. Verify the worker was deployed successfully
4. Ensure you're accessing the deployed URL (not localhost in dev mode)
