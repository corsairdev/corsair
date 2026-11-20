# @corsair-dev/linkup

Linkup plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/linkup
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `answers.get` | `linkup.api.answers.get` | `read` | Search the web and return a written answer with its sources ($0.006; deep $0.055). |
| `credits.get` | `linkup.api.credits.get` | `read` | Get the account's remaining credit balance in dollars. |
| `pages.fetch` | `linkup.api.pages.fetch` | `read` | Fetch one web page or PDF as markdown, optionally with typed data from a schema ($0.001 to $0.011). |
| `research.create` | `linkup.api.research.create` | `destructive` | Start a multi-step research task ($0.25 to $2.50 by reasoningDepth). Poll research.get for the result. |
| `research.get` | `linkup.api.research.get` | `read` | Get a research task: status, and the answer or structured data once completed. |
| `research.list` | `linkup.api.research.list` | `read` | List research tasks, newest or oldest first, paged. |
| `responses.create` | `linkup.api.responses.create` | `destructive` | Generate an answer grounded in live web results (OpenAI Responses format). Paid generation. |
| `search.run` | `linkup.api.search.run` | `read` | Search the web and return results with their text content ($0.005 a call; deep $0.05). Filter by date and domain. |
| `search.structured` | `linkup.api.search.structured` | `read` | Search the web and return JSON shaped by your JSON Schema, optionally with sources ($0.006; deep $0.055). |
| `tasks.create` | `linkup.api.tasks.create` | `destructive` | Queue up to 100 search, fetch or research calls to run in the background, each billed like the direct call. Poll tasks.get. |
| `tasks.get` | `linkup.api.tasks.get` | `read` | Get one background task with its status and output. |
| `tasks.list` | `linkup.api.tasks.list` | `read` | List background tasks, filtered by type and status, paged, with the in-flight quota. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/linkup

## License

Apache-2.0
