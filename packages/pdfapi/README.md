# @corsair-dev/pdfapi

PdfApi plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/pdfapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `templates.listTemplates` | `pdfapi.api.templates.listTemplates` | `read` | Returns the templates in the PDF-API.io account |
| `templates.mergeTemplates` | `pdfapi.api.templates.mergeTemplates` | `destructive` | Renders and merges multiple templates into one PDF document |
| `templates.renderTemplate` | `pdfapi.api.templates.renderTemplate` | `destructive` | Renders a template into a PDF document from placeholder values |
| `templates.retrieveTemplate` | `pdfapi.api.templates.retrieveTemplate` | `read` | Returns one template with its variables by its template id |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pdfapi

## License

Apache-2.0
