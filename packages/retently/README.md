# @corsair-dev/retently

Retently plugin for Corsair - NPS, CSAT and CES surveys with customer management, historical feedback import and campaign reporting.

## Install

```bash
pnpm add @corsair-dev/retently
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.ping` | `retently.api.account.ping` | `read` | Read the account identity, plan, remaining survey credits and usage counters in one call |
| `campaigns.list` | `retently.api.campaigns.list` | `read` | List survey campaigns with their metric, template, channel, type and active state |
| `companies.get` | `retently.api.companies.get` | `read` | Get one company by ID or domain, including its NPS, CSAT, CES and STAR scores |
| `companies.list` | `retently.api.companies.list` | `read` | List companies with their domain, industry, tags, CX metrics and contact count |
| `customers.delete` | `retently.api.customers.delete` | `destructive` | Permanently delete customers and all their associated data, identified by email address |
| `customers.get` | `retently.api.customers.get` | `read` | Get one customer by ID, including tags, custom properties, queue state and last survey |
| `customers.list` | `retently.api.customers.list` | `read` | List customers with paging, sorting, a creation-date window, an email lookup and property filters |
| `customers.resubscribe` | `retently.api.customers.resubscribe` | `write` | Resubscribe previously unsubscribed customers; self-unsubscribed and bounced contacts are skipped |
| `customers.unsubscribe` | `retently.api.customers.unsubscribe` | `write` | Unsubscribe customers from future surveys, optionally recording a custom opt-out message |
| `customers.upsert` | `retently.api.customers.upsert` | `write` | Create or update up to 1,000 customers in one call, setting tags and custom properties |
| `feedback.get` | `retently.api.feedback.get` | `read` | Get one survey response by feedback ID |
| `feedback.import` | `retently.api.feedback.import` | `write` | Import up to 200 historical survey responses into a campaign, with scores, comments, topics and additional answers |
| `feedback.list` | `retently.api.feedback.list` | `read` | List survey responses with scores, comments, topics, tags and answers, filtered by customer, campaign, date or property |
| `outbox.list` | `retently.api.outbox.list` | `read` | List sent surveys with their channel, sender, status and opened/responded detail, filtered by customer, campaign or date |
| `reports.get` | `retently.api.reports.get` | `read` | Read campaign reports with score trend, delivery stats and per-question stats, for one campaign or all |
| `survey.send` | `retently.api.survey.send` | `write` | Queue a transactional survey to up to 100 customers through a transactional campaign, optionally delayed |
| `templates.get` | `retently.api.templates.get` | `read` | Get one survey template with its questions and their UUIDs, which feedback.import needs |
| `templates.list` | `retently.api.templates.list` | `read` | List survey templates with their channel and metric |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/retently

## License

Apache-2.0
