# @corsair-dev/docparser

Docparser plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/docparser
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `models.list` | `docparser.api.models.list` | `read` | List model layouts for one parser. |
| `parsers.list` | `docparser.api.parsers.list` | `read` | List document parsers. |
| `ping` | `docparser.api.ping` | `read` | Check that the API key is accepted. |
| `results.list` | `docparser.api.results.list` | `read` | List parsed documents. Parsed field values are not stored. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/docparser

## License

Apache-2.0
