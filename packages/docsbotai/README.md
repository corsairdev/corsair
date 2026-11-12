# @corsair-dev/docsbotai

DocsBot AI plugin for Corsair. See [CONTRACT.md](./CONTRACT.md) for scope and
provider contract limitations.

## Install

```bash
pnpm add @corsair-dev/docsbotai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `bots.create` | `docsbotai.api.bots.create` | `write` | Create a bot |
| `bots.delete` | `docsbotai.api.bots.delete` | `destructive` | Delete a bot |
| `bots.get` | `docsbotai.api.bots.get` | `read` | Get a bot |
| `bots.list` | `docsbotai.api.bots.list` | `read` | List bots |
| `bots.reports` | `docsbotai.api.bots.reports` | `read` | Get monthly reports |
| `bots.stats` | `docsbotai.api.bots.stats` | `read` | Get bot statistics |
| `bots.update` | `docsbotai.api.bots.update` | `write` | Update a bot |
| `conversations.captureLead` | `docsbotai.api.conversations.captureLead` | `write` | Capture a lead |
| `conversations.delete` | `docsbotai.api.conversations.delete` | `destructive` | Delete a conversation |
| `conversations.list` | `docsbotai.api.conversations.list` | `read` | List conversations |
| `conversations.ticket` | `docsbotai.api.conversations.ticket` | `write` | Generate a support ticket |
| `leads.delete` | `docsbotai.api.leads.delete` | `destructive` | Delete a lead |
| `leads.list` | `docsbotai.api.leads.list` | `read` | List leads |
| `questions.delete` | `docsbotai.api.questions.delete` | `destructive` | Delete a question |
| `questions.list` | `docsbotai.api.questions.list` | `read` | List questions |
| `questions.rate` | `docsbotai.api.questions.rate` | `write` | Rate an answer |
| `research.list` | `docsbotai.api.research.list` | `read` | List research jobs |
| `search.search` | `docsbotai.api.search.search` | `read` | Search bot content |
| `sources.create` | `docsbotai.api.sources.create` | `write` | Create a source |
| `sources.delete` | `docsbotai.api.sources.delete` | `destructive` | Delete a source |
| `sources.get` | `docsbotai.api.sources.get` | `read` | Get a source |
| `sources.getUploadUrl` | `docsbotai.api.sources.getUploadUrl` | `read` | Get a presigned source upload URL |
| `sources.list` | `docsbotai.api.sources.list` | `read` | List sources |
| `sources.retry` | `docsbotai.api.sources.retry` | `write` | Retry a failed source |
| `sources.uploadFile` | `docsbotai.api.sources.uploadFile` | `write` | Upload bytes to a presigned source URL |
| `teams.get` | `docsbotai.api.teams.get` | `read` | Get a team |
| `teams.list` | `docsbotai.api.teams.list` | `read` | List teams |
| `teams.listMembers` | `docsbotai.api.teams.listMembers` | `read` | List team members |
| `teams.update` | `docsbotai.api.teams.update` | `write` | Update a team |
| `webhooks.create` | `docsbotai.api.webhooks.create` | `write` | Create a webhook subscription |
| `webhooks.delete` | `docsbotai.api.webhooks.delete` | `destructive` | Delete a webhook subscription |
| `webhooks.get` | `docsbotai.api.webhooks.get` | `read` | Get a webhook subscription |
| `webhooks.list` | `docsbotai.api.webhooks.list` | `read` | List webhook subscriptions |
| `webhooks.update` | `docsbotai.api.webhooks.update` | `write` | Update a webhook subscription |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## File uploads

Call `sources.getUploadUrl` first, then pass its exact `url` and a `Uint8Array`
to `sources.uploadFile` in the same process and under the same API key. The
local approval expires after 15 minutes; request a new URL if needed. Uploads
require a public IPv4 connection to `storage.googleapis.com`, do not follow
redirects, and never send the DocsBot API key to storage. This API buffers the
file in memory and does not currently provide a streaming upload interface.
There is no built-in upload timeout; a stalled connection may leave the upload
pending until the connection closes.

## Webhooks

The endpoints above manage outbound webhook subscriptions. Inbound webhook
receiving and signature verification are not implemented. The four delivery-test
actions are omitted until DocsBot documents their request and response bodies.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/docsbotai

## License

Apache-2.0
