# @corsair-dev/bigml

Bigml plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bigml
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `anomalies.list` | `bigml.api.anomalies.list` | `read` | List anomaly resources |
| `anomalyScores.list` | `bigml.api.anomalyScores.list` | `read` | List anomaly score resources |
| `associations.list` | `bigml.api.associations.list` | `read` | List association resources |
| `associationSets.list` | `bigml.api.associationSets.list` | `read` | List association set resources |
| `batchAnomalyScores.list` | `bigml.api.batchAnomalyScores.list` | `read` | List batch anomaly score resources |
| `batchCentroids.list` | `bigml.api.batchCentroids.list` | `read` | List batch centroid resources |
| `batchPredictions.list` | `bigml.api.batchPredictions.list` | `read` | List batch prediction resources |
| `batchProjections.list` | `bigml.api.batchProjections.list` | `read` | List batch projection resources |
| `batchTopicDistributions.list` | `bigml.api.batchTopicDistributions.list` | `read` | List batch topic distribution resources |
| `centroids.list` | `bigml.api.centroids.list` | `read` | List centroid resources |
| `clusters.list` | `bigml.api.clusters.list` | `read` | List cluster resources |
| `composites.list` | `bigml.api.composites.list` | `read` | List composite resources |
| `configurations.get` | `bigml.api.configurations.get` | `read` | Retrieve a saved configuration |
| `configurations.list` | `bigml.api.configurations.list` | `read` | List saved configurations |
| `correlations.list` | `bigml.api.correlations.list` | `read` | List correlation resources |
| `datasets.list` | `bigml.api.datasets.list` | `read` | List dataset resources |
| `deepnets.list` | `bigml.api.deepnets.list` | `read` | List deepnet resources |
| `ensembles.list` | `bigml.api.ensembles.list` | `read` | List ensemble resources |
| `evaluations.list` | `bigml.api.evaluations.list` | `read` | List evaluation resources |
| `executions.list` | `bigml.api.executions.list` | `read` | List execution resources |
| `externalConnectors.create` | `bigml.api.externalConnectors.create` | `write` | Create an external data connector |
| `externalConnectors.get` | `bigml.api.externalConnectors.get` | `read` | Retrieve an external data connector |
| `forecasts.list` | `bigml.api.forecasts.list` | `read` | List forecast resources |
| `fusions.list` | `bigml.api.fusions.list` | `read` | List fusion resources |
| `libraries.list` | `bigml.api.libraries.list` | `read` | List library resources |
| `linearRegressions.list` | `bigml.api.linearRegressions.list` | `read` | List linear regression resources |
| `logisticRegressions.list` | `bigml.api.logisticRegressions.list` | `read` | List logistic regression resources |
| `models.list` | `bigml.api.models.list` | `read` | List model resources |
| `optimls.list` | `bigml.api.optimls.list` | `read` | List optiml resources |
| `pcas.list` | `bigml.api.pcas.list` | `read` | List pca resources |
| `predictions.list` | `bigml.api.predictions.list` | `read` | List prediction resources |
| `projections.list` | `bigml.api.projections.list` | `read` | List projection resources |
| `projects.create` | `bigml.api.projects.create` | `write` | Create a project |
| `projects.delete` | `bigml.api.projects.delete` | `destructive` | Permanently delete a project |
| `projects.get` | `bigml.api.projects.get` | `read` | Retrieve a project |
| `projects.list` | `bigml.api.projects.list` | `read` | List projects |
| `samples.list` | `bigml.api.samples.list` | `read` | List sample resources |
| `scripts.list` | `bigml.api.scripts.list` | `read` | List script resources |
| `sources.get` | `bigml.api.sources.get` | `read` | Retrieve a data source |
| `sources.list` | `bigml.api.sources.list` | `read` | List data sources |
| `sources.update` | `bigml.api.sources.update` | `write` | Update a data source's name, description, tags, parsing configuration, or per-field properties |
| `statisticalTests.list` | `bigml.api.statisticalTests.list` | `read` | List statistical test resources |
| `timeSeries.list` | `bigml.api.timeSeries.list` | `read` | List time series resources |
| `topicDistributions.list` | `bigml.api.topicDistributions.list` | `read` | List topic distribution resources |
| `topicModels.list` | `bigml.api.topicModels.list` | `read` | List topic model resources |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bigml

## License

Apache-2.0
