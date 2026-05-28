---
name: corsair
description: Integrate apps and agents with Gmail, Slack, GitHub, Outlook, and hundreds of other services via Corsair. Use when setting up Corsair for agents or determinstically running operations (like workflow automations or buttons like "Send to Slack").
---

# Corsair

Corsair lets your app integrate with hundreds of services (Gmail, Slack, GitHub, Linear, Google Calendar, and more). Use it from coding agents over MCP, from agent SDKs in your backend, or with direct API execution.

**For full doc index, see [docs.corsair.dev/llms.txt](https://docs.corsair.dev/llms.txt). Fetch doc pages rather than guessing APIs.**

---

## Two ways to use Corsair

| | **Corsair App (hosted)** | **Self-hosted SDK** |
| --- | --- | --- |
| **Best for** | Fastest start, production apps, hosted MCP | Run Corsair in your own process; host all credentials yourself |
| **MCP** | HTTP MCP at `api.corsair.dev` | Self-hosted HTTP MCP or stdio MCP |
| **Package** | `@corsair-dev/app` | Packages in this repo |
| **Dashboard** | [app.corsair.dev](https://app.corsair.dev) | N/A |
| **Docs** | https://docs.corsair.dev/app/home | https://docs.corsair.dev/getting-started/introduction |

**Default to Corsair App (hosted)** unless the user explicitly wants self-hosted.

---

## Setup workflow — Corsair App (hosted, recommended)

Split setup between what only the **user** can do in the browser and what the **agent** should do in code.

### User (browser only)

Tell the user to:

1. Sign up at [app.corsair.dev/api-keys](https://app.corsair.dev/api-keys)
2. Create a **developer API key** and scope it to all instances and copy the secret (shown once)
3. Add it to their env (e.g. `.env` as `CORSAIR_DEV_KEY`)

Do not walk the user through creating instances, plugins, or tenants in the dashboard — the agent handles that via the SDK.

### Agent (do the rest in code)

Once `CORSAIR_DEV_KEY` is set:

1. `npm install @corsair-dev/app`
2. Create **instance** → **upsert plugins** → **create tenant**
3. Call **`t.connectLink.create()`** and send the returned **`url`** to the user so they can connect OAuth accounts and enter API keys for all installed plugins — or use `credentials.set()` / `oauth.authorizeUrl()` when you already have secrets or only need one plugin
4. Create **tenant MCP keys** (`mcpKeys.create()`) and wire MCP config (e.g. `.cursor/mcp.json`)
5. Persist `CORSAIR_INSTANCE_ID`, tenant id, and MCP secrets in env — never commit them

```ts
import { createClient } from "@corsair-dev/app";

const corsair = createClient({ apiKey: process.env.CORSAIR_DEV_KEY! });

const { id } = await corsair.instances.create({ name: "my-app" });
const inst = corsair.instance(id);

await inst.plugins.upsert("slack", { mode: "cautious" });

const tenant = await inst.tenants.create("user-abc");
const t = inst.tenant(tenant.id);

const { url } = await t.connectLink.create();
// Send url to the user to connect their accounts on Corsair

const mcpKey = await t.mcpKeys.create("cursor");
// mcpKey.mcpHttpUrl + mcpKey.secret (shown once) → CORSAIR_MCP_SECRET + MCP URL in agent config
```

Provisioning order: **developer API key → instance → plugin → tenant → connect link (or credentials) → MCP keys / agent config**

Integrations catalog: https://api.corsair.dev/md/integrations

---

## Setup workflow — Self-hosted SDK

Use only when the user needs Corsair in their own process:

1. Read https://docs.corsair.dev/getting-started/introduction
2. Follow https://docs.corsair.dev/getting-started/quick-start
3. Install packages per https://docs.corsair.dev/getting-started/installation
4. Configure plugins: https://docs.corsair.dev/guides/plugins
5. For local coding agents: https://docs.corsair.dev/mcp-adapters/mcp-adapters (stdio MCP, not hosted App)

---

## Get started (Corsair App)

- [Introduction](https://docs.corsair.dev/app/home.md): What Corsair is, agentic vs deterministic usage, install `@corsair-dev/app`
- [Installation](https://docs.corsair.dev/app/installation.md): Client setup and minimal provisioning

```bash
npm install @corsair-dev/app
```

```ts
import { createClient } from "@corsair-dev/app";

const corsair = createClient({ apiKey: process.env.CORSAIR_DEV_KEY! });
```

```ts
const { id } = await corsair.instances.create({ name: "my-app" });
const inst = corsair.instance(id);

await inst.plugins.upsert("slack", { mode: "cautious" });

const tenant = await inst.tenants.create("user-abc");
const { url } = await inst.tenant(tenant.id).connectLink.create();
// Send url to the user to connect their accounts
```

Use instance `id` (not display `name`) in API calls.

---

## Use Corsair in chat (MCP)

Give Cursor, Claude Code, Codex, or any MCP client a tenant-scoped HTTP endpoint.

- [Coding agents overview](https://docs.corsair.dev/app/coding-agents.md): Hosted MCP — URL + bearer token from dashboard
- [Cursor](https://docs.corsair.dev/app/coding-agents/cursor.md): `.cursor/mcp.json` with URL and Authorization header
- [Claude Code](https://docs.corsair.dev/app/coding-agents/claude-code.md): `.mcp.json` or `claude mcp add --transport http`
- [Codex](https://docs.corsair.dev/app/coding-agents/codex.md): Streamable HTTP in Codex UI, CLI, or `~/.codex/config.toml`
- [Antigravity](https://docs.corsair.dev/app/coding-agents/antigravity.md): `~/.gemini/antigravity/mcp_config.json` with `serverUrl`
- [Custom connector](https://docs.corsair.dev/app/coding-agents/custom-connector.md): Any HTTP MCP client — URL + bearer token

Hosted MCP tools include `corsair_setup`, `list_operations`, `get_schema`, `run_script`.

### Cursor example

```json
{
  "mcpServers": {
    "corsair": {
      "url": "https://api.corsair.dev/mcp/YOUR_INSTANCE_ID?tenantId=your-tenant-id",
      "headers": {
        "Authorization": "Bearer ${env:CORSAIR_MCP_SECRET}"
      }
    }
  }
}
```

Set `CORSAIR_MCP_SECRET` to the tenant API key secret. Restart Cursor; verify under Settings → MCP.

Create keys via SDK:

```ts
const key = await corsair
  .instance(process.env.CORSAIR_INSTANCE_ID!)
  .tenant("your-tenant-id")
  .mcpKeys.create("cursor");

console.log(key.mcpHttpUrl);
console.log(key.secret); // shown once
```

---

## Use Corsair in agent SDKs

Wire Corsair into Vercel AI SDK, OpenAI, or Claude Agent SDK from your backend.

- [Agent SDKs overview](https://docs.corsair.dev/app/agent-sdks.md): MCP tools via `tenant.mcp.createVercelClient()` or tenant MCP keys
- [Vercel AI SDK](https://docs.corsair.dev/app/vercel-ai.md): `streamText` / `generateText` with `createVercelClient` or `createVercelAiMcpClient`
- [OpenAI](https://docs.corsair.dev/app/openai.md): Responses API and OpenAI Agents SDK
- [Claude Agent SDK](https://docs.corsair.dev/app/claude.md): `claudeMcpServerConfig` and `query()`

When the backend holds the developer API key, prefer `tenant.mcp.createVercelClient()` — no separate MCP secret:

```bash
npm install @corsair-dev/app ai @ai-sdk/mcp @ai-sdk/openai
```

```ts
import { openai } from "@ai-sdk/openai";
import { createClient } from "@corsair-dev/app";
import { stepCountIs, streamText } from "ai";

const corsair = createClient({ apiKey: process.env.CORSAIR_DEV_KEY! });
const mcpClient = await corsair
  .instance(process.env.CORSAIR_INSTANCE_ID!)
  .tenant("alice")
  .mcp.createVercelClient();

const result = streamText({
  model: openai("gpt-4.1"),
  tools: await mcpClient.tools(),
  stopWhen: stepCountIs(15),
  prompt: message,
});
```

For user-scoped bearer tokens: `mcpKeys.create()` + `createVercelAiMcpClient()`.

---

## Use Corsair in your UI (direct execution)

Call plugin operations from your backend without an agent loop.

- [Direct execution](https://docs.corsair.dev/app/direct-execution.md): `tenant.run()` for deterministic workflows and UI actions

```ts
const t = corsair.instance(process.env.CORSAIR_INSTANCE_ID!).tenant("alice");

await t.run("slack.api.messages.post", {
  channel: "#general",
  text: "Hello from chat",
});
```

Paths use catalog dot notation: `plugin.section.operation` (e.g. `github.api.repositories.star`).

After provisioning, send the user a connect link:

```ts
const { url } = await t.connectLink.create();
// Tell the user: open this URL to connect their accounts
```

Handle missing auth at call time (reactive fallback — same connect page):

```ts
const result = await t.run("gmail.api.messages.list");

if (!result.success) {
  redirect(result.signInLink);
  return;
}

console.log(result.data);
```

| Use case | Use |
| --- | --- |
| Agent picks tools at runtime | Coding agents MCP or Agent SDKs |
| Backend knows exact operation | `tenant.run()` |

---

## Provision and manage (@corsair-dev/app)

Prefer provisioning via the SDK after the user creates a developer API key at [app.corsair.dev/api-keys](https://app.corsair.dev/api-keys). After setup, call `t.connectLink.create()` and send `url` to the user — do not send them to the dashboard to connect accounts. Use the dashboard for debugging only.

- [Instances and plugins](https://docs.corsair.dev/app/instances-and-plugins.md): Create instances, install plugins, permissions, root credentials
- [Tenants and auth](https://docs.corsair.dev/app/tenants-and-auth.md): Tenants, connect links, API keys, OAuth per customer
- [Types and errors](https://docs.corsair.dev/app/types-and-errors.md): Generated types, Zod schemas, `CorsairApiError`

Permission modes: `permissive`, `cautious` (recommended), `strict`.

```ts
await inst.plugins.permissions.setMode("slack", "strict");
await inst.plugins.permissions.setOverride("slack", "api.channels.archive", "deny");
```

Direct execution and MCP both respect instance policies. Denied ops return `CorsairApiError` (403).

---

## Integrations catalog

Full list of available plugins and operations:

- [Integrations](https://api.corsair.dev/md/integrations): Complete Corsair integration catalog (Markdown)

When unsure of operation paths, fetch the catalog rather than guessing.

---

## Self-hosted SDK (optional)

Run Corsair in your own process with the open-source SDK — local MCP, plugins, and database sync.

- [SDK introduction](https://docs.corsair.dev/getting-started/introduction.md)
- [SDK quick start](https://docs.corsair.dev/getting-started/quick-start.md)
- [SDK installation](https://docs.corsair.dev/getting-started/installation.md)
- [Plugins guide](https://docs.corsair.dev/guides/plugins.md)
- [MCP adapters](https://docs.corsair.dev/mcp-adapters/mcp-adapters.md): Local stdio MCP for coding agents (not hosted App)

---

## Safety rules

- Never log or expose tenant API key secrets, OAuth tokens, or plugin credentials
- Agents see tool names and results only — not underlying API keys
- Permission requests must be approved in Corsair; agents cannot bypass them
- Prefer dashboard or env vars for secrets; never commit credentials

---

## Resources

- [Docs home](https://docs.corsair.dev/app/home)
- [LLMs.txt index](https://docs.corsair.dev/llms.txt)
- [Integrations catalog](https://api.corsair.dev/md/integrations)
- [Dashboard](https://app.corsair.dev)
- [GitHub](https://github.com/corsairdev/corsair)
