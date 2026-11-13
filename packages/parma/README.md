# @corsair-dev/parma

Parma CRM plugin for Corsair, covering the 22 operations in the official API v1 contract.

## Install

```bash
pnpm add @corsair-dev/parma
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `deals.get` | `parma.api.deals.get` | `read` | Get a deal |
| `deals.list` | `parma.api.deals.list` | `read` | List deals |
| `groups.list` | `parma.api.groups.list` | `read` | List groups |
| `notes.create` | `parma.api.notes.create` | `write` | Create a note |
| `notes.list` | `parma.api.notes.list` | `read` | List notes |
| `notes.update` | `parma.api.notes.update` | `write` | Update a note |
| `pipelines.get` | `parma.api.pipelines.get` | `read` | Get a pipeline |
| `pipelines.list` | `parma.api.pipelines.list` | `read` | List pipelines |
| `relationships.addGroup` | `parma.api.relationships.addGroup` | `write` | Add a relationship to a group |
| `relationships.create` | `parma.api.relationships.create` | `write` | Create a relationship |
| `relationships.delete` | `parma.api.relationships.delete` | `destructive` | Delete a relationship |
| `relationships.get` | `parma.api.relationships.get` | `read` | Get a relationship |
| `relationships.list` | `parma.api.relationships.list` | `read` | List relationships |
| `relationships.listGroups` | `parma.api.relationships.listGroups` | `read` | List relationship groups |
| `relationships.listNotes` | `parma.api.relationships.listNotes` | `read` | List relationship notes |
| `relationships.removeGroup` | `parma.api.relationships.removeGroup` | `destructive` | Remove a relationship from a group |
| `relationships.update` | `parma.api.relationships.update` | `write` | Update a relationship |
| `stages.get` | `parma.api.stages.get` | `read` | Get a stage |
| `stages.list` | `parma.api.stages.list` | `read` | List stages |
| `users.get` | `parma.api.users.get` | `read` | Get a user |
| `users.list` | `parma.api.users.list` | `read` | List users |
| `users.me` | `parma.api.users.me` | `read` | Get the current user and account |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

Both modes send a Bearer token. Set `key` to a Parma API token or OAuth access
token, or use Corsair's credential store. OAuth authorization and token refresh
must be handled by the application; the plugin does not refresh tokens itself,
including when credentials are stored through Corsair Hub.
Parma documents API tokens at https://app.parma.ai/api and the OAuth flow in its
[API reference](https://developers.parma.ai/api-docs/index.html).

List operations with documented pagination accept `page` as a string. Delete
operations return `undefined` on HTTP 204. Parma does not document the response
body of `users.get`, so its result is `unknown`.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/parma

## License

Apache-2.0
