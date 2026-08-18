import {
	BigmlConfigurationEntity,
	BigmlGenericResourceEntity,
	BigmlProjectEntity,
	BigmlSourceEntity,
} from './database';

/**
 * `externalConnectors` is deliberately absent - see
 * `database.ts`'s `BigmlExternalConnectorEntity` doc comment: BigML echoes
 * a live credential back on every read of that resource, so this plugin
 * never mirrors it locally.
 *
 * The 34 generic computed-resource families all share
 * `BigmlGenericResourceEntity` (see that type's own doc comment for why),
 * but each still gets its own named store - they are independent resource
 * types on the account, not variants of one another.
 */
export const BigmlSchema = {
	version: '1.0.0',
	entities: {
		projects: BigmlProjectEntity,
		sources: BigmlSourceEntity,
		configurations: BigmlConfigurationEntity,
		anomalies: BigmlGenericResourceEntity,
		anomalyScores: BigmlGenericResourceEntity,
		associationSets: BigmlGenericResourceEntity,
		associations: BigmlGenericResourceEntity,
		batchAnomalyScores: BigmlGenericResourceEntity,
		batchCentroids: BigmlGenericResourceEntity,
		batchPredictions: BigmlGenericResourceEntity,
		batchProjections: BigmlGenericResourceEntity,
		batchTopicDistributions: BigmlGenericResourceEntity,
		centroids: BigmlGenericResourceEntity,
		clusters: BigmlGenericResourceEntity,
		composites: BigmlGenericResourceEntity,
		correlations: BigmlGenericResourceEntity,
		datasets: BigmlGenericResourceEntity,
		deepnets: BigmlGenericResourceEntity,
		ensembles: BigmlGenericResourceEntity,
		evaluations: BigmlGenericResourceEntity,
		executions: BigmlGenericResourceEntity,
		forecasts: BigmlGenericResourceEntity,
		fusions: BigmlGenericResourceEntity,
		libraries: BigmlGenericResourceEntity,
		linearRegressions: BigmlGenericResourceEntity,
		logisticRegressions: BigmlGenericResourceEntity,
		models: BigmlGenericResourceEntity,
		optimls: BigmlGenericResourceEntity,
		pcas: BigmlGenericResourceEntity,
		predictions: BigmlGenericResourceEntity,
		projections: BigmlGenericResourceEntity,
		samples: BigmlGenericResourceEntity,
		scripts: BigmlGenericResourceEntity,
		statisticalTests: BigmlGenericResourceEntity,
		timeSeries: BigmlGenericResourceEntity,
		topicDistributions: BigmlGenericResourceEntity,
		topicModels: BigmlGenericResourceEntity,
	},
} as const;

export * from './database';
export * from './primitives';
