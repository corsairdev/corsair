# @corsair-dev/crowterminal

CrowTerminal plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/crowterminal
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agent.register` | `crowterminal.api.agent.register` | `write` | Self-register an agent and receive a new API key |
| `data.getTypes` | `crowterminal.api.data.getTypes` | `read` | List the analytics data types each platform accepts |
| `data.ingest` | `crowterminal.api.data.ingest` | `write` | Ingest one platform analytics data point |
| `data.ingestBulk` | `crowterminal.api.data.ingestBulk` | `write` | Ingest up to 50 analytics data points at once |
| `intelligence.getByokPlatform` | `crowterminal.api.intelligence.getByokPlatform` | `read` | Get raw algorithm context without LLM inference charges |
| `intelligence.getPlatform` | `crowterminal.api.intelligence.getPlatform` | `read` | Get TikTok, Instagram and YouTube algorithm insights |
| `memory.compareMd` | `crowterminal.api.memory.compareMd` | `read` | Diff an agent markdown against all stored versions |
| `memory.engagementAnalysis` | `crowterminal.api.memory.engagementAnalysis` | `read` | Correlate every agent field with historical engagement |
| `memory.get` | `crowterminal.api.memory.get` | `read` | Get the stored skill for one client |
| `memory.getBulk` | `crowterminal.api.memory.getBulk` | `read` | Read stored skills for up to 50 clients |
| `memory.getChangelog` | `crowterminal.api.memory.getChangelog` | `read` | Read the change history of a client skill |
| `memory.getPattern` | `crowterminal.api.memory.getPattern` | `read` | Trend one skill field across stored versions |
| `memory.validateChanges` | `crowterminal.api.memory.validateChanges` | `read` | Check proposed edits against historical outcomes |
| `sandbox.engagementAnalysis` | `crowterminal.api.sandbox.engagementAnalysis` | `read` | Run a mock engagement analysis |
| `sandbox.getClient` | `crowterminal.api.sandbox.getClient` | `read` | Get mock client data for testing |
| `sandbox.getMemory` | `crowterminal.api.sandbox.getMemory` | `read` | Get mock skill data for testing |
| `sandbox.validate` | `crowterminal.api.sandbox.validate` | `read` | Run a mock validation |
| `status.get` | `crowterminal.api.status.get` | `read` | Get CrowTerminal service health |
| `status.getComponents` | `crowterminal.api.status.getComponents` | `read` | Get per-component health and latency |
| `status.getHistory` | `crowterminal.api.status.getHistory` | `read` | Get seven days of uptime points for charting |
| `status.getIncidents` | `crowterminal.api.status.getIncidents` | `read` | List recent incidents and affected components |
| `status.getUptime` | `crowterminal.api.status.getUptime` | `read` | Get 24h and 7d uptime percentages |
| `status.ping` | `crowterminal.api.status.ping` | `read` | Check that CrowTerminal is responding |
| `webhooks.create` | `crowterminal.api.webhooks.create` | `write` | Register a CrowTerminal webhook |
| `webhooks.delete` | `crowterminal.api.webhooks.delete` | `destructive` | Delete a CrowTerminal webhook |
| `webhooks.list` | `crowterminal.api.webhooks.list` | `read` | List registered CrowTerminal webhooks |
| `webhooks.test` | `crowterminal.api.webhooks.test` | `write` | Send a test delivery to a webhook URL |
| `webhooks.update` | `crowterminal.api.webhooks.update` | `write` | Update a CrowTerminal webhook |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 6 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/crowterminal

## License

Apache-2.0
