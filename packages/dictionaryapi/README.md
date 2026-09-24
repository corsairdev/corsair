# @corsair-dev/dictionaryapi

DictionaryApi plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/dictionaryapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `entries.get` | `dictionaryapi.api.entries.get` | `read` | Look up a word in Merriam-Webster Collegiate Dictionary, returning definitions, headword, part of speech, and pronunciations — or spelling suggestions if not found |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dictionaryapi

## License

Apache-2.0
