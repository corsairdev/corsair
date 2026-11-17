# @corsair-dev/draftable

Draftable plugin for Corsair: compare documents, view the differences and export them as PDF.

## Install

```bash
pnpm add @corsair-dev/draftable
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `comparisons.list` | `draftable.api.comparisons.list` | `read` | List the comparisons on the Draftable account. |
| `comparisons.get` | `draftable.api.comparisons.get` | `read` | Get one comparison: both documents, page counts, and whether it is ready or failed. |
| `comparisons.create` | `draftable.api.comparisons.create` | `destructive` | Compare two documents given by URL (PDF, Word, PowerPoint, RTF or text). Uses one comparison from the plan quota. |
| `comparisons.delete` | `draftable.api.comparisons.delete` | `destructive` | Delete a comparison and its documents from Draftable. |
| `comparisons.getViewerUrl` | `draftable.api.comparisons.getViewerUrl` | `read` | Get a link to view a comparison in the Draftable viewer, signed for a limited time unless the comparison is public. |
| `exports.create` | `draftable.api.exports.create` | `write` | Start a PDF export of a comparison. Poll exports.get until ready, then download its url. |
| `exports.get` | `draftable.api.exports.get` | `read` | Get an export: whether it is ready and the URL to download the PDF. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/draftable

## License

Apache-2.0
