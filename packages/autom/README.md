# @corsair-dev/autom

Autom plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/autom
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `google.countries` | `autom.api.google.countries` | `read` | Retrieve Google-supported countries filtered by search term. |
| `google.images` | `autom.api.google.images` | `read` | Fetch image search results from Google Search. |
| `google.languages` | `autom.api.google.languages` | `read` | Retrieve Google-supported languages filtered by search term. |
| `google.locations` | `autom.api.google.locations` | `read` | Retrieve Google-supported locations filtered by search term. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/autom

## License

Apache-2.0
