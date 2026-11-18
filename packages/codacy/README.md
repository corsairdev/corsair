# @corsair-dev/codacy

Codacy plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/codacy
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `codacy.api.account.get` | `read` | Get account details |
| `analysis.getConfig` | `codacy.api.analysis.getConfig` | `read` | Get repository analysis configuration |
| `organizations.get` | `codacy.api.organizations.get` | `read` | Get organization |
| `organizations.list` | `codacy.api.organizations.list` | `read` | List organizations |
| `patterns.get` | `codacy.api.patterns.get` | `read` | Get tool pattern |
| `patterns.list` | `codacy.api.patterns.list` | `read` | List tool patterns |
| `repositories.get` | `codacy.api.repositories.get` | `read` | Get repository |
| `repositories.languages` | `codacy.api.repositories.languages` | `read` | Get repository languages |
| `repositories.list` | `codacy.api.repositories.list` | `read` | List repositories |
| `tools.list` | `codacy.api.tools.list` | `read` | List analysis tools |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/codacy

## License

Apache-2.0
