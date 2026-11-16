# @corsair-dev/shortio

Short.io link and domain management plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/shortio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `domains.get` | `shortio.api.domains.get` | `read` | Get a domain by its ID. |
| `domains.list` | `shortio.api.domains.list` | `read` | List domains with limit and offset. |
| `links.archive` | `shortio.api.links.archive` | `write` | Archive a link. |
| `links.archiveBulk` | `shortio.api.links.archiveBulk` | `write` | Archive up to 150 links. |
| `links.create` | `shortio.api.links.create` | `write` | Create a branded short link. |
| `links.delete` | `shortio.api.links.delete` | `destructive` | Delete a link by its ID. |
| `links.deleteBulk` | `shortio.api.links.deleteBulk` | `destructive` | Delete up to 150 links. |
| `links.expand` | `shortio.api.links.expand` | `read` | Expand a short link by domain and path. |
| `links.get` | `shortio.api.links.get` | `read` | Get a link by its ID. |
| `links.list` | `shortio.api.links.list` | `read` | List links for a domain with cursor pagination. |
| `links.unarchive` | `shortio.api.links.unarchive` | `write` | Unarchive a link. |
| `links.unarchiveBulk` | `shortio.api.links.unarchiveBulk` | `write` | Unarchive up to 150 links. |
| `links.update` | `shortio.api.links.update` | `write` | Update a link by its ID. |

## Auth

Auth: API key. Save each tenant's secret key or configure one at plugin
registration. The secret key is sent directly in the `Authorization` header.
See [usage](./USAGE.md) for key precedence and tenant isolation.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/shortio

See [usage and scope](./USAGE.md) and the [Short.io API reference](https://developers.short.io/).

## License

Apache-2.0
