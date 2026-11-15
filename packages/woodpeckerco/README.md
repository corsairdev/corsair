# @corsair-dev/woodpeckerco

Woodpecker Co plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/woodpeckerco
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `campaigns.deleteStep` | `woodpeckerco.api.campaigns.deleteStep` | `destructive` | Permanently delete an unused EMAIL or LINKEDIN step that is not the first step; the campaign must be DRAFT or EDITED |
| `campaigns.list` | `woodpeckerco.api.campaigns.list` | `read` | List campaigns, optionally filtered by status or ID; asking for exactly one ID also returns its statistics |
| `campaigns.pause` | `woodpeckerco.api.campaigns.pause` | `write` | Pause a campaign: no further contact with prospects until it is run again |
| `campaigns.run` | `woodpeckerco.api.campaigns.run` | `write` | Start or resume a campaign: it becomes RUNNING and Woodpecker starts contacting its prospects |
| `campaigns.stop` | `woodpeckerco.api.campaigns.stop` | `write` | Stop a campaign: no further contact with prospects until it is run again |
| `prospects.addToCampaign` | `woodpeckerco.api.prospects.addToCampaign` | `write` | Add up to 20,000 prospects to a campaign, also creating them in the global list; each result says if that prospect was a duplicate or rejected |
| `prospects.listInCampaigns` | `woodpeckerco.api.prospects.listInCampaigns` | `read` | List the prospects in one or more campaigns with their campaign status and interest level, with filters, sorting and paging |
| `webhooks.listEvents` | `woodpeckerco.api.webhooks.listEvents` | `read` | List the event types Woodpecker can send to a webhook, from Woodpecker's docs; makes no API call |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/woodpeckerco

## License

Apache-2.0
