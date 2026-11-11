# @corsair-dev/ticketmaster

Ticketmaster plugin for Corsair. Searches and reads events, attractions, venues
and the classification tree through the Discovery API v2. Every operation is a
read.

## Install

```bash
pnpm add @corsair-dev/ticketmaster
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `attractions.get` | `ticketmaster.api.attractions.get` | `read` | Get one attraction by ID, including its images, classifications and aliases |
| `attractions.search` | `ticketmaster.api.attractions.search` | `read` | Search attractions (artists, teams, shows) by keyword, classification or source, with paging and sorting |
| `classifications.get` | `ticketmaster.api.classifications.get` | `read` | Get one segment, genre or sub-genre by ID, with the level below it |
| `classifications.search` | `ticketmaster.api.classifications.search` | `read` | Search the segment, genre and sub-genre tree Ticketmaster uses to classify events and attractions |
| `events.get` | `ticketmaster.api.events.get` | `read` | Get one event by ID, including its dates, sales window, price ranges, images, venue and attractions |
| `events.getImages` | `ticketmaster.api.events.getImages` | `read` | Get the images for one event by ID, with each ratio, size and URL |
| `events.search` | `ticketmaster.api.events.search` | `read` | Search events by keyword, attraction, venue, location, date, classification or onsale window, with paging and sorting |
| `suggest.get` | `ticketmaster.api.suggest.get` | `read` | Suggest attractions, events, venues and products for a partial search term, as a type-ahead would |
| `venues.get` | `ticketmaster.api.venues.get` | `read` | Get one venue by ID, including its address, location, timezone, markets and images |
| `venues.search` | `ticketmaster.api.venues.search` | `read` | Search venues by keyword, country, state or geo point, with paging and sorting |

## Auth

Auth: API key, sent as the `apikey` query parameter, which is what Ticketmaster
documents. A call with no saved key throws `AuthMissingError`, which may carry a
`connectUrl` for the tenant to enter one.

Get a key from the [Ticketmaster Developer Portal](https://developer-account.ticketmaster.com/user/login):
open your application and copy its Consumer Key.

## Notes

- **Read-only.** The Discovery API has no writes.
- **Paging is 0-based** and `size` defaults to 20. Each search returns
  `next_page`, `null` past the 1,000-item deep-paging limit.
- **An empty page has no `_embedded` key.** Ticketmaster answers 200 and omits
  it, so the searches read that as an empty list.
- **Rate limits** are 5 requests a second and 5,000 a day by default. A 429 is
  retried up to three times, honouring `Retry-After`.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ticketmaster

## License

Apache-2.0
