# @corsair-dev/mem0

Mem0 plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/mem0
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `events.get` | `mem0.api.events.get` | `read` | Read one queued event by ID to see whether an add or delete finished, failed, or is still running |
| `events.list` | `mem0.api.events.list` | `read` | List recent events for the organization and project, page by page, for dashboards or for finding failed writes |
| `memories.add` | `mem0.api.memories.add` | `write` | Extract memories from conversation messages and store them for a user, agent, app or run; processing is queued and returns an event_id to poll |
| `memories.batchDelete` | `mem0.api.memories.batchDelete` | `destructive` | Permanently delete up to 1000 memories in one call |
| `memories.batchUpdate` | `mem0.api.memories.batchUpdate` | `write` | Update up to 1000 memories in one call |
| `memories.delete` | `mem0.api.memories.delete` | `destructive` | Permanently delete one memory; delete_linked also removes memories linked to it |
| `memories.deleteAll` | `mem0.api.memories.deleteAll` | `destructive` | Delete every memory matching a filter, or every memory for an entity when the filter is "*"; Mem0 queues the deletion and answers immediately |
| `memories.get` | `mem0.api.memories.get` | `read` | Read one memory by its ID |
| `memories.history` | `mem0.api.memories.history` | `read` | Read the change history of one memory: each ADD, UPDATE and DELETE with its old and new text |
| `memories.list` | `mem0.api.memories.list` | `read` | List stored memories page by page, filtered by entity, date range or category; entity IDs go inside `filters` |
| `memories.search` | `mem0.api.memories.search` | `read` | Rank stored memories by relevance to a query with hybrid semantic, keyword and entity matching; entity IDs go inside `filters` |
| `memories.update` | `mem0.api.memories.update` | `write` | Change one memory's text or metadata, or set its expiration date; pass expiration_date as null to clear one |
| `webhooks.create` | `mem0.api.webhooks.create` | `write` | Register a URL to receive Mem0 events for a project, subscribing it to memory add, update, delete or categorize and the ingest job events |
| `webhooks.delete` | `mem0.api.webhooks.delete` | `destructive` | Unregister a webhook so Mem0 stops posting events to its URL |
| `webhooks.list` | `mem0.api.webhooks.list` | `read` | List the webhooks registered on a project: each URL, its event subscriptions, and whether it is active |
| `webhooks.update` | `mem0.api.webhooks.update` | `write` | Change a webhook's label, URL or event subscriptions; the new event list replaces the old one |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mem0

## License

Apache-2.0
