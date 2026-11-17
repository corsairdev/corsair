# @corsair-dev/twocaptcha

2Captcha plugin for Corsair: create captcha-solving tasks, read their results, check the balance, and report tasks as correct or incorrect.

## Install

```bash
pnpm add @corsair-dev/twocaptcha
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.balance` | `twocaptcha.api.account.balance` | `read` | Read the account balance in USD |
| `account.reportCorrect` | `twocaptcha.api.account.reportCorrect` | `destructive` | Report that the site accepted a task answer |
| `account.reportIncorrect` | `twocaptcha.api.account.reportIncorrect` | `destructive` | Report that the site rejected a task answer; 2Captcha reviews it and may refund the task |
| `tasks.create` | `twocaptcha.api.tasks.create` | `destructive` | Create a captcha-solving task, which the account pays for; returns the task id to poll |
| `tasks.result` | `twocaptcha.api.tasks.result` | `read` | Read a task result: processing while workers solve it, then ready with the solution and cost |

## Auth

Auth: API key from the 2Captcha dashboard, sent as `clientKey` to API v2 (`api.2captcha.com`).

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/twocaptcha

## License

Apache-2.0
