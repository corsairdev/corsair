# @corsair-dev/linkly

Link tracking and URL shortening with Linkly - create and update tracked short links, move them to trash and restore them, export workspaces, read click analytics, and manage click webhook subscriptions.

## Install

```bash
pnpm add @corsair-dev/linkly
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `clicks.getCounters` | `linkly.api.clicks.getCounters` | `read` | Group a workspace’s clicks by one dimension, such as country or UTM campaign, ordered by count |
| `clicks.getTimeSeries` | `linkly.api.clicks.getTimeSeries` | `read` | Read click counts over time for a workspace, filtered by link, date range, country and device, optionally pivoted into a links-by-date matrix |
| `domains.list` | `linkly.api.domains.list` | `read` | List the custom domains attached to a workspace, usable as links.create domain values |
| `links.create` | `linkly.api.links.create` | `write` | Create a tracked short link in a workspace, with its destination, UTM fields and optional rules |
| `links.delete` | `linkly.api.links.delete` | `destructive` | Move a link to the trash: its short URL stops redirecting straight away. links.restore can undo this while the link is still in the trash, and deleting a trashed link again is a harmless no-op |
| `links.export` | `linkly.api.links.export` | `read` | Export every link in a workspace with their click counts, unpaginated |
| `links.get` | `linkly.api.links.get` | `read` | Read one link by ID: destination, short URL and settings, without click counts |
| `links.list` | `linkly.api.links.list` | `read` | List the links in a workspace with their click counts, one page at a time |
| `links.restore` | `linkly.api.links.restore` | `write` | Take deleted links out of the trash by ID; a restored link whose back-half is taken reports a conflict |
| `links.update` | `linkly.api.links.update` | `write` | Update an existing link in place by sending its ID with the fields to change |
| `webhooks.list` | `linkly.api.webhooks.list` | `read` | List the webhook URLs registered on a workspace to receive a POST for each click |
| `webhooks.subscribe` | `linkly.api.webhooks.subscribe` | `write` | Register a webhook URL on a workspace; Linkly then POSTs there for every click. Deliveries arrive at that URL, not to this plugin |
| `webhooks.unsubscribe` | `linkly.api.webhooks.unsubscribe` | `write` | Remove a webhook registration from a workspace by its URL, so it stops receiving click events |
| `workspaces.listWorkspaces` | `linkly.api.workspaces.listWorkspaces` | `read` | List the workspaces the API key can reach, with their IDs |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/linkly

## License

Apache-2.0
