# @corsair-dev/linkly

Link tracking and URL shortening with Linkly - create, bulk-update, trash and restore tracked short links, read click analytics and raw click exports, manage custom domains and webhooks, and report conversions.

## Install

```bash
pnpm add @corsair-dev/linkly
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `auth.test` | `linkly.api.auth.test` | `read` | Check that the API key is valid |
| `clicks.export` | `linkly.api.clicks.export` | `read` | Export raw click rows (time, browser, country, destination, platform, referer, bot, ISP, params) for a workspace or one link. Not in Linkly's OpenAPI spec; Linkly's analytics docs and MCP server use it. Counts against the workspace's analytics allowance (free plans: 100 a month; when a paid plan runs out, Linkly adds a billed API pack). |
| `clicks.getCounters` | `linkly.api.clicks.getCounters` | `read` | Group a workspace's clicks by one dimension, such as country or UTM campaign, ordered by count (top 10,000 values). Counts against the workspace's analytics allowance (free plans: 100 a month; when a paid plan runs out, Linkly adds a billed API pack). |
| `clicks.getTimeSeries` | `linkly.api.clicks.getTimeSeries` | `read` | Read click counts over time for a workspace, filtered by link, date range, country and device, optionally pivoted into a links-by-date matrix. Counts against the workspace's analytics allowance (free plans: 100 a month; when a paid plan runs out, Linkly adds a billed API pack). |
| `conversions.create` | `linkly.api.conversions.create` | `write` | Report a lead, sale or custom event and attribute it to the link that drove it through its linkly_cid. Unattributable events are discarded and answer attributed: false. Pass event_id so a repeat does not count twice |
| `conversions.list` | `linkly.api.conversions.list` | `read` | List a workspace's attributed conversions (leads, sales, custom events), newest first or paged oldest-first with since and after |
| `domains.create` | `linkly.api.domains.create` | `write` | Attach a custom domain to a workspace. Its CNAME must already point at domains.linklyhq.com |
| `domains.delete` | `linkly.api.domains.delete` | `destructive` | Remove a custom domain from a workspace. Every short link on that domain stops working |
| `domains.list` | `linkly.api.domains.list` | `read` | List the custom domains attached to a workspace, usable as links.create domain values |
| `domains.updateFavicon` | `linkly.api.domains.updateFavicon` | `write` | Set or clear the favicon URL for a custom domain |
| `links.bulkUpsert` | `linkly.api.links.bulkUpsert` | `write` | Create or update up to 1000 links in one call: items with an id update, items without create. Answers 200 even when some items fail; check each item's status |
| `links.create` | `linkly.api.links.create` | `write` | Create a tracked short link in a workspace, with its destination, UTM fields and optional rules |
| `links.delete` | `linkly.api.links.delete` | `destructive` | Move a link to the trash: its short URL stops redirecting straight away. links.restore can undo this while the link is still in the trash, and deleting a trashed link again is a harmless no-op |
| `links.deleteMany` | `linkly.api.links.deleteMany` | `destructive` | Move several links to the trash at once: their short URLs stop redirecting straight away. links.restore can bring them back while they are in the trash |
| `links.export` | `linkly.api.links.export` | `read` | Export every link in a workspace with their click counts, unpaginated. Counts against the workspace's analytics allowance |
| `links.get` | `linkly.api.links.get` | `read` | Read one link by ID: destination, short URL and settings, without click counts |
| `links.getDetails` | `linkly.api.links.getDetails` | `read` | Read one link with its lifetime and recent click counts, plus the workspace's domains |
| `links.list` | `linkly.api.links.list` | `read` | List the links in a workspace with their click counts, one page at a time |
| `links.restore` | `linkly.api.links.restore` | `write` | Take deleted links out of the trash by ID; a restored link whose back-half is taken reports a conflict |
| `links.update` | `linkly.api.links.update` | `write` | Update an existing link in place by sending its ID with the fields to change |
| `webhooks.list` | `linkly.api.webhooks.list` | `read` | List the webhook URLs registered on a workspace |
| `webhooks.listForLink` | `linkly.api.webhooks.listForLink` | `read` | List the webhook URLs registered on one link |
| `webhooks.subscribe` | `linkly.api.webhooks.subscribe` | `write` | Register a webhook URL on a workspace; Linkly then POSTs there for every click, link.created, link.updated and link.deleted. Deliveries arrive at that URL, not to this plugin |
| `webhooks.subscribeToLink` | `linkly.api.webhooks.subscribeToLink` | `write` | Register a webhook URL on one link; Linkly then POSTs its clicks, link.updated and link.deleted there. Deliveries arrive at that URL, not to this plugin |
| `webhooks.unsubscribe` | `linkly.api.webhooks.unsubscribe` | `write` | Remove a webhook registration from a workspace by its URL, so it stops receiving events |
| `webhooks.unsubscribeFromLink` | `linkly.api.webhooks.unsubscribeFromLink` | `write` | Remove a webhook registration from one link by its URL |
| `workspaces.listWorkspaces` | `linkly.api.workspaces.listWorkspaces` | `read` | List the workspaces the API key can reach, with their IDs |
| `workspaces.update` | `linkly.api.workspaces.update` | `destructive` | Rename a workspace or replace its whole webhook list. Sending webhooks overwrites every registered URL, so a missing one stops receiving events. Not in Linkly's OpenAPI spec; Linkly's own MCP server uses it |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/linkly

## License

Apache-2.0
