# @corsair-dev/opensea

Opensea plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/opensea
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `chains.list` | `opensea.api.chains.list` | `read` | The chains OpenSea indexes, with each one’s symbol and block explorer. No input; the list is a closed set and is the valid source for every `chain` argument elsewhere. |
| `collection.nfts` | `opensea.api.collection.nfts` | `read` | The NFTs in one collection, paged with `next`. Filter by trait with `trait_type:value`, several joined by commas. |
| `collections.get` | `opensea.api.collections.get` | `read` | One collection by slug, with its contract addresses, links and NFT counts. The answer is a bare object, not an array, and an unknown slug is a 404. |
| `collections.list` | `opensea.api.collections.list` | `read` | Collections, paged with the returned `next` cursor. Filter by chain, creator or hidden status, and sort with `order_by`. OpenSea defaults the page size to 50. |
| `collections.stats` | `opensea.api.collections.stats` | `read` | Volume, sales, owner count and floor price for one collection, as an all-time total plus per-interval rows. |
| `collections.top` | `opensea.api.collections.top` | `read` | Collections ranked by a metric, `one_day_volume` by default. Page with `cursor`, which is the previous response’s `next`. |
| `collections.trending` | `opensea.api.collections.trending` | `read` | Collections ranked by momentum over a window, `one_day` by default. Same page shape and cursor as `collections.top`. |
| `events.list` | `opensea.api.events.list` | `read` | Marketplace events, newest first, paged with `next`. Narrow by event type and by an `after` or `before` unix timestamp. |
| `listings.best` | `opensea.api.listings.best` | `read` | The cheapest active listings in one collection, paged with `next`. Each order carries a Seaport `protocol_data` payload and its `order_hash` for a later fulfilment call. |
| `nfts.get` | `opensea.api.nfts.get` | `read` | One NFT by chain, contract address and token id, with its owners and traits. The token id goes in as a string, because some collections use ids beyond the safe integer range. |
| `offers.collection` | `opensea.api.offers.collection` | `read` | Active collection-wide offers, paged with `next`. Same order shape as listings, with `remaining_quantity` for how much of the offer is unfilled. |
| `search.search` | `opensea.api.search.search` | `read` | Search across collections, NFTs, tokens and accounts. Each result carries a `type` and one payload key, so branch on `type` before reading the rest. |
| `traits.list` | `opensea.api.traits.list` | `read` | The trait names on one collection and the type of each value. It answers types, not the values themselves; use `collection.nfts` with a trait filter to select by value. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/opensea

## License

Apache-2.0
