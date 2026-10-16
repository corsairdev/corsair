# @corsair-dev/apollo

Apollo plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/apollo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `news.search` | `apollo.api.news.search` | `read` | Search news articles about companies by Apollo organization id |
| `organizations.enrich` | `apollo.api.organizations.enrich` | `read` | Enrich a company by domain, LinkedIn URL, or website |
| `organizations.get` | `apollo.api.organizations.get` | `read` | Get complete organization info by Apollo id |
| `organizations.jobPostings` | `apollo.api.organizations.jobPostings` | `read` | List a company's current job postings |
| `organizations.search` | `apollo.api.organizations.search` | `read` | Search companies by name, location, size, industry, funding, technology, and hiring filters |
| `people.enrich` | `apollo.api.people.enrich` | `read` | Enrich a person by name, email, LinkedIn URL, or Apollo id; optionally reveal personal emails and phones |
| `people.get` | `apollo.api.people.get` | `read` | Get complete person info by Apollo id |
| `people.search` | `apollo.api.people.search` | `read` | Search net-new people by title, seniority, location, and employer filters (redacted profiles, no credits) |

Credits, per Apollo's [API pricing](https://docs.apollo.io/docs/api-pricing): `people.enrich` costs 1-9 credits per person, only when it returns data (8 of them for a mobile phone). `organizations.enrich` and the two `get` calls cost 1 credit each. `organizations.search`, `organizations.jobPostings` and `news.search` cost 1 credit per page. `people.search` is free. Legacy plans may bill differently.

Phone numbers: with `reveal_phone_number` or `run_waterfall_phone`, Apollo delivers the phone result later, to your `webhook_url` or through its poll endpoint when `poll_only` is set. The `people.enrich` response doesn't contain it. This plugin doesn't receive that webhook or poll for it. Phone numbers Apollo already has on the person's contact record come back as `person.contact.phone_numbers`.

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/apollo

## License

Apache-2.0
