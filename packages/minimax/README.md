# @corsair-dev/minimax

MiniMax plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/minimax
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `chat.completion` | `minimax.chat.completion` | `read` | Create a chat completion with a MiniMax text model |
| `chat.createResponse` | `minimax.chat.createResponse` | `read` | Create a model response via the Responses API |
| `chat.estimateInputTokens` | `minimax.chat.estimateInputTokens` | `read` | Estimate the input token count of a request |
| `speech.t2a` | `minimax.speech.t2a` | `read` | Synthesize speech from text (synchronous T2A) |
| `speech.createAsyncTask` | `minimax.speech.createAsyncTask` | `write` | Create an asynchronous long-text speech synthesis task |
| `speech.queryAsyncTask` | `minimax.speech.queryAsyncTask` | `read` | Query the status of an asynchronous speech synthesis task |
| `voice.list` | `minimax.voice.list` | `read` | List system, cloned and generated voices |
| `voice.clone` | `minimax.voice.clone` | `write` | Clone a voice from uploaded audio |
| `voice.design` | `minimax.voice.design` | `write` | Design a custom voice from a description |
| `voice.delete` | `minimax.voice.delete` | `destructive` | Delete a generated voice permanently |
| `music.generate` | `minimax.music.generate` | `read` | Generate a song from a prompt and lyrics |
| `music.coverPreprocess` | `minimax.music.coverPreprocess` | `read` | Preprocess reference audio for two-step music cover generation |
| `music.generateLyrics` | `minimax.music.generateLyrics` | `read` | Generate or edit song lyrics |
| `image.generate` | `minimax.image.generate` | `read` | Generate images from a prompt, optionally with a subject reference |
| `video.generate` | `minimax.video.generate` | `write` | Create a Hailuo video generation task |
| `video.query` | `minimax.video.query` | `read` | Query a Hailuo video generation task |
| `video.generateV2` | `minimax.video.generateV2` | `write` | Create an H3 multimodal video generation task |
| `video.queryV2` | `minimax.video.queryV2` | `read` | Query an H3 video task by id |
| `video.listV2` | `minimax.video.listV2` | `read` | List H3 video tasks from the last 7 days |
| `video.cancelOrDeleteV2` | `minimax.video.cancelOrDeleteV2` | `destructive` | Cancel a queued task or delete a finished task record |
| `video.contextIr` | `minimax.video.contextIr` | `write` | Create an H3-Context-IR task that enriches a video prompt |
| `video.regenerate` | `minimax.video.regenerate` | `write` | Create a 2K video regeneration task |
| `video.templateGenerate` | `minimax.video.templateGenerate` | `write` | Create a Video Agent task from a template |
| `video.templateQuery` | `minimax.video.templateQuery` | `read` | Query a Video Agent template generation task |
| `files.list` | `minimax.files.list` | `read` | List uploaded files for a purpose |
| `files.retrieve` | `minimax.files.retrieve` | `read` | Retrieve the metadata of an uploaded file |
| `files.delete` | `minimax.files.delete` | `destructive` | Delete an uploaded file permanently |
| `models.list` | `minimax.models.list` | `read` | List available models (OpenAI-compatible) |
| `models.retrieve` | `minimax.models.retrieve` | `read` | Retrieve a model (OpenAI-compatible) |
| `models.listAnthropic` | `minimax.models.listAnthropic` | `read` | List available models (Anthropic-compatible) |
| `models.retrieveAnthropic` | `minimax.models.retrieveAnthropic` | `read` | Retrieve a model (Anthropic-compatible) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use. All
requests send `Authorization: Bearer <key>` to `https://api.minimax.io`.

## Webhooks

No webhooks.

## Reference

Full docs, types, and sample requests: https://docs.corsair.dev/plugins/minimax

## License

Apache-2.0
