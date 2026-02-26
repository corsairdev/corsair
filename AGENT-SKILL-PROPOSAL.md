# Corsair as a NanoClaw / OpenClaw Drop-In Skill

## Overview

Corsair becomes a drop-in skill for NanoClaw and OpenClaw that gives AI agents secure,
permissioned access to external integrations — without ever exposing credentials to the
agent, and without requiring the user to manage infrastructure beyond a free ngrok account.

The agent interacts with Corsair entirely through MCP. Corsair holds the keys. The agent
holds nothing. There is no separate CLI to install or manage — the agent edits `corsair.ts`
directly for configuration changes, and writes small scripts when it needs to inspect
database state.

```
User (WhatsApp) ──► NanoClaw/OpenClaw ──► Corsair MCP Server ──► External APIs
                                                │
                                          Permission Layer
                                          SQLite (.corsair/data.db)
                                          ngrok tunnel
```

---

## 1. The MCP Server

### What it exposes

The MCP server is the single interface between the agent and all external integrations.
It starts when NanoClaw/OpenClaw starts (via `.mcp.json`) and exposes two categories of
tools.

**Action tools** — call external APIs through Corsair's permission layer. Tool names
follow `{plugin}_{resource}_{action}`:

```
github_issues_list          slack_messages_send         gmail_messages_send
github_issues_create        slack_channels_list         gmail_messages_list
github_issues_update        slack_users_list            gmail_drafts_create
github_pullRequests_list    slack_files_upload
github_repositories_get
github_releases_create
```

**Data tools** — query Corsair's local database of synced external data. These
never make API calls and have no permission checks. They let the agent (and any UI the
user builds) read fresh, structured data without hitting rate limits:

```
github_db_issues_search         slack_db_messages_search
github_db_pullRequests_list     slack_db_channels_list
github_db_repositories_list     gmail_db_messages_list
github_db_releases_list         gmail_db_threads_list
```

Data tools return the same typed shapes as action tools but pull from `corsair_entities`
in SQLite. Webhooks keep this data fresh automatically — when a GitHub issue is updated,
the webhook fires, Corsair processes it, and `corsair_db_issues_search` reflects the
change immediately.

**Meta tools** — always present regardless of plugins:

```
corsair_status          → lists all plugins, connection status, permission mode
corsair_list_pending    → shows pending approval requests with descriptions
```

### What the agent never sees

- API keys, tokens, OAuth credentials of any kind
- The ngrok URL or any internal Corsair endpoint paths
- Approval IDs or tokens (these are embedded in review page URLs sent directly to the user)

### Tool descriptions carry risk metadata

Each tool description tells the agent what to expect:

```
github_repos_delete
  Permanently deletes a GitHub repository and all its contents. [DESTRUCTIVE · IRREVERSIBLE]
  In cautious or strict mode, this call returns pending_approval. The user will receive
  a review link. Do not retry — enter needs_input and wait to be resumed.
```

### The pending_approval response shape

When an action is blocked for approval, the MCP tool returns a structured object:

```json
{
  "status": "pending_approval",
  "description": "Delete GitHub repository me/my-project",
  "reviewUrl": "https://abc123.ngrok-free.app/corsair/review/3f2a1b4c-...?token=x9f2...",
  "expiresAt": "2026-02-25T12:35:00Z"
}
```

One URL, not two. The review page shows the user everything about the action and has
Approve / Deny buttons directly on the page.

---

## 2. The `/add-corsair` Skill

### What a skill is

NanoClaw and OpenClaw both use skills — markdown files that give the agent
step-by-step instructions for a setup task. `/add-corsair` is a skill the user types once
to configure the full Corsair stack. There is no CLI to install. The agent handles
everything: creating files, querying the database with inline scripts, editing `corsair.ts`
for any configuration changes.

### What `/add-corsair` does

**Step 1 — Pre-flight**

Check for existing state: does `corsair.ts` exist, does `.mcp.json` have a `"corsair"`
entry, does `.corsair/config.json` exist. If Corsair is already configured, ask the user
whether to re-run setup or just add a plugin.

Ask the user which integrations they want and which permission mode (`cautious`, `strict`,
`open`, `readonly`).

**Step 2 — Create `.corsair/`**

Create the `.corsair/` directory at the project root if it doesn't exist. Add `.corsair/`
to `.gitignore` — it will contain the KEK and SQLite database, neither of which should
be committed.

**Step 3 — ngrok setup**

Check `.corsair/config.json` for an existing ngrok auth token. If not present, guide the
user to create a free ngrok account and paste their auth token. Write it to
`.corsair/config.json` at mode `0600`.

**Step 4 — Create `corsair.ts`**

Create `corsair.ts` at the project root with only the plugins the user selected. The
database is passed explicitly — for the personal assistant case this is a SQLite instance
pointed at `.corsair/data.db`:

```typescript
import { createCorsair, github, slack } from 'corsair';
import Database from 'better-sqlite3';

const db = new Database('.corsair/data.db');

export const corsair = createCorsair({
  database: db,
  approval: {
    timeout: '10m',
    onTimeout: 'deny',
  },
  plugins: [
    github({ permissions: { mode: 'cautious' } }),
    slack({ permissions: { mode: 'cautious' } }),
  ],
});
```

**Step 5 — Create the MCP bootstrap file and register it**

Create `corsair.mcp.js` at the project root:

```js
import { startMcpServer } from 'corsair/mcp';
startMcpServer({ config: './corsair.ts' });
```

Add Corsair to `.mcp.json`:

```json
{
  "mcpServers": {
    "corsair": {
      "command": "node",
      "args": ["corsair.mcp.js"]
    }
  }
}
```

Reload MCP with `/mcp`. The agent now has Corsair tools.

**Step 6 — Connect each plugin**

For each plugin the user selected, run through credential setup (see Section 3). On first
startup, Corsair auto-creates `.corsair/data.db`, runs migrations, and starts the ngrok
tunnel using the stored auth token.

**Step 7 — Add ongoing agent instructions to `CLAUDE.md`**

See Section 2 of `CORSAIR-SKILL.md` for the exact content. This teaches the agent
permanently how to handle Corsair tool responses.

---

## 3. Plugin Management

All plugin management is done by the agent editing `corsair.ts` and running inline
scripts to verify state. There are no CLI commands.

### Adding a plugin

Adding a plugin is two steps: add it to `corsair.ts`, then store its credential.

**1. Edit `corsair.ts`**

Add the plugin to the `plugins` array. No migrations needed — Corsair's schema handles
any new plugin automatically through the existing four tables.

```typescript
import { createCorsair, github, slack, linear } from 'corsair';
import Database from 'better-sqlite3';

const db = new Database('.corsair/data.db');

export const corsair = createCorsair({
  database: db,
  approval: { timeout: '10m', onTimeout: 'deny' },
  plugins: [
    github({ permissions: { mode: 'cautious' } }),
    slack({ permissions: { mode: 'open' } }),
    linear({ permissions: { mode: 'cautious' } }), // newly added
  ],
});
```

**2. Store the credential**

Ask the user for their key directly. For an API key plugin, the agent just asks:
"What's your Linear API key?" and then stores it with an inline script:

```typescript
import { corsair } from './corsair.ts';
await corsair.linear.keys.set_api_key('key-from-user');
```

For OAuth plugins, the agent generates the authorization URL using the ngrok public URL
as the redirect, tells the user to open it, and Corsair's HTTP server handles the
callback automatically.

**3. Verify**

```typescript
import { corsair } from './corsair.ts';
const key = await corsair.linear.keys.get_api_key();
console.log(key ? 'connected' : 'not connected');
```

### Removing a plugin

Remove it from the `plugins` array in `corsair.ts`. That's it. No deregistration step,
no tool call. The plugin's entries in `corsair_integrations` and `corsair_accounts` remain
in the database but are inert once the plugin is not in the config.

### Changing permissions

Agent edits `corsair.ts` directly. The MCP server watches `corsair.ts` for changes and
reloads — no restart needed. For example, switching GitHub to strict mode:

```typescript
github({ permissions: { mode: 'strict' } }),
```

---

## 4. The Permission System

### Config shape

```typescript
github({
  permissions: {
    // 'open'     → reads: allow, writes: allow, destructive: allow
    // 'cautious' → reads: allow, writes: allow, destructive: require_approval
    // 'strict'   → reads: allow, writes: require_approval, destructive: deny
    // 'readonly' → reads: allow, everything else: deny
    mode: 'cautious',

    // Per-endpoint overrides — keys are strongly typed string literals
    // derived from the plugin's endpoint tree. Typing 'repos.' in an IDE
    // autocompletes to all valid paths: 'repos.delete', 'repos.list', etc.
    overrides: {
      'repos.delete': 'deny',            // never, regardless of mode
      'releases.create': 'require_approval', // escalate beyond mode default
    },
  },
})
```

The `overrides` key type is derived from the plugin's endpoint tree at the TypeScript
level — it's not a plain `Record<string, string>`. The valid keys are all dot-notation
paths through the plugin's nested endpoint structure (`'issues.list'`,
`'issues.create'`, `'repos.delete'`, etc.), so typing `'repos.'` in an editor shows
only the valid completions for that namespace. Passing an invalid path is a type error.

Rate limiting is not part of the permission config — Corsair handles it natively at the
HTTP client layer. The permission system is only concerned with allow / deny /
require_approval.

### How risk levels work

Each endpoint in a plugin carries a `riskLevel` in the plugin's `endpointMeta` map:

```typescript
// inside the github plugin definition
endpointMeta: {
  issuesList:          { riskLevel: 'read' },
  issuesCreate:        { riskLevel: 'write' },
  issuesUpdate:        { riskLevel: 'write' },
  repositoriesDelete:  { riskLevel: 'destructive', irreversible: true },
  releasesCreate:      { riskLevel: 'write' },
  workflowsListRuns:   { riskLevel: 'read' },
}
```

The `mode` maps risk levels to policies:

| mode     | read  | write            | destructive      |
|----------|-------|------------------|------------------|
| open     | allow | allow            | allow            |
| cautious | allow | allow            | require_approval |
| strict   | allow | require_approval | deny             |
| readonly | allow | deny             | deny             |

### How it's implemented

Permission checks are runtime only. When an MCP tool is called, Corsair looks up the
permission config for that endpoint at that moment and evaluates the policy:

- `allow` → proceeds immediately, calls the external API
- `deny` → returns `{ status: 'denied', reason: '...' }` without calling anything
- `require_approval` → stores the pending action in `corsair_permissions`, returns
  `{ status: 'pending_approval', reviewUrl: '...', expiresAt: '...' }`

There is no ahead-of-time compilation or hook generation — the check runs inline when
the tool is invoked.

### The approval flow end-to-end

```
1. Agent calls github_repositories_delete({ owner: 'me', repo: 'test' })

2. Permission hook fires → mode: 'cautious' + riskLevel: 'destructive' → require_approval

3. Corsair stores in corsair_permissions:
   {
     id:           '3f2a1b4c-9d8e-4f1a-b2c3-d4e5f6a7b8c9',  (UUIDv4)
     token:        'a7f3b9c1...',  (32-byte secure random, single-use)
     plugin:       'github',
     endpoint:     'repositoriesDelete',
     args:         '{"owner":"me","repo":"test"}',
     session_id:   'nanoclaw_session_abc',
     callback_url: 'http://localhost:3000/trigger/resume?session=abc',
     status:       'pending',
     expires_at:   '2026-02-25T12:35:00Z'
   }

4. MCP tool returns:
   {
     status:      'pending_approval',
     description: 'Delete GitHub repository me/test (irreversible)',
     reviewUrl:   'https://abc123.ngrok-free.app/corsair/review/3f2a1b4c-...?token=a7f3b9c1...',
     expiresAt:   '2026-02-25T12:35:00Z'
   }

5. Agent sends WhatsApp message:
   "⚠️ I need your approval to delete repo me/test (irreversible).
    Review and decide here: https://abc123.ngrok-free.app/corsair/review/3f2a1b4c-...?token=a7f3b9c1...
    Expires in 10 minutes."
   Then enters needs_input.

6. User taps the link, sees the review page:
   ┌─────────────────────────────────────────┐
   │  ⚠️  Action requires your approval      │
   │                                         │
   │  Delete GitHub Repository               │
   │  ─────────────────────────────          │
   │  Repository:   me/test                  │
   │  Stars:        42                       │
   │  Last commit:  2 days ago               │
   │  Description:  My test project          │
   │                                         │
   │  ⚠️ This action is irreversible.        │
   │                                         │
   │  [  ✅ Approve  ]  [  ❌ Deny  ]        │
   │                                         │
   │  Expires at 12:35 PM                    │
   └─────────────────────────────────────────┘

7. User clicks Approve.

8. POST to Corsair HTTP server (via ngrok).
   Corsair validates: token exists, unused, not expired.
   Marks token used, marks action approved.
   Executes repositoriesDelete with stored args.
   POSTs result to callback_url.

9. NanoClaw receives POST → /trigger/resume → agent resumes:
   "Done. Repository me/test has been deleted."
```

### The review page

Corsair's HTTP server serves a static HTML page for each pending approval. The page is
rendered server-side per action type, showing the full context relevant to that specific
operation:

- **Email send** (Gmail): To, CC, Subject, full body preview
- **Message send** (Slack): Channel name, full message text, any attachments
- **Repository delete** (GitHub): Repo name, description, star count, last commit date
- **Issue close** (GitHub/Linear): Issue title, current status, assignee, linked PRs
- **Calendar event delete**: Event title, date, attendees
- **Release create** (GitHub): Tag name, release notes preview, target branch

Each action type has its own template. Corsair fetches additional context (star count,
last commit, etc.) at review page render time using the stored credentials, so the user
sees the full picture before deciding.

---

## 5. The Webhook System

### Purpose

When a plugin has webhooks configured, Corsair registers a public URL with the external
service so events flow in automatically. This keeps `corsair_entities` (the local data
store) fresh and lets the agent react to external events.

### ngrok as the webhook gateway

```
GitHub/Slack/etc. ──► https://abc123.ngrok-free.app/webhooks/{plugin}
                              │
                           ngrok tunnel
                              │
                       http://localhost:{PORT}/webhooks/{plugin}
                              │
                     Corsair HTTP server
                              │
               signature verification + entity sync + event log
```

The same ngrok tunnel serves three purposes: inbound webhooks, OAuth callbacks during
plugin setup, and approval review pages. One tunnel, one stable URL.

### Webhook registration

On MCP server startup:

1. Starts the HTTP server on a local port
2. Authenticates and starts ngrok with the stored auth token; gets the stable public URL
3. Compares the current ngrok URL against the last-registered URL stored in
   `.corsair/state.json` for each plugin
4. If the URL is new or changed, calls the plugin's API to register or update the webhook
   endpoint (GitHub API, Slack API, etc.)
5. Writes the registered URL to `.corsair/state.json`

With a free ngrok account, the subdomain is persistent — re-registration only happens
once, on the very first start.

### Webhook processing

`bindWebhooksRecursively` already handles the core flow. The HTTP server routes
`POST /webhooks/{plugin}` through the plugin's `pluginWebhookMatcher`, verifies the
signature, and calls the handler. The handler stores updated data in `corsair_entities`,
so data tools return fresh results immediately after.

---

## 6. The `.corsair/` Directory and SQLite Database

### Location

`.corsair/` lives at the project root, next to `corsair.ts`. It is always gitignored.

```
my-project/
├── corsair.ts          ← plugin config, committed to git
├── corsair.mcp.js      ← MCP bootstrap, committed to git
├── .mcp.json           ← MCP server registration, committed to git
├── .corsair/           ← gitignored
│   ├── config.json     ← KEK, ngrok auth token
│   ├── data.db         ← SQLite database
│   └── state.json      ← runtime state (ports, registered webhook URLs)
└── .gitignore          ← includes .corsair/
```

### `.corsair/config.json`

```json
{
  "kek": "base64-encoded-32-byte-key",
  "ngrok": {
    "authToken": "...",
    "publicUrl": "https://abc123.ngrok-free.app"
  }
}
```

File permissions: `0600`. Generated on first start if missing.

### `.corsair/state.json`

```json
{
  "httpPort": 3742,
  "publicUrl": "https://abc123.ngrok-free.app",
  "webhooksRegistered": {
    "github": "https://abc123.ngrok-free.app/webhooks/github",
    "slack":  "https://abc123.ngrok-free.app/webhooks/slack"
  }
}
```

### SQLite schema

Uses the Kysely SQLite dialect. The `db/kysely/sqlite.ts` file with JSON extraction
helpers already exists in the codebase.

**`corsair_integrations`** — one row per plugin. Encrypted integration-level config
(OAuth client ID/secret) + DEK.

**`corsair_accounts`** — one row per plugin in skill mode (effectively single-tenant,
tenant_id = `'local'`). Encrypted account-level tokens (access token, refresh token,
API key, etc.) + DEK.

**`corsair_entities`** — synced external data. One row per external object (issue, PR,
channel, email thread, etc.). Powers the data tools and kept fresh by webhooks.

**`corsair_events`** — append-only audit log. Every tool call writes a row regardless of
outcome. Queryable by the agent for debugging or building dashboards.

**`corsair_permissions`** *(new)* — the approval queue.

```sql
CREATE TABLE corsair_permissions (
  id           TEXT PRIMARY KEY,       -- UUIDv4
  token        TEXT NOT NULL UNIQUE,   -- 32-byte secure random, single-use
  plugin       TEXT NOT NULL,          -- 'github'
  endpoint     TEXT NOT NULL,          -- 'repositoriesDelete'
  args         TEXT NOT NULL,          -- JSON-encoded args
  session_id   TEXT,                   -- NanoClaw/OpenClaw session identifier
  callback_url TEXT,                   -- /trigger/resume URL
  review_url   TEXT,                   -- full ngrok review page URL
  status       TEXT DEFAULT 'pending', -- pending | approved | denied | expired
  expires_at   TEXT NOT NULL,          -- ISO8601
  created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Key storage

Envelope encryption, same as existing Corsair SaaS mode:
- KEK stored in `.corsair/config.json` (generated on first run; can be overridden with
  `CORSAIR_KEK` env var for KMS-backed setups)
- Unique DEK per plugin, stored encrypted in `corsair_integrations.dek`
- All credentials encrypted with DEK in `corsair_integrations.config` and
  `corsair_accounts.config`

---

## What changes in the existing codebase

| Area | Change |
|------|--------|
| `core/plugins/index.ts` | Add `endpointMeta` field to `CorsairPlugin` with `riskLevel` per endpoint |
| `core/endpoints/bind.ts` | Auto-generate permission `before` hook from plugin permission config |
| `core/index.ts` | Add `approval` config field to `CorsairIntegration` |
| `db/index.ts` | Wire Kysely SQLite dialect; default DB path to `.corsair/data.db` |
| All plugin `index.ts` files | Add `permissions` option and `endpointMeta` map |
| Package imports | All plugins re-exported from root `'corsair'` package |
| New: `mcp/` | MCP server — action tools, data tools, meta tools, pending_approval shape |
| New: `http/` | HTTP server — webhooks, OAuth callbacks, review pages, approve/deny handlers |
| New: `http/review/` | Per-plugin HTML templates for the approval review page |
| New: `db/migrations/` | Migration adding `corsair_permissions` table |
