# Linear Webhook Testing

## Step 1: Setup Webhook in Linear Dashboard

1. Go to [Linear Settings](https://linear.app/settings/api)
2. Navigate to **Webhooks** section
3. Click **Create Webhook**
4. Configure:
   - **Label:** Your webhook name
   - **URL:** Your webhook endpoint (e.g., `https://your-domain.com/api/webhook`)
   - **Resource types:** Select Issues, Comments, Projects
5. Click **Create Webhook**
6. Copy the **Signing Secret** shown after creation

## Step 2: Set Signing Secret

```typescript
await corsair.withTenant('your-tenant-id').linear.keys.setSigningSecret('your-signing-secret');
```

## Step 3: Test Webhook

1. Create a new issue in Linear
2. Update an existing issue
3. Add a comment to an issue
4. Create a new project
5. Check your webhook endpoint logs to verify events are received

## Testing Tips

- Use ngrok for local development: `ngrok http 3000`
- Verify the webhook URL is publicly accessible
- Ensure you've selected the correct resource types when creating the webhook
