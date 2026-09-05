# @corsair-dev/addresszen

Addresszen plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/addresszen
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `autocomplete.addresses` | `addresszen.api.autocomplete.addresses` | `read` | Get address autocomplete suggestions for a partial address query |
| `key.availability` | `addresszen.api.key.availability` | `read` | Get public information on an API key, including whether it is currently usable |
| `resolve.addressUsa` | `addresszen.api.resolve.addressUsa` | `read` | Resolve an address autocompletion by its address ID and return the full address in US format |
| `verify.address` | `addresszen.api.verify.address` | `read` | Verify and standardize a US address using USPS CASS validation |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/addresszen

## License

Apache-2.0
