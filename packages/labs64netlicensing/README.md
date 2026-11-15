# @corsair-dev/labs64netlicensing

Labs64 NetLicensing plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/labs64netlicensing
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `licenses.list` | `labs64netlicensing.api.licenses.list` | `read` | List NetLicensing licenses for the connected vendor. |
| `products.list` | `labs64netlicensing.api.products.list` | `read` | List NetLicensing products for the connected vendor. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/labs64netlicensing

## License

Apache-2.0
