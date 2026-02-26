---
name: add-corsair
description: >
  Set up Corsair as a secure, permissioned integration layer for your AI agent.
  Corsair holds your API credentials in an encrypted local database, exposes them
  as MCP tools with a configurable permission system, and routes webhook events
  from external services — all through a single ngrok tunnel.
  No CLI to install. The agent handles everything.
---

# /add-corsair

This skill installs and configures Corsair. After it completes, your agent will have
access to typed, permissioned tools for every integration you enable (GitHub, Slack,
Gmail, Linear, and more). Credentials never leave your machine. The agent never sees
raw API keys or tokens.

---

## Phase 1: Pre-flight

Before making any changes, check the current state of the installation.

1. Check whether `corsair.ts` exists in any of these locations:
   `corsair.ts`, `src/corsair.ts`, `app/corsair.ts`, `server/corsair.ts`

2. Check whether `.mcp.json` already has a `"corsair"` entry.

3. Check whether `.corsair/config.json` already exists.

4. If `corsair.ts` already exists and `.mcp.json` already has a Corsair entry, ask the
   user whether they want to re-run setup or just add a new plugin. Do not proceed with
   a full install if Corsair is already configured.

5. Ask the user which integrations they want to enable. Show this list:
   - GitHub — issues, pull requests, repositories, releases, workflows
   - Slack — messages, channels, users, files
   - Gmail — send, read, draft emails
   - Google Calendar — events, availability
   - Google Drive — files, folders
   - Linear — issues, projects, teams
   - HubSpot — contacts, companies, deals
   - Discord — messages, channels, webhooks
   - Resend — transactional email
   - PostHog — events, feature flags

6. Ask the user which permission mode they want as their default:
   - **cautious** (recommended) — reads and writes always allowed; destructive actions
     like deletes and archives require approval via a review link sent to the user
   - **strict** — reads allowed; writes require approval; destructive actions blocked
   - **open** — everything allowed, no approval prompts (useful for development)
   - **readonly** — reads only, all writes blocked

---

## Phase 2: Create the `.corsair/` directory

Create the `.corsair/` directory at the project root. This directory stores the
encryption key, SQLite database, and runtime state. It must never be committed to git.

Add `.corsair/` to `.gitignore`. If `.gitignore` doesn't exist, create it with:
```
.corsair/
```

If it exists, append `.corsair/` only if it isn't already there.

---

## Phase 3: ngrok setup

Corsair needs a stable public URL for two things: receiving webhook events from external
services (GitHub, Slack, etc.) and hosting the approval review pages it sends the user
when a permissioned action is requested.

Check `.corsair/config.json` for an existing `ngrok.authToken`. If it's already there,
skip to Phase 4.

If there is no auth token:

1. Tell the user:
   > Corsair needs a free ngrok account to receive webhook events and show you approval
   > pages when needed. This is a one-time setup.
   >
   > 1. Go to https://dashboard.ngrok.com/signup and create a free account
   > 2. After signing in, go to https://dashboard.ngrok.com/get-started/your-authtoken
   > 3. Copy your auth token and paste it here

2. Wait for the user to paste the token.

3. Write it to `.corsair/config.json` and set permissions to `0600`:
   ```json
   {
     "ngrok": {
       "authToken": "<token the user pasted>"
     }
   }
   ```

4. Tell the user:
   > Free ngrok accounts include one stable subdomain that doesn't change between
   > restarts. You won't need to reconfigure anything after the first setup.

---

## Phase 4: Create `corsair.ts`

If `corsair.ts` does not exist, create it at the project root. Use only the plugins the
user selected in Phase 1 and the permission mode they chose. The database is passed
explicitly as a `better-sqlite3` instance pointing at `.corsair/data.db`:

```typescript
import { createCorsair, github, slack } from 'corsair';
// import only the plugins the user selected
import Database from 'better-sqlite3';

const db = new Database('.corsair/data.db');

export const corsair = createCorsair({
  database: db,
  approval: {
    timeout: '10m',    // how long the review link stays active
    onTimeout: 'deny', // what happens if the user doesn't respond in time
  },
  plugins: [
    github({ permissions: { mode: 'cautious' } }),
    slack({ permissions: { mode: 'cautious' } }),
    // add other selected plugins here
  ],
});
```

If `corsair.ts` already exists, read it first and add only the new plugins the user
selected, preserving all existing configuration.

---

## Phase 5: Create the MCP bootstrap file and register it

Create `corsair.mcp.js` at the project root. This is the file NanoClaw runs to start
Corsair's MCP server. On startup it creates `.corsair/data.db` if it doesn't exist,
runs migrations, authenticates ngrok, starts the HTTP server, and opens the MCP stdio
connection.

```js
import { startMcpServer } from 'corsair/mcp';
startMcpServer({ config: './corsair.ts' });
```

Add Corsair to `.mcp.json`. If `.mcp.json` doesn't exist, create it. If it exists, add
only the `"corsair"` entry and preserve everything else.

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

Reload MCP connections with `/mcp`. Verify that Corsair appears in the MCP server list
and that `corsair_status` and other tools are visible.

---

## Phase 6: Connect each plugin

For each plugin the user selected, the plugin just needs to be in `corsair.ts` (done in
Phase 4) and have its credential stored. No setup page, no separate tool call. The agent
asks the user for their key directly and stores it with an inline script.

### API key / bot token plugins (Discord, Resend, PostHog, Linear)

Ask the user for their key. For example:
> What's your Linear API key? You can find it at linear.app → Settings → API.

Once they provide it, run an inline script to store it:

```typescript
import { corsair } from './corsair.ts';
await corsair.linear.keys.set_api_key('key-the-user-provided');
```

Verify it was stored:

```typescript
import { corsair } from './corsair.ts';
const key = await corsair.linear.keys.get_api_key();
console.log(key ? 'connected' : 'not connected');
```

If it prints `connected`, confirm to the user: "✓ Linear connected."

### OAuth plugins (GitHub, Slack, Gmail, Google Calendar, Google Drive, HubSpot)

Generate the authorization URL using the ngrok public URL as the redirect:

```typescript
import { corsair } from './corsair.ts';
const url = await corsair.github.getAuthorizationUrl({
  redirectUri: 'https://abc123.ngrok-free.app/corsair/oauth/callback/github',
});
console.log(url);
```

Tell the user:
> Open this link in your browser to connect your GitHub account:
> [printed URL]

Corsair's HTTP server catches the OAuth callback, exchanges the code for tokens, and
stores them encrypted in `.corsair/data.db`. Verify success:

```typescript
import { corsair } from './corsair.ts';
const token = await corsair.github.keys.get_access_token();
console.log(token ? 'connected' : 'not connected');
```

### After each plugin is connected

Corsair automatically registers a webhook with the external service when the MCP server
starts, using the ngrok public URL. Confirm to the user:
> ✓ GitHub connected. Webhook registered. Events from GitHub will now be received and
> synced automatically. Permissions: cautious mode.

---

## Phase 7: Add ongoing agent instructions

This phase is the most important. The agent needs permanent instructions on how to handle
Corsair tool responses. Add the following section to `CLAUDE.md` (create it if it doesn't
exist). Do not remove or overwrite any existing content.

```markdown
## Corsair Integration Layer

All external API calls (GitHub, Slack, Gmail, etc.) go through Corsair MCP tools.
Never attempt to call external APIs directly or ask the user for API keys — Corsair
holds all credentials securely and the agent has no access to them.

### Tool categories

**Action tools** (`github_issues_create`, `slack_messages_send`, etc.) — call external
APIs through Corsair's permission layer. Some may require user approval.

**Data tools** (`github_db_issues_search`, `slack_db_messages_search`, etc.) — query
Corsair's local database of synced data. Always fast, no API calls, no rate limits.
Use these whenever you need to read or search data the user has already interacted with.

**Meta tools**:
- `corsair_status` — see which integrations are connected and their permission modes
- `corsair_list_pending` — show pending approval requests

### Handling Corsair tool responses

**Normal response** — the action completed. Report the result to the user.

**`{ status: "pending_approval" }`** — the action requires the user's approval. When
you receive this:
1. Send the user one message with the review link:
   "⚠️ [description]. Review and approve or deny here: [reviewUrl]
    This link expires at [expiresAt]."
2. Enter needs_input immediately. Do not call any other tools.
3. Wait to be resumed. When resumed, report the outcome.

**`{ status: "denied" }`** — this action is not permitted by the current permission
configuration. Tell the user: "I'm not allowed to [description]. This is blocked by your
Corsair permission settings." Do not retry. To change this, the user can ask you to
update the permissions in corsair.ts.

### Adding or removing integrations

To add a new integration, edit corsair.ts to add the plugin and run /add-plugin.
To remove one, edit corsair.ts to remove the plugin and run /remove-plugin.
To change permission settings for a plugin, edit the permissions config in corsair.ts
directly.

### Destructive actions

Before calling any tool marked [DESTRUCTIVE] in its description, tell the user what
you're about to do and confirm they want to proceed. Corsair will still enforce its own
approval check — this confirmation is in addition to that.
```

---

## Phase 8: Verify

Call `corsair_status`:

```
Tool: corsair_status
```

The response should list each plugin with its connection status and permission mode. Show
this to the user.

Run a low-risk test for each connected plugin. For example, if GitHub is connected:

```
Tool: github_repositories_list
```

If it returns the user's repositories, GitHub is working correctly.

Tell the user:
> ✓ Corsair is set up. Your agent now has secure, permissioned access to [list of plugins].
>
> Credentials are stored encrypted at .corsair/data.db and the agent never sees them.
> Webhook events from [plugins] are being received and synced automatically.
>
> To add another integration, just ask me to add a plugin.
> To change permissions, ask me to update corsair.ts.
> To see what's connected, ask "what integrations do I have?"

---

## Troubleshooting

### MCP tools not visible after Phase 5

Reload MCP with `/mcp`. If Corsair still doesn't appear, check that `corsair.mcp.js`
exists at the project root and that the `.mcp.json` entry points to it correctly.

To verify the MCP server starts manually:
```js
// run this inline to check for startup errors
import { startMcpServer } from 'corsair/mcp';
startMcpServer({ config: './corsair.ts' });
```

### ngrok tunnel failed to start

Read `.corsair/config.json` to verify the auth token is stored correctly. If the token
looks wrong, delete the ngrok entry from the file and redo Phase 3. The file path should
be `.corsair/config.json` at the project root (not in the home directory).

### OAuth callback never received

The callback uses the ngrok public URL. If the user completed authorization but nothing
happened:
1. Verify the MCP server is still running (it runs the HTTP server that catches callbacks)
2. Check `.corsair/state.json` to confirm the ngrok URL is present
3. Have the user call `corsair_setup_start` again to get a fresh link

### Plugin shows "disconnected" in corsair_status

Call `corsair_setup_start({ plugin: '{name}' })` to re-authenticate without affecting
other plugins.

---

## Managing plugins after setup

### Adding an integration

Ask the agent: "Add Linear" or "I want to connect Slack." The agent will:
1. Edit `corsair.ts` to add the plugin to the `plugins` array
2. Ask the user for their API key or walk through OAuth authorization
3. Store the credential with an inline script using `corsair.{plugin}.keys.set_*`
4. Verify with `corsair.{plugin}.keys.get_*` and confirm to the user

### Removing an integration

Ask the agent: "Remove GitHub." The agent will:
1. Confirm with the user before making any changes
2. Remove the plugin from the `plugins` array in `corsair.ts`

That's all that's required. The plugin's credential rows remain in the database but are
inert once the plugin is no longer in the config.

### Changing permission settings

Ask the agent: "Make GitHub strict" or "Don't allow any deletes in Slack." The agent
edits `corsair.ts` directly. The MCP server detects the change and reloads — no restart
needed.

### Checking pending approvals

Ask: "Do I have any pending approvals?" The agent calls `corsair_list_pending` and
shows any actions waiting for a response.

---

## Removal

Ask the agent to remove Corsair. The agent will:

1. Remove the `"corsair"` entry from `.mcp.json`
2. Delete `corsair.ts` and `corsair.mcp.js`
3. Remove the Corsair section from `CLAUDE.md`
4. Delete `.corsair/` with all its contents
5. Reload MCP with `/mcp`

The agent will confirm with the user before deleting `.corsair/` since this permanently
removes all stored credentials and the encryption key.
