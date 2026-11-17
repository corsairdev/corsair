# @corsair-dev/ngrok

ngrok plugin for Corsair: manage cloud endpoints, reserve custom domains, list tunnels and API keys, and manage event subscriptions.

## Install

```bash
pnpm add @corsair-dev/ngrok
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apiKeys.create` | `ngrok.api.apiKeys.create` | `write` | Mint an API key; the token is returned once in this response and never again, so it must be stored now |
| `apiKeys.delete` | `ngrok.api.apiKeys.delete` | `destructive` | Revoke an API key permanently; anything still using it stops authenticating |
| `apiKeys.list` | `ngrok.api.apiKeys.list` | `read` | List the account’s API keys without their tokens, with owner and creation time |
| `domains.create` | `ngrok.api.domains.create` | `write` | Reserve a hostname and return the CNAME target to point DNS at; certificate issuance starts once it resolves |
| `domains.delete` | `ngrok.api.domains.delete` | `destructive` | Release a reserved domain, which stops it resolving through ngrok; another account can then claim it |
| `domains.get` | `ngrok.api.domains.get` | `read` | Read one reserved domain, including its certificate provisioning status |
| `domains.list` | `ngrok.api.domains.list` | `read` | List reserved domains with their CNAME target and certificate state |
| `domains.update` | `ngrok.api.domains.update` | `write` | Change a reserved domain’s description, certificate, management policy or allowed IPs |
| `endpoints.create` | `ngrok.api.endpoints.create` | `write` | Create a cloud endpoint at a URL you own (e.g. your ngrok dev domain); its required Traffic Policy decides what happens to requests, and it serves immediately |
| `endpoints.delete` | `ngrok.api.endpoints.delete` | `destructive` | Delete a cloud endpoint; its public URL stops resolving and ngrok has no restore call |
| `endpoints.get` | `ngrok.api.endpoints.get` | `read` | Read one cloud endpoint by id |
| `endpoints.list` | `ngrok.api.endpoints.list` | `read` | List cloud endpoints with their public URL, upstream and traffic policy, newest first |
| `endpoints.update` | `ngrok.api.endpoints.update` | `write` | Change an endpoint’s description, metadata, traffic policy or bindings, leaving fields that are omitted alone |
| `events.create` | `ngrok.api.events.create` | `write` | Subscribe to event types and deliver them to existing destination ids, which are created through a separate API |
| `events.delete` | `ngrok.api.events.delete` | `destructive` | Delete an event subscription, which stops those events being delivered |
| `events.get` | `ngrok.api.events.get` | `read` | Read one event subscription by id |
| `events.list` | `ngrok.api.events.list` | `read` | List event subscriptions with their sources and destinations |
| `tunnels.list` | `ngrok.api.tunnels.list` | `read` | List the tunnels open agent sessions and their public URLs |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ngrok

## License

Apache-2.0
