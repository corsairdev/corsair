# Slack Webhook Testing

## Step 1: Setup Webhook in Slack Dashboard

1. Go to [Slack API Dashboard](https://api.slack.com/apps)
2. Select your app
3. Navigate to **Event Subscriptions**
4. Enable **Event Subscriptions**
5. Set **Request URL** to your webhook endpoint (e.g., `https://your-domain.com/api/webhook`)
6. Subscribe to bot events:
   - `message.channels`
   - `message.groups`
   - `message.im`
   - `message.mpim`
   - `reaction_added`
   - `channel_created`
   - `team_join`
   - `user_change`
   - `file_created`
   - `file_public`
   - `file_shared`
7. Save changes
8. Copy the **Signing Secret** from the **Basic Information** page

## Step 2: Set Signing Secret

```typescript
await corsair.withTenant('your-tenant-id').slack.keys.setSigningSecret('your-signing-secret');
```

## Step 3: Test Webhook

1. Send a message in a Slack channel your bot is in
2. Add a reaction to a message
3. Create a new channel
4. Check your webhook endpoint logs to verify events are received

## Testing Tips

- Use ngrok for local development: `ngrok http 3000`
- Verify the webhook URL is publicly accessible
- Check that the signing secret matches what's in Slack dashboard
