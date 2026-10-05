# @corsair-dev/docmosis

Docmosis plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/docmosis
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `admin.environmentReady` | `docmosis.api.admin.environmentReady` | `read` | Check whether the environment is active and ready to render |
| `admin.environmentSummary` | `docmosis.api.admin.environmentSummary` | `read` | Get environment status, plan details, and quota usage |
| `admin.getBatchUploadStatus` | `docmosis.api.admin.getBatchUploadStatus` | `read` | Check status for a template batch upload job |
| `admin.getRenderQueue` | `docmosis.api.admin.getRenderQueue` | `read` | Get current render queue utilization and delay |
| `admin.getRenderTags` | `docmosis.api.admin.getRenderTags` | `read` | Get monthly render statistics grouped by custom tags |
| `admin.ping` | `docmosis.api.admin.ping` | `read` | Check basic connectivity to the Docmosis API |
| `admin.pingService` | `docmosis.api.admin.pingService` | `read` | Verify that Docmosis service listeners are online |
| `images.delete` | `docmosis.api.images.delete` | `destructive` | Delete one or more stored images |
| `images.get` | `docmosis.api.images.get` | `read` | Download one or more uploaded images |
| `images.list` | `docmosis.api.images.list` | `read` | List available stored images, optionally by folder |
| `templates.delete` | `docmosis.api.templates.delete` | `destructive` | Delete one or more templates from the environment |
| `templates.get` | `docmosis.api.templates.get` | `read` | Download one or more template files |
| `templates.getDetails` | `docmosis.api.templates.getDetails` | `read` | Get metadata details for a specific template |
| `templates.getSampleData` | `docmosis.api.templates.getSampleData` | `read` | Generate sample JSON or XML data from a template structure |
| `templates.getStructure` | `docmosis.api.templates.getStructure` | `read` | Get parsed field and structure metadata for a template |
| `templates.list` | `docmosis.api.templates.list` | `read` | List templates with optional folder and paging filters |
| `templates.render` | `docmosis.api.templates.render` | `write` | Generate a document from a template and JSON/XML data |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/docmosis

## License

Apache-2.0
