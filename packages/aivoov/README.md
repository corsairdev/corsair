# @corsair-dev/aivoov

AiVOOV text-to-speech plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/aivoov
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `audio.create` | `aivoov.api.audio.create` | `write` | Synthesise speech from one or more voice and text pairs, returning Base64-encoded audio. Consumes character credits |
| `voices.list` | `aivoov.api.voices.list` | `read` | List available text-to-speech voices, optionally filtered by BCP-47 language code. Limited to 20 calls per day, so results are mirrored to the voices entity |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/aivoov

## License

Apache-2.0
