# @corsair-dev/agentmail

AgentMail plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/agentmail
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `messages.get` | `agentmail.api.messages.get` | `read` | Retrieve the complete details of an AgentMail message |
| `messages.list` | `agentmail.api.messages.list` | `read` | List messages from an AgentMail inbox |
| `messages.send` | `agentmail.api.messages.send` | `write` | Send an email using AgentMail |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/agentmail

## License

Apache-2.0
