# Testing Gmail Webhooks

## Prerequisites

1. **Gmail API Setup**:
   - Create a Google Cloud Project
   - Enable Gmail API
   - Create OAuth 2.0 credentials (Client ID and Client Secret)
   - Obtain access token and refresh token

2. **Environment Variables**:
   ```bash
   GMAIL_CLIENT_ID=your_client_id
   GMAIL_CLIENT_SECRET=your_client_secret
   GMAIL_ACCESS_TOKEN=your_access_token
   GMAIL_REFRESH_TOKEN=your_refresh_token
   ```

3. **Gmail Watch Setup**:
   - Set up a Pub/Sub topic in Google Cloud
   - Configure Gmail Watch API to send notifications to your Pub/Sub topic
   - Your webhook endpoint should receive Pub/Sub notifications

## Testing Steps

### 1. Start the Webhook Server

```bash
cd demo/corsair-plugins
npm run dev
# or
node src/webhook-server.ts
```

The server will start on `http://localhost:3000/webhook`

### 2. Test with Mock Pub/Sub Notification

Create a test script or use curl to send a mock Pub/Sub notification:

```bash
# Create a test notification payload
cat > test-webhook.json << 'EOF'
{
  "message": {
    "data": "eyJlbWFpbEFkZHJlc3MiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaGlzdG9yeUlkIjoiMTIzNDU2Nzg5MCJ9",
    "messageId": "test-message-id",
    "publishTime": "2024-01-01T00:00:00Z"
  },
  "subscription": "projects/test-project/subscriptions/test-sub"
}
EOF

# Send the webhook with tenant_id query parameter
curl -X POST http://localhost:3000/webhook?tenant_id=test-tenant \
  -H "Content-Type: application/json" \
  -d @test-webhook.json
```

The base64 encoded data decodes to:
```json
{
  "emailAddress": "test@example.com",
  "historyId": "1234567890"
}
```

### 3. Test with Real Gmail Webhook

To test with real Gmail notifications:

1. **Set up Gmail Watch**:
   ```typescript
   // Use Gmail API to set up watch
   const watchResponse = await gmail.users.watch('me', {
     topicName: 'projects/YOUR_PROJECT/topics/YOUR_TOPIC',
     labelIds: ['INBOX']
   });
   ```

2. **Configure Pub/Sub Push Subscription**:
   - Create a push subscription in Google Cloud Pub/Sub
   - Set the endpoint to: `https://your-domain.com/webhook?tenant_id=YOUR_TENANT_ID`
   - Gmail will send notifications to this endpoint

3. **Trigger Events**:
   - Send an email to the watched Gmail account
   - Delete a message
   - Add/remove labels from a message

### 4. Verify Webhook Processing

Check the server logs for:
- ✅ Plugin identification: Should show `plugin: 'gmail'`
- ✅ Action identification: Should show `action: 'messages.messageReceived'` (or similar)
- ✅ History fetching: Should fetch message details from Gmail API
- ✅ Database updates: Should save messages to the database

### 5. Test Individual Webhook Handlers

#### Test messageReceived

```bash
# Create a notification for a new message
curl -X POST http://localhost:3000/webhook?tenant_id=test-tenant \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "data": "'$(echo -n '{"emailAddress":"test@example.com","historyId":"1234567890"}' | base64)'"
    }
  }'
```

#### Test messageDeleted

Similar to above, but the history API should return `messagesDeleted` entries.

#### Test messageLabelChanged

Similar to above, but the history API should return `labelsAdded` or `labelsRemoved` entries.

### 6. Test Tenant ID Extraction

Test that tenant_id is correctly extracted from query parameters:

```bash
# With tenant_id in query
curl -X POST "http://localhost:3000/webhook?tenant_id=tenant-123" \
  -H "Content-Type: application/json" \
  -d @test-webhook.json

# Without tenant_id (should default to 'default')
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d @test-webhook.json
```

### 7. Test OAuth Token Refresh

To test token refresh:

1. Use an expired access token in environment variables
2. Make a webhook request that triggers a Gmail API call
3. Verify that the token is automatically refreshed
4. Check logs for token refresh messages

### 8. Debugging Tips

- **Check webhook matching**: The `pluginWebhookMatcher` should return `true` for Pub/Sub format
- **Verify base64 decoding**: The message data should decode to a valid JSON object
- **Check history fetching**: Ensure the historyId is valid and the API call succeeds
- **Database verification**: Check that messages are being saved to the database
- **Error handling**: Verify that errors are logged and don't crash the server

### 9. Expected Log Output

When a webhook is received, you should see:

```
════════════════════════════════════════════════════════════
📨 INCOMING WEBHOOK REQUEST
════════════════════════════════════════════════════════════
...

🔍 Running filterWebhook function...

✅ Filter Result:
   Plugin: gmail
   Action: messages.messageReceived
════════════════════════════════════════════════════════════

📧 Gmail Event Details:
   Action: messages.messageReceived
   Message ID: <message-id>
   Has Data: true
```

### 10. Common Issues

1. **Webhook not matching**: Ensure the body has `message.data` field (Pub/Sub format)
2. **Token refresh failing**: Check that client ID, secret, and refresh token are correct
3. **History fetch failing**: Verify the historyId is valid and the access token has proper scopes
4. **Database errors**: Ensure the database schema is set up correctly for Gmail resources
