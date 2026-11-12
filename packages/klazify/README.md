# @corsair-dev/klazify

Klazify plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/klazify
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `categories.iab` | `klazify.api.categories.iab` | `read` | Classify a URL into IAB v1 and v3 taxonomy categories |
| `categories.listV1` | `klazify.api.categories.listV1` | `read` | List the 620 categories in the Klazify v1 taxonomy |
| `categories.listV2` | `klazify.api.categories.listV2` | `read` | List the 1,091 categories in the Klazify v2 taxonomy |
| `categorize.all` | `klazify.api.categorize.all` | `read` | Classify a URL or email and return categories, logo, social profiles, company data and tech stack in one answer |
| `categorize.realtime` | `klazify.api.categorize.realtime` | `read` | Classify a URL or email into Klazify categories, re-crawled |
| `company.get` | `klazify.api.company.get` | `read` | Read company name, location, headcount, revenue, funding and tags for a URL |
| `discovery.search` | `klazify.api.discovery.search` | `read` | Search Klazify's domain database by rank, category, country, technology and company size |
| `domain.get` | `klazify.api.domain.get` | `read` | Read domain registration and expiration dates |
| `logo.get` | `klazify.api.logo.get` | `read` | Fetch a website's logo URL from Klazify's CDN |
| `similarDomains.get` | `klazify.api.similarDomains.get` | `read` | List up to 10 domains in the same category |
| `tech.get` | `klazify.api.tech.get` | `read` | Detect the technologies a website uses |
| `traffic.get` | `klazify.api.traffic.get` | `read` | Read traffic rank, monthly visits, engagement and traffic sources for a domain |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/klazify

## License

Apache-2.0
