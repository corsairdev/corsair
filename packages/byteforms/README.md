# ByteForms for Corsair

A Corsair integration plugin for **ByteForms** — a no-code form builder. It exposes
ByteForms' REST API as typed, agent-callable operations with API-key auth and no
webhooks.

- Plugin id: `byteforms`
- Package: `@corsair-dev/byteforms`
- Provider docs: https://forms.bytesuite.io/docs/api

## Installation

```bash
pnpm add @corsair-dev/byteforms
```

Register the plugin with a Corsair instance:

```ts
import { createCorsair } from 'corsair';
import { byteforms } from '@corsair-dev/byteforms';

const corsair = createCorsair({
  // ...database, kek, permissions, hub...
  plugins: [
    byteforms(),
  ],
});
```

## Authentication

ByteForms uses API-key ("basic") auth. The raw API key is sent in the
`Authorization` header — **no `Bearer` prefix**. Provide the key when registering
the plugin or via stored credentials:

```ts
byteforms({ key: process.env.BYTEFORMS_API_KEY });
```

Base URL: `https://api.forms.bytesuite.io/api`

## Operations

All operations are validated with zod input/output schemas.

### `forms.create` — Create a form

Create a new form with a name, optional field definitions, and options.

```ts
await corsair.byteforms.forms.create({
  name: 'Contact us',
  body: [{ component: 'input', type: 'text', label: 'Name', id: 'name', required: true }],
  options: { theme: 'light', thank_you_message: 'Thanks!' },
});
```

Risk level: `write`.

### `forms.list` — List all forms

List every form created by the authenticated user.

```ts
const { data, status } = await corsair.byteforms.forms.list({});
```

Risk level: `read`.

### `forms.get` — Get a form by id

```ts
const { data } = await corsair.byteforms.forms.get({ formId: '42' });
```

`formId` may be the numeric id or the `public_id` string.

Risk level: `read`.

### `forms.delete` — Delete a form

```ts
await corsair.byteforms.forms.delete({ formId: '42' });
```

Risk level: `write`.

### `forms.responses` — Get form responses (paginated)

```ts
const { count, cursor, data } = await corsair.byteforms.forms.responses({
  formId: '42',
  limit: 25,
  order: 'desc',
  query: 'john',
});
```

Supported query params: `limit` (number), `order` (`asc` | `desc`), `query`
(string), `after` / `before` (cursor strings).

Risk level: `read`.

## Error handling

Errors are routed through `error-handlers.ts`:

- `429` → rate-limit handling with `Retry-After` backoff.
- `401` → auth error (no retries).

API errors are wrapped as `ByteFormsAPIError` carrying `status`, `statusText`, and
the response `body` when available.

## Development

```bash
pnpm --filter @corsair-dev/byteforms typecheck
pnpm --filter @corsair-dev/byteforms test
pnpm --filter @corsair-dev/byteforms build
```

Tests mock `makeByteFormsRequest` and assert each endpoint builds the correct
method/path and returns the provider envelope.
