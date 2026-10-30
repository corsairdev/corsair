# @corsair-dev/builtwith

BuiltWith plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/builtwith
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `createDomainListFile` | `builtwith.api.createDomainListFile` | `read` | Build a deduplicated TXT or ZIP domain list file locally for bulk lookups |
| `datasets.lookup` | `builtwith.api.datasets.lookup` | `read` | Look up technology usage totals from the Trends API, optionally at a historical date |
| `domain.lookup` | `builtwith.api.domain.lookup` | `read` | Look up current and historical technologies for up to 16 root domains |
| `financial.lookup` | `builtwith.api.financial.lookup` | `read` | Look up financial information for a domain |
| `free.lookup` | `builtwith.api.free.lookup` | `read` | Get technology group and category counts with last-updated dates for a domain |
| `lists.getList` | `builtwith.api.lists.getList` | `read` | List websites using a technology, paginated with the NextOffset token |
| `mcp.lookup` | `builtwith.api.mcp.lookup` | `read` | Search the BuiltWith registry of remote MCP servers by keyword or category |
| `product.lookup` | `builtwith.api.product.lookup` | `read` | Find eCommerce shops selling a product, or list a shop's products |
| `recommendations.lookup` | `builtwith.api.recommendations.lookup` | `read` | Get technology recommendations for up to 16 domains |
| `redirects.lookup` | `builtwith.api.redirects.lookup` | `read` | Get live and historical inbound and outbound redirects for a domain |
| `social.lookup` | `builtwith.api.social.lookup` | `read` | Find root domains linked to social media profile URLs |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/builtwith

## License

Apache-2.0
