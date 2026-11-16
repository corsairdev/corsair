# @corsair-dev/tomba

Tomba plugin for Corsair: find, verify and enrich B2B email addresses and phone numbers, and read company and domain data.

## Install

```bash
pnpm add @corsair-dev/tomba
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `tomba.api.account.get` | `read` | Read the account plan and the remaining search, verification and count credits for this usage window |
| `account.rateLimits` | `tomba.api.account.rateLimits` | `read` | Read the per-route request limits on the current plan |
| `combined.find` | `tomba.api.combined.find` | `read` | Read the person and their company from one email address |
| `company.find` | `tomba.api.company.find` | `read` | Read a company profile from its domain |
| `company.search` | `tomba.api.company.search` | `read` | Search the company database with a plain-language query or structured filters, 50 per page |
| `domain.emailCount` | `tomba.api.domain.emailCount` | `read` | How many addresses Tomba holds for a domain, by department and seniority |
| `domain.emailFormat` | `tomba.api.domain.emailFormat` | `read` | Read the address patterns a company uses and their share |
| `domain.emailSources` | `tomba.api.domain.emailSources` | `read` | List the public pages where Tomba found an email address, with first and last seen dates |
| `domain.location` | `tomba.api.domain.location` | `read` | Where a company's people are, by country |
| `domain.similar` | `tomba.api.domain.similar` | `read` | Find companies similar to a domain, with their industry |
| `domain.status` | `tomba.api.domain.status` | `read` | Read Tomba's reachability verdict for a domain |
| `domain.suggestions` | `tomba.api.domain.suggestions` | `read` | Suggest alternative domains related to a company |
| `domain.technology` | `tomba.api.domain.technology` | `read` | Read the technologies a website runs, by category |
| `finder.author` | `tomba.api.finder.author` | `read` | Find the email of the person who wrote an article |
| `finder.domainSearch` | `tomba.api.finder.domainSearch` | `read` | List a company's known email addresses with each person's role, department and verification status |
| `finder.email` | `tomba.api.finder.email` | `read` | Find one person's work email from their name and the company domain or name |
| `finder.enrich` | `tomba.api.finder.enrich` | `read` | Turn an email address into a profile: name, role, company and social links |
| `finder.linkedin` | `tomba.api.finder.linkedin` | `read` | Find the work email behind a LinkedIn profile URL |
| `finder.phone` | `tomba.api.finder.phone` | `read` | Find phone numbers from an email address, a domain or a LinkedIn URL |
| `person.find` | `tomba.api.person.find` | `read` | Read a person profile from their work email |
| `verifier.email` | `tomba.api.verifier.email` | `read` | Check whether an address can receive mail, with format, MX, SMTP and catch-all results |
| `verifier.phone` | `tomba.api.verifier.phone` | `read` | Check a phone number and report its line type and carrier |

## Auth

Auth: API key plus API secret. Tomba needs both on every request: store the key as the account's `api_key` and the secret as its `api_secret` (or pass `key` and `apiSecret` to `tomba()`). Corsair prompts your tenant for them on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tomba

## License

Apache-2.0
