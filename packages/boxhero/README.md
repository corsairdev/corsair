# BoxHero plugin

Typed Corsair endpoints for the [BoxHero Open API](https://rest.boxhero-app.com/docs/api).

Auth is a team-bound bearer token from **Settings → Integrations**. There are no inbound webhooks on this API.

```
Authorization: Bearer <api-token>
```

Base URL: `https://rest.boxhero-app.com` with every path under `/v1`.

## Operations

| Endpoint | API |
| --- | --- |
| `locations.list` / `get` / `delete` | `/v1/locations` |
| `items.list` / `get` / `delete` | `/v1/items` |
| `transactions.listBasic` / `listLocation` | `GET /v1/transactions` |
| `partners.list` | `/v1/partners` |
| `itemAttributes.list` / `get` | `/v1/item-attrs` |
| `teams.getInfo` | `/v1/teams/linked` |
| `members.list` / `get` | `/v1/members` |

`listBasic` and `listLocation` hit the same documented list. BoxHero has no `/v1/location-txs` route. The Open API requires LOCATION mode (`mode = 2`).

## Development

```bash
pnpm --dir packages/boxhero typecheck
pnpm --dir packages/boxhero test
pnpm --dir packages/boxhero build
```
