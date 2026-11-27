# @corsair-dev/dub

Dub (dub.co) link management for Corsair: create, update and delete short links, read click and conversion analytics and events, generate QR codes, and manage tags, domains, folders and customers.

## Install

```bash
pnpm add @corsair-dev/dub
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `analytics.retrieve` | `dub.api.analytics.retrieve` | `read` | Read aggregated click, lead and sale analytics, grouped by count, timeseries, country, device, link and more |
| `customers.delete` | `dub.api.customers.delete` | `destructive` | Permanently delete a customer; past events keep their recorded data |
| `customers.get` | `dub.api.customers.get` | `read` | Retrieve one customer by their Dub id, or their externalId prefixed with ext_ |
| `customers.list` | `dub.api.customers.list` | `read` | List customers with filters and cursor paging; the next cursor is the last customer id |
| `customers.update` | `dub.api.customers.update` | `write` | Update a customer email, name, avatar or country |
| `domains.create` | `dub.api.domains.create` | `write` | Add a domain to the workspace; it still needs DNS verification in the dashboard |
| `domains.delete` | `dub.api.domains.delete` | `destructive` | Permanently delete a domain; its links stop resolving and analytics are not restored on recreate |
| `domains.list` | `dub.api.domains.list` | `read` | List the workspace domains with search and page paging |
| `domains.update` | `dub.api.domains.update` | `write` | Update a domain or rename it with newSlug; redirects and branding are editable here |
| `events.list` | `dub.api.events.list` | `read` | List raw click, lead and sale events with filters, newest first |
| `folders.create` | `dub.api.folders.create` | `write` | Create a folder to group links, with an access level |
| `folders.delete` | `dub.api.folders.delete` | `destructive` | Permanently delete a folder; its links keep existing |
| `folders.list` | `dub.api.folders.list` | `read` | List folders with search and page paging |
| `folders.update` | `dub.api.folders.update` | `write` | Rename a folder, change its description or access level |
| `links.bulkCreate` | `dub.api.links.bulkCreate` | `write` | Create up to 100 links in one call; the answer carries one row per link, including per-link errors |
| `links.bulkDelete` | `dub.api.links.bulkDelete` | `destructive` | Permanently delete up to 100 links in one call; their analytics are not recoverable |
| `links.bulkUpdate` | `dub.api.links.bulkUpdate` | `write` | Apply one set of field changes to up to 100 links named by id or externalId |
| `links.count` | `dub.api.links.count` | `read` | Count links matching the filters, optionally grouped by domain, tag, folder or user |
| `links.create` | `dub.api.links.create` | `write` | Create a short link; a duplicate domain and slug answers 409 conflict |
| `links.delete` | `dub.api.links.delete` | `destructive` | Permanently delete a short link; recreating it does not restore its analytics |
| `links.get` | `dub.api.links.get` | `read` | Retrieve one link by id, externalId, or a domain and slug pair |
| `links.list` | `dub.api.links.list` | `read` | List short links with filters and cursor paging; the next cursor is the last link id |
| `links.update` | `dub.api.links.update` | `write` | Update a short link by id (or externalId prefixed with ext_) |
| `links.upsert` | `dub.api.links.upsert` | `write` | Idempotent create-or-update keyed on domain and slug (or externalId); safe to retry |
| `qr.get` | `dub.api.qr.get` | `read` | Generate an SVG QR code for a URL; the document comes back as the svg string |
| `tags.create` | `dub.api.tags.create` | `write` | Create a tag with an optional color |
| `tags.delete` | `dub.api.tags.delete` | `destructive` | Permanently delete a tag and remove it from every link |
| `tags.list` | `dub.api.tags.list` | `read` | List tags with search, sorting and page paging |
| `tags.update` | `dub.api.tags.update` | `write` | Rename a tag or change its color |
| `track.lead` | `dub.api.track.lead` | `write` | Record a lead conversion attributed to a click; there is no delete, so a tracked lead cannot be undone |
| `track.sale` | `dub.api.track.sale` | `write` | Record a sale conversion in cents attributed to a customer; invoiceId deduplicates, but a tracked sale cannot be undone |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dub

## License

Apache-2.0
