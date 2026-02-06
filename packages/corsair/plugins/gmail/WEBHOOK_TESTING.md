# Gmail Webhook Testing

## Step 1: Setup Gmail Watch

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a Pub/Sub topic
3. Configure Gmail Watch API to send notifications to your Pub/Sub topic
4. Set up a Pub/Sub push subscription pointing to your webhook endpoint (e.g., `https://your-domain.com/api/webhook`)

## Step 2: Configure Gmail Watch

Gmail webhooks use Pub/Sub, so no signing secret is needed. The webhook will receive Pub/Sub notifications.

## Step 3: Test Webhook

1. Send an email to the watched Gmail account
2. Delete a message
3. Add/remove labels from a message
4. Check your webhook endpoint logs to verify events are received

## Testing Tips

- Use ngrok for local development: `ngrok http 3000`
- Verify the Pub/Sub subscription is configured correctly
- Ensure Gmail Watch is set up with the correct topic name
- The webhook payload will be in Pub/Sub format with base64 encoded message data
