# @corsair-dev/linkup

Linkup plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/linkup
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `answers.get` | `linkup.api.answers.get` | `write` | Ask for a sourced answer. This spends credits. Source text is not stored. |
| `credits.get` | `linkup.api.credits.get` | `read` | Read the remaining credit balance. |
| `pages.fetch` | `linkup.api.pages.fetch` | `write` | Fetch one page as markdown. This spends credits. The page is not stored. |
| `responses.create` | `linkup.api.responses.create` | `write` | Create a response. This spends credits. The generated text is not stored. |
| `search.run` | `linkup.api.search.run` | `write` | Search the web. This spends credits. Page text is not stored. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/linkup

## License

Apache-2.0
