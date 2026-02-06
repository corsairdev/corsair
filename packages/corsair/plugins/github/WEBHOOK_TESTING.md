# GitHub Webhook Testing

## Step 1: Setup Webhook in GitHub Repository

1. Go to your GitHub repository
2. Navigate to **Settings** → **Webhooks**
3. Click **Add webhook**
4. Configure:
   - **Payload URL:** Your webhook endpoint (e.g., `https://your-domain.com/api/webhook`)
   - **Content type:** `application/json`
   - **Secret:** Generate a random secret (save this)
   - **Events:** Select:
     - Pull requests
     - Pushes
     - Stars
5. Click **Add webhook**

## Step 2: Set Webhook Secret

```typescript
await corsair.withTenant('your-tenant-id').github.keys.setWebhookSecret('your-webhook-secret');
```

## Step 3: Test Webhook

1. Open a pull request in the repository
2. Push code to the repository
3. Star/unstar the repository
4. Check your webhook endpoint logs to verify events are received

## Testing Tips

- Use ngrok for local development: `ngrok http 3000`
- Verify the webhook URL is publicly accessible
- GitHub will send a test ping when you create the webhook - verify it's received
