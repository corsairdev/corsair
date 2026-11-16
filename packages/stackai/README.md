# @corsair-dev/stackai

StackAI project I/O schemas and asynchronous run lifecycle for Corsair.

## Install

```bash
pnpm add @corsair-dev/stackai
```

## Endpoints

| Operation | Risk | Description |
| --- | --- | --- |
| `projects.ioSchema` | read | Inspect a project version's input/output schema. |
| `runs.start` | destructive | Start a project run. |
| `runs.list` | read | List runs with cursor pagination. |
| `runs.get` | read | Read a run's current state. |
| `runs.cancel` | destructive | Request cancellation. |
| `runs.resume` | destructive | Resume an ask-human pause. |

Authenticate with a personal API key or supported user token. Set `baseURL` for private installations; the default is `https://api.stack-ai.com`. Start, cancel and resume return `{ body, location }`; `location` is the provider's header or `null` if absent. A 201/202 does not guarantee completion. The plugin prevents Corsair retries from resending writes, but a custom root handler may still delay and reprocess the original failure. Reconcile ambiguous failures before manually retrying. Webhook support is outside this integration's scope.

Reference: https://docs.stackai.com/stackai-api/rest-api-v2.md
