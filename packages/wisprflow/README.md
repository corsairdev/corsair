# @corsair-dev/wisprflow

Wispr Flow plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/wisprflow
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `tokens.generate` | `wisprflow.api.tokens.generate` | `write` | Create a short-lived client JWT so a browser or app can call the client-side API without the org key |
| `tokens.revoke` | `wisprflow.api.tokens.revoke` | `destructive` | Revoke one client JWT so it stops working immediately |
| `tokens.revokeClient` | `wisprflow.api.tokens.revokeClient` | `destructive` | Revoke every client JWT issued to a client_id |
| `transcriptions.create` | `wisprflow.api.transcriptions.create` | `write` | Transcribe base64 16kHz PCM16 WAV audio into formatted text. Billed per generated token |
| `transcriptions.warmup` | `wisprflow.api.transcriptions.warmup` | `read` | Warm the API connection before a dictation session to cut first-request latency |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/wisprflow

## License

Apache-2.0
