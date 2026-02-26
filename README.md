# Corsair

**Your Agent's Integration Infrastructure.**

> Don't do work yourself because you're too scared to hand it off.

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

## How to install it

Corsair is installed by your coding agent. Run this in Claude Code, Cursor, or any agent that supports skills:

```
/add-corsair
```

Your agent will:

1. Ask which integrations you want to connect
2. Ask your preferred permission mode
3. Set up an encrypted local database at `.corsair/data.db`
4. Configure ngrok for webhook callbacks and review pages
5. Register the Corsair MCP server so it has access to the tools
6. Walk you through connecting each integration (OAuth or API key)

You don't need to install a CLI or write any config files by hand. The agent handles the entire setup.

---

## Permission modes

Each integration can have its own permission mode, so you can set GitHub to strict and Slack to cautious based on how much you trust each surface.

| Mode | Reads | Writes | Destructive actions |
|------|-------|--------|---------------------|
| **cautious** _(recommended)_ | Instant | Instant | Approval required |
| **strict** | Instant | Approval required | Blocked |
| **open** | Instant | Instant | Instant |
| **readonly** | Instant | Blocked | Blocked |

To change a setting, tell your agent: _"Make GitHub strict"_ or _"Don't allow any deletes in Slack."_ It edits `corsair.ts` directly and no restart is needed.

---

## Integrations

- **GitHub**: issues, pull requests, repositories, releases, and workflows
- **Slack**: messages, channels, users, and files
- **Gmail**: send, read, and draft emails
- **Google Calendar**: events and availability
- **Google Drive**: files and folders
- **Linear**: issues, projects, and teams
- **HubSpot**: contacts, companies, and deals
- **Discord**: messages, channels, and webhooks
- **Resend**: transactional email
- **PostHog**: events and feature flags

We actively have about 15 more integrations in development that will be released soon. Also ask your coding agent to build a Corsair plugin!

---

## How it works

Corsair runs as an MCP server alongside your coding agent. When your agent calls a tool like `gmail_send` or `github_issues_create`, Corsair checks the action against your permission policy and does one of three things:

- **Executes it immediately**: reads always go through, as do writes in open or cautious mode
- **Pauses and sends a review link**: for anything that exceeds your configured threshold
- **Blocks it outright**: for actions your policy does not allow

API credentials live in an encrypted local SQLite database (`.corsair/data.db`) and never leave your machine. Your agent only sees tool names and results, so it has no access to your tokens, keys, or secrets.

Corsair also registers webhooks with each connected service automatically. Events from GitHub, Slack, and others get synced to your local database in real time, so your agent can query fresh data without making a live API call every time.

---

## For developers

If you're building an application that needs to coordinate multiple integrations across tenants, Corsair also works as a standard TypeScript library:

```typescript
import { createCorsair, github, slack, linear } from 'corsair';
import Database from 'better-sqlite3';

export const corsair = createCorsair({
  database: new Database('.corsair/data.db'),
  plugins: [
    github({ permissions: { mode: 'cautious' } }),
    slack({ permissions: { mode: 'cautious' } }),
    linear({ permissions: { mode: 'open' } }),
  ],
});

// Same syntax across every integration, fully typed
const tenant = corsair.withTenant('tenant_123');
await tenant.slack.api.messages.post({ channel: 'C01234567', text: 'Shipped.' });
await tenant.linear.api.issues.create({ title: 'Follow-up tasks', teamId: 'TEAM_ABC' });
await tenant.resend.api.emails.send({ to: 'user@example.com', subject: 'Welcome!' });
```

Every API response is automatically synced to your local database using four shared tables. You can query with full type safety, write foreign keys directly from your own tables to Corsair's, and get webhooks or polling configured automatically per integration.

```typescript
// Query synced data without making a live API call
const issues = await tenant.linear.db.issues.search({
  where: { state: 'in_progress' },
});

// Write foreign keys directly to Corsair tables
await db.projects.create({
  name: 'New Project',
  linearIssueId: issues[0].id, // stays in sync automatically
});
```

---

## FAQ

<details>
<summary>Where are credentials stored?</summary>

Credentials are stored in an encrypted local SQLite database at `.corsair/data.db` using [envelope encryption](https://docs.cloud.google.com/kms/docs/envelope-encryption). A master key encrypts per-tenant data keys, which encrypt the actual secrets. Nothing leaves your machine. If you'd rather manage keys yourself, you can pass them directly to Corsair and skip its key management entirely.

</details>

<details>
<summary>Does the agent ever see my API keys?</summary>

No. Your agent has access to tool names and their results. Credentials are stored in the encrypted database and Corsair uses them internally when executing calls. The agent cannot read, log, or exfiltrate them.

</details>

<details>
<summary>What happens if I deny an action?</summary>

The action is discarded and nothing is sent, created, or modified. You can follow up with your agent in the same thread to correct course; it will try again with updated parameters and send a new review link.

</details>

<details>
<summary>Do I need to keep something running for the review links to work?</summary>

Yes. The Corsair MCP server (started automatically when your coding agent connects) runs an HTTP server that handles review pages and OAuth callbacks. It uses ngrok to get a stable public URL, which is included in every review link it sends you.

</details>

<details>
<summary>Can I use Corsair with multiple tenants?</summary>

Yes. Enable `multiTenancy: true` and each tenant gets fully isolated credentials, data storage, and permission policies.

</details>

<details>
<summary>Can I use Corsair alongside direct SDK calls?</summary>

Yes. Corsair is a library and an MCP server; use it where it helps and drop down to individual SDKs when you need custom logic.

</details>

<details>
<summary>What happens if an integration's API changes?</summary>

Corsair manages API versioning by mapping version numbers to schemas. This is under active development.

</details>

---

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
