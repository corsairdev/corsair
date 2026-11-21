# @corsair-dev/storeganise

Storeganise self-storage management: read sites, units, users, invoices, unit rentals, jobs and add-ons, update rental custom fields, and receive signed webhook events.

## Install

```bash
pnpm add @corsair-dev/storeganise
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `addons.get` | `storeganise.api.addons.get` | `read` | Read one add-on record with its operator credentials |
| `addons.list` | `storeganise.api.addons.list` | `read` | List the add-ons installed on the account |
| `invoices.list` | `storeganise.api.invoices.list` | `read` | List invoices, filtered by update time or fetched in batches of ids |
| `jobs.get` | `storeganise.api.jobs.get` | `read` | Read one job by the id a webhook delivery carries |
| `settings.get` | `storeganise.api.settings.get` | `read` | Read the business settings, including the webhook secret |
| `sites.get` | `storeganise.api.sites.get` | `read` | Read one storage site by id or code |
| `sites.list` | `storeganise.api.sites.list` | `read` | List storage sites, optionally filtered by a search term |
| `unitRentals.get` | `storeganise.api.unitRentals.get` | `read` | Read one unit rental, embedding its unit, owner and custom fields |
| `unitRentals.list` | `storeganise.api.unitRentals.list` | `read` | List unit rentals in batches of ids, embedding related records |
| `unitRentals.update` | `storeganise.api.unitRentals.update` | `write` | Set custom fields on a unit rental, such as access codes |
| `units.list` | `storeganise.api.units.list` | `read` | List storage units with dimensions and default prices |
| `users.get` | `storeganise.api.users.get` | `read` | Read one user by id or email address |
| `users.list` | `storeganise.api.users.list` | `read` | List users, filtered by update time or fetched in batches of ids |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/storeganise

## License

Apache-2.0
