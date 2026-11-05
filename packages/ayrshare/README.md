# @corsair-dev/ayrshare

Ayrshare plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ayrshare
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `autoSchedule.list` | `ayrshare.api.autoSchedule.list` | `read` | List active auto-post schedules, including titles, UTC times, weekday filters, and exclude dates. |
| `autoSchedule.set` | `ayrshare.api.autoSchedule.set` | `write` | Create or replace an auto-post schedule. Its case-sensitive title is the join key used by publish autoSchedule.title. |
| `posts.delete` | `ayrshare.api.posts.delete` | `destructive` | Delete an Ayrshare post by id. Published Instagram and TikTok posts cannot be deleted via API; use markManualDeleted only after deleting them on the network. |
| `posts.history` | `ayrshare.api.posts.history` | `read` | Fetch Ayrshare post history, filterable by date, status, network, and record count. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ayrshare

## License

Apache-2.0
