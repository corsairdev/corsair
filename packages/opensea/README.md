# @corsair-dev/opensea

Opensea plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/opensea
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.get` | `opensea.api.accounts.get` | `read` | One OpenSea profile by wallet address or username, with its display name, bio, follower counts and verification flag. `is_agent` is a self-declaration, not a check by OpenSea. |
| `accounts.portfolio` | `opensea.api.accounts.portfolio` | `read` | USD value of one wallet’s NFTs and tokens, with profit and loss over a timeframe. Every figure is a string. `pnl_absolute` and `pnl_percentage` are absent, not zero, when the account has no history. |
| `chains.list` | `opensea.api.chains.list` | `read` | The chains OpenSea indexes, with each one’s symbol and block explorer. No input; the list is the valid source for every `chain` argument elsewhere. |
| `collection.nfts` | `opensea.api.collection.nfts` | `read` | The NFTs in one collection, paged with `next`. Filter by trait with `traits`, a JSON array of `traitType` and `value` pairs sent as a string. |
| `collections.floorPrices` | `opensea.api.collections.floorPrices` | `read` | Floor price over time for one collection, as points carrying a float unix timestamp, a USD string and a token-unit price. Narrow with `timeframe`, and set how many points come back with `resolution`. |
| `collections.get` | `opensea.api.collections.get` | `read` | One collection by slug, with its contract addresses, links and NFT counts. The answer is a bare object, not an array, and an unknown slug is a 404. |
| `collections.holders` | `opensea.api.collections.holders` | `read` | Wallet addresses holding one collection, with each amount and its share of supply as a fraction (`0.0127` is 1.27%). Sort by quantity either way. This route pages with `cursor`, not `next`. |
| `collections.list` | `opensea.api.collections.list` | `read` | Collections, paged with the returned `next` cursor. Filter by chain, creator or hidden status, and sort with `order_by`. OpenSea defaults the page size to 50. |
| `collections.stats` | `opensea.api.collections.stats` | `read` | Volume, sales, owner count and floor price for one collection, as an all-time total plus per-interval rows. |
| `collections.top` | `opensea.api.collections.top` | `read` | Collections ranked by a metric, `one_day_volume` by default. This route pages with `cursor`, which is the previous response’s `next`. |
| `collections.trending` | `opensea.api.collections.trending` | `read` | Collections ranked by momentum over a window, `one_day` by default. Same page shape as `collections.top`, and it pages with `cursor` too. |
| `contract.nfts` | `opensea.api.contract.nfts` | `read` | Every NFT a contract has issued, paged with `next`. Use this to walk a contract whose collection slug you do not have; `collection.nfts` is the same rows keyed by slug. |
| `events.collection` | `opensea.api.events.collection` | `read` | Marketplace events limited to one collection, paged with `next`. Narrow by event type, trait filter or a time window. The account-wide `events.list` is the same shape without the collection scope. |
| `events.list` | `opensea.api.events.list` | `read` | Marketplace events, newest first, paged with `next`. Narrow by event type and by an `after` or `before` unix timestamp. |
| `listings.all` | `opensea.api.listings.all` | `read` | Every active listing in a collection, paged with `next`, including private ones when asked. Filter by `maker` to see one seller’s listings. `listings.best` gives only the cheapest per token. |
| `listings.best` | `opensea.api.listings.best` | `read` | The cheapest active listings in one collection, paged with `next`. Each order carries a Seaport `protocol_data` payload and its `order_hash` for a later fulfilment call. |
| `nfts.get` | `opensea.api.nfts.get` | `read` | One NFT by chain, contract address and token id, with its owners and traits. The token id goes in as a string, because some collections use ids beyond the safe integer range. |
| `nfts.owners` | `opensea.api.nfts.owners` | `read` | Wallets holding one token, with the quantity each holds. Useful for an ERC-1155 or a fractionalised token, where more than one address holds the same id. |
| `offers.all` | `opensea.api.offers.all` | `read` | Every active offer on a collection, paged with `next`, including trait and per-token offers. Filter by `maker` for one bidder. `offers.collection` gives only the collection-wide ones. |
| `offers.best` | `opensea.api.offers.best` | `read` | The highest active offer on one token in a collection, as a single order object. Answers an empty or 404 result when nobody has bid on that token. |
| `offers.collection` | `opensea.api.offers.collection` | `read` | Active collection-wide offers, paged with `next`. Same order shape as listings, with `remaining_quantity` for how much of the offer is unfilled. |
| `orders.get` | `opensea.api.orders.get` | `read` | One order by chain, Seaport contract address and order hash, as a single object rather than an array. Takes the `order_hash` from a listing or offer row; a cancelled or filled order still answers with its final state. |
| `search.search` | `opensea.api.search.search` | `read` | Search across collections, NFTs, tokens and accounts. Each result carries a `type` and one payload key, so branch on `type` before reading the rest. |
| `traits.list` | `opensea.api.traits.list` | `read` | The trait names on one collection, the type of each, and under `counts` every value with how many NFTs carry it (`min` and `max` for a numeric trait). Use `collection.nfts` with a `traits` filter to select NFTs by value. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/opensea

## License

Apache-2.0
