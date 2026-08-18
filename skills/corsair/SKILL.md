---
name: corsair
description: Integrate apps and agents with Gmail, Slack, GitHub, Outlook, and hundreds of other services via Corsair. Use when setting up Corsair for agents or deterministically running operations (like workflow automations or buttons like "Send to Slack").
---

# Corsair

**Canonical setup (Corsair App):** fetch and follow [Agent setup](https://docs.corsair.dev/app/agent-setup.md) end-to-end. Do not guess APIs — use that page and the links it provides.

## Pick the shape first

Almost every Corsair app is one of four shapes, or a combination. Fetch the matching page(s) before writing code — each one covers the pattern, the guardrails, and a checklist. Start from [Use cases](https://docs.corsair.dev/use-cases/overview.md) if the ask spans more than one.

| The user wants… | Read |
| --- | --- |
| A page listing data ("show me my open PRs") | [Dashboard](https://docs.corsair.dev/use-cases/dashboards.md) |
| To instruct it in prose ("a chatbot that can close issues") | [Agent](https://docs.corsair.dev/use-cases/agents.md) |
| To ask questions across synced data | [Knowledge base](https://docs.corsair.dev/use-cases/knowledge-base.md) |
| "When X happens, do Y" automation | [Workflow](https://docs.corsair.dev/use-cases/workflows.md) |

Combining shapes (e.g. a dashboard **and** a chatbot) means one `createCorsair` call, one handler route, and one connection per tenant — never a second Corsair instance per feature.

- **Doc index:** [docs.corsair.dev/llms.txt](https://docs.corsair.dev/llms.txt)
- **Integrations catalog (paths + schemas):** [api.corsair.dev/md/integrations](https://api.corsair.dev/md/integrations)
- **Human intro:** [Introduction](https://docs.corsair.dev/app/home.md)
- **Dashboard:** [app.corsair.dev](https://app.corsair.dev)

**Default to Corsair App (hosted)** unless the user explicitly wants self-hosted → [SDK introduction](https://docs.corsair.dev/getting-started/introduction.md).
