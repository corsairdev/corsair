# @corsair-dev/browsertool

BrowserTool plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/browsertool
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `files.get` | `browsertool.api.files.get` | `read` | Get a download URL for a task output file |
| `sessions.get` | `browsertool.api.sessions.get` | `read` | Get the live URL for a browser session |
| `tasks.create` | `browsertool.api.tasks.create` | `write` | Run an AI-powered browser automation task |
| `tasks.stop` | `browsertool.api.tasks.stop` | `write` | Stop a running browser task and its session |
| `tasks.watch` | `browsertool.api.tasks.watch` | `read` | Poll a browser task for progress and results |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/browsertool

## License

Apache-2.0
