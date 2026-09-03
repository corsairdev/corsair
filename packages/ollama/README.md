# @corsair-dev/ollama

Ollama plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ollama
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `chat.chat` | `ollama.api.chat.chat` | `write` | Tool to send a chat message with conversation history to Ollama. Use when you need to have a multi-turn conversation with an LLM model. |
| `chat.generate` | `ollama.api.chat.generate` | `write` | Tool to generate text responses from Ollama models with optional raw mode. Use raw=true to bypass prompt templating when you need full control over the prompt for debugging or custom processing. Note that raw mode will not return a context. |
| `models.listModels` | `ollama.api.models.listModels` | `read` | Tool to list all available Ollama models and their details. Use when you need to fetch installed models with metadata including name, size, last modified timestamp, digest, and format information. |
| `models.showModel` | `ollama.api.models.showModel` | `read` | Tool to show comprehensive information about an Ollama model. Use when you need to retrieve model details, parameters, template, license, or system prompt. |
| `models.version` | `ollama.api.models.version` | `read` | Tool to get the version of Ollama running locally. Use to check which version of Ollama is currently installed. |
| `openai.createOpenAiChatCompletion` | `ollama.api.openai.createOpenAiChatCompletion` | `write` | Tool to create OpenAI-compatible chat completions using Ollama models. Use when you need conversational AI responses with OpenAI API format compatibility. |
| `openai.createOpenAiCompletion` | `ollama.api.openai.createOpenAiCompletion` | `write` | Tool to create OpenAI-compatible text completions using Ollama models. Use when you need text generation with OpenAI API format compatibility beyond chat-based interactions. |
| `openai.listOpenAiModels` | `ollama.api.openai.listOpenAiModels` | `read` | Tool to list available models using OpenAI-compatible API format. Use when you need to retrieve locally available Ollama models with metadata following OpenAI's model list format. |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ollama

## License

Apache-2.0
