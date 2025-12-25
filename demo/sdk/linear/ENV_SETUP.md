# Environment Variables Setup - Quick Reference

## Required Environment Variables

### 1. LINEAR_API_KEY (Required)

**How to get it:**

1. Log in to Linear → Settings (bottom left)
2. Go to **Account** → **API**
3. Under **Personal API Keys**, click **Create New Key**
4. Name it "Linear SDK Development"
5. **Copy the key** (starts with `lin_api_`)

**Add to .env:**
```bash
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxxx
```

---

### 2. LINEAR_BASE_URL (Optional - has default)

**Default value:** `https://api.linear.app/graphql`

This is Linear's GraphQL API endpoint. You typically don't need to change this.

**Add to .env:**
```bash
LINEAR_BASE_URL=https://api.linear.app/graphql
```

---

### 3. LINEAR_TEST_TEAM_ID (Optional - needed for create/update/delete tests)

**How to get it:**

**Method A - Use the SDK:**

Create `get-team-id.ts`:
```typescript
import { Linear, OpenAPI } from './index';
import * as dotenv from 'dotenv';

dotenv.config();
OpenAPI.BASE = process.env.LINEAR_BASE_URL || 'https://api.linear.app/graphql';
OpenAPI.TOKEN = process.env.LINEAR_API_KEY;

async function getTeams() {
  const teams = await Linear.teams.list(10);
  teams.nodes.forEach(team => {
    console.log(`${team.name} (${team.key}): ${team.id}`);
  });
}

getTeams();
```

Run: `npx ts-node get-team-id.ts`

**Method B - Use GraphQL Playground:**

1. Go to https://studio.apollographql.com/sandbox/explorer
2. Set endpoint: `https://api.linear.app/graphql`
3. Add header: `Authorization: Bearer lin_api_your_key_here`
4. Run query:
   ```graphql
   query {
     teams {
       nodes {
         id
         name
         key
       }
     }
   }
   ```

**Add to .env:**
```bash
LINEAR_TEST_TEAM_ID=your-team-id-here
```

---

### 4. LINEAR_WEBHOOK_SECRET (Optional - needed for webhook signature verification)

**How to get it:**

1. First, expose your local server (see step 5)
2. Go to Linear Settings → **Workspace Settings** → **API**
3. Scroll to **Webhooks** section
4. Click **+** to create a new webhook
5. Configure:
   - **Label:** SDK Development
   - **URL:** Your ngrok URL + `/webhook/linear`
   - **Resource types:** Issues, Comments, Projects
6. Click **Create Webhook**
7. **Copy the Signing Secret** shown after creation

**Add to .env:**
```bash
LINEAR_WEBHOOK_SECRET=your-signing-secret-here
```

---

### 5. WEBHOOK_PORT (Optional - has default)

**Default value:** `3000`

The port your local webhook server will listen on.

**Add to .env:**
```bash
WEBHOOK_PORT=3000
```

---

### 6. TEST_TIMEOUT (Optional - has default)

**Default value:** `30000` (30 seconds)

Maximum time in milliseconds for tests to complete.

**Add to .env:**
```bash
TEST_TIMEOUT=30000
```

---

## Complete .env Template

```bash
LINEAR_API_KEY=lin_api_your_key_here
LINEAR_BASE_URL=https://api.linear.app/graphql

LINEAR_TEST_TEAM_ID=

LINEAR_WEBHOOK_SECRET=
WEBHOOK_PORT=3000

TEST_TIMEOUT=30000
```

---

## Exposing Local Webhook Server (for Step 4)

### Install ngrok

**macOS:**
```bash
brew install ngrok
```

**Windows:**
Download from https://ngrok.com/download

**Linux:**
```bash
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin
```

### Run ngrok

1. Start your webhook server:
   ```bash
   npm run webhook-server
   ```

2. In a new terminal, run:
   ```bash
   ngrok http 3000
   ```

3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

4. Use this URL when creating the webhook in Linear:
   ```
   https://abc123.ngrok.io/webhook/linear
   ```

---

## Verification Steps

### Step 1: Verify API Key

```bash
npm test -- teams.test.ts
```

Expected output:
```
✓ should list teams (234ms)
  Listed 3 team(s)
  First team: ENG - Engineering
```

### Step 2: Verify Team ID (if set)

```bash
npm test -- issues.test.ts
```

Tests should list issues for your team.

### Step 3: Verify Webhook Setup

1. Start webhook server: `npm run webhook-server`
2. Trigger an event in Linear (create an issue)
3. Check server logs for: `✓ Event processed: Issue.create`
4. Check `tests/fixtures/` for captured JSON files

---

## Troubleshooting

### "LINEAR_API_KEY not set"
- Check your `.env` file exists in `demo/sdk/linear/`
- Verify the key starts with `lin_api_`
- No extra spaces or quotes around the key

### "Invalid signature"
- Restart webhook server after adding `LINEAR_WEBHOOK_SECRET`
- Verify secret matches exactly from Linear settings
- For testing, temporarily remove `LINEAR_WEBHOOK_SECRET`

### "Team not found"
- Run the get-team-id script to get valid IDs
- Check you have access to the team in Linear
- Some tests are skipped if `LINEAR_TEST_TEAM_ID` is not set

---

## Quick Start (Minimal Setup)

To just run basic tests without create/update/delete operations:

1. Get API key from Linear
2. Create `.env`:
   ```bash
   LINEAR_API_KEY=lin_api_your_key_here
   LINEAR_BASE_URL=https://api.linear.app/graphql
   ```
3. Run: `npm test`

This is enough to test:
- ✅ Listing issues
- ✅ Getting issues by ID
- ✅ Listing teams
- ✅ Getting team details
- ✅ Listing projects
- ⏭️ Skips: Creating/updating/deleting (needs team ID)
- ⏭️ Skips: Webhook verification (needs webhook secret)

