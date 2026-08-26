import { logEventFromContext } from 'corsair/core';
import type { BigmlContext, BigmlEndpoints } from '../index';
import type { BigmlSchema } from '../schema';
import { BigmlGenericResourceEntity } from '../schema/database';
import { cacheEntities } from './persist';
import { bigmlCall, listQuery } from './shared';
import type { BigmlEndpointOutputs, GenericListOp } from './types';

type GenericStoreKey = keyof typeof BigmlSchema.entities;

/**
 * The 34 catalog operations that are a plain `GET {resource}` list and
 * nothing else - no create, update, or delete in this catalog's scope (see
 * `endpoints/types.ts`'s `GENERIC_LIST_OPS` doc comment). Every entry here
 * was confirmed live to return `200` with the same `{meta, objects}`
 * envelope every other list endpoint in this plugin uses.
 */
const GENERIC_RESOURCES: {
	op: GenericListOp;
	path: string;
	store: GenericStoreKey;
	label: string;
}[] = [
	{
		op: 'anomaliesList',
		path: 'anomaly',
		store: 'anomalies',
		label: 'anomaly',
	},
	{
		op: 'anomalyScoresList',
		path: 'anomalyscore',
		store: 'anomalyScores',
		label: 'anomaly score',
	},
	{
		op: 'associationSetsList',
		path: 'associationset',
		store: 'associationSets',
		label: 'association set',
	},
	{
		op: 'associationsList',
		path: 'association',
		store: 'associations',
		label: 'association',
	},
	{
		op: 'batchAnomalyScoresList',
		path: 'batchanomalyscore',
		store: 'batchAnomalyScores',
		label: 'batch anomaly score',
	},
	{
		op: 'batchCentroidsList',
		path: 'batchcentroid',
		store: 'batchCentroids',
		label: 'batch centroid',
	},
	{
		op: 'batchPredictionsList',
		path: 'batchprediction',
		store: 'batchPredictions',
		label: 'batch prediction',
	},
	{
		op: 'batchProjectionsList',
		path: 'batchprojection',
		store: 'batchProjections',
		label: 'batch projection',
	},
	{
		op: 'batchTopicDistributionsList',
		path: 'batchtopicdistribution',
		store: 'batchTopicDistributions',
		label: 'batch topic distribution',
	},
	{
		op: 'centroidsList',
		path: 'centroid',
		store: 'centroids',
		label: 'centroid',
	},
	{ op: 'clustersList', path: 'cluster', store: 'clusters', label: 'cluster' },
	{
		op: 'compositesList',
		path: 'composite',
		store: 'composites',
		label: 'composite',
	},
	{
		op: 'correlationsList',
		path: 'correlation',
		store: 'correlations',
		label: 'correlation',
	},
	{ op: 'datasetsList', path: 'dataset', store: 'datasets', label: 'dataset' },
	{ op: 'deepnetsList', path: 'deepnet', store: 'deepnets', label: 'deepnet' },
	{
		op: 'ensemblesList',
		path: 'ensemble',
		store: 'ensembles',
		label: 'ensemble',
	},
	{
		op: 'evaluationsList',
		path: 'evaluation',
		store: 'evaluations',
		label: 'evaluation',
	},
	{
		op: 'executionsList',
		path: 'execution',
		store: 'executions',
		label: 'execution',
	},
	{
		op: 'forecastsList',
		path: 'forecast',
		store: 'forecasts',
		label: 'forecast',
	},
	{ op: 'fusionsList', path: 'fusion', store: 'fusions', label: 'fusion' },
	{
		op: 'librariesList',
		path: 'library',
		store: 'libraries',
		label: 'library',
	},
	{
		op: 'linearRegressionsList',
		path: 'linearregression',
		store: 'linearRegressions',
		label: 'linear regression',
	},
	{
		op: 'logisticRegressionsList',
		path: 'logisticregression',
		store: 'logisticRegressions',
		label: 'logistic regression',
	},
	{ op: 'modelsList', path: 'model', store: 'models', label: 'model' },
	{ op: 'optimlsList', path: 'optiml', store: 'optimls', label: 'optiml' },
	{ op: 'pcasList', path: 'pca', store: 'pcas', label: 'pca' },
	{
		op: 'predictionsList',
		path: 'prediction',
		store: 'predictions',
		label: 'prediction',
	},
	{
		op: 'projectionsList',
		path: 'projection',
		store: 'projections',
		label: 'projection',
	},
	{ op: 'samplesList', path: 'sample', store: 'samples', label: 'sample' },
	{ op: 'scriptsList', path: 'script', store: 'scripts', label: 'script' },
	{
		op: 'statisticalTestsList',
		path: 'statisticaltest',
		store: 'statisticalTests',
		label: 'statistical test',
	},
	{
		op: 'timeSeriesList',
		path: 'timeseries',
		store: 'timeSeries',
		label: 'time series',
	},
	{
		op: 'topicDistributionsList',
		path: 'topicdistribution',
		store: 'topicDistributions',
		label: 'topic distribution',
	},
	{
		op: 'topicModelsList',
		path: 'topicmodel',
		store: 'topicModels',
		label: 'topic model',
	},
];

function makeListEndpoint(
	path: string,
	store: GenericStoreKey,
	label: string,
	eventName: string,
): BigmlEndpoints[GenericListOp] {
	return async (ctx: BigmlContext, input) => {
		const result = await bigmlCall<BigmlEndpointOutputs[GenericListOp]>(
			ctx,
			path,
			{ query: listQuery(input) },
		);

		await cacheEntities(
			ctx.db[store],
			BigmlGenericResourceEntity,
			result.objects,
			{
				label,
			},
		);
		await logEventFromContext(
			ctx,
			eventName,
			{ returned: result.objects.length },
			'completed',
		);
		return result;
	};
}

export const GenericResources = Object.fromEntries(
	GENERIC_RESOURCES.map(({ op, path, store, label }) => [
		op,
		makeListEndpoint(path, store, label, `bigml.${op}`),
	]),
) as { [K in GenericListOp]: BigmlEndpoints[K] };
