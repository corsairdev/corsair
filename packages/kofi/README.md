# @corsair-dev/kofi

Ko-fi plugin for Corsair: receives Ko-fi's payment webhook for donations, membership payments, shop orders and commissions, verifies each delivery with the account's token, and lists the payment types Ko-fi can send. Ko-fi publishes no REST API.

## Install

```bash
pnpm add @corsair-dev/kofi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `webhooks.listEvents` | `kofi.api.webhooks.listEvents` | `read` | List the payment types Ko-fi can deliver, from its webhook reference; makes no API call, because Ko-fi has no REST API |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/kofi

## License

Apache-2.0
