# @corsair-dev/mailsso

Mails.so email validation plugin for Corsair: validate one address or a batch, and read a batch job back. The plugin does not handle webhooks, because Mails.so sends none.

## Install

```bash
pnpm add @corsair-dev/mailsso
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `validations.batch` | `mailsso.api.validations.batch` | `write` | Start a batch validation job for at least 2 different email addresses; needs a paid Mails.so plan, and the job cannot be deleted through the API. It returns the job at once with no results: follow it with validations.getBatch until status is completed (it reads processing meanwhile). |
| `validations.getBatch` | `mailsso.api.validations.getBatch` | `read` | Read a batch validation job by id: status processing while it runs, and once completed the counts per result and the validation of every address |
| `validations.single` | `mailsso.api.validations.single` | `read` | Validate one email address: deliverability result and reason, a 0-100 score, and format, domain, MX, block-list, catch-all, generic, disposable and free-provider checks |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mailsso

## License

Apache-2.0
