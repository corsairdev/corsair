# @corsair-dev/emailable

Emailable plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/emailable
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `emailable.api.account.get` | `read` | Get the credits left on the account. The owner email is not stored. |
| `batches.create` | `emailable.api.batches.create` | `destructive` | Start verifying a list of up to 50,000 addresses. Uses one credit per address. Poll batches.get for the results. |
| `batches.get` | `emailable.api.batches.get` | `read` | Get a batch: progress, counts per state and reason, and each address's result (up to 1,000 addresses) or a download link (larger batches). |
| `oauth.authorize` | `emailable.api.oauth.authorize` | `read` | Build the OAuth authorize URL. The client id is not stored. |
| `verifications.verify` | `emailable.api.verifications.verify` | `read` | Verify one email address: state (deliverable, undeliverable, risky, unknown), reason, score, and flags such as disposable, free, role and accept-all, plus a did-you-mean suggestion. Uses one credit. If `pending` is true, call again within 5 minutes at no extra cost. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/emailable

## License

Apache-2.0
