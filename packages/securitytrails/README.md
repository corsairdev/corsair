# @corsair-dev/securitytrails

Securitytrails plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/securitytrails
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.ping` | `securitytrails.api.account.ping` | `read` | Verify the configured SecurityTrails API key is accepted and the API is reachable. |
| `account.usage` | `securitytrails.api.account.usage` | `read` | Return the current and allowed monthly API usage for the account. |
| `company.associatedIps` | `securitytrails.api.company.associatedIps` | `read` | List the CIDR blocks associated with a company domain. Paginated. |
| `domain.get` | `securitytrails.api.domain.get` | `read` | Get current DNS records (A, AAAA, MX, NS, SOA, TXT) and co-occurrence statistics for a hostname. |
| `domain.ssl` | `securitytrails.api.domain.ssl` | `read` | List current and historical SSL/TLS certificates for a hostname, optionally including subdomains. Paginated. |
| `ips.search` | `securitytrails.api.ips.search` | `read` | Search the IP dataset with a DSL query, returning matching addresses, PTR records and open ports. Paginated. |
| `ips.stats` | `securitytrails.api.ips.stats` | `read` | Return aggregate open-port and PTR-pattern statistics for a DSL query over the IP dataset. |
| `projects.bulkStaticAssetRules` | `securitytrails.api.projects.bulkStaticAssetRules` | `write` | Add or remove static asset rules for an ASI project, changing which assets are in the project's monitoring scope. Up to 1000 rules per request. |
| `projects.list` | `securitytrails.api.projects.list` | `read` | List the Attack Surface Intelligence projects the API key can access. |
| `scroll.get` | `securitytrails.api.scroll.get` | `read` | Fetch the next page of a DSL search using a scroll cursor from a previous response. |
| `sql.query` | `securitytrails.api.sql.query` | `read` | Run a SQL-like query against the hosts or ips tables. Returns up to 100 records plus a scroll cursor. |
| `sql.scroll` | `securitytrails.api.sql.scroll` | `read` | Fetch the next 100 records for an open SQL API scroll cursor. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/securitytrails

## License

Apache-2.0
