# @corsair-dev/revai

RevAI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/revai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `jobs.getJob` | `revai.api.jobs.getJob` | `read` | Get an async job |
| `jobs.getTranscript` | `revai.api.jobs.getTranscript` | `read` | Get transcript of a job |
| `jobs.submitJob` | `revai.api.jobs.submitJob` | `write` | Submit an async job |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/revai

## License

Apache-2.0
