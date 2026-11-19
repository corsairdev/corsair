# @corsair-dev/googleads

Google Ads plugin for Corsair: GAQL reporting, campaign, budget and ad group management through the Google Ads API.

## Install

```bash
pnpm add @corsair-dev/googleads
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `adGroups.create` | `googleads.api.adGroups.create` | `write` | Create an ad group inside an existing campaign |
| `adGroups.update` | `googleads.api.adGroups.update` | `destructive` | Change an ad group's name, status or default CPC bid, which can change spend; updateMask names the fields that change |
| `campaignBudgets.create` | `googleads.api.campaignBudgets.create` | `write` | Create a campaign budget in micros of the account currency |
| `campaignBudgets.update` | `googleads.api.campaignBudgets.update` | `destructive` | Change a budget amount or name, which changes how much the campaigns using it can spend |
| `campaigns.create` | `googleads.api.campaigns.create` | `destructive` | Create a campaign that starts serving and spending unless status is PAUSED, against an existing budget |
| `campaigns.remove` | `googleads.api.campaigns.remove` | `destructive` | Remove a campaign: its status becomes REMOVED and it cannot be restored, only recreated as a new campaign |
| `campaigns.update` | `googleads.api.campaigns.update` | `destructive` | Change a campaign's name, status or dates; enabling it starts spending. updateMask names the fields that change |
| `customers.listAccessible` | `googleads.api.customers.listAccessible` | `read` | List the accounts the credentials can call, which is how a caller finds a customer ID |
| `customers.update` | `googleads.api.customers.update` | `write` | Update the account record itself: auto-tagging, final URL suffix and call reporting |
| `googleAdsFields.search` | `googleads.api.googleAdsFields.search` | `read` | Search the queryable fields, which is how a caller finds what a GAQL statement may select |
| `reporting.mutate` | `googleads.api.reporting.mutate` | `destructive` | Mutate any entity in one call: each entry names its own operation, and removing is permanent for that entity |
| `reporting.search` | `googleads.api.reporting.search` | `read` | Run a Google Ads Query Language statement and read its rows, 10,000 at a time |
| `reporting.searchStream` | `googleads.api.reporting.searchStream` | `read` | Run a query and read the whole result set in one response, without paging |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/googleads

## License

Apache-2.0
