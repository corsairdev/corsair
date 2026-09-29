# @corsair-dev/carbone

Carbone plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/carbone
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `status.get` | `carbone.api.status.get` | `read` | Tool to retrieve the current status and health of the Carbone server. Use before generating reports to ensure the service is operational. |
| `templates.upload` | `carbone.api.templates.upload` | `write` | Upload a template file to the Carbone server to obtain a template ID for document generation. Supported template formats: DOCX, XLSX, PPTX, ODT, ODS, ODP, ODG, XHTML, IDML, HTML, or XML. Templates can contain placeholders like {d.fieldname} that will be replaced with data during report generation. |
| `templates.list` | `carbone.api.templates.list` | `read` | Tool to retrieve a list of templates from Carbone storage with filtering, search, and cursor-based pagination. Use when you need to find templates, search by name or ID, or iterate through all deployed templates. |
| `templates.download` | `carbone.api.templates.download` | `read` | Tool to download a template from Carbone by template ID. Use when you need to retrieve the original template file. |
| `templates.update` | `carbone.api.templates.update` | `write` | Tool to update metadata and attributes of an existing Carbone template. Use when you need to modify template name, comment, tags, category, or control version deployment and lifecycle. |
| `templates.delete` | `carbone.api.templates.delete` | `destructive` | Permanently delete a template from the Carbone server by its 64-character hexadecimal template ID. This action is irreversible. Ensure you have the correct template ID before deleting. |
| `templates.listCategories` | `carbone.api.templates.listCategories` | `read` | Tool to retrieve a list of all categories used in templates. Categories function like folders for organizing templates. Use when you need to see available template groupings. |
| `templates.listTags` | `carbone.api.templates.listTags` | `read` | Tool to list all tags currently used in templates. Use when you need to discover available tags for categorizing or filtering templates by document type or version. |
| `render.generateReport` | `carbone.api.render.generateReport` | `write` | Tool to generate a Carbone report from a template and JSON data. Use when you need to render documents in various formats. |
| `render.renderDirect` | `carbone.api.render.renderDirect` | `write` | Tool to generate a document by uploading a base64-encoded template and data in a single API call. Use when you need to render documents without uploading templates separately. |
| `version.set` | `carbone.api.version.set` | `write` | Tool to set the Carbone API version to be used for subsequent requests. Use before rendering or managing templates to ensure correct version is applied. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/carbone

## License

Apache-2.0
