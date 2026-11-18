# @corsair-dev/fal

fal plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/fal
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.billing` | `fal.api.account.billing` | `read` | The account's credit balance (needs a key with billing read access) |
| `files.upload` | `fal.api.files.upload` | `write` | Upload a file to fal storage and get a public URL to pass as a model input |
| `models.estimateCost` | `fal.api.models.estimateCost` | `read` | Estimate what a number of calls or output units will cost |
| `models.pricing` | `fal.api.models.pricing` | `read` | Unit price of fal models (per image, megapixel, second…) |
| `models.run` | `fal.api.models.run` | `write` | Run a model and wait up to waitSeconds (default 10) for its output; spends fal credits. SUCCEEDED and FAILED are final. IN_QUEUE or IN_PROGRESS is a job to follow with queue.status; video, audio and training usually take longer than the wait. |
| `models.search` | `fal.api.models.search` | `read` | Find fal models by text, category or endpoint id; includeOpenApi returns their input and output fields |
| `queue.cancel` | `fal.api.queue.cancel` | `write` | Cancel a queued request: removed if still waiting, asked to stop if running |
| `queue.result` | `fal.api.queue.result` | `read` | The output of a completed queued request |
| `queue.status` | `fal.api.queue.status` | `read` | Where a queued request stands. Once done it returns state SUCCEEDED with the output, or FAILED with the error. |
| `queue.submit` | `fal.api.queue.submit` | `write` | Queue a model run (image, video, audio, 3D…) and get a request id back at once; spends fal credits. Follow it with queue.status until state is SUCCEEDED or FAILED, or pass webhookUrl. |
| `requests.deletePayloads` | `fal.api.requests.deletePayloads` | `destructive` | Delete a request's stored input and output payloads and the files it generated on fal's CDN (files it took as input stay) |
| `requests.list` | `fal.api.requests.list` | `read` | Past requests to given endpoints, with timing and status; optionally their inputs and outputs |
| `usage.billingEvents` | `fal.api.usage.billingEvents` | `read` | Billed requests one by one, with their cost |
| `usage.get` | `fal.api.usage.get` | `read` | Usage and cost by endpoint over a date range |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/fal

## License

Apache-2.0
