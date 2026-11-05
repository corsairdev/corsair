# @corsair-dev/castingwords

Castingwords plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/castingwords
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `audiofile.get` | `castingwords.api.audiofile.get` | `read` | Get audiofile details including current state |
| `invoice.get` | `castingwords.api.invoice.get` | `read` | Get invoice details and line items |
| `order.create` | `castingwords.api.order.create` | `write` | Create a transcription order for public audio/video URLs (API4 order_url) |
| `prepayBalance.get` | `castingwords.api.prepayBalance.get` | `read` | Get the current prepaid balance in USD |
| `refund.create` | `castingwords.api.refund.create` | `destructive` | Cancel and refund an audiofile before transcription work starts |
| `skus.list` | `castingwords.api.skus.list` | `read` | List documented CastingWords SKUs from Store API v4 (no live sku endpoint) |
| `transcript.get` | `castingwords.api.transcript.get` | `read` | Get a completed transcript (txt, doc, rtf, html, srt, docx, tstxt, vtt) |
| `upgrade.create` | `castingwords.api.upgrade.create` | `write` | Order upgrades for an audiofile (timestamps, captions, etc.) |
| `webhook.get` | `castingwords.api.webhook.get` | `read` | Get the registered account webhook URL |
| `webhook.register` | `castingwords.api.webhook.register` | `write` | Register a webhook URL for CastingWords event notifications |
| `webhook.test` | `castingwords.api.webhook.test` | `write` | Request a test webhook POST for a documented event type |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/castingwords

## License

Apache-2.0
