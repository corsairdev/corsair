# Gmail SDK

A TypeScript SDK for the Gmail API with full type safety, real API integration tests, and webhook support via Gmail Watch API.

## Features

- 🔒 **OAuth2 Authentication** - Secure authentication with access and refresh tokens
- 📧 **Complete API Coverage** - Messages, Labels, Drafts, Threads, and History
- 🔔 **Webhook Support** - Gmail Watch API integration with push notifications
- ✅ **Type Safe** - Full TypeScript support with comprehensive type definitions
- 🧪 **Real API Tests** - Integration tests using actual Gmail API (no mocks)
- 🎯 **User-Friendly API** - Clean, intuitive facade over Gmail REST API

## Installation

```bash
npm install @corsair/gmail-sdk
```

## Quick Start

```typescript
import { Gmail, OpenAPI } from '@corsair/gmail-sdk';

OpenAPI.TOKEN = 'your-access-token';

const messages = await Gmail.Messages.list('me', 'is:inbox', 10);
console.log(`Found ${messages.messages?.length} messages`);

const labels = await Gmail.Labels.list('me');
console.log(`Found ${labels.labels?.length} labels`);
```

## Authentication Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

### Step 2: Enable Gmail API

1. Navigate to **APIs & Services** > **Library**
2. Search for "Gmail API"
3. Click **Enable**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Desktop app** or **Web application**
4. Add authorized redirect URI: `http://localhost:3000/oauth/callback`
5. Save your `Client ID` and `Client Secret`

### Step 4: Get Access Token

Create a script to obtain tokens:

```javascript
const { google } = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'http://localhost:3000/oauth/callback'
);

const scopes = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.send',
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Authorize this app by visiting:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the code from that page here: ', async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log('Refresh Token:', tokens.refresh_token);
  console.log('Access Token:', tokens.access_token);
  rl.close();
});
```

### Step 5: Configure Environment Variables

Create a `.env` file:

```bash
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_ACCESS_TOKEN=your-access-token
GMAIL_USER_ID=me
```

## API Reference

### Messages

```typescript
const messages = await Gmail.Messages.list('me', 'is:inbox', 10);

const message = await Gmail.Messages.get('me', messageId, 'full');

const raw = Buffer.from(emailContent).toString('base64')
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const sent = await Gmail.Messages.send('me', { raw });

await Gmail.Messages.delete('me', messageId);

await Gmail.Messages.modify('me', messageId, {
  addLabelIds: ['STARRED'],
  removeLabelIds: ['UNREAD'],
});

await Gmail.Messages.trash('me', messageId);
await Gmail.Messages.untrash('me', messageId);
```

### Labels

```typescript
const labels = await Gmail.Labels.list('me');

const label = await Gmail.Labels.get('me', 'INBOX');

const newLabel = await Gmail.Labels.create('me', {
  name: 'My Custom Label',
  labelListVisibility: 'labelShow',
  messageListVisibility: 'show',
});

await Gmail.Labels.update('me', labelId, {
  id: labelId,
  name: 'Updated Label Name',
});

await Gmail.Labels.delete('me', labelId);
```

### Drafts

```typescript
const drafts = await Gmail.Drafts.list('me', 10);

const draft = await Gmail.Drafts.get('me', draftId, 'full');

const newDraft = await Gmail.Drafts.create('me', {
  message: { raw: encodedEmail },
});

await Gmail.Drafts.update('me', draftId, {
  id: draftId,
  message: { raw: updatedEmail },
});

const sentMessage = await Gmail.Drafts.send('me', {
  id: draftId,
});

await Gmail.Drafts.delete('me', draftId);
```

### Threads

```typescript
const threads = await Gmail.Threads.list('me', 'is:inbox', 10);

const thread = await Gmail.Threads.get('me', threadId, 'full');

await Gmail.Threads.modify('me', threadId, {
  addLabelIds: ['IMPORTANT'],
});

await Gmail.Threads.trash('me', threadId);
await Gmail.Threads.untrash('me', threadId);

await Gmail.Threads.delete('me', threadId);
```

### History

```typescript
const profile = await Gmail.Users.getProfile('me');
const currentHistoryId = profile.historyId;

const history = await Gmail.History.list('me', startHistoryId, 100);

if (history.history) {
  for (const item of history.history) {
    if (item.messagesAdded) {
      console.log('New messages:', item.messagesAdded.length);
    }
    if (item.messagesDeleted) {
      console.log('Deleted messages:', item.messagesDeleted.length);
    }
    if (item.labelsAdded) {
      console.log('Labels added:', item.labelsAdded.length);
    }
  }
}
```

## Webhook Support

### Setting Up Gmail Push Notifications

#### 1. Create Cloud Pub/Sub Topic

```bash
gcloud pubsub topics create gmail-push
```

#### 2. Grant Gmail API Permission

```bash
gcloud pubsub topics add-iam-policy-binding gmail-push \
  --member=serviceAccount:gmail-api-push@system.gserviceaccount.com \
  --role=roles/pubsub.publisher
```

#### 3. Create Push Subscription

```bash
gcloud pubsub subscriptions create gmail-push-sub \
  --topic=gmail-push \
  --push-endpoint=https://your-domain.com/webhook/gmail
```

### Using the Webhook Handler

```typescript
import { createWebhookHandler } from '@corsair/gmail-sdk';

const handler = createWebhookHandler({
  userId: 'me',
  autoFetchHistory: true,
});

handler.on('history', async (event) => {
  console.log('History event:', event.historyId);
});

handler.on('messageReceived', async (event) => {
  console.log('New message:', event.message.id);
  console.log('Snippet:', event.message.snippet);
});

handler.on('messageDeleted', async (event) => {
  console.log('Message deleted:', event.message.id);
});

handler.on('messageLabelChanged', async (event) => {
  console.log('Labels changed for:', event.message.id);
  console.log('Added:', event.labelsAdded);
  console.log('Removed:', event.labelsRemoved);
});

app.post('/webhook/gmail', async (req, res) => {
  const result = await handler.handleRawNotification(req.body);
  res.status(result.success ? 200 : 400).json(result);
});
```

### Starting Watch

```typescript
const watchResponse = await Gmail.Users.watch('me', {
  topicName: 'projects/your-project/topics/gmail-push',
  labelIds: ['INBOX'],
});

console.log('Watch started, expires:', watchResponse.expiration);

handler.setLastHistoryId(watchResponse.historyId!);
```

### Stopping Watch

```typescript
await Gmail.Users.stop('me');
```

## Testing

### Run Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
npm test -- messages.test.ts
npm test -- labels.test.ts
npm test -- drafts.test.ts
npm test -- threads.test.ts
npm test -- webhooks.test.ts
```

### Run Webhook Server

```bash
npm run webhook-server
```

The webhook server will start on port 3000 (configurable via `WEBHOOK_PORT` env var) and listen for Gmail push notifications.

## Required OAuth Scopes

For full SDK functionality, request these scopes:

- `https://www.googleapis.com/auth/gmail.modify` - Read, modify, and delete messages
- `https://www.googleapis.com/auth/gmail.labels` - Manage labels
- `https://www.googleapis.com/auth/gmail.send` - Send emails
- `https://www.googleapis.com/auth/gmail.compose` - Create and manage drafts
- `https://www.googleapis.com/auth/gmail.readonly` - Read-only access (alternative)

## Rate Limits

Gmail API has the following quotas:

- **250 quota units per user per second**
- **1 billion quota units per day**

Most operations cost 5-25 quota units. Monitor your usage in the Google Cloud Console.

## Error Handling

```typescript
try {
  const message = await Gmail.Messages.get('me', messageId);
} catch (error) {
  if (error.status === 404) {
    console.log('Message not found');
  } else if (error.status === 429) {
    console.log('Rate limit exceeded');
  } else if (error.status === 401) {
    console.log('Authentication failed - refresh token');
  } else {
    console.error('Error:', error.message);
  }
}
```

## Examples

### Send an Email

```typescript
function createEmail(to: string, subject: string, body: string): string {
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    body,
  ].join('\n');

  return Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const raw = createEmail(
  'recipient@example.com',
  'Hello from Gmail SDK',
  'This is a test email sent via the Gmail API!'
);

const message = await Gmail.Messages.send('me', { raw });
console.log('Message sent:', message.id);
```

### Search Messages

```typescript
const unreadMessages = await Gmail.Messages.list('me', 'is:unread', 20);

const fromSender = await Gmail.Messages.list('me', 'from:sender@example.com');

const withAttachment = await Gmail.Messages.list('me', 'has:attachment');

const dateRange = await Gmail.Messages.list('me', 'after:2024/01/01 before:2024/12/31');
```

### Batch Operations

```typescript
const messageIds = ['msg1', 'msg2', 'msg3'];

await Gmail.Messages.batchModify('me', {
  ids: messageIds,
  addLabelIds: ['STARRED'],
  removeLabelIds: ['UNREAD'],
});
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and questions:
- GitHub Issues: [github.com/your-repo/issues](https://github.com/your-repo/issues)
- Gmail API Documentation: [developers.google.com/gmail/api](https://developers.google.com/gmail/api)

