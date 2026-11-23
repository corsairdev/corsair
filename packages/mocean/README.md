# @corsair-dev/mocean

Messaging with Mocean - send SMS, check message status and account balance and pricing, run verify challenges and look up phone numbers.

## Install

```bash
pnpm add @corsair-dev/mocean
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.balance` | `mocean.api.account.balance` | `read` | Read the account balance |
| `account.pricing` | `mocean.api.account.pricing` | `read` | List the account per-destination pricing, optionally filtered by MCC/MNC or service type |
| `lookup.request` | `mocean.api.lookup.request` | `read` | Look up a number's original and current carrier and porting status, charged against prepaid credit; returns synchronously without a callback URL |
| `sms.send` | `mocean.api.sms.send` | `destructive` | Send an SMS to up to 500 receivers, charged per destination; the response carries a status and msgid per receiver |
| `sms.status` | `mocean.api.sms.status` | `read` | Read one sent message's final status (success, failed, expired, pending or not found) and the credit it deducted |
| `verify.check` | `mocean.api.verify.check` | `write` | Check the PIN a user gave you against a verify request; Mocean allows three wrong attempts |
| `verify.request` | `mocean.api.verify.request` | `destructive` | Send a verification code over SMS, charged per attempt; keep the reqid for check and resend |
| `verify.resend` | `mocean.api.verify.resend` | `destructive` | Resend the code of an existing verify request over SMS, charged per attempt |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mocean

## License

Apache-2.0
