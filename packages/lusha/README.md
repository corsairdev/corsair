# @corsair-dev/lusha

B2B contact and company data: search and enrich Lusha records (emails, phone numbers, firmographics), follow async enrich jobs, and read account credit usage. Metered reads charge credits per call.

## Install

```bash
pnpm add @corsair-dev/lusha
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getAccountUsage` | `lusha.api.account.getAccountUsage` | `read` | Read the account credit balance, rate-limit windows, plan and per-action pricing map. Free, but Lusha caps it at 5 requests per minute. |
| `company.enrichCompanies` | `lusha.api.company.enrichCompanies` | `read` | Reveal full firmographics for up to 100 company ids, including premium fields named in reveal (each charged separately per result). Omitting reveal returns base firmographics only. Metered, and every call re-charges. |
| `company.searchAndEnrichCompanies` | `lusha.api.company.searchAndEnrichCompanies` | `read` | Search up to 100 companies by id, name or domain and return their full firmographics in one call. Metered: charged per result and per reveal field. |
| `company.searchCompanies` | `lusha.api.company.searchCompanies` | `read` | Look up up to 100 companies by id, name or domain and get firmographic previews. Metered: Lusha charges credits per matched result. |
| `jobs.getContactsEnrichJob` | `lusha.api.jobs.getContactsEnrichJob` | `read` | Where a partial contacts enrich job stands: processing (poll again after retryAfter seconds), complete (contacts to merge by id plus creditsCharged), or the terminal expired and failed. Free. |
| `person.enrichContacts` | `lusha.api.person.enrichContacts` | `read` | Reveal emails and phone numbers for up to 100 contact ids from search results. Metered: charged per revealed data point, and every call re-charges. May answer status partial with a job; follow it with jobs.getContactsEnrichJob until it reports complete, expired or failed. |
| `person.searchAndEnrichContacts` | `lusha.api.person.searchAndEnrichContacts` | `read` | Search up to 100 contacts by email, LinkedIn URL or name plus company and return their full enriched records in one call. Metered: charged per result and per revealed field. |
| `person.searchContacts` | `lusha.api.person.searchContacts` | `read` | Look up up to 100 contacts by id, LinkedIn URL, email, or name plus company, and get previews that say which data points exist and what revealing them costs. Metered: Lusha charges credits per matched result. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/lusha

## License

Apache-2.0
