# Resend Webhook Testing

## Step 1: Setup Webhook in Resend Dashboard

1. Go to [Resend Dashboard](https://resend.com/webhooks)
2. Click **Create Webhook**
3. Enter your webhook URL (e.g., `https://your-domain.com/api/webhook`)
4. Select events to subscribe to:
   - `email.sent`
   - `email.delivered`
   - `email.bounced`
   - `email.opened`
   - `email.clicked`
   - `email.complained`
   - `email.failed`
   - `email.received`
   - `domain.created`
   - `domain.updated`
5. Click **Create**
6. Copy the **Webhook Signing Secret**

## Step 2: Set Webhook Secret

```typescript
await corsair.withTenant('your-tenant-id').resend.keys.setWebhookSecret('your-webhook-secret');
```

## Step 3: Test Webhook

1. Send an email using Resend API
2. Open the email (if tracking is enabled)
3. Click a link in the email (if tracking is enabled)
4. Check your webhook endpoint logs to verify events are received

## Testing Tips

- Use ngrok for local development: `ngrok http 3000`
- Verify the webhook URL is publicly accessible
- Ensure email tracking is enabled for open/click events
