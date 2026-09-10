# @corsair-dev/groqcloud

GroqCloud plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/groqcloud
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `audio.createTranscription` | `groqcloud.api.audio.createTranscription` | `write` | Transcribe an audio file into text |
| `audio.createTranslation` | `groqcloud.api.audio.createTranslation` | `write` | Translate an audio recording into English text |
| `audio.listVoices` | `groqcloud.api.audio.listVoices` | `read` | Retrieve available TTS voices for Groq PlayAI models |
| `chat.createCompletion` | `groqcloud.api.chat.createCompletion` | `write` | Generate a chat completion from a list of messages |
| `chat.createResponse` | `groqcloud.api.chat.createResponse` | `write` | Create a model response for the given input (Responses API) |
| `models.listModels` | `groqcloud.api.models.listModels` | `read` | Retrieve currently available Groq models |
| `models.retrieveModel` | `groqcloud.api.models.retrieveModel` | `read` | Retrieve detailed metadata for a specific model |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/groqcloud

## License

Apache-2.0
