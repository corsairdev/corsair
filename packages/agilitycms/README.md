# @corsair-dev/agilitycms

Agility CMS plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/agilitycms
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `content.getApiTypes` | `agilitycms.api.content.getApiTypes` | `read` | Retrieve enum types and metadata definitions used throughout Agility CMS API |
| `content.getContentModels` | `agilitycms.api.content.getContentModels` | `read` | Retrieve content models and page module schema definitions |
| `content.getItem` | `agilitycms.api.content.getItem` | `read` | Fetch details of a content item by Content ID including fields and metadata |
| `content.getList` | `agilitycms.api.content.getList` | `read` | Retrieve a paginated, filterable list of content items by reference name |
| `content.getLogs` | `agilitycms.api.content.getLogs` | `read` | Retrieve sync items (content change logs) incrementally using sync tokens |
| `content.getPage` | `agilitycms.api.content.getPage` | `read` | Retrieve details of a Page including metadata, content zones, and components by page ID |
| `content.getPageModules` | `agilitycms.api.content.getPageModules` | `read` | Retrieve page module UI component definitions for building pages |
| `content.getSitemapFlat` | `agilitycms.api.content.getSitemapFlat` | `read` | Retrieve the flat sitemap dictionary for a specific channel and locale |
| `content.syncPages` | `agilitycms.api.content.syncPages` | `read` | Synchronize local page data with CMS incrementally using sync tokens |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/agilitycms

## License

Apache-2.0
