# @corsair-dev/byteforms

ByteForms plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/byteforms
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `forms.create` | `byteforms.api.forms.create` | `write` | Create a new ByteForms form with custom fields and options |
| `forms.delete` | `byteforms.api.forms.delete` | `destructive` | Delete a ByteForms form by its numeric or public ID |
| `forms.get` | `byteforms.api.forms.get` | `read` | Retrieve a single ByteForms form definition by ID |
| `forms.list` | `byteforms.api.forms.list` | `read` | List all ByteForms forms created by the authenticated user |
| `forms.responses` | `byteforms.api.forms.responses` | `read` | Retrieve paginated responses submitted to a ByteForms form |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/byteforms

## License

Apache-2.0
