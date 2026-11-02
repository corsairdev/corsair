---
name: corsair
version: 0.1.0
description: >-
  Use the user's own apps through Corsair: read and search their email, chat,
  issues, docs and calendar, make changes (send, create, update, delete), and
  set up routines that run on a schedule or when something happens in an app.
  Covers Gmail, Slack, GitHub, Linear, Notion, Google Calendar, HubSpot and
  hundreds more over one MCP address. Use it when the user asks you to do
  something in one of their apps, to connect an app, to automate a recurring
  task, or to set up Corsair.
---

# Corsair

Corsair gives you the user's apps over one MCP server:

```
https://mcp.corsair.dev/mcp
```

The user signs in once and picks a **link**: a set of their connected apps plus a
**mode** that decides what you may do without asking. Corsair holds every app
credential. You never see a token or an API key, and you never need one.

Latest version of this file: https://corsair.dev/skill.md. If the `version` in
your copy is older, fetch it again and replace your copy.

---

## 1. Is Corsair already connected?

Look for these tools (some clients prefix them, e.g. `mcp__corsair__search`):
`list_integrations`, `search`, `list_operations`, `run_script`.

- **They're there:** skip to [Use it](#3-use-it).
- **They're not:** do [Set up](#2-set-up-once).

## 2. Set up (once)

Add the server to the client you're running in. The sign-in step belongs to
the user: a browser opens, they sign in to Corsair (Google, GitHub or an emailed
link; this also creates an account), pick or make a link, and allow. Never ask
for their password.

| Client | Add Corsair |
| --- | --- |
| Claude Code | `claude mcp add --transport http corsair https://mcp.corsair.dev/mcp` then `/mcp` to sign in. Add `--scope user` to have it in every project. |
| Codex | `codex mcp add corsair --url https://mcp.corsair.dev/mcp` (signs in on add; if it doesn't, `codex mcp login corsair`) |
| Gemini CLI | `gemini mcp add --transport http corsair https://mcp.corsair.dev/mcp` then `/mcp auth corsair` |
| Cursor | Add `{"mcpServers": {"corsair": {"url": "https://mcp.corsair.dev/mcp"}}}` to `~/.cursor/mcp.json` |
| VS Code | Add `{"servers": {"corsair": {"type": "http", "url": "https://mcp.corsair.dev/mcp"}}}` to `.vscode/mcp.json` |
| Zed | Add `{"context_servers": {"corsair": {"url": "https://mcp.corsair.dev/mcp"}}}` to Zed settings |
| Claude (app) | Tell the user: Customize → Connectors → Add custom connector, name it Corsair, paste the address, Connect |
| ChatGPT | Tell the user: add a custom MCP server with the address and choose OAuth. Personal plans get the read tools only, so you can look things up but not make changes |

Any other client that supports remote MCP servers with OAuth works the same way.
A client that can't sign in (GitHub Copilot's coding agent, for example) uses a
link's own address with an API key instead; the user finds both at
https://hub.corsair.dev/me.

After adding the server, the tools may only appear in a new session or after a
reload. Tell the user if they need to restart you.

## 3. Use it

The server's own instructions say this too. Follow them when they differ.

| You want to | Call |
| --- | --- |
| Answer a question about their data (newest mail, open issues, a doc, today's meetings) | `search` with the whole question. It usually answers in one call. |
| Read an app `search` doesn't cover, or something that must be live | The `read_data` snippet the `search` reply hands back, or `list_operations` then `read_data` |
| Change something (send, create, update, delete) | `list_operations` with what you want to do, then one `run_script` that does any lookups itself |
| Check exact arguments or return shapes | `get_schema` |
| Wait on a long job the reply names (a crawl, a document parse) | `get_job` with that job |
| Do something later or repeatedly | `update_routine` with the user's words. Include the time zone for schedules ("weekdays at 9am New York time"). |
| See what routines exist and whether they ran | `view_routines` |
| See which apps are on the link | `list_integrations` |
| Use an app that isn't connected | `get_connect_link` (see below) |

Scripts run in a sandbox that can only call the user's connected apps. They have
no network, filesystem or other system access.

Not every link has every tool. A read-only link has no `run_script`; a link that
can't add apps has no `get_connect_link`.

### Connecting an app

1. Call `get_connect_link` with the app.
2. Give the user the link **exactly as returned** and ask them to tell you when
   they're done.
3. Carry on once they confirm.

Some apps come back ready with no link: Corsair calls them with its own key and
bills each call to the user's Corsair credits (Firecrawl, Exa, Apollo, Reducto,
TinyFish, Context.dev, DataForSEO and a few more). A call that fails is refunded.

### Approvals and modes

Every action is checked against the link's mode, whatever your client allows:

| Mode | What it allows |
| --- | --- |
| Read | Reads only. Writes are refused. |
| Cautious (default) | Writes go through. Destructive actions (deletes) need approval. |
| Strict | Every write needs approval. Destructive actions are refused. |
| Open | Everything, without asking. |

When a reply says an action needs approval, it includes a link that shows exactly
what will run. Give the user that link, wait for them to approve or deny it, then
call again. One approval covers that one action once. Don't look for another way
to make the same change. If a mode blocks you, tell the user they can change it
at https://hub.corsair.dev/me.

### Replies that need the user

- A reply ending in `Needs you:` lists what's waiting on the user. Pass each line
  on with the fix it names.
- A reply that says the fault is on Corsair's side: tell the user and stop.
  Don't retry in a loop.

## 4. Good habits

- Ask before you send, post, delete or set up a routine that acts on its own,
  unless the user already told you to do exactly that.
- Prefer one `search` over many narrow calls. Prefer one `run_script` that does
  its own lookups over a chain of calls.
- Never paste a token, password or API key into a tool call or into chat.
  Corsair already holds the credentials.
- Quote ids and links from replies exactly; later calls take them as given.

## 5. Building an app instead?

If the user is writing their own product and wants Corsair inside it (their own
users connect their own apps), that's the open-source SDK, not this MCP server:

```bash
npm install corsair
```

Start at https://docs.corsair.dev/getting-started/set-up-with-your-agent. The
`@corsair-dev/cli` package sets up the database, credentials and OAuth for an
SDK project, with JSON output on every command.

## Links

- Docs for this server: https://docs.corsair.dev/cloud/mcp
- Links, modes and connected apps: https://hub.corsair.dev/me
- A personal address (yourname.lug.dev): https://lug.dev
- Every app Corsair supports: https://corsair.dev/integrations
- Agent index: https://corsair.dev/llms.txt
