# @corsair-dev/fluxguard

Fluxguard plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/fluxguard
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `fluxguard.api.account.get` | `read` | Get the organisation account: plan, credits, site count and flags |
| `categories.create` | `fluxguard.api.categories.create` | `write` | Create a site category; sites are assigned to it in the Fluxguard console |
| `categories.list` | `fluxguard.api.categories.list` | `read` | List the site categories change notifications can be limited to |
| `monitoring.addPage` | `fluxguard.api.monitoring.addPage` | `write` | Add a URL for monitoring, creating a site and session when none is given |
| `monitoring.deletePage` | `fluxguard.api.monitoring.deletePage` | `destructive` | Stop monitoring a page: Fluxguard hides it and everything captured for it, and the id still resolves with status ignore |
| `monitoring.deleteSite` | `fluxguard.api.monitoring.deleteSite` | `destructive` | Delete a site with all of its sessions, pages and captured versions |
| `monitoring.getPage` | `fluxguard.api.monitoring.getPage` | `read` | Get one monitored page with its version counts and categories |
| `monitoring.startCrawl` | `fluxguard.api.monitoring.startCrawl` | `write` | Start capturing a session now; the capture runs in the background and spends account credits |
| `webhooks.create` | `fluxguard.api.webhooks.create` | `write` | Add a webhook URL. Every later change event is POSTed to it, so a live URL starts receiving data immediately |
| `webhooks.delete` | `fluxguard.api.webhooks.delete` | `destructive` | Remove a webhook so its URL stops receiving change events |
| `webhooks.list` | `fluxguard.api.webhooks.list` | `read` | List the webhook URLs change events are posted to |
| `webhooks.sample` | `fluxguard.api.webhooks.sample` | `read` | Get a sample delivery built from this account, to inspect the payload shape |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/fluxguard

## License

Apache-2.0
