# Waboxapp Plugin

Integrates [Waboxapp](https://www.waboxapp.com), a WhatsApp gateway API, with Corsair.

## What this plugin does

- Wraps Waboxapp's HTTP API (`https://www.waboxapp.com/api`) for sending and receiving WhatsApp messages.
- Exposes an example endpoint (`example.get`) as a reference pattern for future message-sending endpoints.
- Handles an incoming-message webhook. Waboxapp sends webhook payloads as `application/x-www-form-urlencoded` with no signature header, so tenant matching is done via the `token` field in the payload body rather than a signature header.

## Authentication

Waboxapp uses two credentials, both passed as query parameters on every request (not headers):

- `token` — API access token, generated from the Waboxapp dashboard under Profile → Developer → Tokens.
- `uid` — the identifier for a connected WhatsApp session/number, obtained by linking a WhatsApp account via QR code in the Waboxapp dashboard.

## Status

This is an initial scaffold addressing #1587. It establishes the plugin structure, endpoint pattern, and webhook flow. Full message-sending endpoints (text, media, template messages) and contact/group management are not yet implemented and will follow in subsequent work.
