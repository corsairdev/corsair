# PostHog Webhook Testing

## Step 1: Setup Webhook in PostHog Dashboard

1. Go to [PostHog Project Settings](https://app.posthog.com/project/settings)
2. Navigate to **Webhooks**
3. Click **New webhook**
4. Configure:
   - **Webhook URL:** Your webhook endpoint (e.g., `https://your-domain.com/api/webhook`)
   - **Events:** Select `event_captured` or all events
5. Click **Save**
6. Copy the **Webhook Secret** (if provided)

## Step 2: Set Webhook Secret (if available)

```typescript
await corsair.withTenant('your-tenant-id').posthog.keys.setWebhookSecret('your-webhook-secret');
```

## Step 3: Test Webhook

1. Capture an event in PostHog (via your application or PostHog UI)
2. Check your webhook endpoint logs to verify events are received

## Testing Tips

- Use ngrok for local development: `ngrok http 3000`
- Verify the webhook URL is publicly accessible
- PostHog will send events as they are captured in real-time
- You can test by triggering events in your application or using PostHog's test event feature
