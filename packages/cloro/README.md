# @corsair-dev/cloro

Cloro plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cloro
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `monitor.chatgpt` | `cloro.api.monitor.chatgpt` | `write` | Ask ChatGPT a prompt as a user in a given country and get the structured answer, sources, and shopping cards |
| `monitor.copilot` | `cloro.api.monitor.copilot` | `write` | Ask Microsoft Copilot a prompt in a given country and get the structured answer and sources |
| `monitor.gemini` | `cloro.api.monitor.gemini` | `write` | Ask Google Gemini a prompt in a given country and get the structured answer and sources |
| `monitor.googleAiMode` | `cloro.api.monitor.googleAiMode` | `write` | Ask Google AI Mode a prompt and get the structured answer, sources, places, and products |
| `monitor.googleNews` | `cloro.api.monitor.googleNews` | `write` | Run a Google News search (1-10 pages) and get articles |
| `monitor.googleSearch` | `cloro.api.monitor.googleSearch` | `write` | Run a Google search (1-10 pages) and get organic results, ads, People Also Ask, and the AI Overview |
| `monitor.perplexity` | `cloro.api.monitor.perplexity` | `write` | Ask Perplexity a prompt in a given country and get the structured answer and sources |
| `utility.countries` | `cloro.api.utility.countries` | `read` | List the country codes a monitor engine supports |
| `utility.credits` | `cloro.api.utility.credits` | `read` | Get the remaining cloro credit balance and billing cycle |
| `utility.states` | `cloro.api.utility.states` | `read` | List the US states supported for state-level targeting |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cloro

## License

Apache-2.0
