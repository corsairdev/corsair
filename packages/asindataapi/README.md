# @corsair-dev/asindataapi

AsinDataApi plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/asindataapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `categories.get` | `asindataapi.api.categories.get` | `read` | Retrieve Amazon category data and products within a category |
| `collections.create` | `asindataapi.api.collections.create` | `write` | Create a new Collection for batch data collection |
| `collections.delete` | `asindataapi.api.collections.delete` | `destructive` | Delete a Collection [DESTRUCTIVE] |
| `collections.get` | `asindataapi.api.collections.get` | `read` | Get details of a specific Collection including status and request counts |
| `collections.list` | `asindataapi.api.collections.list` | `read` | List all Collections on the account |
| `collections.start` | `asindataapi.api.collections.start` | `write` | Start a Collection to run all its requests immediately |
| `collections.update` | `asindataapi.api.collections.update` | `write` | Update an existing Collection's configuration (only when not running) |
| `destinations.create` | `asindataapi.api.destinations.create` | `write` | Create a new Destination for exporting Collection Result Sets |
| `destinations.delete` | `asindataapi.api.destinations.delete` | `destructive` | Delete a Destination [DESTRUCTIVE] |
| `destinations.list` | `asindataapi.api.destinations.list` | `read` | List all configured Destinations (S3, GCS, Azure Blob, S3-compatible) |
| `destinations.update` | `asindataapi.api.destinations.update` | `write` | Update an existing Destination's configuration |
| `identifiers.resolve` | `asindataapi.api.identifiers.resolve` | `read` | Resolve GTIN, ISBN, UPC, or EAN identifiers to ASINs automatically |
| `offers.get` | `asindataapi.api.offers.get` | `read` | Retrieve product offers, pricing, availability, and seller information |
| `products.get` | `asindataapi.api.products.get` | `read` | Retrieve Amazon product details by ASIN, URL, or GTIN/ISBN/UPC/EAN |
| `requests.add` | `asindataapi.api.requests.add` | `write` | Add Requests to a Collection (up to 1000 per call) |
| `requests.clear` | `asindataapi.api.requests.clear` | `destructive` | Bulk-delete multiple Requests from a Collection by their IDs [DESTRUCTIVE] |
| `requests.delete` | `asindataapi.api.requests.delete` | `destructive` | Delete a single Request from a Collection [DESTRUCTIVE] |
| `requests.list` | `asindataapi.api.requests.list` | `read` | List all Requests in a Collection (paginated, 1000 per page) |
| `requests.update` | `asindataapi.api.requests.update` | `write` | Update a single Request within a Collection |
| `resultSets.get` | `asindataapi.api.resultSets.get` | `read` | Get a specific Result Set with download links |
| `resultSets.list` | `asindataapi.api.resultSets.list` | `read` | List all Result Sets for a Collection |
| `search.get` | `asindataapi.api.search.get` | `read` | Search Amazon products by keywords across supported Amazon domains |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/asindataapi

## License

Apache-2.0
