# @corsair-dev/databox

Databox plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/databox
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `auth.validateKey` | `databox.api.auth.validateKey` | `read` | Check that the configured API key is valid; a setup or health check that reads nothing else |
| `dashboards.list` | `databox.api.dashboards.list` | `read` | List dashboards with their tags and the integrations they use |
| `datasets.create` | `databox.api.datasets.create` | `write` | Create a dataset in a data source with column definitions and an optional primary key that makes re-ingested records overwrite |
| `datasets.get` | `databox.api.datasets.get` | `read` | Read one dataset with its status, sync and verification info |
| `datasets.getIngestion` | `databox.api.datasets.getIngestion` | `read` | Read one ingestion's status and record counts: how many records were appended, overwritten or rejected |
| `datasets.ingestData` | `databox.api.datasets.ingestData` | `write` | Submit up to 500 records for ingestion; the response carries an ingestionId to poll in datasets.getIngestion |
| `datasets.list` | `databox.api.datasets.list` | `read` | List datasets, optionally filtered by data source or type (API-created or merged), with search and paging |
| `datasets.listData` | `databox.api.datasets.listData` | `read` | Read a page of a dataset's records with the column schema; records are keyed by column ID |
| `dataSources.create` | `databox.api.dataSources.create` | `write` | Create a data source for pushing custom data through the API; only a name is required |
| `dataSources.delete` | `databox.api.dataSources.delete` | `destructive` | Permanently delete a data source and every dataset and record it holds; this cannot be undone |
| `dataSources.get` | `databox.api.dataSources.get` | `read` | Read one data source, including its status and sync interval |
| `dataSources.list` | `databox.api.dataSources.list` | `read` | List the data sources in the organization, with search, connection filter, sorting and paging |
| `metrics.getData` | `databox.api.metrics.getData` | `read` | Read a metric's values over a date range with granularity, dimension breakdowns and filters; may wait for a first sync (up to two minutes) |
| `metrics.list` | `databox.api.metrics.list` | `read` | List the organization's metrics with their dimensions, optionally filtered by source or name |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/databox

## License

Apache-2.0
