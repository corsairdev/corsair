# eSputnik Plugin for Corsair

This package provides a typed eSputnik integration for Corsair using eSputnik's HTTP Basic Authentication API-key flow.

## Setup

Create an eSputnik API key and provide it through Corsair's API-key credential configuration:

```typescript
import { createCorsair } from 'corsair';
import { esputnik } from '@corsair-dev/esputnik';

export const corsair = createCorsair({
	plugins: [esputnik({ key: process.env.ESPUTNIK_API_KEY })],
});
```

## Current Operations

The plugin covers 110 documented, non-deprecated operations across:

- Account, contacts, segments, workflows, and subscription categories.
- Orders, current and historical events, and behavior tracking.
- Email, mobile push, Viber, App Inbox, Telegram bot, SMS, and broadcast messaging.
- Domains, web push, product feeds, application tokens, promotional codes, preprocessor files, and interaction status.

The implementation uses the official API base URL `https://esputnik.com/api/` and validates every public operation input and output with Zod schemas.

See the official documentation for request and response details:

https://docs.esputnik.com/llms.txt
