# @corsair-dev/craftmypdf

CraftMyPDF plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/craftmypdf
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getInfo` | `craftmypdf.api.account.getInfo` | `read` | Read the account name, credit usage and template count against their limits |
| `editor.createSession` | `craftmypdf.api.editor.createSession` | `write` | Create a signed URL that lets its bearer edit a template in the embedded designer; the URL is a credential |
| `editor.deactivateSession` | `craftmypdf.api.editor.deactivateSession` | `write` | Revoke an editor session so its URL stops working |
| `pdf.addText` | `craftmypdf.api.pdf.addText` | `write` | Draw text such as page numbers or headers on chosen pages of a PDF and return a new file |
| `pdf.addWatermark` | `craftmypdf.api.pdf.addWatermark` | `write` | Stamp a text watermark on every page of a PDF and return a new file |
| `pdf.create` | `craftmypdf.api.pdf.create` | `write` | Generate a PDF from a template and JSON data, synchronously; consumes one credit per PDF |
| `pdf.createAsync` | `craftmypdf.api.pdf.createAsync` | `write` | Queue a PDF generation and return at once with a transaction reference, delivering the file to a webhook URL; consumes one credit per PDF |
| `pdf.createImage` | `craftmypdf.api.pdf.createImage` | `write` | Render a template to a JPEG or PNG image instead of a PDF; consumes one credit per image |
| `pdf.createMerge` | `craftmypdf.api.pdf.createMerge` | `write` | Render several templates, each with its own data, into one combined PDF; consumes one credit per template |
| `pdf.createParallel` | `craftmypdf.api.pdf.createParallel` | `write` | Generate a batch of PDFs in one request, each from its own template data, optionally merging them into a single file; consumes one credit per PDF |
| `pdf.getInfo` | `craftmypdf.api.pdf.getInfo` | `read` | Read the page count and document properties of a PDF at a URL |
| `pdf.merge` | `craftmypdf.api.pdf.merge` | `write` | Merge several PDFs fetched by URL into one file |
| `pdf.updateFields` | `craftmypdf.api.pdf.updateFields` | `write` | Fill the form fields of a PDF and optionally make them read-only, returning a new file |
| `templates.createFrom` | `craftmypdf.api.templates.createFrom` | `write` | Create a new template by copying an existing one |
| `templates.delete` | `craftmypdf.api.templates.delete` | `destructive` | Permanently delete a template |
| `templates.get` | `craftmypdf.api.templates.get` | `read` | Read one template, including its body and sample JSON data |
| `templates.list` | `craftmypdf.api.templates.list` | `read` | List the templates on the account with the ids generation calls need |
| `templates.listVersions` | `craftmypdf.api.templates.listVersions` | `read` | List the saved versions of a template |
| `templates.queryUsage` | `craftmypdf.api.templates.queryUsage` | `read` | Report how many PDFs and credits the given templates used in a date range |
| `templates.retainVersions` | `craftmypdf.api.templates.retainVersions` | `write` | Mark template versions to protect from automatic cleanup, or release the ones already kept; a released version can be cleaned up later |
| `templates.transfer` | `craftmypdf.api.templates.transfer` | `write` | Move a template to another team, after which this account no longer owns it |
| `templates.update` | `craftmypdf.api.templates.update` | `write` | Change a template's name, sample JSON data or body; the body is what the template renders |
| `transactions.list` | `craftmypdf.api.transactions.list` | `read` | List past generations with their status, credit cost and file size |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/craftmypdf

## License

Apache-2.0
