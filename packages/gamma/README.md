# @corsair-dev/gamma

Gamma plugin for Corsair: generate presentations, documents, webpages and social posts from text, read and search them, archive or delete them, export to PDF, PPTX or PNG, and browse the workspace's themes and folders.

## Install

```bash
pnpm add @corsair-dev/gamma
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agent.generate` | `gamma.api.agent.generate` | `destructive` | Start a Gamma 5 agent generation from one brief, with a theme, template, quality preset and up to 10 source URLs. Spends credits |
| `agent.get` | `gamma.api.agent.get` | `read` | Where an agent generation stands, with the same terminal states as a Classic one |
| `exports.get` | `gamma.api.exports.get` | `read` | Where an export stands. `completed` carries a download URL that works for anyone holding it, for about a week |
| `exports.start` | `gamma.api.exports.start` | `write` | Start an export of an existing gamma to PDF, PPTX or PNG, returning an `exportId`. A PNG export is a zip of one image per card |
| `folders.list` | `gamma.api.folders.list` | `read` | The folders the caller can see. Some are view-only, and placing a gamma with `folderId` needs edit access |
| `gammas.archive` | `gamma.api.gammas.archive` | `write` | Archive a gamma. Idempotent, and reversible from the Gamma app, so it is not destructive |
| `gammas.delete` | `gamma.api.gammas.delete` | `destructive` | Delete a gamma permanently. Needs a workspace admin role |
| `gammas.get` | `gamma.api.gammas.get` | `read` | One gamma’s title, author, folder, theme, archive state and thumbnail |
| `gammas.search` | `gamma.api.gammas.search` | `read` | Full-text search over the gammas the caller can read. Needs `q` or a filter (`createdBy`, `updatedAfter`, `updatedBefore`) |
| `generations.create` | `gamma.api.generations.create` | `destructive` | Start a Classic generation from text or a `pages` array, at once returning a `generationId` to poll. Spends credits. Use it for webpages and multi-page gammas; the agent route covers a single new presentation |
| `generations.get` | `gamma.api.generations.get` | `read` | Where a Classic generation stands: `pending` is not final, `completed` carries the gamma ID, URL and any export URL, `failed` carries the error |
| `themes.list` | `gamma.api.themes.list` | `read` | Workspace and official themes, with the ID a generation takes |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/gamma

## License

Apache-2.0
