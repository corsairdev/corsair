# @corsair-dev/tisane

Tisane plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/tisane
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `text.extractEntities` | `tisane.api.text.extractEntities` | `read` | Extract named entities and topics from text |
| `text.moderate` | `tisane.api.text.moderate` | `read` | Content moderation for abuse, hate speech, and harassment |
| `text.parse` | `tisane.api.text.parse` | `read` | Comprehensive natural language parsing and text analysis |
| `text.sentiment` | `tisane.api.text.sentiment` | `read` | Aspect-based sentiment analysis and tone evaluation |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tisane

## License

Apache-2.0
