# @corsair-dev/builtwith

BuiltWith plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/builtwith
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `createDomainListFile` | `builtwith.create.domain.list.file` | `write` | Create a TXT or ZIP file from a list of domains. |
| `datasets.lookup` | `builtwith.datasets.lookup` | `read` | Look up historical technology usage trends. |
| `domain.lookup` | `builtwith.domain.lookup` | `read` | Look up technology information for domains. |
| `financial.lookup` | `builtwith.financial.lookup` | `read` | Look up financial information for a domain. |
| `free.lookup` | `builtwith.free.lookup` | `read` | Perform a BuiltWith free lookup. |
| `lists.getList` | `builtwith.lists.getList` | `read` | Retrieve a BuiltWith technology list. |
| `mcp.lookup` | `builtwith.mcp.lookup` | `read` | Look up BuiltWith MCP information. |
| `product.lookup` | `builtwith.product.lookup` | `read` | Search BuiltWith product information. |
| `recommendations.lookup` | `builtwith.recommendations.lookup` | `read` | Get technology recommendations for domains. |
| `redirects.lookup` | `builtwith.redirects.lookup` | `read` | Look up domain redirects. |
| `social.lookup` | `builtwith.social.lookup` | `read` | Look up social profile information. |

## Auth

Auth: API key (`Authorization: API <key>`). Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/builtwith

## License

Apache-2.0
