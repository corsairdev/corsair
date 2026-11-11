# @corsair-dev/higgsfield

Higgsfield plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/higgsfield
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `files.createUploadUrl` | `higgsfield.api.files.createUploadUrl` | `write` | Get a presigned URL to PUT an input file to yourself, and the public URL it will have. For most uses files.upload does both steps. |
| `files.upload` | `higgsfield.api.files.upload` | `write` | Upload an image, audio or video file from base64 and get the public URL to pass as a model input. A file already at a public https URL needs no upload: pass that URL to the model. |
| `generations.estimate` | `higgsfield.api.generations.estimate` | `read` | What a generation with these inputs would cost, in US dollars and credits. Free; nothing runs. |
| `generations.run` | `higgsfield.api.generations.run` | `write` | Generate and wait up to waitSeconds (default 10, at most 15) for the output; spends account balance when it completes. Answers like requests.status: queued or in_progress is a job to follow with requests.status, and video usually takes longer than the wait. Outputs expire after 7 days by default. |
| `generations.submit` | `higgsfield.api.generations.submit` | `write` | Queue a generation (image, video…) and get a request id back at once; spends account balance when it completes. Follow it with requests.status until it is completed, failed, nsfw or canceled, or pass webhookUrl. Outputs expire after 7 days by default. Repeating with the returned idempotency_key is never charged twice. |
| `models.get` | `higgsfield.api.models.get` | `read` | One model by its path, with its input fields (input_schema). Read this before a generation: every model takes its own fields. |
| `models.list` | `higgsfield.api.models.list` | `read` | Find Higgsfield models by text, output type or operation; includeSchema adds their input fields |
| `requests.cancel` | `higgsfield.api.requests.cancel` | `write` | Cancel a request that is still queued and refund it. Once it has started it cannot be canceled, and this errors. |
| `requests.delete` | `higgsfield.api.requests.delete` | `destructive` | Delete a finished request's files, prompt and parameters now. Billing records stay. A request still running gets a 409. |
| `requests.status` | `higgsfield.api.requests.status` | `read` | Where a request stands, with its output URLs once completed. Output URLs stop working at expires_at, 7 days after it finished by default. |
| `usage.get` | `higgsfield.api.usage.get` | `read` | Completed generations and their estimated cost by model and time bucket. For monitoring: it can lag and is not a billing record. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/higgsfield

## License

Apache-2.0
