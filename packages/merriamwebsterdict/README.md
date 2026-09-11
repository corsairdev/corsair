# @corsair-dev/merriamwebsterdict

Merriam-Webster Dictionary plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/merriamwebsterdict
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `words.get` | `merriamwebsterdict.api.words.get` | `read` | Look up a word in Merriam-Webster (collegiate / sd2 / sd3 / sd4), returning definitions, part of speech, pronunciation, etymology, and audio — or spelling suggestions when no entry matches |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/merriamwebsterdict

## License

Apache-2.0
