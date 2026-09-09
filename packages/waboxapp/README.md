# Waboxapp Plugin

Waboxapp WhatsApp gateway API for Corsair.

## Auth

Every request needs two values, sent as form fields (not headers):

- `token` from Profile → Developer → Tokens
- `uid` for the linked WhatsApp session

Pass them as `waboxapp({ key: token, uid })` or store `uid` on the account.

## API

- `messages.sendChat`
- `messages.sendImage`
- `messages.sendLink`
- `messages.sendMedia`
- `accounts.getStatus`

Waboxapp's public REST docs do not expose contact or group management, or template sends.

## Webhooks

Incoming POSTs are `application/x-www-form-urlencoded`. Tenant routing uses `uid`. The body `token` is checked against the stored API token and is not written to event logs.

Events: `message.received`, `message.ack`.
