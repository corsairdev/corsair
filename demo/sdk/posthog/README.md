# PostHog SDK

A TypeScript SDK for the PostHog API with Zod validation.

## Installation

```bash
npm install
```

## Configuration

### Getting Your PostHog Credentials

Follow these steps to obtain the necessary API key from your PostHog account:

#### Step 1: Get Your Project API Key

1. Log in to your [PostHog account](https://app.posthog.com)
2. Navigate to your **Project Settings**
3. Click on **Project API Key** in the left sidebar
4. Copy your **Project API Key** - this is the key you'll use for capturing events

#### Step 2: Get Your Personal API Key (Optional, for API access)

1. In PostHog, click on your profile icon (top right)
2. Go to **Personal API Keys**
3. Click **Create Personal API Key**
4. Give it a name and copy the key
5. **Important**: Store this key securely. You won't be able to see it again.

#### Step 3: Create Environment File

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Open the `.env` file and fill in your values:
   ```env
   # PostHog API Configuration
   POSTHOG_API_KEY=your-project-api-key-here
   POSTHOG_API_HOST=https://app.posthog.com

   # Optional: Personal API Key for API access
   POSTHOG_PERSONAL_API_KEY=your-personal-api-key-here

   # Webhook Configuration (optional, for webhook testing)
   POSTHOG_WEBHOOK_SECRET=your-webhook-secret-here

   # Test Configuration
   TEST_TIMEOUT=30000

   # Webhook Server Configuration
   PORT=3000
   ```

3. Replace `your-project-api-key-here` with the Project API Key you copied in Step 1

### Setting Up Webhooks

To receive webhook events from PostHog, follow these steps:

#### Step 1: Set Up Local Webhook Server

1. Start the webhook test server:
   ```bash
   npm run webhook-server
   ```

2. In another terminal, start ngrok to expose your local server:
   ```bash
   ngrok http 3000
   ```

3. Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`)

#### Step 2: Create Webhook Destination in PostHog

1. Go to your PostHog project settings
2. Navigate to **Data Pipelines** → **Destinations**
3. Click **+ New** → **Destination** → **Webhook**
4. Enter the Webhook URL: `https://your-ngrok-url.ngrok.io/webhook`
5. Configure filters (optional) to select which events to send
6. Click **Create & Enable**

#### Step 3: Test Webhooks

1. With the webhook server running, trigger events in PostHog:
   - Capture events using the SDK
   - Use PostHog's UI to trigger events
   - etc.

2. Watch your terminal for incoming webhook events
3. Webhook payloads are automatically saved to `tests/fixtures/` for testing

## Usage

### Basic Usage

```typescript
import { PostHog, OpenAPI } from '@corsair/posthog-sdk';

// Configure the API key
OpenAPI.TOKEN = process.env.POSTHOG_API_KEY;

// Create an event
const event = await PostHog.Events.create({
  distinct_id: 'user-123',
  event: 'button_clicked',
  properties: {
    button_name: 'Sign Up',
    page: '/home',
  },
});
console.log(event);

// Create an identity
const identity = await PostHog.Identity.create({
  distinct_id: 'user-123',
  properties: {
    email: 'user@example.com',
    name: 'John Doe',
    plan: 'premium',
  },
});
console.log(identity);

// Track a page view
const pageView = await PostHog.Track.trackPage({
  distinct_id: 'user-123',
  url: 'https://example.com/products',
  properties: {
    title: 'Products Page',
  },
});
console.log(pageView);

// Track a screen view
const screenView = await PostHog.Track.trackScreen({
  distinct_id: 'user-123',
  screen_name: 'HomeScreen',
  properties: {
    app_version: '1.0.0',
    platform: 'ios',
  },
});
console.log(screenView);

// Create an alias
const alias = await PostHog.Alias.create({
  distinct_id: 'user-123',
  alias: 'old-user-id',
});
console.log(alias);
```

### Available APIs

- **PostHog.Alias** - Alias management (create)
- **PostHog.Events** - Event tracking (create)
- **PostHog.Identity** - User identification (create)
- **PostHog.Track** - Page and screen tracking (trackPage, trackScreen)

### With Per-Request Token

You can also pass a token per request:

```typescript
const event = await PostHog.Events.create({
  distinct_id: 'user-123',
  event: 'button_clicked',
  token: 'your-api-key-here',
});
```

### With Zod Validation

All request arguments have Zod schemas for validation:

```typescript
import { CreateEventArgsSchema } from '@corsair/posthog-sdk';

const args = {
  distinct_id: 'user-123',
  event: 'button_clicked',
  properties: {
    button_name: 'Sign Up',
  },
};

// Validate before sending
const result = CreateEventArgsSchema.safeParse(args);
if (result.success) {
  await PostHog.Events.create(result.data);
} else {
  console.error('Validation failed:', result.error);
}
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run only model validation tests (no token required)
npm test -- models.test.ts
```

## API Reference

### Alias

| Method | Description |
|--------|-------------|
| `PostHog.Alias.create(args)` | Create an alias to link two distinct IDs |

### Events

| Method | Description |
|--------|-------------|
| `PostHog.Events.create(args)` | Create a custom event |

### Identity

| Method | Description |
|--------|-------------|
| `PostHog.Identity.create(args)` | Create or update user identity properties |

### Track

| Method | Description |
|--------|-------------|
| `PostHog.Track.trackPage(args)` | Track a page view |
| `PostHog.Track.trackScreen(args)` | Track a screen view (mobile apps) |

## Error Handling

The SDK throws `ApiError` for API errors:

```typescript
import { ApiError } from '@corsair/posthog-sdk';

try {
  await PostHog.Events.create({
    distinct_id: 'user-123',
    event: 'test_event',
  });
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.status, error.message);
    console.error('Response body:', error.body);
  }
}
```

## Rate Limiting

PostHog has rate limits. The SDK will throw an error with status 429 when rate limited. You can handle this:

```typescript
try {
  await PostHog.Events.create({
    distinct_id: 'user-123',
    event: 'test_event',
  });
} catch (error) {
  if (error instanceof ApiError && error.status === 429) {
    // Handle rate limit
    const retryAfter = error.headers?.['retry-after'];
    console.log(`Rate limited. Retry after ${retryAfter} seconds`);
  }
}
```

## Webhook Handling

The SDK includes a webhook handler for processing PostHog webhook events:

```typescript
import { createWebhookHandler } from '@corsair/posthog-sdk';

const handler = createWebhookHandler({
  secret: process.env.POSTHOG_WEBHOOK_SECRET, // Optional, for signature verification
});

// Handle event captured
handler.on('event.captured', async (event) => {
  console.log('Event captured:', event.event);
  console.log('User:', event.distinct_id);
  console.log('Properties:', event.properties);
  // Your logic here
});

// Process webhook payload
const result = await handler.handleWebhook(headers, payload);
if (result.success) {
  console.log('Webhook processed:', result.eventType);
}
```

### Running the Webhook Test Server

The SDK includes a test server for receiving and testing webhooks:

```bash
# Start the webhook server
npm run webhook-server

# In another terminal, expose it with ngrok
ngrok http 3000
```

The server will:
- Receive webhook events from PostHog
- Log event details to the console
- Save webhook payloads to `tests/fixtures/` for testing
- Display a helpful setup page at `http://localhost:3000`

### Testing Webhooks

After capturing webhook events, you can test them:

```bash
# Run webhook tests (uses fixtures from webhook server)
npm test -- webhooks.test.ts
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Required: PostHog Project API Key
POSTHOG_API_KEY=your-project-api-key-here

# Optional: Override API base URL (default: https://app.posthog.com)
POSTHOG_API_HOST=https://app.posthog.com

# Optional: Personal API Key for API access
POSTHOG_PERSONAL_API_KEY=your-personal-api-key-here

# Optional: Webhook secret for signature verification
POSTHOG_WEBHOOK_SECRET=your-webhook-secret-here

# Optional: Test timeout in milliseconds (default: 30000)
TEST_TIMEOUT=30000

# Optional: Webhook server port (default: 3000)
PORT=3000
```

## License

MIT

