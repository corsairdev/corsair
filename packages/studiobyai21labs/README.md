# @corsair-dev/studiobyai21labs

StudioByAI21Labs plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/studiobyai21labs
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `chat.completions` | `studiobyai21labs.api.chat.completions` | `write` | Generate a Jamba chat completion from a conversation history |
| `library.delete` | `studiobyai21labs.api.library.delete` | `write` | Delete a library file |
| `library.download` | `studiobyai21labs.api.library.download` | `read` | Get a signed download URL for a library file |
| `library.get` | `studiobyai21labs.api.library.get` | `read` | Get metadata for a library file |
| `library.list` | `studiobyai21labs.api.library.list` | `read` | List workspace library files with optional filters |
| `library.update` | `studiobyai21labs.api.library.update` | `write` | Update a library file public URL or labels |
| `library.upload` | `studiobyai21labs.api.library.upload` | `write` | Upload a file or register a public URL in the library |
| `maestro.createRun` | `studiobyai21labs.api.maestro.createRun` | `write` | Create an AI21 Maestro run |
| `maestro.retrieveRun` | `studiobyai21labs.api.maestro.retrieveRun` | `read` | Retrieve an AI21 Maestro run by id |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/studiobyai21labs

## License

Apache-2.0
