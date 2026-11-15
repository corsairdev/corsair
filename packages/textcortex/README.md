# @corsair-dev/textcortex

TextCortex plugin for Corsair: list the available models, read the credit balance and enabled capabilities, run chat completions and responses, generate images, and search the web.

## Install

```bash
pnpm add @corsair-dev/textcortex
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `balance.get` | `textcortex.api.balance.get` | `read` | Read the remaining API credits, the funding source and the wallet amount |
| `capabilities.get` | `textcortex.api.capabilities.get` | `read` | Read the features enabled for the key, such as image generation |
| `chat.completions` | `textcortex.api.chat.completions` | `write` | Generate a chat completion from a conversation, which spends credits on every call |
| `images.create` | `textcortex.api.images.create` | `write` | Generate images from a prompt, returning URLs or base64 JSON, and spend credits per image |
| `models.list` | `textcortex.api.models.list` | `read` | List the chat models available to the key, with their IDs and owners |
| `responses.create` | `textcortex.api.responses.create` | `write` | Generate one response from a prompt and optional instructions, which spends credits |
| `web.search` | `textcortex.api.web.search` | `write` | Search the web and return matching sources, which is a paid call rather than a plain read |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/textcortex

## License

Apache-2.0
