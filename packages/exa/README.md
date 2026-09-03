# @corsair-dev/exa

Exa plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/exa
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `answer.get` | `exa.api.answer.get` | `read` | Generate a direct, citation-backed answer to a natural language question |
| `contents.get` | `exa.api.contents.get` | `read` | Retrieve full text, highlights, or summaries from URLs or document IDs |
| `events.get` | `exa.api.events.get` | `read` | Get details of a specific webset event by its ID |
| `events.list` | `exa.api.events.list` | `read` | List all events that have occurred for a webset |
| `imports.create` | `exa.api.imports.create` | `write` | Create a new import to upload data into a webset |
| `imports.delete` | `exa.api.imports.delete` | `destructive` | Delete an existing import [DESTRUCTIVE] |
| `imports.list` | `exa.api.imports.list` | `read` | List all imports for a webset |
| `monitors.create` | `exa.api.monitors.create` | `write` | Create a new monitor to watch a webset for changes |
| `search.findSimilar` | `exa.api.search.findSimilar` | `read` | Find web pages semantically similar to a given URL |
| `search.search` | `exa.api.search.search` | `read` | Search the web using neural or keyword search |
| `webhooksApi.list` | `exa.api.webhooksApi.list` | `read` | List all webhooks configured for websets |
| `websets.create` | `exa.api.websets.create` | `write` | Create a new webset with search, import, and enrichment setup |
| `websets.delete` | `exa.api.websets.delete` | `destructive` | Delete a webset [DESTRUCTIVE] |
| `websets.get` | `exa.api.websets.get` | `read` | Get details of a specific webset by its ID |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/exa

## License

Apache-2.0
