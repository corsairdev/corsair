# Corsair

**Your agent's integration layer, with guardrails built in 🦞**

> Don't do the work yourself because you're too scared to hand it off.

---

AI personal assistants are genuinely capable now. They can draft emails, send messages, and manage your calendar. But giving them the keys to everything feels reckless, because one misunderstood instruction and they're abusing your email, sending calendar invites to strangers, or deleting important files.

So you end up doing the work yourself anyway, because you are afraid of providing the access.

Corsair sits between your agent and your integrations, holding your API credentials in an encrypted local database and enforcing a configurable permission layer on every actiything risky (a send, a delete, a write) gets paused and sent to you as a review link. You approve or deny it, and your agent cannot get around it.

---

## What it looks like

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
