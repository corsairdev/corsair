# @corsair-dev/abstract

Abstract plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/abstract
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `email.reputation` | `abstract.api.email.reputation` | `read` | Assess email deliverability and quality: format, disposable/free/role detection, MX and SMTP validation |
| `email.validate` | `abstract.api.email.validate` | `read` | Validate whether an email address is real, correctly formatted, and deliverable |
| `iban.validate` | `abstract.api.iban.validate` | `read` | Validate the format and country code of an IBAN number |
| `vat.getCategories` | `abstract.api.vat.getCategories` | `read` | Get VAT rate categories (standard, reduced, special) for a country |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/abstract

## License

Apache-2.0
