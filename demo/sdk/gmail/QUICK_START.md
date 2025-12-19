# Gmail SDK - Quick Start

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
cd demo/sdk/gmail
npm install
```

### 2. Get OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable Gmail API
3. Create OAuth 2.0 credentials (Desktop app)
4. Save Client ID and Client Secret

### 3. Get Tokens

Create `get-tokens.js`:

```javascript
const { google } = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'urn:ietf:wg:oauth:2.0:oob'
);

const scopes = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.send',
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent',
});

console.log('Visit:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter code: ', async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log('\nGMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
  console.log('GMAIL_ACCESS_TOKEN=' + tokens.access_token);
  rl.close();
});
```

Run it:
```bash
node get-tokens.js
```

### 4. Create .env File

```bash
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_ACCESS_TOKEN=your-access-token
GMAIL_USER_ID=me
TEST_EMAIL=your-email@gmail.com
```

### 5. Run Tests

```bash
npm test
```

## 📝 Common Operations

### List Messages

```typescript
import { Gmail, OpenAPI } from './index';

OpenAPI.TOKEN = process.env.GMAIL_ACCESS_TOKEN;

const messages = await Gmail.Messages.list('me', 'is:inbox', 10);
console.log(`Found ${messages.messages?.length} messages`);
```

### Send Email

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

const raw = createEmail('to@example.com', 'Hello', 'Test message');
const sent = await Gmail.Messages.send('me', { raw });
```

### Create Label

```typescript
const label = await Gmail.Labels.create('me', {
  name: 'My Label',
  labelListVisibility: 'labelShow',
  messageListVisibility: 'show',
});
```

### Create Draft

```typescript
const raw = createEmail('to@example.com', 'Draft', 'Draft content');
const draft = await Gmail.Drafts.create('me', {
  message: { raw },
});
```

### Search Messages

```typescript
const unread = await Gmail.Messages.list('me', 'is:unread');

const fromSender = await Gmail.Messages.list('me', 'from:sender@example.com');

const withAttachment = await Gmail.Messages.list('me', 'has:attachment');
```

### Modify Labels

```typescript
await Gmail.Messages.modify('me', messageId, {
  addLabelIds: ['STARRED', 'IMPORTANT'],
  removeLabelIds: ['UNREAD'],
});
```

## 🔔 Webhooks

### Setup Watch

```typescript
import { createWebhookHandler } from './webhook-handler';

const handler = createWebhookHandler({ userId: 'me' });

handler.on('messageReceived', async (event) => {
  console.log('New message:', event.message.snippet);
});

const watch = await Gmail.Users.watch('me', {
  topicName: 'projects/your-project/topics/gmail-push',
  labelIds: ['INBOX'],
});
```

### Webhook Server

```bash
npm run webhook-server
```

## 🧪 Testing

```bash
npm test                    # All tests
npm test -- messages.test   # Messages only
npm run test:watch          # Watch mode
npm run test:verbose        # Verbose output
```

## 📚 Full Documentation

- [README.md](./README.md) - Complete API reference
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup instructions
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details

## 🆘 Troubleshooting

### Token Expired
Access tokens expire after 1 hour. Use refresh token to get a new one.

### Rate Limit
Gmail API: 250 units/user/second. Wait between requests.

### Insufficient Permission
Re-run token generator with all required scopes.

## 🔗 Useful Links

- [Gmail API Docs](https://developers.google.com/gmail/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

---

**Need help?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions!

