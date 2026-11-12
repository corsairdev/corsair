# @corsair-dev/u301

U301 plugin for Corsair - create and manage branded short links, configure custom domains and their redirects, and read click analytics.

## Install

```bash
pnpm add @corsair-dev/u301
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `analytics.audience` | `u301.api.analytics.audience` | `read` | Read a top-N click breakdown by country, city, referrer, browser, OS or device |
| `analytics.clicks` | `u301.api.analytics.clicks` | `read` | Read click counts over a time range at a chosen granularity, in a chosen timezone |
| `domains.active` | `u301.api.domains.active` | `read` | Check whether a domain's DNS verification has completed, which is the step to poll after adding the CNAME |
| `domains.create` | `u301.api.domains.create` | `write` | Add a custom domain; the DNS CNAME still has to be created and verified before it serves links |
| `domains.delete` | `u301.api.domains.delete` | `destructive` | Remove a custom domain from the workspace |
| `domains.get` | `u301.api.domains.get` | `read` | Read one domain's validity, archive state, slug length and redirect settings |
| `domains.homeRedirect` | `u301.api.domains.homeRedirect` | `write` | Set where a domain's root redirects to |
| `domains.list` | `u301.api.domains.list` | `read` | List the workspace's domains, including the shared u301.co and any of your own |
| `domains.notFoundRedirect` | `u301.api.domains.notFoundRedirect` | `write` | Set where an unknown slug on a domain redirects to |
| `domains.pathLength` | `u301.api.domains.pathLength` | `write` | Set the random slug length a domain uses, 3 to 10 |
| `links.create` | `u301.api.links.create` | `write` | Shorten a URL on u301.co or one of your domains, with an optional custom slug, password and comment; a new link spends one monthly allowance slot |
| `links.delete` | `u301.api.links.delete` | `destructive` | Delete a short link; the destination is no longer reachable through it |
| `links.get` | `u301.api.links.get` | `read` | Read one short link by its short form, such as u301.co/abc123 |
| `links.list` | `u301.api.links.list` | `read` | List the workspace's short links with their click counts, archive and suspend state |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/u301

## License

Apache-2.0
