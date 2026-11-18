# @corsair-dev/renderform

Renderform plugin for Corsair - render templates to images, PDFs and video, manage templates and their html-editor content, capture screenshots and PDFs, and read usage and fonts.

## Install

```bash
pnpm add @corsair-dev/renderform
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `fonts` | `renderform.api.fonts` | `read` | List the fonts available to a template, with their variants and whether each is Google or custom |
| `pdf` | `renderform.api.pdf` | `write` | Capture a URL as a PDF in a chosen page format, optionally self-deleting after a set time; costs a credit |
| `render` | `renderform.api.render` | `write` | Render a template to an image, PDF or video, merging your data into its fields; costs a credit unless the answer is served from the cache, and a video render is asynchronous |
| `results.delete` | `renderform.api.results.delete` | `destructive` | Delete one render result |
| `results.get` | `renderform.api.results.get` | `read` | Read one render result; this is how an asynchronous video render is polled until it is done or failed |
| `results.list` | `renderform.api.results.list` | `read` | List render history, optionally filtered to one template or batch |
| `screenshot` | `renderform.api.screenshot` | `write` | Capture a URL as a screenshot at a chosen size; costs a credit |
| `templates.content` | `renderform.api.templates.content` | `read` | Read an html-editor template's raw HTML, CSS and sample data, which lists the merge fields a render should fill |
| `templates.create` | `renderform.api.templates.create` | `write` | Create a template in the html-editor, canvas-editor or canvas-html editor, with a size, tags and an output format |
| `templates.delete` | `renderform.api.templates.delete` | `destructive` | Delete a template |
| `templates.get` | `renderform.api.templates.get` | `read` | Read one template's metadata |
| `templates.list` | `renderform.api.templates.list` | `read` | List your templates with their preview, format, size and tags |
| `templates.update` | `renderform.api.templates.update` | `write` | Update a template's metadata; tags replace the whole set rather than merging |
| `templates.updateContent` | `renderform.api.templates.updateContent` | `write` | Replace an html-editor template's raw HTML, CSS and sample data |
| `usage` | `renderform.api.usage` | `read` | Read the plan, the credits used against the total, and the next renewal |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/renderform

## License

Apache-2.0
