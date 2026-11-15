# @corsair-dev/twocaptcha

2Captcha plugin for Corsair: create captcha-solving tasks, read their results, check the balance, and report tasks as correct or incorrect.

## Install

```bash
pnpm add @corsair-dev/twocaptcha
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.balance` | `twocaptcha.api.account.balance` | `read` | Read the account balance |
| `account.reportCorrect` | `twocaptcha.api.account.reportCorrect` | `write` | Report a token the site accepted, which improves the account solving rating |
| `account.reportIncorrect` | `twocaptcha.api.account.reportIncorrect` | `write` | Report a token the site rejected, which refunds the task |
| `tasks.create` | `twocaptcha.api.tasks.create` | `write` | Create a captcha-solving task and charge the account for it; returns the task id to poll |
| `tasks.result` | `twocaptcha.api.tasks.result` | `read` | Read a task result, returning a not-ready state while the captcha is still being solved |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/twocaptcha

## License

Apache-2.0
