# @corsair-dev/campaigncleaner

CampaignCleaner plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/campaigncleaner
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `campaign.delete` | `campaigncleaner.api.campaign.delete` | `destructive` | Delete a saved Campaign Cleaner campaign by ID |
| `campaign.list` | `campaigncleaner.api.campaign.list` | `read` | List saved Campaign Cleaner campaigns |
| `campaign.pdfAnalysis` | `campaigncleaner.api.campaign.pdfAnalysis` | `read` | Download PDF analysis for a processed campaign |
| `campaign.status` | `campaigncleaner.api.campaign.status` | `read` | Get processing status for a Campaign Cleaner campaign |
| `credits.get` | `campaigncleaner.api.credits.get` | `read` | Get remaining Campaign Cleaner credits |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/campaigncleaner

## License

Apache-2.0
