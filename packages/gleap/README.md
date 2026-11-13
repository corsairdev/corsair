# @corsair-dev/gleap

Gleap integration plugin for Corsair.

[Gleap](https://gleap.io) is a customer messaging, bug tracking, feedback collection, and user session management platform. This plugin provides typed access to the Gleap REST API for managing tickets, outbound messages, user sessions, surveys and ratings, teams, boards, and company records.

## Installation

```bash
pnpm add @corsair-dev/gleap
```

## Authentication

Generate an API key in your Gleap dashboard under **Settings → Developer → API keys**.

Pass your API key to the plugin:

```typescript
import { corsair } from 'corsair';
import { gleap } from '@corsair-dev/gleap';

const app = corsair({
  plugins: [
    gleap({
      key: process.env.GLEAP_API_KEY,
      projectId: process.env.GLEAP_PROJECT_ID, // optional
    }),
  ],
});
```

### Regions

The plugin defaults to the European data region base URL (`https://api.gleap.io/v3`). For projects hosted in the US data region, specify the US host via `baseUrl`:

```typescript
gleap({
  key: process.env.GLEAP_API_KEY,
  baseUrl: 'https://api.us.gleap.ai/v3',
});
```

## Operations

| Operation | Method & Path | Risk Level | Description |
| --- | --- | --- | --- |
| `tickets.list` | `GET /tickets` | `read` | List tickets with filtering, sorting, and pagination |
| `tickets.get` | `GET /tickets/{ticketId}` | `read` | Get ticket details by ID |
| `tickets.create` | `POST /tickets` | `write` | Create a new ticket |
| `tickets.update` | `PUT /tickets/{ticketId}` | `write` | Update an existing ticket |
| `tickets.delete` | `DELETE /tickets/{ticketId}` | `destructive` | Permanently delete a ticket |
| `tickets.search` | `GET /tickets/search` | `read` | Full-text search across tickets and comments |
| `tickets.counts` | `GET /tickets/ticketscount` | `read` | Get ticket counts grouped by board and status |
| `messages.list` | `GET /messages` | `read` | List messages in a ticket |
| `messages.create` | `POST /messages` | `write` | Create a message or internal note |
| `messages.update` | `PUT /messages/{messageId}` | `write` | Update an existing message |
| `messages.delete` | `DELETE /messages/{messageId}` | `destructive` | Delete a message |
| `messages.getThread` | `GET /messages/{messageId}/thread` | `read` | Get thread messages for a parent message |
| `messages.createThread` | `POST /messages/{messageId}/thread` | `write` | Create a thread reply |
| `sessions.list` | `GET /sessions` | `read` | List contact sessions |
| `sessions.get` | `GET /sessions/{sessionId}` | `read` | Get session details by ID |
| `sessions.getByUserId` | `GET /sessions/by-user-id/{userId}` | `read` | Get session by end-user ID |
| `sessions.create` | `POST /sessions` | `write` | Create a contact session |
| `sessions.update` | `PUT /sessions/{sessionId}` | `write` | Update a contact session |
| `sessions.delete` | `DELETE /sessions/{sessionId}` | `destructive` | Delete a contact session |
| `sessions.search` | `GET /sessions/search` | `read` | Search contact sessions |
| `sessions.activities` | `GET /sessions/{sessionId}/activities` | `read` | Get session timeline activities |
| `users.getMe` | `GET /users/me` | `read` | Get current authenticated user profile |
| `users.list` | `GET /projects/users` | `read` | List project team members |
| `users.update` | `PUT /users/{userId}` | `write` | Update team member profile |
| `feedback.rateConversation` | `POST /s2s/conversations/{conversationId}/rating` | `write` | Submit CSAT rating (0–10) |
| `feedback.rateMessage` | `POST /s2s/messages/{messageId}/rating` | `write` | Rate message (thumbs up/down) |
| `feedback.surveysList` | `GET /engagement/surveys` | `read` | List engagement surveys |
| `feedback.surveysGet` | `GET /engagement/surveys/{surveyId}` | `read` | Get survey definition by ID |
| `feedback.surveysResponses` | `GET /engagement/surveys/{surveyId}/responses` | `read` | Get responses for a survey |
| `feedback.surveysStats` | `GET /engagement/surveys/{surveyId}/stats` | `read` | Get aggregate survey statistics |
| `teams.list` | `GET /teams` | `read` | List teams in project |
| `teams.create` | `POST /teams` | `write` | Create a new team |
| `teams.update` | `PUT /teams/{teamId}` | `write` | Update team configuration |
| `teams.delete` | `DELETE /teams/{teamId}` | `destructive` | Delete a team |
| `boards.list` | `GET /ticket-types` | `read` | List project ticket boards |
| `boards.create` | `POST /ticket-types` | `write` | Create a ticket board |
| `boards.update` | `PUT /ticket-types/{type}` | `write` | Update a ticket board |
| `boards.delete` | `DELETE /ticket-types/{type}` | `destructive` | Delete an empty ticket board |
| `companies.list` | `GET /companies` | `read` | List customer companies |
| `companies.get` | `GET /companies/{companyId}` | `read` | Get company details by ID |
| `companies.createOrUpdate` | `PUT /companies/{companyId}` | `write` | Create or update company record |
| `companies.delete` | `DELETE /companies/{companyId}` | `destructive` | Delete a company record |

## Rate Limits & Error Handling

- **Rate Limits:** Gleap enforces 1,000 requests per 60 seconds for general endpoints, and 200 requests per 60 seconds for ticket query/compose endpoints. When rate-limited (HTTP 429), Gleap returns a `Retry-After` header indicating wait duration.
- **Single-Owner Retries:** The plugin's `RATE_LIMIT_ERROR` returns `{ maxRetries: 0 }` to delegate retry scheduling cleanly to the underlying transport without multiplying requests.
- **Privacy & Redaction:** Credentials and tokens are redacted from error logs, URLs, and propagated errors.

## References

- [Gleap Documentation](https://docs.gleap.io/)
- [Gleap API Overview](https://docs.gleap.ai/en/articles/716-api-overview)
- [Gleap Server-to-Server OpenAPI](https://api.gleap.io/s2s-openapi.json)
