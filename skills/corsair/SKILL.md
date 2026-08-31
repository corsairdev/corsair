---
name: corsair
description: Integrate apps and agents with Gmail, Slack, GitHub, Outlook, and hundreds of other services via Corsair. Use when setting up Corsair for agents or deterministically running operations (like workflow automations or buttons like "Send to Slack").
---

# Corsair

Corsair is an open-source SDK that runs in your own app and connects you — or your users — to hundreds of services (Gmail, Slack, GitHub, Linear, and more). It handles OAuth, token refresh, webhooks, and rate limits, and stores every credential encrypted in your own database. **Corsair Hub** is the hosted relay for the surfaces that need a public URL — OAuth connect pages, callbacks, and approvals — and stores none of your credentials.

**Setting up a new app?** Use the **`corsair-hub`** skill. It covers the install, the `/api/corsair` route, keys, first-run self-registration, and connecting accounts end to end. Don't guess the API — follow [hub/setup](https://docs.corsair.dev/hub/setup.md).

**Already wired and just running operations?** Look up the plugin's paths and schemas in the catalog, then call `corsair.<plugin>.api.<…>` — or expose them to an agent over [MCP](https://docs.corsair.dev/mcp-adapters/mcp-adapters.md).

- **Doc index:** [docs.corsair.dev/llms.txt](https://docs.corsair.dev/llms.txt)
- **Integrations catalog (paths + schemas):** [api.corsair.dev/md/integrations](https://api.corsair.dev/md/integrations)
- **Introduction:** [docs.corsair.dev/introduction](https://docs.corsair.dev/introduction.md)
- **Dashboard & keys:** [hub.corsair.dev/dashboard](https://hub.corsair.dev/dashboard)

Fully self-hosted with no Hub relay (you host the OAuth and approval URLs yourself)? → [SDK introduction](https://docs.corsair.dev/introduction.md).
