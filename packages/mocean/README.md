# @corsair-dev/mocean

Messaging with Mocean - SMS and delivery status, verify codes over SMS and Telegram, voice calls, WhatsApp messages and templates, number lookup, and account balance and pricing.

## Install

```bash
pnpm add @corsair-dev/mocean
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.balance` | `mocean.api.account.balance` | `read` | Read the account credit balance |
| `account.pricing` | `mocean.api.account.pricing` | `read` | List per-destination prices for SMS, number lookup or verify, optionally for one MCC/MNC pair |
| `lookup.request` | `mocean.api.lookup.request` | `read` | Look up a number's original and current carrier and porting status, paid from prepaid credit; synchronous without a callback URL |
| `sms.reportConversion` | `mocean.api.sms.reportConversion` | `write` | Tell Mocean whether a sent SMS reached the user (conversion tracking for OTP routes) |
| `sms.send` | `mocean.api.sms.send` | `destructive` | Send an SMS to up to 500 receivers, charged per destination; the response has a status and msgid per receiver |
| `sms.status` | `mocean.api.sms.status` | `read` | Read a sent message's final status (success, failed, expired, pending or not found) and the credit it took |
| `templates.create` | `mocean.api.templates.create` | `write` | Create a WhatsApp message template and submit it to Meta for review |
| `templates.delete` | `mocean.api.templates.delete` | `destructive` | Delete a WhatsApp message template, every language of it or one by ID; cannot be undone |
| `templates.edit` | `mocean.api.templates.edit` | `write` | Edit a WhatsApp message template; Meta reviews it again |
| `templates.get` | `mocean.api.templates.get` | `read` | Read one WhatsApp message template |
| `templates.list` | `mocean.api.templates.list` | `read` | List WhatsApp message templates, filtered by name, status, category or language |
| `verify.check` | `mocean.api.verify.check` | `write` | Check the code a user gave you against a verify request; Mocean allows three wrong attempts |
| `verify.request` | `mocean.api.verify.request` | `destructive` | Send a verification code by SMS, charged per attempt; keep the reqid for check and resend |
| `verify.requestTelegram` | `mocean.api.verify.requestTelegram` | `destructive` | Send a verification code to a Telegram chat through your bot; keep the reqid for check |
| `verify.resend` | `mocean.api.verify.resend` | `destructive` | Resend the code of a verify request by SMS, charged per attempt |
| `voice.dial` | `mocean.api.voice.dial` | `destructive` | Call one or more numbers and run a Mocean Command flow (say, play, collect, record, dial), charged per call |
| `voice.hangup` | `mocean.api.voice.hangup` | `destructive` | Hang up a call in progress |
| `voice.recording` | `mocean.api.voice.recording` | `read` | Download the audio recording of a call |
| `whatsapp.downloadMedia` | `mocean.api.whatsapp.downloadMedia` | `read` | Download media a WhatsApp user sent to your business number |
| `whatsapp.send` | `mocean.api.whatsapp.send` | `destructive` | Send a WhatsApp message (text, media, template, interactive, location or contacts) from your business number |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mocean

## License

Apache-2.0
