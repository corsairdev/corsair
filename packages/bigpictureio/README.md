# @corsair-dev/bigpictureio

BigPicture.io plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bigpictureio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `company.find` | `bigpictureio.api.company.find` | `read` | Find detailed company information by domain |
| `company.stream` | `bigpictureio.api.company.stream` | `read` | Hold the company lookup open until BigPicture finishes |
| `ip.find` | `bigpictureio.api.ip.find` | `read` | Find the company associated with an IP address |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bigpictureio

## License

Apache-2.0
