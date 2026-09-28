# @corsair-dev/googleaddressvalidation

Google Address Validation plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/googleaddressvalidation
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `address.provideFeedback` | `googleaddressvalidation.api.address.provideFeedback` | `write` | Report the outcome of a previous address validation sequence back to Google |
| `address.validate` | `googleaddressvalidation.api.address.validate` | `read` | Validate a postal address and get standardized results |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/googleaddressvalidation

## License

Apache-2.0
