# Plugin documentation structure

This document defines the **standard layout and contents** for Corsair integration docs. It matches the quality bar set by the Slack plugin and scales to every plugin with **four MDX pages per plugin**.

Use `<plugin>` as the URL slug (e.g. `slack`, `linear`). Published routes look like `/plugins/<plugin>/…`.

---

## File tree

Each plugin lives under `docs/plugins/<plugin>/`:

```text
docs/plugins/<plugin>/
├── overview.mdx          # Hub: overview, setup, auth, quickstarts, links to reference
├── api.mdx               # Deterministic reference: all API operations, inputs, outputs
├── webhooks.mdx          # Deterministic reference: events, payloads, handler I/O
└── database.mdx          # Deterministic reference: synced entities, schema, DB API
```

### Optional pages (not counted in the four)

Some integrations need extra narrative depth. These are **optional** and sit beside the four standard files:

| File | When to add |
|------|-------------|
| `get-credentials.mdx` | Long provider-dashboard walkthroughs (scopes, redirect URLs, screenshots) that would clutter `overview.mdx`. |

The Slack docs use `get-credentials` where helpful; the **four-page skeleton** still applies—treat optional files as supplements.

---

## Corsair auth types (framework)

Corsair’s core supports these `authType` values (see `AuthTypes` in `packages/corsair/core/constants.ts`):

| `authType` | Typical use | Credential setup |
|------------|-------------|------------------|
| `managed` | Corsair-hosted OAuth app (Hub) | Nothing — tenants connect through Hub |
| `oauth_2` | Bring-your-own OAuth app | Enter client ID + secret in [hub.corsair.dev](https://hub.corsair.dev/dashboard) |
| `api_key` | Single secret or key for server-to-server calls | Nothing upfront — prompted on first tenant request |
| `bot_token` | Token issued for a **bot** or **app user** | Nothing upfront — prompted on first tenant request |

**Scenarios to document (where relevant):**

- **Multi-tenant SaaS (default)** — omit `multiTenancy` in `createCorsair`; scope calls with `withTenant()`. Link to [Multi-Tenancy](/concepts/multi-tenancy).
- **Managed OAuth** — `authType: 'managed'`; list first in credential tabs when supported.
- **Optional env overrides** — Some plugins allow passing secrets in plugin options for dev; production should use encrypted DB storage.

Plugins **subset** these types; only document modes the plugin actually implements.

---

## Page 1: `overview.mdx` (hub)

**Purpose:** Onboarding and orientation—not a full endpoint list.

**Frontmatter:**

- `title` — Display name (e.g. `Slack`).
- `description` — One line for SEO/cards.

**Suggested sections:**

1. **Intro** — Generic “Use **Title** through Corsair…” + capability bullets (API / DB entities / webhooks counts).
2. **Setup** (`<Steps>`) — Install (`CodeGroup`), full Hub-shaped `createCorsair` (database, kek, hub), choose auth (tabs), connect a tenant (`createLink`).
3. **Example API calls** — Preferred read + write from `plugin-docs.yaml`, scoped with `withTenant`.
4. **Query synced data** — Optional `dbExample` from yaml; else entity list + link to `database.mdx`.
5. **Webhooks** — Optional `exampleWebhook` hook snippet; link to `webhooks.mdx` + concepts.
6. **What's next** (`<CardGroup>`) — API, Database, Webhooks, Connect, Agents, optional get-credentials.

**Tone:** Task-focused, like the Slack hub—not a parameter-by-parameter dump (that belongs on reference pages).

---

## Page 2: `api.mdx`

**Purpose:** Complete, **deterministic** reference for HTTP-backed operations exposed as `corsair.<plugin>.api.<group>.<method>(…)`.

**Frontmatter:** `title` (e.g. `<Plugin> API Endpoints`), `description`.

**Opening:** Short paragraph + `<Callout>` linking to [API access](/concepts/api), [auth](/concepts/auth), [error handling](/concepts/error-handling); optional link to plugin source on GitHub.

**Per resource group** (e.g. `channels`, `messages`), repeat this pattern for **each operation**:

| Block | Content |
|-------|---------|
| Heading | Human name (e.g. **List channels**). |
| Operation id | Inline code: `` `group.method` `` (matches `list_operations` / `get_schema`). |
| One-line summary | What it does. |
| Example | `await corsair.<plugin>.api.….({ … })` with realistic args. |
| **Input** | Table: parameter name, TypeScript type, required/optional, description. If the schema is a single object, still list fields (same as Slack). |
| **Output** | TypeScript-shaped description: either a `type` / interface snippet, or “Returns `…`” with the **documented return shape** (success payload). Note unions/discriminators if applicable. |
| Separator | `---` between operations. |

**Ordering:** Alphabetical or source-order within each group; groups ordered consistently (same across plugins where possible).

**Generation-friendly:** Input/output types should match the **canonical schema** Corsair exposes (`get_schema('<plugin>.api.…')`) so this page can be codegen’d.

---

## Page 3: `webhooks.mdx`

**Purpose:** **Deterministic** reference for incoming events: verification, routing, and handler typing.

**Frontmatter:** `title`, `description`.

**Opening:** How the provider reaches the app (`processWebhook`), link to [Webhooks](/concepts/webhooks), [hooks](/concepts/hooks), [multi-tenancy](/concepts/multi-tenancy) if URLs are tenant-scoped.

**Setup snippet** — Minimal `POST` handler (framework-agnostic or Next.js as in Slack).

**Per webhook event** (e.g. `messages.message`, `challenge.challenge`), repeat:

| Block | Content |
|-------|---------|
| Heading | Event key as H3 (e.g. `messages.message`). |
| Operation id | `` `webhookGroup.eventName` `` (matches Corsair’s webhook hook map). |
| Provider event type | External name if different (Slack’s `message`, etc.). |
| **When it fires** | Bullet list of conditions. |
| **Input (payload)** | TypeScript object shape: raw provider body **or** normalized `result.data`—state which. Include nested fields readers need. |
| **Output / side effects** | What the plugin does by default (DB writes, replies). |
| **Hook I/O** | Document `webhookHooks` handler signature: `before`/`after` `(ctx, result) => …`; type of `result` (success/error), what handlers may return. |
| Verification | If applicable (signature header, secret); note automatic handling vs user code. |

Special cases (e.g. URL verification challenges) get their own subsection and explicit “you usually don’t handle this manually.”

---

## Page 4: `database.mdx`

**Purpose:** **Deterministic** reference for local cache: entities, row shape, and query API.

**Frontmatter:** `title`, `description`.

**Opening:** Why DB sync exists; link to [Database operations](/concepts/database), sync/multi-tenancy as needed.

**Synced entities** — Bullet list of entity names (`messages`, `channels`, …).

**Global DB API** — `search` / `findMany` / `findAll` patterns the plugin supports; shared options (`limit`, `offset`, `where`, etc.) with TypeScript snippets.

**Per entity** — For each table/model:

| Block | Content |
|-------|---------|
| **Schema** | TypeScript interface: stored fields (IDs, JSON `data` blob columns, timestamps). Mark required vs optional. |
| **Querying** | 2–3 examples: `findMany`, `findAll`, `search` with `where: { data: { … } }`. |
| **Indexes / notes** | Only if the plugin documents them (foreign keys, uniqueness). |

If the plugin exposes **generated** or **Zod** types for `data`, reference them explicitly so docs stay aligned with code.

---

## Skeleton: placeholder plugin `<plugin>`

Below is a **minimal outline** you can copy when adding a new plugin. Replace `<Plugin>`, `<plugin>`, and examples with real values.

### `overview.mdx` (outline)

- Frontmatter: title `<Plugin>`, description.
- Intro bullets: what users get.
- Setup: install, `createCorsair`, configure credentials (tabs per auth type; `managed` first when supported).
- Tabs: `managed` / `oauth_2` / `api_key` (or `bot_token`) with auth-specific setup instructions.
- One API example; Tabs for API vs DB; short webhook section + event table; plugin options table; Cards to other pages.

### `api.mdx` (outline)

- Intro callouts.
- For each `resource.method`: heading, id, example, **Input** table, **Output** type/shape.

### `webhooks.mdx` (outline)

- Handler setup; for each event: id, when it fires, **Input** payload, default behavior, hook types.

### `database.mdx` (outline)

- Entity list; global query API; per-entity **Schema** + **Querying**.

---

## Relationship to automation

- **`api.mdx`**, **`webhooks.mdx`**, and **`database.mdx`** should be treated as **machine-generated or machine-verifiable** from plugin metadata (schemas, operation lists, entity definitions).
- **`overview.mdx`** stays **human-first** (or templated with small manifest data): positioning, setup narrative, and cross-links.
- Optional **`packages/<plugin>/plugin-docs.yaml`** feeds the generator with plugin-specific copy. The script owns Hub-shaped wiring (install tabs, `createCorsair`, connect, `withTenant`, cards):

```yaml
displayName: Slack
description: "…"                 # Mintlify frontmatter
overviewNote: |                  # Optional markdown after the intro
  …
recommendedAuth: managed         # Tab labeled Recommended; used in setup snippet
factory:                         # Optional construct-time options + note
  note: "…"                      # Shown above the factory snippet in auth tabs
  options:                       # Merged into plugin({ ... }) in setup + auth
    host: example.example.com
examples:
  read:
    path: channels.list          # shortPath under plugin.api
    title: List channels         # optional heading
  write:
    path: messages.post
    title: Post a message
    args:                        # optional; defaults to {}
      channel: C01234567
      text: Hello from Corsair
dbExample:
  entity: channels               # must match a synced entity
  note: "…"
  data: { is_archived: false }
  limit: 50
exampleWebhook:
  path: messages.message         # shortPath under plugin.webhooks
  note: "…"
  after: |                       # body of after: async (ctx, result) => { … }
    console.log(result.data);
```

Credential walkthroughs stay on optional `get-credentials.mdx` (linked from auth tabs when present). Connect copy is shared across all plugins. `factory.options` is also passed when constructing the plugin for introspection (for plugins that cannot be called with `()`).

Generation **validates** yaml overrides against the plugin: `examples.*.path` must exist, `args` keys/types must match the endpoint input schema, `dbExample.entity` / `data` fields must match synced filters (including types), and `exampleWebhook.path` must exist. Invalid overrides fail the generate run.

Keeping this split makes it possible to regenerate reference pages on every plugin change without rewriting the hub.

---

## Reference: Slack file mapping

The Slack plugin illustrates the four-page model plus optional depth:

| Standard file | Slack example |
|---------------|-----------------|
| Hub | [`slack/overview.mdx`](./slack/overview.mdx) |
| API | [`slack/api.mdx`](./slack/api.mdx) |
| Webhooks | [`slack/webhooks.mdx`](./slack/webhooks.mdx) |
| Database | [`slack/database.mdx`](./slack/database.mdx) |
| Optional | [`slack/get-credentials.mdx`](./slack/get-credentials.mdx) |

New plugins should implement at least the **four standard files**; add optional pages when onboarding would otherwise be too long for `overview.mdx`.
