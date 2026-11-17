# @corsair-dev/emailable

Emailable plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/emailable
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `emailable.api.account.get` | `read` | Read remaining credits. The owner email is not stored. |
| `batches.create` | `emailable.api.batches.create` | `write` | Start a batch verification. This spends credits. Addresses are not stored. |
| `batches.get` | `emailable.api.batches.get` | `read` | Read a batch. Addresses are not stored. |
| `oauth.authorize` | `emailable.api.oauth.authorize` | `read` | Build the OAuth authorize URL. The client id is not stored. |
| `verifications.verify` | `emailable.api.verifications.verify` | `write` | Verify one address. This spends a credit. Names are not stored. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/emailable

## License

Apache-2.0
