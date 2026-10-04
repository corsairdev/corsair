# Mintlify → Fumadocs migration

This app replaces `docs/docs.json` (Mintlify) with Fumadocs. Only the
structure and one real page are ported here; the rest is scripted work.

## Tab mapping

Mintlify's `navigation.tabs` → one root folder per tab, each with a
`meta.json` carrying `"root": true`:

| Mintlify tab | Fuma root folder |
| --- | --- |
| `Docs` | `content/docs/(docs)/` |
| `Plugins` | `content/docs/(plugins)/` |
| *(none — new)* | `content/docs/(api)/` — the V1 API-reference tab |

Within a tab, Mintlify's `{ "group": "...", "pages": [...] }` maps 1:1 to a
subfolder with its own `meta.json` (`{ "title": "...", "pages": [...] }`).
Nested groups become nested folders.

## Porting the 346 plugin pages (not done in this PR)

Each `packages/<plugin>/` already has its doc pages as a flat Mintlify group
in `docs.json` (`overview`, optional `get-credentials`, `api`, `database`,
optional `webhooks`). This is mechanical:

1. For each plugin folder in `docs/plugins/<name>/`, write
   `content/docs/(plugins)/<name>/meta.json` with `pages` in the same order
   as the existing `docs.json` group.
2. Copy each `.mdx` body across, running it through the same component swap
   as `cloud/overview.mdx` below.

Scriptable in one pass over `docs.json`'s `Plugins` tab — no per-plugin
judgment calls.

## Porting the ~60 non-plugin Docs pages (not done in this PR)

Same mechanical copy: one Mintlify page → one `.mdx` file in the matching
`content/docs/(docs)/...` folder, same component swap.

## Mintlify → Fumadocs component swap

Applied to `cloud/overview.mdx`, the one ported page:

| Mintlify | Fumadocs |
| --- | --- |
| `<CodeGroup>` + fenced blocks with a language label | `<Tabs items={[...]}>` from `fumadocs-ui/components/tabs`, one `<Tab value="...">` per language |
| `<Warning>` | `<Callout type="warn">` from `fumadocs-ui/components/callout` |
| `<Note>` | `<Callout type="info">` |
| `import X from '/snippets/*.mdx'` | no direct equivalent ported here — flagged inline in the one page that used one (`connect-next.mdx`) rather than silently dropped |

## The V1 API tab

`content/docs/(api)/v1/` is **generated, not hand-written** — see
`scripts/generate-openapi.ts`, run via `pnpm generate:openapi` (wired into
both `dev` and `build`). It reads
`packages/corsair/core/cloud/management-v1.openapi.yaml` and calls
`fumadocs-openapi`'s `generateFiles({ per: 'operation', groupBy: 'tag' })`,
producing one page per operation grouped into a folder per tag (Project,
Keys, Instances, Tenants, Connections, Grants) with its own `meta.json`.
Re-run the script — never hand-edit `content/docs/(api)/v1/`; it's
git-ignored for exactly that reason.

`content/docs/(api)/v1-guides/` holds the hand-written guide placeholders
(overview, quickstart, authentication, errors) and sits above the generated
reference in the tab's nav (`content/docs/(api)/meta.json`).

## Not done here (flagged, not silently dropped)

- Search: `app/api/search/route.ts` via `createFromSource(source)` + ⌘K in `RootProvider`.
- `docs.json`'s `redirects` array → `next.config.mjs` `redirects()`.
- Canonical OpenAPI source decision: this PR renders
  `packages/corsair/core/cloud/management-v1.openapi.yaml` (the SDK's copy).
  If Hub owns a canonical original, re-point `lib/openapi.ts` at it.
