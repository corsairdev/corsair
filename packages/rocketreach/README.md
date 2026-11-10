# @corsair-dev/rocketreach

RocketReach plugin for Corsair - person and company lookup and search, bulk lookup with status polling, and email verification.

## Install

```bash
pnpm add @corsair-dev/rocketreach
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `rocketreach.api.account.get` | `read` | Read the account state, credit usage per pool and the current rate limits |
| `account.universal` | `rocketreach.api.account.universal` | `read` | Read the universal-credits account: plan, daily call count and limit, credit usage by action and rate limits. The key RocketReach echoes back is stripped |
| `company.lookup` | `rocketreach.api.company.lookup` | `write` | Look up one company by domain, name, LinkedIn URL, ID or ticker, spending a lookup credit |
| `company.search` | `rocketreach.api.company.search` | `write` | Search companies by name, domain, industry, size, revenue and other filters |
| `email.verify` | `rocketreach.api.email.verify` | `write` | Verify whether one address can receive mail, with per-check detail; charges a verification credit, refunded when the answer is unknown or the address is malformed |
| `person.bulkLookup` | `rocketreach.api.person.bulkLookup` | `write` | Start a bulk lookup of up to 100 people and return the RR-Request-ID to poll with person.checkStatus |
| `person.checkStatus` | `rocketreach.api.person.checkStatus` | `read` | Read the current state of one or more profile lookups by profile ID or RR-Request-ID |
| `person.lookup` | `rocketreach.api.person.lookup` | `write` | Look up one person by email, LinkedIn URL, ID, phone, NPI number or name and employer, spending a lookup credit; a status other than complete means poll person.checkStatus |
| `person.search` | `rocketreach.api.person.search` | `write` | Search people by title, employer, skills, school and other filters, returning summaries without contact details |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/rocketreach

## License

Apache-2.0
