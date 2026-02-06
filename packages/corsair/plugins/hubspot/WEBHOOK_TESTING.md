# HubSpot Webhook Testing

## Step 1: Setup Webhook in HubSpot Dashboard

1. Go to [HubSpot Settings](https://app.hubspot.com/settings)
2. Navigate to **Integrations** → **Private Apps**
3. Create a new private app or edit existing
4. Go to **Webhooks** section
5. Click **Create subscription**
6. Configure:
   - **Event type:** Select from:
     - Contact created/updated/deleted
     - Company created/updated/deleted
     - Deal created/updated/deleted
     - Ticket created/updated/deleted
   - **Webhook URL:** Your webhook endpoint (e.g., `https://your-domain.com/api/webhook`)
7. Save the subscription
8. Copy the **Webhook Secret** (if provided)

## Step 2: Set Webhook Secret (if available)

```typescript
await corsair.withTenant('your-tenant-id').hubspot.keys.setWebhookSecret('your-webhook-secret');
```

## Step 3: Test Webhook

1. Create a new contact in HubSpot
2. Update an existing contact
3. Create a new company
4. Create a new deal
5. Create a new ticket
6. Check your webhook endpoint logs to verify events are received

## Testing Tips

- Use ngrok for local development: `ngrok http 3000`
- Verify the webhook URL is publicly accessible
- Ensure you've subscribed to the correct event types
- HubSpot may require authentication - check your private app permissions
