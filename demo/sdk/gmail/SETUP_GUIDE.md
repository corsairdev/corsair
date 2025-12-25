# Gmail SDK Setup Guide

This guide will walk you through setting up the Gmail SDK for real API testing with your Gmail account.

## Prerequisites

- Node.js 18+ installed
- A Google account with Gmail access
- Access to Google Cloud Console

## Step-by-Step Setup

### 1. Google Cloud Project Setup

#### Create a New Project

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "Gmail SDK Testing")
5. Click **"Create"**
6. Wait for the project to be created and select it

#### Enable Gmail API

1. In your project, go to **"APIs & Services"** > **"Library"**
2. Search for **"Gmail API"**
3. Click on **"Gmail API"** in the results
4. Click **"Enable"**
5. Wait for the API to be enabled

### 2. OAuth 2.0 Credentials

#### Create OAuth Client ID

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - Choose **"External"** (unless you have a Google Workspace)
   - Fill in the app name: "Gmail SDK Test"
   - Add your email as the developer contact
   - Click **"Save and Continue"**
   - On Scopes page, click **"Add or Remove Scopes"**
   - Add these scopes:
     - `https://www.googleapis.com/auth/gmail.modify`
     - `https://www.googleapis.com/auth/gmail.labels`
     - `https://www.googleapis.com/auth/gmail.send`
   - Click **"Update"** and **"Save and Continue"**
   - Add your email as a test user
   - Click **"Save and Continue"**

4. Back on the Credentials page, click **"Create Credentials"** > **"OAuth client ID"**
5. Choose **"Desktop app"** as the application type
6. Name it "Gmail SDK Desktop Client"
7. Click **"Create"**
8. **Important:** Copy and save:
   - Client ID (looks like: `xxxxx.apps.googleusercontent.com`)
   - Client Secret

### 3. Get OAuth Tokens

#### Install Dependencies

```bash
cd demo/sdk/gmail
npm install
```

#### Create Token Generator Script

Create a file `get-tokens.js` in the `demo/sdk/gmail` directory:

```javascript
const { google } = require('googleapis');
const readline = require('readline');

const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const scopes = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent',
});

console.log('\n=== Gmail SDK Token Generator ===\n');
console.log('1. Visit this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Authorize the application');
console.log('3. Copy the authorization code\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the authorization code here: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\n=== Success! ===\n');
    console.log('Add these to your .env file:\n');
    console.log(`GMAIL_CLIENT_ID=${CLIENT_ID}`);
    console.log(`GMAIL_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GMAIL_ACCESS_TOKEN=${tokens.access_token}`);
    console.log(`GMAIL_USER_ID=me\n`);
    
    console.log('Note: The access token expires in 1 hour.');
    console.log('The refresh token can be used to get new access tokens.\n');
  } catch (error) {
    console.error('Error getting tokens:', error.message);
  }
  
  rl.close();
});
```

#### Run the Token Generator

```bash
node get-tokens.js
```

Follow the instructions:
1. Click the URL that appears
2. Sign in with your Google account
3. Click "Allow" to grant permissions
4. Copy the authorization code
5. Paste it into the terminal

### 4. Configure Environment Variables

Create a `.env` file in `demo/sdk/gmail/`:

```bash
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_ACCESS_TOKEN=your-access-token

GMAIL_USER_ID=me

TEST_EMAIL=your-email@gmail.com

TEST_TIMEOUT=30000
WEBHOOK_PORT=3000
```

**Important Notes:**
- Replace all `your-*` values with actual credentials from step 3
- `TEST_EMAIL` should be your Gmail address (for sending test emails to yourself)
- Keep this file secure and never commit it to version control

### 5. Verify Setup

Run a simple test to verify everything works:

```bash
npm test -- labels.test.ts
```

If successful, you should see output like:
```
Gmail API Test Configuration:
  Base URL: https://gmail.googleapis.com
  Token: ***configured***
  User ID: me
  Timeout: 30000ms

Gmail.Labels - Labels API
  list
    ✓ should list all labels (234ms)
```

## Setting Up Webhooks (Optional)

### 1. Enable Cloud Pub/Sub API

1. In Google Cloud Console, go to **"APIs & Services"** > **"Library"**
2. Search for **"Cloud Pub/Sub API"**
3. Click **"Enable"**

### 2. Create Pub/Sub Topic

Using gcloud CLI:

```bash
gcloud auth login

gcloud config set project YOUR_PROJECT_ID

gcloud pubsub topics create gmail-push
```

Or via Console:
1. Go to **"Pub/Sub"** > **"Topics"**
2. Click **"Create Topic"**
3. Name it `gmail-push`
4. Click **"Create"**

### 3. Grant Gmail API Permission

```bash
gcloud pubsub topics add-iam-policy-binding gmail-push \
  --member=serviceAccount:gmail-api-push@system.gserviceaccount.com \
  --role=roles/pubsub.publisher
```

### 4. Create Push Subscription (for Production)

For local testing, you can use pull subscriptions. For production with a public endpoint:

```bash
gcloud pubsub subscriptions create gmail-push-sub \
  --topic=gmail-push \
  --push-endpoint=https://your-domain.com/webhook/gmail
```

### 5. Update .env

Add to your `.env` file:

```bash
GMAIL_WEBHOOK_TOPIC=projects/YOUR_PROJECT_ID/topics/gmail-push
```

### 6. Test Webhook Server

```bash
npm run webhook-server
```

The server will start on port 3000 and display:
```
Gmail webhook server listening on port 3000
Webhook endpoint: http://localhost:3000/webhook/gmail
```

## Troubleshooting

### "Invalid Credentials" Error

- Verify your `GMAIL_ACCESS_TOKEN` is correct
- Access tokens expire after 1 hour - you may need to refresh
- Check that all required scopes were granted

### "Insufficient Permission" Error

- Ensure you added all required OAuth scopes
- Re-run the token generator with `prompt: 'consent'` to re-authorize

### "Rate Limit Exceeded" Error

- Gmail API has quotas (250 units/user/second)
- Wait a few seconds between test runs
- Check your quota usage in Google Cloud Console

### "Token Expired" Error

To refresh your access token, you can use the refresh token:

```javascript
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'urn:ietf:wg:oauth:2.0:oob'
);

oauth2Client.setCredentials({
  refresh_token: 'YOUR_REFRESH_TOKEN'
});

const { credentials } = await oauth2Client.refreshAccessToken();
console.log('New access token:', credentials.access_token);
```

### Tests Failing

1. Check that `.env` file exists and has all required variables
2. Verify your Gmail account has messages/labels to test with
3. Run tests individually to isolate issues:
   ```bash
   npm test -- messages.test.ts
   ```

## Running Tests

### All Tests

```bash
npm test
```

### Specific Test Suite

```bash
npm test -- messages.test.ts
npm test -- labels.test.ts
npm test -- drafts.test.ts
npm test -- threads.test.ts
npm test -- webhooks.test.ts
```

### Verbose Output

```bash
npm run test:verbose
```

### Watch Mode

```bash
npm run test:watch
```

## Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore` by default
2. **Rotate tokens regularly** - Especially if they may have been exposed
3. **Use minimal scopes** - Only request permissions you need
4. **Restrict OAuth consent screen** - Limit to specific users if possible
5. **Monitor API usage** - Check Google Cloud Console for unusual activity

## Next Steps

- Read the [README.md](./README.md) for API usage examples
- Explore the test files in `tests/` for more examples
- Check out the [Gmail API documentation](https://developers.google.com/gmail/api)
- Join the community and contribute!

## Support

If you encounter issues:
1. Check this guide thoroughly
2. Review error messages carefully
3. Search existing GitHub issues
4. Create a new issue with details about your problem

Happy coding! 🚀

