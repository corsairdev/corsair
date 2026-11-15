# @corsair-dev/raisely

Raisely plugin for Corsair: reads campaigns, donations, fundraising profiles and designations, records a donation, and updates a profile through the Raisely API.

## Install

```bash
pnpm add @corsair-dev/raisely
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `campaigns.get` | `raisely.api.campaigns.get` | `read` | Fetch one campaign by uuid or path, including its totals, goal and public URL |
| `campaigns.list` | `raisely.api.campaigns.list` | `read` | List the organisation’s campaigns with path, mode and status filters plus offset paging |
| `designations.list` | `raisely.api.designations.list` | `read` | List the designations a donation can be attributed to, optionally for one campaign |
| `donations.create` | `raisely.api.donations.create` | `write` | Record a donation for a campaign, with the donor details and the gateway it came through |
| `donations.get` | `raisely.api.donations.get` | `read` | Fetch one donation by uuid with its amount, gateway state and designation |
| `donations.list` | `raisely.api.donations.list` | `read` | List donations with campaign, profile, status, mode and currency filters plus offset paging |
| `profiles.get` | `raisely.api.profiles.get` | `read` | Fetch one fundraising profile by its path, including its totals and goal |
| `profiles.list` | `raisely.api.profiles.list` | `read` | List the fundraising profiles in a campaign with their totals, goals and donation counts |
| `profiles.update` | `raisely.api.profiles.update` | `write` | Update a fundraising profile: its name, description, goal, photo or custom values |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/raisely

## License

Apache-2.0
