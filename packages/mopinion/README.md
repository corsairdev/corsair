# @corsair-dev/mopinion

Feedback analytics with Mopinion - read account data, datasets, deployments, reports, fields and collected feedback with filters and paging.

## Install

```bash
pnpm add @corsair-dev/mopinion
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `mopinion.api.account.get` | `read` | Read the account data behind the signed credentials |
| `datasets.feedback` | `mopinion.api.datasets.feedback` | `read` | List the feedback items of a dataset, one page at a time, with Mopinion filter expressions for date, rating, NPS, CES, GCR and tags |
| `datasets.feedbackItem` | `mopinion.api.datasets.feedbackItem` | `read` | Read one feedback item of a dataset |
| `datasets.fields` | `mopinion.api.datasets.fields` | `read` | Read the field definitions of a dataset |
| `datasets.get` | `mopinion.api.datasets.get` | `read` | Read basic info on one feedback dataset |
| `deployments.get` | `mopinion.api.deployments.get` | `read` | Read one deployment |
| `deployments.list` | `mopinion.api.deployments.list` | `read` | List the deployments (the containers that publish feedback forms on a website or app), one page at a time |
| `reports.feedback` | `mopinion.api.reports.feedback` | `read` | List the feedback items behind a report, one page at a time, with Mopinion filter expressions for date, rating, NPS, CES, GCR and tags |
| `reports.feedbackItem` | `mopinion.api.reports.feedbackItem` | `read` | Read one feedback item of a report |
| `reports.fields` | `mopinion.api.reports.fields` | `read` | Read the field definitions of a report |
| `reports.get` | `mopinion.api.reports.get` | `read` | Read basic info on one report |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mopinion

## License

Apache-2.0
