@AGENTS.md

# apps/docs: docs.corsair.dev on Fumadocs

- **Its own pnpm project, outside the workspace**: `pnpm install --ignore-workspace` here, then `pnpm dev`. It has its own `pnpm-lock.yaml`, so docs dependencies never change the root lockfile that plugin PRs share. It imports no workspace package; it reads `docs/` and `explorer/data` as files.

- **Content is `docs/` at the repo root, read in place** (the same files Mintlify publishes). Don't copy pages into this app. Navigation comes from `docs/docs.json` (`lib/nav.ts`), redirects too (`lib/redirects.ts`).
- **Mintlify MDX is supported as written**: `lib/remark-mintlify.ts` handles snippet imports, fence titles, CodeGroup tabs, mermaid fences, lone Accordions, `<Update>` and undefined `{name}` text; `components/mintlify.tsx` renders Card, Tabs, Steps, callouts, ParamField and the rest with Fumadocs UI. A new Mintlify component needs an entry in both places it applies.
- **Generated API pages** (`docs/plugins/<id>/api.mdx`, 46 MB) are compiled on request (`lib/api-pages.ts`); compiling them at build time made the build 17x slower.
- **Prerendering**: the written pages only, by default. `DOCS_PRERENDER_ALL=1 pnpm build` renders all ~2,600 pages (the "Docs site" CI job runs it).
- **Agents**: `/<page>.md` and `Accept: text/markdown` (`lib/markdown.ts`, `proxy.ts`), `/llms.txt` (copied from `docs/llms.txt`), `/llms-full.txt` (written pages only), `/mcp` (docs MCP server).
- Static files (`icons/`, `images/`, `favicon.ico`, `llms.txt`) are copied from `docs/` by `scripts/sync-assets.mjs` before dev and build; they're gitignored here.
- Each page renders the layout itself (`components/docs-shell.tsx`) with only the sidebar it shows (`treeForPage`): the full tree is ~3,500 nodes and would go into every page's HTML.
