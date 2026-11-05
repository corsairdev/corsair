# eSputnik Plugin for Corsair

Typed access to the [eSputnik](https://esputnik.com) REST API: contacts and segments, events and orders, messages on every channel, broadcasts, web tracking and promo codes.

## Setup

Create an API key in eSputnik (your profile > Settings > API) and pass it to the plugin, or store it through Corsair's API-key credential flow. Requests use HTTP Basic auth with the key as the password.

```typescript
import { createCorsair } from 'corsair';
import { esputnik } from '@corsair-dev/esputnik';

export const corsair = createCorsair({
	plugins: [esputnik({ key: process.env.ESPUTNIK_API_KEY })],
});
```

## Operations

108 operations, grouped by area:

| Group | What it covers |
| --- | --- |
| `account` | Account info, balance, billing history, bearer tokens for the event endpoints |
| `contacts` | Create, update, search and delete contacts; segments, workflows, subscriptions, unsubscribe list, recommendations, activity and message history, mobile push tokens |
| `orders`, `events` | Orders, current and past events |
| `emails`, `mobilePush`, `viber`, `appInbox`, `telegramBot`, `sms` | Message templates and their language versions; sending email, SMS and Viber |
| `messages` | Sending a prepared message to contacts, reporting interaction status |
| `broadcasts` | List, create, read and cancel broadcasts |
| `interfaces` | Email and SMS sender names |
| `site`, `productFeeds`, `apps`, `promocodes`, `preprocessor` | Web tracking and web push domains, product feeds, Telegram app tokens, promo codes, preprocessor files |

Every input and output is checked with a Zod schema. Routes and field names follow the [eSputnik API reference](https://docs.esputnik.com/reference/getting-started-with-your-api).
