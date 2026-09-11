# @corsair-dev/postman

Postman plugin for Corsair. Programmatically manage Postman collections, workspaces, environments, mocks, monitors, specs, and more through the Postman API (`https://api.getpostman.com`).

## Features

- **Collections (49 ops)**: Create, read, update, replace, delete, fork, merge, duplicate, and transform collections, plus folders, requests, responses, comments, pull requests, and forks.
- **Specs / Spec Hub (14 ops)**: Create and manage specs and spec files, generate collections from specs, and sync both ways.
- **Workspaces (9 ops)**: List, create, update, delete, and inspect activity, roles, and global variables.
- **Environments (9 ops)**: Full CRUD plus forks and merges.
- **Mocks (7 ops)**: Mock servers and server responses, including publish.
- **Monitors (6 ops)**: Full CRUD plus run.
- **APIs (17 ops)**: API Builder resources, schemas, versions, and comments.
- **Team & admin**: Users, groups, billing invoices, collection access keys, SCIM, comments, and pull-request reviews.
- **Production-grade security**: API key sent only via the `X-Api-Key` header (never in URLs), path-traversal guards on file-path inputs, secret-capable payloads excluded from event logs, and automatic rate-limit backoff.

## Auth Setup

Postman uses API key authentication. Generate a key from your [Postman account settings](https://learning.postman.com/docs/developer/postman-api/authentication/#generate-a-postman-api-key).

Set your environment variable:

```bash
POSTMAN_API_KEY=your_api_key_here
```

### Plugin Initialization

```ts
import { createCorsair } from 'corsair';
import { postman } from '@corsair-dev/postman';

const app = createCorsair({
  plugins: [
    postman({
      // Explicit key, or automatically resolved from POSTMAN_API_KEY / key manager
      key: process.env.POSTMAN_API_KEY,
    }),
  ],
});
```

## Tools & Endpoints

124 endpoints across 16 namespaces. Destructive operations are marked `destructive`, mutating operations `write`, everything else `read`.

| Namespace | Ops | Highlights |
| :--- | :--- | :--- |
| `collections` | 49 | `create`, `get`, `update`, `replace`, `remove`, `fork`, `mergeFork`, `duplicate`, `transformToOpenapi`, folders, requests, responses, comments, pull requests |
| `apis` | 17 | `create`, `get`, `list`, `update`, `remove`, schemas and schema files, versions, comments |
| `specs` | 14 | `create`, `get`, `list`, `update`, `remove`, spec files, `generateCollection`, `syncWithCollection` |
| `workspaces` | 9 | `list`, `get`, `create`, `update`, `remove`, activity feed, roles, global variables |
| `environments` | 9 | `list`, `get`, `create`, `update`, `replace`, `remove`, forks, merges |
| `mocks` | 7 | `list`, `create`, `update`, server responses, `publish` |
| `monitors` | 6 | `list`, `get`, `create`, `update`, `remove`, `run` |
| `users` | 2 | `list`, `get` |
| `account` | 1 | `me` (authenticated user) |
| `billing` | 2 | `getAccount`, `listInvoices` |
| `accessKeys` | 1 | `list` collection access keys |
| `groups` | 1 | `list` |
| `scim` | 2 | `getResourceTypes`, `getServiceConfig` (requires a SCIM API key) |
| `tools` | 1 | `importOpenapi` |
| `comments` | 1 | `resolve` a comment thread |
| `pullRequests` | 2 | `review`, `update` |

## Usage Examples

### 1. Create a Collection

```ts
const created = await app.call('postman.collections.create', {
  workspace: 'your-workspace-id',
  collection: {
    info: {
      name: 'My API',
      schema:
        'https://schema.postman.com/json/collection/v2.1.0/collection.json',
    },
    item: [],
  },
});

console.log(created.collection?.id);
```

### 2. List Workspaces

```ts
const workspaces = await app.call('postman.workspaces.list', { limit: 10 });

for (const ws of workspaces.workspaces ?? []) {
  console.log(ws.name);
}
```

### 3. Get the Authenticated User

```ts
const me = await app.call('postman.account.me', {});

console.log(me.user);
```

### 4. Run a Monitor

```ts
const run = await app.call('postman.monitors.run', {
  monitorId: 'your-monitor-id',
});

console.log(run);
```

## Entities & Database

Results are automatically persisted to the plugin database for caching and offline querying:

- `collection`: Postman collections keyed by ID
- `workspace`: Workspaces keyed by ID
- `environment`: Environments keyed by ID
- `monitor`: Monitors keyed by ID
- `mock`: Mock servers keyed by ID

## Rate Limiting & Error Handling

- **Rate limits**: 300 requests/minute per user. `GET /collections`, `GET /workspaces`, and `GET /workspaces/{id}` are limited to 10 calls per 10 seconds; workspace updates to 20 requests/minute.
- **429 Too Many Requests**: Automatically retries with exponential backoff respecting the `Retry-After` header. The framework never replays non-idempotent requests on top of transport retries.
- **401 Unauthorized**: Thrown as `AuthMissingError` when no API key resolves, or surfaced when the key is invalid.
- **403 / 404**: Mapped to permission and not-found handlers with no retries.
- **Event logging**: Endpoint activity is logged without secret-capable request bodies (headers, cookies, file contents).
