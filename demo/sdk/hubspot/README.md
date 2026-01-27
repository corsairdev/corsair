# HubSpot SDK

A TypeScript SDK for the HubSpot API with Zod validation.

## Installation

```bash
npm install
```

## Configuration

### Getting Your HubSpot Credentials

Follow these steps to obtain the necessary access token from your HubSpot account (updated for 2024/2025):

#### Step 1: Navigate to Private Apps

1. Log in to your [HubSpot account](https://app.hubspot.com)
2. Click the **Settings** icon (⚙️) in the main navigation bar (top right)
3. In the left sidebar, navigate to **Integrations** → **Private Apps**
4. You'll see a list of existing private apps (if any)

#### Step 2: Create a New Private App

1. Click the **"Create a private app"** button (top right)
2. In the **"Basic Info"** tab:
   - Enter an **App name** (e.g., "My SDK App" or "Workflow Integration")
   - Optionally add a **Description**
   - Click **"Create app"** at the bottom

#### Step 3: Configure Scopes (Permissions)

1. After creating the app, you'll be on the **"Scopes"** tab
2. Select the scopes you need based on what you want to do. Here are the recommended scopes:

| Scope | Description | Required For |
|-------|-------------|--------------|
| `crm.objects.contacts.read` | Read contacts | Getting contact info, listing contacts |
| `crm.objects.contacts.write` | Write contacts | Creating/updating/deleting contacts |
| `crm.objects.companies.read` | Read companies | Getting company info, listing companies |
| `crm.objects.companies.write` | Write companies | Creating/updating/deleting companies |
| `crm.objects.deals.read` | Read deals | Getting deal info, listing deals |
| `crm.objects.deals.write` | Write deals | Creating/updating/deleting deals |
| `crm.objects.tickets.read` | Read tickets | Getting ticket info, listing tickets |
| `crm.objects.tickets.write` | Write tickets | Creating/updating/deleting tickets |
| `engagements.read` | Read engagements | Getting engagement info |
| `engagements.write` | Write engagements | Creating/deleting engagements |
| `contacts.read` | Read contact lists | Viewing contact lists |
| `contacts.write` | Write contact lists | Adding/removing contacts from lists |

3. **Tip**: You can search for scopes using the search box at the top
4. Click **"Save"** after selecting your scopes

#### Step 4: Get Your Access Token

1. Navigate to the **"Auth"** tab (in the app settings)
2. You'll see a section labeled **"Access token"**
3. Click the **"Show token"** button (or eye icon) to reveal the token
4. Copy the **Access token** - it will start with `pat-` (Private App Token)
5. **Important**: Store this token securely. You won't be able to see it again after closing this page. If you lose it, you'll need to create a new private app.

#### Step 5: Create Environment File

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Open the `.env` file and fill in your values:
   ```env
   # HubSpot API Configuration
   HUBSPOT_ACCESS_TOKEN=pat-your-actual-access-token-here
   HUBSPOT_BASE_URL=https://api.hubapi.com

   # Webhook Configuration (optional, for webhook testing)
   HUBSPOT_WEBHOOK_SECRET=your-webhook-secret-here

   # Test Configuration
   TEST_TIMEOUT=30000
   TEST_LIST_ID=your-test-list-id-here

   # Webhook Server Configuration
   PORT=3000
   ```

3. Replace `pat-your-actual-access-token-here` with the token you copied in Step 4

### Setting Up Webhooks

To receive webhook events from HubSpot, follow these steps:

#### Step 1: Get Your Webhook Secret (Optional but Recommended)

1. In your Private App settings, go to the **"Webhooks"** tab
2. You'll see a **"Client secret"** - copy this value
3. Add it to your `.env` file as `HUBSPOT_WEBHOOK_SECRET`
4. This secret is used to verify webhook signatures for security

#### Step 2: Set Up Local Webhook Server

1. Start the webhook test server:
   ```bash
   npm run webhook-server
   ```

2. In another terminal, start ngrok to expose your local server:
   ```bash
   ngrok http 3000
   ```

3. Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`)

#### Step 3: Create Webhook Subscription in HubSpot

1. Go to your Private App settings → **"Webhooks"** tab
2. Click **"Create subscription"** button
3. Fill in the subscription details:
   - **Webhook URL**: `https://your-ngrok-url.ngrok.io/webhook`
   - **Event type**: Select from the dropdown (e.g., `contact.creation`, `company.creation`, etc.)
   - **Property name**: (Optional) Leave blank for all properties, or specify a property
   - **Active**: Check this box to enable the subscription
4. Click **"Create"**
5. Repeat for each event type you want to receive

#### Step 4: Test Webhooks

1. With the webhook server running, trigger events in HubSpot:
   - Create a new contact
   - Update a company
   - Create a deal
   - etc.

2. Watch your terminal for incoming webhook events
3. Webhook payloads are automatically saved to `tests/fixtures/` for testing

#### Available Webhook Event Types

- `contact.creation` - When a contact is created
- `contact.propertyChange` - When a contact property changes
- `contact.deletion` - When a contact is deleted
- `contact.privacyDeletion` - When a contact is privacy deleted
- `company.creation` - When a company is created
- `company.propertyChange` - When a company property changes
- `company.deletion` - When a company is deleted
- `deal.creation` - When a deal is created
- `deal.propertyChange` - When a deal property changes
- `deal.deletion` - When a deal is deleted
- `ticket.creation` - When a ticket is created
- `ticket.propertyChange` - When a ticket property changes
- `ticket.deletion` - When a ticket is deleted
- `engagement.creation` - When an engagement is created
- `engagement.deletion` - When an engagement is deleted
- `conversation.creation` - When a conversation is created
- `conversation.newMessage` - When a new message is added to a conversation
- `conversation.propertyChange` - When a conversation property changes
- `conversation.deletion` - When a conversation is deleted
- `conversation.privacyDeletion` - When a conversation is privacy deleted
- `workflow.enrollment` - When a contact is enrolled in a workflow

## Usage

### Basic Usage

```typescript
import { HubSpot, OpenAPI } from '@corsair/hubspot-sdk';

// Configure the token
OpenAPI.TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

// Get a contact
const contact = await HubSpot.Contacts.get({
  contactId: '12345',
});
console.log(contact);

// Create a contact
const newContact = await HubSpot.Contacts.createOrUpdate({
  properties: {
    email: 'newcontact@example.com',
    firstname: 'New',
    lastname: 'Contact',
  },
});
console.log(newContact);

// Get many companies
const companies = await HubSpot.Companies.getMany({ limit: 10 });
console.log(companies);
```

### Available APIs

- **HubSpot.Contacts** - Contact management (get, getMany, createOrUpdate, delete, getRecentlyCreated, getRecentlyUpdated, search)
- **HubSpot.Companies** - Company management (get, getMany, create, update, delete, getRecentlyCreated, getRecentlyUpdated, searchByDomain)
- **HubSpot.Deals** - Deal management (get, getMany, create, update, delete, getRecentlyCreated, getRecentlyUpdated, search)
- **HubSpot.Tickets** - Ticket management (get, getMany, create, update, delete)
- **HubSpot.Engagements** - Engagement management (get, getMany, create, delete)
- **HubSpot.ContactLists** - Contact list operations (addContact, removeContact)

### With Per-Request Token

You can also pass a token per request:

```typescript
const contact = await HubSpot.Contacts.get({
  contactId: '12345',
  token: 'pat-your-token-here',
});
```

### With Zod Validation

All request arguments have Zod schemas for validation:

```typescript
import { GetContactArgsSchema } from '@corsair/hubspot-sdk';

const args = {
  contactId: '12345',
};

// Validate before sending
const result = GetContactArgsSchema.safeParse(args);
if (result.success) {
  await HubSpot.Contacts.get(result.data);
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

### Contacts

| Method | Description |
|--------|-------------|
| `HubSpot.Contacts.get(args)` | Get a contact by ID |
| `HubSpot.Contacts.getMany(args)` | Get many contacts |
| `HubSpot.Contacts.createOrUpdate(args)` | Create or update a contact |
| `HubSpot.Contacts.delete(args)` | Delete a contact |
| `HubSpot.Contacts.getRecentlyCreated(args)` | Get recently created contacts |
| `HubSpot.Contacts.getRecentlyUpdated(args)` | Get recently updated contacts |
| `HubSpot.Contacts.search(args)` | Search contacts |

### Companies

| Method | Description |
|--------|-------------|
| `HubSpot.Companies.get(args)` | Get a company by ID |
| `HubSpot.Companies.getMany(args)` | Get many companies |
| `HubSpot.Companies.create(args)` | Create a company |
| `HubSpot.Companies.update(args)` | Update a company |
| `HubSpot.Companies.delete(args)` | Delete a company |
| `HubSpot.Companies.getRecentlyCreated(args)` | Get recently created companies |
| `HubSpot.Companies.getRecentlyUpdated(args)` | Get recently updated companies |
| `HubSpot.Companies.searchByDomain(args)` | Search company by domain |

### Deals

| Method | Description |
|--------|-------------|
| `HubSpot.Deals.get(args)` | Get a deal by ID |
| `HubSpot.Deals.getMany(args)` | Get many deals |
| `HubSpot.Deals.create(args)` | Create a deal |
| `HubSpot.Deals.update(args)` | Update a deal |
| `HubSpot.Deals.delete(args)` | Delete a deal |
| `HubSpot.Deals.getRecentlyCreated(args)` | Get recently created deals |
| `HubSpot.Deals.getRecentlyUpdated(args)` | Get recently updated deals |
| `HubSpot.Deals.search(args)` | Search deals |

### Tickets

| Method | Description |
|--------|-------------|
| `HubSpot.Tickets.get(args)` | Get a ticket by ID |
| `HubSpot.Tickets.getMany(args)` | Get many tickets |
| `HubSpot.Tickets.create(args)` | Create a ticket |
| `HubSpot.Tickets.update(args)` | Update a ticket |
| `HubSpot.Tickets.delete(args)` | Delete a ticket |

### Engagements

| Method | Description |
|--------|-------------|
| `HubSpot.Engagements.get(args)` | Get an engagement by ID |
| `HubSpot.Engagements.getMany(args)` | Get many engagements |
| `HubSpot.Engagements.create(args)` | Create an engagement |
| `HubSpot.Engagements.delete(args)` | Delete an engagement |

### Contact Lists

| Method | Description |
|--------|-------------|
| `HubSpot.ContactLists.addContact(args)` | Add a contact to a list |
| `HubSpot.ContactLists.removeContact(args)` | Remove a contact from a list |

## Error Handling

The SDK throws `ApiError` for API errors:

```typescript
import { ApiError } from '@corsair/hubspot-sdk';

try {
  await HubSpot.Contacts.get({ contactId: '12345' });
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.status, error.message);
    console.error('Response body:', error.body);
  }
}
```

## Rate Limiting

HubSpot has rate limits. The SDK will throw an error with status 429 when rate limited. You can handle this:

```typescript
try {
  await HubSpot.Contacts.getMany();
} catch (error) {
  if (error instanceof ApiError && error.status === 429) {
    // Handle rate limit
    const retryAfter = error.headers?.['retry-after'];
    console.log(`Rate limited. Retry after ${retryAfter} seconds`);
  }
}
```

## Webhook Handling

The SDK includes a webhook handler for processing HubSpot webhook events:

```typescript
import { createWebhookHandler } from '@corsair/hubspot-sdk';

const handler = createWebhookHandler({
  secret: process.env.HUBSPOT_WEBHOOK_SECRET, // Optional, for signature verification
});

// Handle contact creation
handler.on('contact.creation', async (event) => {
  console.log('Contact created:', event.objectId);
  // Your logic here
});

// Handle contact updates
handler.on('contact.propertyChange', async (event) => {
  console.log('Contact updated:', event.objectId);
  console.log('Property:', event.propertyName);
  console.log('New value:', event.propertyValue);
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
- Receive webhook events from HubSpot
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
# Required: HubSpot API Access Token
HUBSPOT_ACCESS_TOKEN=pat-your-access-token-here

# Optional: Override API base URL (default: https://api.hubapi.com)
HUBSPOT_BASE_URL=https://api.hubapi.com

# Optional: Webhook secret for signature verification
HUBSPOT_WEBHOOK_SECRET=your-webhook-secret-here

# Optional: Test timeout in milliseconds (default: 30000)
TEST_TIMEOUT=30000

# Optional: Test list ID for contact list tests
TEST_LIST_ID=your-test-list-id-here

# Optional: Webhook server port (default: 3000)
PORT=3000
```

## License

MIT

