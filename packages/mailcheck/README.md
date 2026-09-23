# @corsair-dev/mailcheck

Mailcheck plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/mailcheck
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `domain.validate` | `mailcheck.api.domain.validate` | `read` | Check a domain for MX records, disposable providers, and catch-all mail |
| `email.verify` | `mailcheck.api.email.verify` | `read` | Verify an email for syntax, MX records, and SMTP validity |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mailcheck

## License

Apache-2.0
