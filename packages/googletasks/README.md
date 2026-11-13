# @corsair-dev/googletasks

Google Tasks integration for Corsair. The plugin uses Google OAuth 2.0 bearer tokens, validates requests and responses with Zod, and exposes all documented Google Tasks API v1 methods for task lists and tasks.

## Authentication and scopes

Set up Google OAuth credentials and connect the plugin with `authType: 'oauth_2'` (the default). Standard read/write operation coverage requests only `https://www.googleapis.com/auth/tasks`, the narrowest Google scope covering all 14 methods. If an integration only needs reads, configure `googletasks({ scopeMode: 'readonly' })` to request `https://www.googleapis.com/auth/tasks.readonly`; mutation calls cannot be authorized by that read-only grant. OAuth tokens are sent as `Authorization: Bearer …` and are refreshed through Corsair's OAuth flow.

```ts
import { createCorsair } from 'corsair';
import { googletasks } from '@corsair-dev/googletasks';

const corsair = createCorsair({ plugins: [googletasks()] });
```

## Operations

Every method is served from `https://tasks.googleapis.com` under `/tasks/v1`. Read methods accept either the read-only or full scope. All other methods require the full `tasks` scope.

| Corsair operation | HTTP route | Scope | Risk |
| --- | --- | --- | --- |
| `taskLists.list` | `GET /tasks/v1/users/@me/lists` | `tasks.readonly` or `tasks` | read |
| `taskLists.get` | `GET /tasks/v1/users/@me/lists/{tasklist}` | `tasks.readonly` or `tasks` | read |
| `taskLists.insert` | `POST /tasks/v1/users/@me/lists` | `tasks` | write |
| `taskLists.update` | `PUT /tasks/v1/users/@me/lists/{tasklist}` | `tasks` | write |
| `taskLists.patch` | `PATCH /tasks/v1/users/@me/lists/{tasklist}` | `tasks` | write |
| `taskLists.delete` | `DELETE /tasks/v1/users/@me/lists/{tasklist}` | `tasks` | destructive |
| `tasks.list` | `GET /tasks/v1/lists/{tasklist}/tasks` | `tasks.readonly` or `tasks` | read |
| `tasks.get` | `GET /tasks/v1/lists/{tasklist}/tasks/{task}` | `tasks.readonly` or `tasks` | read |
| `tasks.insert` | `POST /tasks/v1/lists/{tasklist}/tasks` | `tasks` | write |
| `tasks.update` | `PUT /tasks/v1/lists/{tasklist}/tasks/{task}` | `tasks` | write |
| `tasks.patch` | `PATCH /tasks/v1/lists/{tasklist}/tasks/{task}` | `tasks` | write |
| `tasks.delete` | `DELETE /tasks/v1/lists/{tasklist}/tasks/{task}` | `tasks` | destructive |
| `tasks.move` | `POST /tasks/v1/lists/{tasklist}/tasks/{task}/move` | `tasks` | write |
| `tasks.clear` | `POST /tasks/v1/lists/{tasklist}/clear` | `tasks` | destructive |

Task and task-list identifiers are path parameters. Create and replace operations send the resource in the JSON body; patch operations send only fields to change. List inputs expose the documented filters and `maxResults`/`pageToken` pagination. `taskLists.list` defaults to 1000 items per page (maximum 1000); `tasks.list` defaults to 20 (maximum 100). Follow the returned `nextPageToken` until it is absent.

`tasks.clear` hides all completed tasks in a list; it does not permanently delete them. Deleting an assigned task or a task list containing assigned tasks can also delete the original task in Google Docs or Chat Spaces. Delete and clear responses are HTTP 204 with no response body. There are no documented Tasks API webhook subscription methods; this plugin does not expose webhooks.

Google HTTP errors are preserved with their status and response metadata. A `429` response passes its `Retry-After` delay to the bounded handler retry policy; authorization errors and other statuses are not retried by the plugin handler.

## References

- [Google Tasks REST API reference](https://developers.google.com/workspace/tasks/reference/rest)
- [Google Tasks API v1 Discovery document](https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest)
- [Google Tasks OAuth scopes](https://developers.google.com/tasks/auth)
