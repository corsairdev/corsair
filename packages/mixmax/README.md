# Mixmax Plugin

Email productivity platform for Gmail and Outlook with sequences, templates, and automation.

## Types of Integrations

Mixmax offers three ways to integrate your application with the Mixmax compose window:

- **Enhancements** - Show up as icons in the Mixmax Enhance menu. Includes Availability, SMS, and Poll integrations with a picker UI.
- **Slash Commands** - Accessed using the Mixmax command menu (typing "/"). Includes Google Search and Giphy search streamed as you type.
- **Link Resolvers** - Convert URLs into rich previews when pasted. Includes LinkedIn and Instagram link previews.

## API Operations

### Messages
- list - List your messages (emails) that are drafts, scheduled, sent, or failed to send
- create - Create a draft message (email does not send)
- get - Retrieve a message by ID
- update - Update a saved message
- send - Send a saved draft message (returns 202, delivery async)
- schedule - Schedule a message to send later
- unschedule - Cancel a scheduled send
- 	est - Send a test email to yourself
- sendPlain - Send a plain email from your mailbox
- envVars.list - List env vars for a service
- envVars.retrieve - Retrieve an env var value
- envVars.upsert - Update or create an env var
- envVars.delete - Delete an env var
- headers.list - List headers for a service
- headers.add - Add a header
- headers.update - Update a header
- headers.delete - Delete a header
- customDomains.list - List custom domains
- customDomains.create - Create a custom domain
- customDomains.retrieve - Retrieve a custom domain
- customDomains.verify - Verify a custom domain
- customDomains.delete - Delete a custom domain
- secretFiles.list - List secret files
- secretFiles.retrieve - Retrieve a secret file
- secretFiles.upsert - Upsert a secret file
- secretFiles.delete - Delete a secret file

### Sequences
- list - List sequences you can access
- getRecipients - Get recipients of a sequence
- ddRecipients - Add recipients to a sequence

### Snippets
- list - List templates (snippets)
- get - Get a template by ID

### Users
- getMe - Get the current Mixmax user
- userPreferences - Get and update user preferences (auto BCC, signature)

## Authentication

This plugin supports two auth types:

- **pi_key** - Use your Mixmax API token with 	enant_external_id
- **oauth_2** - OAuth 2.0 flow with tenant external ID routing

## Webhooks

The plugin includes a webhook handler for example.example events that verifies the X-Mixmax-Signature header and logs events to the Corsair event database.

## Usage

`	ypescript
import { mixmax } from '@corsair-dev/mixmax';

const plugin = mixmax({
  key: 'your_mixmax_api_key',
  authType: 'api_key',
});

// List messages
const messages = await plugin.endpoints.messages.list({ limit: 50 });

// Create a draft
await plugin.endpoints.messages.create({
  to: [{ email: 'customer@example.com' }],
  subject: 'Hello',
  body: '<p>Test</p>',
});

// List env vars
const envVars = await plugin.endpoints.messages.envVars.list({ serviceId: 'srv-1' });

// Add a header
await plugin.endpoints.messages.headers.add({ serviceId: 'srv-1', name: 'Cache-Control' });
