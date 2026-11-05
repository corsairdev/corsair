# @corsair-dev/agentql

AgentQL plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/agentql
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `browserSessions.createRemoteBrowserSession` | `agentql.api.browserSessions.createRemoteBrowserSession` | `write` | Tool to create a remote browser session. Use when you need to run browser automation on remote infrastructure. |
| `data.query` | `agentql.api.data.query` | `read` | Tool to query structured data as JSON from a web page using an AgentQL query or natural language prompt. Use after defining your query or prompt and a URL or HTML. |
| `data.queryDocument` | `agentql.api.data.queryDocument` | `read` | Tool to extract structured data from PDF or image documents using an AgentQL query or natural language prompt. Accepts a file upload plus query or prompt. |
| `usage.get` | `agentql.api.usage.get` | `read` | Retrieves API usage statistics and subscription limits for the AgentQL account. Returns current billing cycle dates, lifetime usage limits, API key usage counts, and total account usage. Useful for monitoring quota consumption and planning usage. No parameters required - uses the authenticated API key from connection settings. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/agentql

## License

Apache-2.0
