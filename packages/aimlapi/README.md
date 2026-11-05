# @corsair-dev/aimlapi

AimlApi plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/aimlapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `assistants.create` | `aimlapi.api.assistants.create` | `write` | Create a new AIMLAPI assistant. |
| `assistants.delete` | `aimlapi.api.assistants.delete` | `write` | Delete an assistant. |
| `assistants.get` | `aimlapi.api.assistants.get` | `read` | Retrieve an assistant by ID. |
| `assistants.list` | `aimlapi.api.assistants.list` | `read` | List configured assistants. |
| `assistants.update` | `aimlapi.api.assistants.update` | `write` | Update an assistant definition. |
| `batches.list` | `aimlapi.api.batches.list` | `read` | List or retrieve batch processing status and results. |
| `billing.getBalance` | `aimlapi.api.billing.getBalance` | `read` | Retrieve account billing balance. |
| `chat.createCompletion` | `aimlapi.api.chat.createCompletion` | `write` | Generate a chat completion using an AIMLAPI-compatible model. |
| `luma.getGeneration` | `aimlapi.api.luma.getGeneration` | `read` | Retrieve a Luma video generation by ID. |
| `messages.create` | `aimlapi.api.messages.create` | `write` | Create a message in a thread. |
| `messages.delete` | `aimlapi.api.messages.delete` | `write` | Delete a message. |
| `messages.get` | `aimlapi.api.messages.get` | `read` | Retrieve a message by ID. |
| `messages.list` | `aimlapi.api.messages.list` | `read` | List messages in a thread. |
| `messages.update` | `aimlapi.api.messages.update` | `write` | Update a message. |
| `models.list` | `aimlapi.api.models.list` | `read` | List models currently available to the AIMLAPI account. |
| `models.listWithDetails` | `aimlapi.api.models.listWithDetails` | `read` | List models with pagination metadata and expanded details. |
| `responses.get` | `aimlapi.api.responses.get` | `read` | Retrieve a response by ID. |
| `runs.cancel` | `aimlapi.api.runs.cancel` | `write` | Cancel an in-progress run. |
| `runs.create` | `aimlapi.api.runs.create` | `write` | Create a run for a thread and assistant. |
| `runs.get` | `aimlapi.api.runs.get` | `read` | Retrieve a run by ID. |
| `runs.list` | `aimlapi.api.runs.list` | `read` | List runs for a thread. |
| `runs.submitToolOutputs` | `aimlapi.api.runs.submitToolOutputs` | `write` | Submit tool outputs for a run. |
| `runs.update` | `aimlapi.api.runs.update` | `write` | Update a run. |
| `runSteps.get` | `aimlapi.api.runSteps.get` | `read` | Retrieve a single run step. |
| `runSteps.list` | `aimlapi.api.runSteps.list` | `read` | List run steps for a run. |
| `threads.create` | `aimlapi.api.threads.create` | `write` | Create an AIMLAPI thread. |
| `threads.delete` | `aimlapi.api.threads.delete` | `write` | Delete a thread. |
| `threads.get` | `aimlapi.api.threads.get` | `read` | Retrieve a thread by ID. |
| `threads.update` | `aimlapi.api.threads.update` | `write` | Update thread metadata or resources. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/aimlapi

## License

Apache-2.0
