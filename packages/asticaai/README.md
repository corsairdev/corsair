# @corsair-dev/asticaai

AsticaAi plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/asticaai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `analyzeAudio.analyze` | `asticaai.api.analyzeAudio.analyze` | `read` | Transcribe audio using Astica speech-to-text. |
| `readText.read` | `asticaai.api.readText.read` | `read` | Extract text from an image using Astica OCR. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/asticaai

## License

Apache-2.0
