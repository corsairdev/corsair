# Corsair

**Your agent's safe integration layer**

> Agents are capable of anything. Take advantage of their potential, safely.

---

AI agents are genuinely capable now. They can research, manage your inbox, write code, and do just about anything else. But giving them the keys to everything feels reckless, because one misunderstood instruction and they're making destructive changes.

So you end up doing the work yourself anyway, because you are afraid of granting access.

Corsair is your agent's integration layer. Connect to 1,000+ apps all from one place. Your agent never sees credentials, and you can enforce a permission layer on any action. 

---

## Why Corsair exists

Integrations in the TypeScript ecosystem are a solved problem in theory, but a nightmare in practice. Every SDK is designed from the perspective of the company that built it, not the developer trying to ship quickly, so each one has its own conventions, its own credential model, and its own way of thinking about webhooks. No-code tools require you to hand over your data, pay, and learn a new interface. Unified API platforms are thin wrappers around an API and you have to scour their docs for a good description of how to integrate. 

I ran into this building an earlier product where different customers wanted different integrations where they worked (Slack, Teams, Gmail), and I couldn't find anything that handled them consistently in my own codebase, with my own data, and under my own control. I wanted strong types so I could learn the API as I used it. I wanted native webhook support to keep data fresh. I wanted credentials and token refresh handled for me natively. It didn't exist, and so I built it.


---

## Use cases

**Startups**: Corsair is mult-tenant by default. If your customers need to integrate to many different sources, use Corsair as a centralized place to write integrations in one paradigm. Your users' credentials and data are automatically partitioned.

**Personal Assistants (🦞)**: Corsair automatically integrates into OpenClaw and NanoClaw. Simply drop-in the skill.md and Corsair opens you up to any integration you can think of.

**Workflow Automation**: Corsair allows any action you can do in a traditional drag-and-drop workflow automation tool in one place. Simply vibe code any workflow across 1,000+ apps.

**RAG**: Corsair stores all data that flows through it, and automatically keeps it fresh through webhooks and polling. Store and vectorize data for context retrieval across all apps in one centralized database. 

---

## What permissions look like

You're away from your computer. You remotely ask your agent to send an email.

```
You: Send Sarah the Q1 numbers from the Financials folder in Drive.
```

Your agent calls the Google Drive tool, thn the Gmail tool. Corsair intercepts the Gmail call, sees it's a send action, and pauses.

```
Agent: I've drafted the email. This action requires your approval before it sends.

  ⚠️ gmail_send → sarah@company.dev
     Subject: "Q1 Numbers"
     "Hi Sarah, here's the breakdown we discussed on the call..."

  Review and approve: https://somepubliclink.com/review/a8f2c1
  Expires in 10 minutes.
```

You open the link and can see all important details. The email is to **.dev** instead of **.com**! Deny the request, follow up with your agent, and tell it what needs to be fixed. Once it updates it, it will send you a new request.


---

## Permission modes

Each integration can have its own permission mode. Set GitHub to strict and Slack to cautious based on how much you trust each surface.

| Mode | Reads | Writes | Destructive actions |
|---|---|---|---|
| **cautious** _(recommended)_ | Instant | Instant | Approval required |
| **strict** | Instant | Approval required | Blocked |
| **open** | Instant | Instant | Instant |
| **readonly** | Instant | Blocked | Blocked |

You can also override individual endpoints:

```typescript
github({
  permissions: {
    mode: 'cautious',
    overrides: {
      'releases.create': 'require_approval',
      'issues.create': 'allow',
    },
  },
})
```

---

## How it works

When your agent calls a Corsair endpoint, Corsair:

1. **Resolves the credential** for that integration from the encrypted database — the agent never sees raw keys or tokens
2. **Checks the permission policy** — reads pass through immediately; writes and destructive actions are evaluated against the configured mode
3. **Executes or pauses** — allowed actions run immediately and return typed results; actions that require approval are held and a review link is sent to you
4. **Handles retries and errors** — rate limits, transient failures, and auth errors are handled automatically with configurable retry strategies

Your agent only ever sees method names and results. It has no way to read, log, or exfiltrate your credentials.

---

## Integrations

- **Slack** — messages, channels, users, files, reactions
- **GitHub** — issues, pull requests, repositories, releases, workflows
- **Gmail** — messages, drafts, labels, threads
- **Google Calendar** — events and availability
- **Google Drive** — files, folders, shared drives
- **Google Sheets** — spreadsheets and rows
- **Linear** — issues, projects, teams, comments
- **HubSpot** — contacts, companies, deals, tickets
- **Resend** — transactional email and domains
- **PostHog** — event ingestion and analytics
- **Tavily** — web search
- **Discord** — messages, channels, webhooks

We actively have about 15 more integrations in development that will be released soon. Also ask your coding agent to build a Corsair plugin!

---

## Using Corsair as a library

```typescript
import { createCorsair } from 'corsair';
import { slack } from 'corsair/plugins/slack';
import { github } from 'corsair/plugins/github';
import { linear } from 'corsair/plugins/linear';

const corsair = createCorsair({
  plugins: [
    github({ permissions: { mode: 'cautious' } }),
    slack({ permissions: { mode: 'cautious' } }),
    linear({ permissions: { mode: 'open' } }),
  ],
  database: { url: process.env.DATABASE_URL! },
  kek: process.env.KEK!,
});

// Fully typed, consistent API surface across every integration
await corsair.slack.api.messages.post({ channel: '#general', text: 'Shipped.' });
await corsair.linear.api.issues.create({ title: 'Follow-up tasks', teamId: 'TEAM_ABC' });
await corsair.github.api.pullRequests.get({ owner: 'acme', repo: 'api', pull_number: 42 });
```

**Multi-tenancy** — scope every call and credential to an individual tenant:

```typescript
const corsair = createCorsair({
  plugins: [slack(), github()],
  database: { url: process.env.DATABASE_URL! },
  kek: process.env.KEK!,
  multiTenancy: true,
});

// Endpoint discovery works at the root — no tenant needed
corsair.get_methods('slack');

// API calls are tenant-scoped
const client = corsair.withTenant('org-456');
await client.slack.api.messages.post({ channel: '#alerts', text: 'Deploy complete.' });
```

---

## Key management

Credentials are stored using envelope encryption. A key-encryption key (KEK) you control encrypts per-tenant data-encryption keys, which encrypt the actual secrets. Nothing leaves your database.

```typescript
// Integration-level keys (shared across tenants — e.g. OAuth client credentials)
await corsair.keys.github.set_api_key('ghp_...');

// Per-tenant keys (account-level secrets like user tokens)
const client = corsair.withTenant('user-123');
await client.github.keys.set_api_key('ghp_...');
```

You can also skip key management entirely and pass credentials directly if you're managing them yourself.

---

## Webhooks

Plugins ship with typed, signature-verified webhook handlers alongside their API endpoints:

```typescript
app.post('/webhooks', async (req, res) => {
  const webhook = corsair.github.webhooks.pullRequests.opened;
  const matched = await webhook.match(req);
  if (matched) {
    const result = await webhook.handler(req);
    // result.data is typed as PullRequestOpenedEvent
  }
});
```

---

## Adding a plugin

```bash
npx tsx templates/plugin/generate.ts MyPlugin
```

Scaffolds a full plugin: Zod input/output schemas, endpoint definitions, webhook handlers, error handlers, key builder, and the `endpointMeta` and `endpointSchemas` maps that power `get_schema()`.

---

## FAQ

<details>
<summary>Where are credentials stored?</summary>

In an encrypted database using [envelope encryption](https://docs.cloud.google.com/kms/docs/envelope-encryption). A KEK you control encrypts per-tenant data keys, which encrypt the actual secrets. If you'd rather manage keys yourself, you can pass them directly and skip the key manager entirely.

</details>

<details>
<summary>Does the agent ever see my API keys?</summary>

No. The agent sees method names and results. Credentials are resolved internally by Corsair at call time. The agent cannot read, log, or exfiltrate them.

</details>

<details>
<summary>What happens if I deny an approval request?</summary>

The action is discarded — nothing is sent, created, or modified. Your agent can try again with corrected parameters and will send a new approval request.

</details>

<details>
<summary>Can I use Corsair with multiple tenants?</summary>

Yes. Set `multiTenancy: true` and each tenant gets isolated credentials, data storage, and permission evaluation. Endpoint discovery (`get_methods`, `get_schema`) is available at the root and doesn't require a tenant.

</details>

<details>
<summary>Can I use Corsair alongside direct SDK calls?</summary>

Yes. Corsair is a library. Use it where the permission layer and key management help you, and drop down to individual SDKs when you need custom logic.

</details>

---

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
