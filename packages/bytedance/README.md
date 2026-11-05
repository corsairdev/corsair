# @corsair-dev/bytedance

Bytedance plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bytedance
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `tasks.delete` | `bytedance.api.tasks.delete` | `destructive` | Cancel a queued video task, or delete a finished task record |
| `tasks.get` | `bytedance.api.tasks.get` | `read` | Get a video generation task: status, video URL (valid 24h), and token usage |
| `tasks.list` | `bytedance.api.tasks.list` | `read` | List video generation tasks from the past 7 days, filtered by status, model, or ids |
| `video.create` | `bytedance.api.video.create` | `write` | Start a Seedance video generation task from text, frames, or reference media; returns a task id |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bytedance

## License

Apache-2.0
