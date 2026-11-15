# @corsair-dev/typesafe

TypeSafe plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/typesafe
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `models.list` | `typesafe.api.models.list` | `read` | List the TypeSafe model names and aliases this key can use, such as jev-latest |
| `systemOne.ask` | `typesafe.api.systemOne.ask` | `read` | Ask Jev typed questions about text, JSON or images in one call: yes/no (probability), choice (one option), score (ordered levels) or box (locate in an image). Answers come back with calibrated probabilities. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/typesafe

## License

Apache-2.0
