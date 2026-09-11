# @corsair-dev/webvizio

Webvizio plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/webvizio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `projects.list` | `webvizio.api.projects.list` | `read` | List all available Webvizio projects |
| `webhooks.list` | `webvizio.api.webhooks.list` | `read` | List all configured Webvizio webhook subscriptions |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/webvizio

## License

Apache-2.0
