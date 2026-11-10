# @corsair-dev/recruitee

Applicant tracking with Recruitee - read and write candidates, read and write offers, and list departments and locations through the Recruitee ATS API.

## Install

```bash
pnpm add @corsair-dev/recruitee
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `candidates.create` | `recruitee.api.candidates.create` | `write` | Add a candidate manually and assign them to an offer at its default stage |
| `candidates.delete` | `recruitee.api.candidates.delete` | `destructive` | Delete a candidate permanently |
| `candidates.get` | `recruitee.api.candidates.get` | `read` | Fetch one candidate with their contact details, stage, status and placements |
| `candidates.list` | `recruitee.api.candidates.list` | `read` | Search candidates with offer, stage, status and location filters, plus offset paging |
| `candidates.update` | `recruitee.api.candidates.update` | `write` | Update a candidate: their name, contacts, cover letter, status or stage |
| `departments.list` | `recruitee.api.departments.list` | `read` | List the company departments with how many offers each has |
| `locations.list` | `recruitee.api.locations.list` | `read` | List the company locations with how many offers each has |
| `offers.create` | `recruitee.api.offers.create` | `write` | Create an offer as a job or a talent pool, optionally already published |
| `offers.get` | `recruitee.api.offers.get` | `read` | Fetch one offer with its title, slug, description, requirements and state |
| `offers.list` | `recruitee.api.offers.list` | `read` | List offers (jobs and talent pools) with department, location, status and kind filters |
| `offers.update` | `recruitee.api.offers.update` | `write` | Update an offer: its title, description, requirements, department, location or status |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/recruitee

## License

Apache-2.0
