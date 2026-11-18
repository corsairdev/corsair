# @corsair-dev/akta

Akta plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/akta
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `company.employeeReviews` | `akta.api.company.employeeReviews` | `read` | Get employee review ratings and individual reviews for a company |
| `company.enrich` | `akta.api.company.enrich` | `read` | Get structured company data by section: firmographics, business model, funding, and more |
| `company.productReviews` | `akta.api.company.productReviews` | `read` | Get a company's product catalog with ratings, pricing, and reviews |
| `company.search` | `akta.api.company.search` | `read` | Resolve a company name or website to its Akta uuid (free, no credits) |
| `industry.search` | `akta.api.industry.search` | `read` | Resolve a free-text industry to Akta industry codes (free, no credits) |
| `news.list` | `akta.api.news.list` | `read` | List enriched news articles filtered by company, industry, topic, or date |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/akta

## License

Apache-2.0
