# @corsair-dev/twilio

Twilio plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/twilio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `calls.create` | `twilio.api.calls.create` | `write` | Initiate an outbound phone call |
| `calls.get` | `twilio.api.calls.get` | `read` | Retrieve a call record by SID |
| `calls.list` | `twilio.api.calls.list` | `read` | List call records with optional filters |
| `messages.get` | `twilio.api.messages.get` | `read` | Retrieve a message by SID |
| `messages.list` | `twilio.api.messages.list` | `read` | List messages with optional filters |
| `messages.send` | `twilio.api.messages.send` | `write` | Send an SMS or MMS message |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 3 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/twilio

## License

Apache-2.0
