# @corsair-dev/imejisio

Imejisio plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/imejisio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `render` | `imejisio.api.designs.render` | `write` | Render an Imejis template design into image/PDF bytes or a stored URL |

`delivery=stream` (the default) returns the raw bytes, normalized to a base64
payload. `delivery=hosted` and `delivery=signed` return a URL to a render that
Imejis stores, and those are mirrored into the `renders` entity.

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use. The
credential is an Imejis **render API key**, sent as the `dma-api-key` header and
managed under https://www.imejis.io/settings/api-keys.

Imejis's design-management API (`https://api.imejis.io`) is a separate surface
that only accepts OAuth 2.0 access tokens, so it is not reachable with an API
key and is not part of this plugin.

## Webhooks

No webhooks.

## Reference

- Imejis API docs: https://www.imejis.io/apis
- Imejis OpenAPI spec: https://api.imejis.io/openapi.json
- Full docs, types, and examples: https://docs.corsair.dev/plugins/imejisio

## License

Apache-2.0
