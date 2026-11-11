# @corsair-dev/enigma

Enigma plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/enigma
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `brands.get` | `enigma.api.brands.get` | `read` | Get a brand by ID with its operating locations (paged by cursor) and legal entities, each location with its address, operating status and 12-month card revenue |
| `brands.match` | `enigma.api.brands.match` | `read` | Match a business by name, website, phone number or a natural-language prompt, with an optional address and confidence threshold; returns the best-matching brand with its industries, location count and 12-month card revenue |
| `legalEntities.get` | `enigma.api.legalEntities.get` | `read` | Get a legal entity by ID or name, with its registered entities, formation dates, addresses and brands; each list returns up to three entries with a pageInfo flag when more exist |
| `locations.match` | `enigma.api.locations.match` | `read` | Match a business location by name, address, website or phone number; returns the address, phone numbers, operating status and parent brands |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/enigma

## License

Apache-2.0
