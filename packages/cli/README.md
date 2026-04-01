# @corsair-dev/cli

The Corsair CLI handles everything needed to get a Corsair instance running: database setup, credential storage, and OAuth token acquisition. The intention is that a developer (or an agent) can go from a blank project to a fully authorized integration with a minimal number of commands, without ever needing to manually touch a database or manage encryption keys.

All output is JSON, so both humans and agents can consume it the same way.

---

## Installation

The CLI is included when you install `corsair`:

```bash
pnpm add corsair @corsair-dev/cli
```

The `corsair` binary is available immediately after install via `pnpm exec corsair <command>` or `npx corsair <command>`. No additional configuration needed.

---

## Commands

### `corsair setup`

Initializes your Corsair instance. Run this once after adding Corsair to your project, and again whenever you add new plugins.

What it does:
1. Verifies all required database tables exist
2. Creates integration and account rows for each plugin
3. Generates and stores Data Encryption Keys (DEKs)
4. Reports which credentials are missing and how to set them

```bash
npx corsair setup
```

You can pass credentials inline to skip the manual step afterward:

```bash
npx corsair setup --slack api_key=xoxb-... --linear api_key=lin_api_...
```

Multiple plugins and fields can be set in one command:

```bash
npx corsair setup \
  --slack api_key=xoxb-... \
  --gmail client_id=... client_secret=...
```

#### Flags

| Flag | Description |
|------|-------------|
| `--<plugin> <field>=<value>` | Set one or more credentials for a plugin |
| `--backfill` | After setup, run list endpoints to pull initial data into the database |

---

### `corsair auth`

Handles OAuth token acquisition. For plugins that use `oauth_2`, this command drives the full authorization flow and saves the resulting tokens.

All output is JSON. The command never opens an interactive prompt.

#### Get an OAuth URL

```bash
npx corsair auth --plugin=gmail
```

For providers that support localhost redirects (Google, etc.), the CLI starts a local server, outputs the auth URL, and waits. Once the user authorizes in the browser, the callback is captured and tokens are saved automatically:

```json
{ "status": "pending_oauth", "authUrl": "https://accounts.google.com/...", "redirectUri": "http://localhost:54321", "plugin": "gmail", "tenant": "default", "note": "Open authUrl in a browser. Tokens will be saved automatically once authorized." }
```

For providers that require a pre-registered redirect URI (Spotify, etc.), the URL is returned and the user must paste the code back manually:

```json
{ "status": "needs_code", "authUrl": "https://accounts.spotify.com/...", "redirectUri": "https://your-app.com/callback", "plugin": "spotify", "tenant": "default", "note": "Open authUrl, complete auth, then run: corsair auth --plugin=<id> --code=CODE" }
```

#### Exchange a code

```bash
npx corsair auth --plugin=spotify --code=AQD3...
```

```json
{ "status": "success", "plugin": "spotify", "tenant": "default" }
```

#### Check current credentials

```bash
npx corsair auth --plugin=gmail --credentials
```

```json
{
  "plugin": "gmail",
  "tenant": "default",
  "credentials": {
    "client_id": "12345....com",
    "client_secret": "***",
    "access_token": "ya29.A...abc",
    "refresh_token": "1//0g...xyz",
    "expires_at": "1234567890000"
  }
}
```

Values are masked in output (`first6...last3`).

#### Flags

| Flag | Description |
|------|-------------|
| `--plugin=<id>` | Required. The plugin to authorize |
| `--tenant=<id>` | Tenant to authorize for. Defaults to `default` |
| `--code=<code>` | Exchange an authorization code for tokens directly |
| `--credentials` | Print current credential status instead of starting the OAuth flow |

---

### `corsair watch-renew`

Renews Google webhook watch subscriptions (Gmail, Drive, Calendar). Google watch subscriptions expire after 7 days — run this on a schedule to keep them active.

```bash
npx corsair watch-renew
```

---

## Typical setup flow

### API key plugin (e.g. Slack, Linear)

```bash
# 1. Initialize
npx corsair setup

# 2. Set the credential (from setup output guidance, or inline)
npx corsair setup --slack api_key=xoxb-...
```

### OAuth plugin (e.g. Gmail, Spotify)

```bash
# 1. Initialize and set OAuth app credentials
npx corsair setup --gmail client_id=... client_secret=...

# 2. Complete the OAuth flow
npx corsair auth --plugin=gmail
# → outputs auth URL, browser opens, tokens saved automatically
```

For providers with registered redirects:

```bash
npx corsair setup --spotify client_id=... client_secret=... redirect_url=https://your-app.com/callback
npx corsair auth --plugin=spotify
# → outputs auth URL + instructions
npx corsair auth --plugin=spotify --code=AQD3...
```

---

## Agent usage

Because all output is JSON and no interactive prompts are used, the CLI is designed to be driven by an agent. A typical agent flow:

```bash
# Check what's missing
npx corsair setup

# Set credentials the agent obtained
npx corsair setup --gmail client_id=... client_secret=...

# Get the OAuth URL to show the user
npx corsair auth --plugin=gmail
# → parse authUrl from JSON, show to user or open browser

# After user authorizes (for localhost-redirect providers, this is automatic)
# For registered-redirect providers, exchange the code:
npx corsair auth --plugin=gmail --code=<code from redirect>

# Verify
npx corsair auth --plugin=gmail --credentials
```

---

## How credentials are stored

Credentials are encrypted at rest using envelope encryption:

- A Key Encryption Key (KEK) is provided by you via `CORSAIR_KEK` in your environment
- Each plugin gets a Data Encryption Key (DEK) at the integration level (shared credentials like OAuth client ID/secret) and at the account level (per-tenant credentials like access tokens)
- DEKs are encrypted with the KEK and stored in the database; individual fields are encrypted with the DEK

The CLI manages DEK provisioning automatically during `setup` and `auth`. You only need to provide the KEK.

---

## Where the CLI looks for your `corsair.ts`

The CLI searches these paths relative to your working directory:

```
corsair.ts / corsair.js
src/corsair.ts
src/server/corsair.ts
server/corsair.ts
lib/corsair.ts
app/corsair.ts
corsair/index.ts
```

Export your instance as a named export `corsair` or as the default export:

```ts
// src/server/corsair.ts
export const corsair = createCorsair({ ... });
```
