# @corsair-dev/fathom

Fathom plugin for Corsair. Simple, privacy-focused website analytics without tracking personal data.

## Install

```bash
pnpm add @corsair-dev/fathom
```

## Endpoints

| Operation | Operation ID | Method & Path | Risk | Description |
|-----------|--------------|---------------|------|-------------|
| `account.get` | `fathom.api.account.get` | `GET /account` | `read` | Retrieve information about the account that owns the API key |
| `account.getToken` | `fathom.api.account.getToken` | `GET /token` | `read` | Retrieve metadata about the API token used to make the request |
| `sites.list` | `fathom.api.sites.list` | `GET /sites` | `read` | List all sites owned by the account with pagination |
| `sites.create` | `fathom.api.sites.create` | `POST /sites` | `write` | Create a new site entity in Fathom Analytics |
| `sites.get` | `fathom.api.sites.get` | `GET /sites/:id` | `read` | Retrieve details of a single site by its ID |
| `sites.update` | `fathom.api.sites.update` | `POST /sites/:id` | `write` | Update site settings such as name, sharing, or timezone |
| `sites.delete` | `fathom.api.sites.delete` | `DELETE /sites/:id` | `destructive` | Permanently delete a site and all associated analytics data |
| `sites.wipe` | `fathom.api.sites.wipe` | `DELETE /sites/:id/data` | `destructive` | Wipe all data from a site (deprecated: returns 410 Gone) |
| `events.list` | `fathom.api.events.list` | `GET /sites/:site_id/events` | `read` | List all events tracked by a site with pagination |
| `events.setCurrency` | `fathom.api.events.setCurrency` | `POST /sites/:site_id/events/currency` | `write` | Set or update the currency for an event by name |
| `events.deleteByName` | `fathom.api.events.deleteByName` | `DELETE /sites/:site_id/events` | `write` | Remove an event's currency setting by name (the event and its completions stay; set it again with events.setCurrency) |
| `events.create` | `fathom.api.events.create` | `POST /sites/:site_id/events` | `write` | Create an event (deprecated: returns 410 Gone; track directly on site) |
| `events.get` | `fathom.api.events.get` | `GET /sites/:site_id/events/:id` | `read` | Retrieve a single event by ID (deprecated: returns 410 Gone) |
| `events.update` | `fathom.api.events.update` | `POST /sites/:site_id/events/:id` | `write` | Update an event by ID (deprecated: returns 410 Gone) |
| `events.delete` | `fathom.api.events.delete` | `DELETE /sites/:site_id/events/:id` | `destructive` | Delete an event by ID (deprecated: returns 410 Gone) |
| `events.wipe` | `fathom.api.events.wipe` | `DELETE /sites/:site_id/events/:id/data` | `destructive` | Wipe event completion data (deprecated: returns 410 Gone) |
| `milestones.list` | `fathom.api.milestones.list` | `GET /sites/:site_id/milestones` | `read` | List all milestones for a site with pagination |
| `milestones.create` | `fathom.api.milestones.create` | `POST /sites/:site_id/milestones` | `write` | Create a new milestone for a site |
| `milestones.get` | `fathom.api.milestones.get` | `GET /sites/:site_id/milestones/:id` | `read` | Retrieve a single milestone by its ID |
| `milestones.update` | `fathom.api.milestones.update` | `POST /sites/:site_id/milestones/:id` | `write` | Update a milestone name or date by its ID |
| `milestones.delete` | `fathom.api.milestones.delete` | `DELETE /sites/:site_id/milestones/:id` | `destructive` | Permanently delete a milestone from a site |
| `reports.aggregation` | `fathom.api.reports.aggregation` | `GET /aggregations` | `read` | Generate custom aggregation reports across pageviews or events |
| `reports.currentVisitors` | `fathom.api.reports.currentVisitors` | `GET /current_visitors` | `read` | Get real-time current visitor count and optional page/referrer breakdown |

## Auth

Authentication uses HTTP Bearer tokens via `Authorization: Bearer <API_TOKEN>`. Corsair prompts your tenant for credentials on first use, or accepts `key` in plugin options.

Create an API token in your [Fathom API Settings](https://app.usefathom.com/api).

## Pagination

Top-level list endpoints (`sites.list`, `events.list`, `milestones.list`) support cursor-based pagination:
- `limit`: Integer between 1 and 100 (default: 10).
- `starting_after`: Object ID cursor to paginate forwards in chronological order.
- `ending_before`: Object ID cursor to paginate backwards in reverse chronological order.

Each list response returns `has_more: boolean` indicating whether additional pages exist.

## Rate Limits & Retries

Fathom enforces two account-wide limits across all endpoints:
1. Hourly request volume limit (e.g. 600 requests/hr on Tier 1).
2. Concurrency limit (e.g. 5 concurrent requests on Tier 1).

When a limit is reached, Fathom responds with HTTP 429 and a `Retry-After` header. Corsair's HTTP transport owns 429 retries using the provider's `Retry-After` delay.

## Deprecated Operations

Fathom retired individual event ID endpoints and data wiping via the API, which return HTTP 410 Gone:
- Data wiping (`DELETE /sites/:id/data`, `DELETE /sites/:id/events/:id/data`) is no longer available programmatically.
- Event tracking is handled automatically on your website; event currency and configuration are managed via `events.setCurrency` and `events.deleteByName` using the event name.

## Reference

- [Fathom API Reference](https://usefathom.com/api)
- [Fathom OpenAPI Schema](https://usefathom.com/api/openapi.json)
- Full docs, types, and examples: https://docs.corsair.dev/plugins/fathom

## License

Apache-2.0
