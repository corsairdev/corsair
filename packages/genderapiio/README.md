# @corsair-dev/genderapiio

GenderAPI.io plugin for Corsair: infer gender from a name, an email address or a username, one at a time or in a batch of up to 50, with the confidence, the source that answered and the credits it cost.

## Install

```bash
pnpm add @corsair-dev/genderapiio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.capabilities` | `genderapiio.api.account.capabilities` | `read` | Read the deployment version, the AI availability and the batch limit. This route is free |
| `account.errorCatalog` | `genderapiio.api.account.errorCatalog` | `read` | Read every error code with the statuses it uses and what a caller should do about it. This route is free |
| `account.usage` | `genderapiio.api.account.usage` | `read` | Read the shared balance, the trial reset time and whether this call used a key or the IP trial. This route is free |
| `gender.batch` | `genderapiio.api.gender.batch` | `read` | Infer gender for up to 50 names, emails or usernames in one request. An item can fail on its own, and only successful items are billed |
| `gender.infer` | `genderapiio.api.gender.infer` | `read` | Infer gender from a name, an email address or a username, with a confidence, the source that answered (dataset or AI) and the credits it cost |
| `phone.validate` | `genderapiio.api.phone.validate` | `read` | Validate and format a phone number, returning its E.164 form, country and calling code |

## Auth

Auth: API key, optional. Without one, GenderAPI.io serves an IP-scoped trial (10 credits per 24 hours), so Corsair does not prompt for a key: connect it with a connect link or the `key` option.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/genderapiio

## License

Apache-2.0
