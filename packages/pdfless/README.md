# @corsair-dev/pdfless

PDFLess plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/pdfless
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `templates.list` | `pdfless.api.templates.list` | `read` | List document templates in the PDFLess workspace. |
| `workspace.get` | `pdfless.api.workspace.get` | `read` | Read the PDFLess workspace for the connected API key. |
| `pdfs.generate` | `pdfless.api.pdfs.generate` | `destructive` | Render a PDF from a document template and return its download link. Uses one document from the workspace quota. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pdfless

## License

Apache-2.0
