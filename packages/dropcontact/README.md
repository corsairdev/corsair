# @corsair-dev/dropcontact

Dropcontact plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/dropcontact
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.credits` | `dropcontact.api.account.credits` | `read` | Read the enrichment credits left on the account; costs no credits |
| `enrichment.enrich` | `dropcontact.api.enrichment.enrich` | `write` | Submit up to 250 contacts for email finding, verification and company enrichment; spends one credit per contact and returns a request_id, not the results |
| `enrichment.results` | `dropcontact.api.enrichment.results` | `read` | Read the enriched contacts for a request_id: qualified emails, LinkedIn, phone and company data; reports success false with a reason while the batch is still processing |
| `webhook.get` | `dropcontact.api.webhook.get` | `read` | Read the default webhook callback URL used by enrichment requests that carry no custom callback of their own |
| `webhook.remove` | `dropcontact.api.webhook.remove` | `destructive` | Delete the account default webhook callback URL; afterwards only requests carrying their own custom_callback_url notify anything |
| `webhook.set` | `dropcontact.api.webhook.set` | `write` | Set the account default webhook callback URL, replacing any previous one; enrichment requests without their own callback POST their results there |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dropcontact

## License

Apache-2.0
