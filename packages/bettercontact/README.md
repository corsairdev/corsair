# @corsair-dev/bettercontact

BetterContact plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bettercontact
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `credits.get` | `bettercontact.api.credits.get` | `read` | Check remaining API credits balance |
| `enrichment.enrich` | `bettercontact.api.enrichment.enrich` | `write` | Submit lead enrichment request for work emails and phone numbers |
| `enrichment.getResults` | `bettercontact.api.enrichment.getResults` | `read` | Retrieve results for a submitted enrichment request |
| `leadFinder.create` | `bettercontact.api.leadFinder.create` | `write` | Create a new Lead Finder search to discover leads based on criteria |
| `leadFinder.getResults` | `bettercontact.api.leadFinder.getResults` | `read` | Retrieve results from a submitted Lead Finder search |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bettercontact

## License

Apache-2.0
