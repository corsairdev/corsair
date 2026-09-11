# @corsair-dev/abyssale

Abyssale plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/abyssale
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `auth.test` | `abyssale.api.auth.test` | `read` | Test Abyssale API key authentication validity |
| `designs.list` | `abyssale.api.designs.list` | `read` | Get a list of designs in Abyssale |
| `fonts.list` | `abyssale.api.fonts.list` | `read` | Get a list of available fonts in Abyssale |
| `generation.batch` | `abyssale.api.generation.batch` | `write` | Start an asynchronous multi-format generation from an Abyssale design |
| `generation.image` | `abyssale.api.generation.image` | `write` | Synchronously generate a single image from an Abyssale design |
| `generation.status` | `abyssale.api.generation.status` | `read` | Poll the status of an asynchronous generation request |
| `projects.create` | `abyssale.api.projects.create` | `write` | Create a new project in Abyssale |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/abyssale

## License

Apache-2.0
