---
name: corsair
version: 1.0.0
description: >-
  Use your person's own apps through Corsair, an MCP gateway: read and search
  their email, chat, issues, docs and calendar, make changes (send, create,
  update, delete), and set up routines that run on a schedule or when
  something happens in an app. Covers Gmail, Slack, GitHub, Linear, Notion,
  Google Calendar, HubSpot and 700+ more over one MCP URL. Use it when your
  person asks you to do something in one of their apps, to connect an app, to
  automate a recurring task, or to set up Corsair.
---

# Corsair

Corsair gives you your person's apps over one MCP URL. They sign in once and
pick a **link**: a set of their connected apps plus a **mode** that decides
what you may do without asking. Corsair holds every app credential. You never
see a token or an API key, and you never need one.

Latest version of this file: https://corsair.dev/skill.md. If the `version` in
your copy is older, fetch it again and replace your copy.

No person with you to sign in? Follow https://corsair.dev/auth.md instead: it
makes an account with one call and emails your person to claim it.

---

## 1. Is Corsair already connected?

Look for `search` and `list_integrations` (some clients prefix them, e.g.
`mcp__corsair__search`). Every connection has them.

- **They're there:** skip to [Use it](#3-use-it). If `run_script` is missing,
  the client only uses read tools (ChatGPT on personal plans does this): you
  can look things up but not make changes.
- **They're not:** do [Set up](#2-set-up-once).

## 2. Set up (once)

Pick the URL:

- **Your person already has one**, such as `https://yourname.lug.dev/work`
  (they claimed it at https://corsair.dev/start, and it's listed at
  https://hub.corsair.dev/me): use it. Each path (`/work`, `/personal`) is its
  own link with its own apps and mode.
- **They don't, or don't know:** use `https://mcp.corsair.dev/mcp`. Its sign-in
  makes an account if they need one and asks which link to use.

Add the server to the client you're running in, with that URL in place of
`<URL>`. The sign-in belongs to your person: a browser opens, they sign in to
Corsair (Google, GitHub or an emailed link) and allow. Never ask for their
password.

| Client | Add Corsair |
| --- | --- |
| Claude Code | `claude mcp add --transport http corsair <URL>` then `/mcp` to sign in. Add `--scope user` to have it in every project. |
| Codex | `codex mcp add corsair --url <URL>` (signs in on add; if it doesn't, `codex mcp login corsair`) |
| Gemini CLI | `gemini mcp add --transport http corsair <URL>` then `/mcp auth corsair` |
| Cursor | Add `{"mcpServers": {"corsair": {"url": "<URL>"}}}` to `~/.cursor/mcp.json` |
| VS Code | Add `{"servers": {"corsair": {"type": "http", "url": "<URL>"}}}` to `.vscode/mcp.json` |
| Zed | Add `{"context_servers": {"corsair": {"url": "<URL>"}}}` to Zed settings |
| Claude (app) | Tell your person: Customize → Connectors → Add custom connector, name it Corsair, paste the URL, Connect |
| ChatGPT | Tell your person: add a custom MCP server with the URL and choose OAuth. Personal plans get the read tools only, so you can look things up but not make changes |

Steps for 25+ more clients: https://corsair.dev/connect. Any client that
supports remote MCP servers with OAuth works the same way. A client that can't
sign in (GitHub Copilot's coding agent, for example) uses a link's URL with an
API key instead; your person finds both at https://hub.corsair.dev/me.

After adding the server, the tools may only appear in a new session or after a
reload. Tell your person if they need to restart you.

## 3. Use it

The server's own instructions say this too. Follow them when they differ.

| You want to | Call |
| --- | --- |
| Answer a question about their data (newest mail, open issues, a doc, today's meetings) | `search` with the whole question. It usually answers in one call. |
| Read an app `search` doesn't cover, or something that must be live | `read_data` |
| Change something (send, create, update, delete) | `list_operations` with what you want to do, then one `run_script` that does any lookups itself |
| Check exact arguments or return shapes | `get_schema` |
| Wait on a long job a reply names (a crawl, a document parse) | `get_job` with that job |
| Do something later or repeatedly | `update_routine` with your person's words. Include the time zone for schedules ("weekdays at 9am New York time"). |
| See what routines exist and whether they ran | `view_routines` |
| Give an app a file | `upload_file` first, then pass its id wherever the app takes a file URL. Never put a file's bytes in a script. |
| Run a saved job (a morning brief, meeting prep) | `use_skill` by name. `find_skill` searches skills.sh, `save_skill` keeps one for every agent on the link. Starter skills: https://corsair.dev/skills |
| See which apps are on the link | `list_integrations` |
| Use an app that isn't connected | `get_connect_link` (see below) |

Scripts run in a sandbox that can only call your person's connected apps. They
have no network, filesystem or other system access.

Not every link has every tool. A link that can't add apps has no
`get_connect_link`, and a link in Read mode has no `save_skill`.

### Connecting an app

1. Call `get_connect_link` with the app.
2. Give your person the link **exactly as returned** and ask them to tell you
   when they're done.
3. Carry on once they confirm.

Some apps come back ready with no link: they run on Corsair's own account and
each call costs Corsair credits (prices: https://corsair.dev/pricing).

### Approvals and modes

Every action is checked against the link's mode, whatever your client allows:

| Mode | What it allows |
| --- | --- |
| Read | Reads only. Writes are refused. |
| Cautious (default) | Writes go through. Destructive actions (deletes) need approval. |
| Strict | Every write needs approval. Destructive actions are refused. |
| Open | Everything, without asking. |

When a reply says an action needs approval, it includes a link that shows
exactly what will run. Give your person that link and wait for them to approve
or deny it. Then call again with **only that action**, in its own `run_script`:
if the script made other changes before it stopped, running all of it again
makes them twice. One approval covers that one action once. Don't look for
another way to make the same change. If a mode blocks you, tell your person
they can change it at https://hub.corsair.dev/me.

### Replies that need your person

- A reply ending in `Needs you:` lists what's waiting on them. Pass each line
  on with the fix it names.
- A reply that says the fault is on Corsair's side: tell them and stop. Don't
  retry in a loop. `submit_feedback` sends Corsair a note; say that you did.

## 4. Good habits

- Ask before you send, post, delete or set up a routine that acts on its own,
  unless your person already told you to do exactly that.
- Prefer one `search` over many narrow calls. Prefer one `run_script` that does
  its own lookups over a chain of calls. When a change may need approval (any
  delete, or any write on a Strict link), give it a `run_script` of its own.
- Never paste a token, password or API key into a tool call or into chat.
  Corsair already holds the credentials.
- Quote ids and links from replies exactly; later calls take them as given.

## 5. Building an app instead?

If your person is writing their own product and wants Corsair inside it (their
own users connect their own apps), that's the open-source SDK, not this MCP
URL:

```bash
npm install corsair
```

The SDK skill walks an agent from an empty app to a working integration:

```bash
npx skills add corsairdev/corsair
```

The guide is at https://docs.corsair.dev/getting-started/set-up-with-your-agent,
and https://corsair.dev/developers has the plans.
