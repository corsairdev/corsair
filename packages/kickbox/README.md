# @corsair-dev/kickbox

Kickbox plugin for Corsair: verify a single email address for deliverability, role, free and disposable flags, typo suggestions and a Sendex quality score, and check whether a domain is a known disposable one.

## Install

```bash
pnpm add @corsair-dev/kickbox
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `verify.disposable` | `kickbox.api.verify.disposable` | `read` | Check whether an address or domain is a known disposable one. Free, and answered by Kickbox’s open service |
| `verify.verify` | `kickbox.api.verify.verify` | `read` | Verify one address and get its verdict (deliverable, undeliverable, risky, unknown), the reason, role and free flags, a typo suggestion and a Sendex quality score. Spends one verification credit |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/kickbox

## License

Apache-2.0
