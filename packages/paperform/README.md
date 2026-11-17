# @corsair-dev/paperform

Paperform plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/paperform
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `forms.list` | `paperform.api.forms.list` | `read` | List forms. Submission answers are not read. |
| `spaces.forms` | `paperform.api.spaces.forms` | `read` | List forms in one space. |
| `spaces.get` | `paperform.api.spaces.get` | `read` | Read one space. |
| `spaces.list` | `paperform.api.spaces.list` | `read` | List spaces. |
| `translations.list` | `paperform.api.translations.list` | `read` | List translations. The mapping text is not stored. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/paperform

## License

Apache-2.0
