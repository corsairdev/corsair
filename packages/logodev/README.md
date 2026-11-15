# @corsair-dev/logodev

Logo.dev plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/logodev
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `brands.search` | `logodev.api.brands.search` | `destructive` | Search brands by name. Logo.dev charges API credits on every search. |
| `logos.fetch` | `logodev.api.logos.fetch` | `read` | Fetch the content type of a domain logo from the Logo.dev CDN. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/logodev

## License

Apache-2.0
