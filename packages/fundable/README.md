# @corsair-dev/fundable

Fundable plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/fundable
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `alerts.configurations` | `fundable.api.alerts.configurations` | `read` | Authenticated user's alert configurations |
| `alerts.list` | `fundable.api.alerts.list` | `read` | Saved alert matches with deals and reasoning in a date range |
| `companies.deals` | `fundable.api.companies.deals` | `read` | Get a company's complete funding history by identifier |
| `companies.get` | `fundable.api.companies.get` | `read` | Get company details and recent funding by identifier |
| `companies.post` | `fundable.api.companies.post` | `read` | Discover companies with metadata and full latest-deal details |
| `companies.search` | `fundable.api.companies.search` | `read` | Fuzzy company lookup by name, domain, LinkedIn, or Crunchbase |
| `deals.get` | `fundable.api.deals.get` | `read` | Get a specific funding round by UUID |
| `deals.investors` | `fundable.api.deals.investors` | `read` | Full investor lineup for a funding round (firms, angels, leads) |
| `deals.post` | `fundable.api.deals.post` | `read` | Find funding rounds across complete company histories |
| `filters.industries` | `fundable.api.filters.industries` | `read` | Resolve industry and super-category labels to exact permalinks |
| `filters.locations` | `fundable.api.filters.locations` | `read` | Resolve location labels to exact permalinks |
| `investors.deals` | `fundable.api.investors.deals` | `read` | Investor's complete deal history by identifier |
| `investors.get` | `fundable.api.investors.get` | `read` | Investor profile, stats, and portfolio summary by identifier |
| `investors.post` | `fundable.api.investors.post` | `read` | Discover investor firms by attributes and investments |
| `investors.search` | `fundable.api.investors.search` | `read` | Fuzzy investor lookup by name, domain, LinkedIn, or Crunchbase |
| `people.deals` | `fundable.api.people.deals` | `read` | Deals a person participated in as an investor |
| `people.email` | `fundable.api.people.email` | `read` | Unlock a person's verified email address |
| `people.get` | `fundable.api.people.get` | `read` | Full person detail including employment and education by identifier |
| `people.phone` | `fundable.api.people.phone` | `read` | Unlock a person's verified phone number |
| `people.post` | `fundable.api.people.post` | `read` | Discover founders, employees, angels, and lead investors |
| `people.search` | `fundable.api.people.search` | `read` | Fuzzy person lookup by name or identifier |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/fundable

## License

Apache-2.0
