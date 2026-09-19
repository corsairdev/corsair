import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Configurations,
	ExternalConnectors,
	GenericResources,
	Projects,
	Sources,
} from './endpoints';
import type {
	BigmlEndpointInputs,
	BigmlEndpointOutputs,
} from './endpoints/types';
import {
	BigmlEndpointInputSchemas,
	BigmlEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BigmlSchema } from './schema';

export type BigmlPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** BigML API key. */
	key?: string;
	/** BigML username - BigML auth is a `username`+`api_key` pair, not a single value (see `client.ts`). */
	username?: string;
	hooks?: InternalBigmlPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bigmlEndpointsNested>;
};

export const bigmlAuthConfig = {
	api_key: {
		account: ['username'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BigmlContext = CorsairPluginContext<
	typeof BigmlSchema,
	BigmlPluginOptions,
	undefined,
	typeof bigmlAuthConfig
>;

export type BigmlKeyBuilderContext = KeyBuilderContext<
	BigmlPluginOptions,
	typeof bigmlAuthConfig
>;

export type BigmlBoundEndpoints = BindEndpoints<typeof bigmlEndpointsNested>;

type BigmlEndpoint<K extends keyof BigmlEndpointOutputs> = CorsairEndpoint<
	BigmlContext,
	BigmlEndpointInputs[K],
	BigmlEndpointOutputs[K]
>;

export type BigmlEndpoints = {
	[K in keyof BigmlEndpointOutputs]: BigmlEndpoint<K>;
};

/** BigML has no webhook, callback, or streaming mechanism - see `webhooks/types.ts`. */
export type BigmlWebhooks = Record<string, never>;

export type BigmlBoundWebhooks = BindWebhooks<BigmlWebhooks>;

/**
 * Nested per the repo's dot-notation convention. The 34 generic list-only
 * resource types (see `endpoints/generic-resources.ts`) each get their own
 * single-operation family rather than being grouped under one umbrella -
 * they are independent BigML resource types on the account, not variants of
 * each other, and `anomalies.list` reads the same way every other
 * `family.op` path in this repo does.
 */
const bigmlEndpointsNested = {
	projects: {
		create: Projects.create,
		get: Projects.get,
		delete: Projects.remove,
		list: Projects.list,
	},
	sources: {
		get: Sources.get,
		update: Sources.update,
		list: Sources.list,
	},
	externalConnectors: {
		create: ExternalConnectors.create,
		get: ExternalConnectors.get,
	},
	configurations: {
		get: Configurations.get,
		list: Configurations.list,
	},
	anomalies: { list: GenericResources.anomaliesList },
	anomalyScores: { list: GenericResources.anomalyScoresList },
	associationSets: { list: GenericResources.associationSetsList },
	associations: { list: GenericResources.associationsList },
	batchAnomalyScores: { list: GenericResources.batchAnomalyScoresList },
	batchCentroids: { list: GenericResources.batchCentroidsList },
	batchPredictions: { list: GenericResources.batchPredictionsList },
	batchProjections: { list: GenericResources.batchProjectionsList },
	batchTopicDistributions: {
		list: GenericResources.batchTopicDistributionsList,
	},
	centroids: { list: GenericResources.centroidsList },
	clusters: { list: GenericResources.clustersList },
	composites: { list: GenericResources.compositesList },
	correlations: { list: GenericResources.correlationsList },
	datasets: { list: GenericResources.datasetsList },
	deepnets: { list: GenericResources.deepnetsList },
	ensembles: { list: GenericResources.ensemblesList },
	evaluations: { list: GenericResources.evaluationsList },
	executions: { list: GenericResources.executionsList },
	forecasts: { list: GenericResources.forecastsList },
	fusions: { list: GenericResources.fusionsList },
	libraries: { list: GenericResources.librariesList },
	linearRegressions: { list: GenericResources.linearRegressionsList },
	logisticRegressions: { list: GenericResources.logisticRegressionsList },
	models: { list: GenericResources.modelsList },
	optimls: { list: GenericResources.optimlsList },
	pcas: { list: GenericResources.pcasList },
	predictions: { list: GenericResources.predictionsList },
	projections: { list: GenericResources.projectionsList },
	samples: { list: GenericResources.samplesList },
	scripts: { list: GenericResources.scriptsList },
	statisticalTests: { list: GenericResources.statisticalTestsList },
	timeSeries: { list: GenericResources.timeSeriesList },
	topicDistributions: { list: GenericResources.topicDistributionsList },
	topicModels: { list: GenericResources.topicModelsList },
} as const;

const bigmlWebhooksNested = {} as const;

export const bigmlEndpointSchemas = {
	'projects.create': {
		input: BigmlEndpointInputSchemas.projectsCreate,
		output: BigmlEndpointOutputSchemas.projectsCreate,
	},
	'projects.get': {
		input: BigmlEndpointInputSchemas.projectsGet,
		output: BigmlEndpointOutputSchemas.projectsGet,
	},
	'projects.delete': {
		input: BigmlEndpointInputSchemas.projectsDelete,
		output: BigmlEndpointOutputSchemas.projectsDelete,
	},
	'projects.list': {
		input: BigmlEndpointInputSchemas.projectsList,
		output: BigmlEndpointOutputSchemas.projectsList,
	},
	'sources.get': {
		input: BigmlEndpointInputSchemas.sourcesGet,
		output: BigmlEndpointOutputSchemas.sourcesGet,
	},
	'sources.update': {
		input: BigmlEndpointInputSchemas.sourcesUpdate,
		output: BigmlEndpointOutputSchemas.sourcesUpdate,
	},
	'sources.list': {
		input: BigmlEndpointInputSchemas.sourcesList,
		output: BigmlEndpointOutputSchemas.sourcesList,
	},
	'externalConnectors.create': {
		input: BigmlEndpointInputSchemas.externalConnectorsCreate,
		output: BigmlEndpointOutputSchemas.externalConnectorsCreate,
	},
	'externalConnectors.get': {
		input: BigmlEndpointInputSchemas.externalConnectorsGet,
		output: BigmlEndpointOutputSchemas.externalConnectorsGet,
	},
	'configurations.get': {
		input: BigmlEndpointInputSchemas.configurationsGet,
		output: BigmlEndpointOutputSchemas.configurationsGet,
	},
	'configurations.list': {
		input: BigmlEndpointInputSchemas.configurationsList,
		output: BigmlEndpointOutputSchemas.configurationsList,
	},
	'anomalies.list': {
		input: BigmlEndpointInputSchemas.anomaliesList,
		output: BigmlEndpointOutputSchemas.anomaliesList,
	},
	'anomalyScores.list': {
		input: BigmlEndpointInputSchemas.anomalyScoresList,
		output: BigmlEndpointOutputSchemas.anomalyScoresList,
	},
	'associationSets.list': {
		input: BigmlEndpointInputSchemas.associationSetsList,
		output: BigmlEndpointOutputSchemas.associationSetsList,
	},
	'associations.list': {
		input: BigmlEndpointInputSchemas.associationsList,
		output: BigmlEndpointOutputSchemas.associationsList,
	},
	'batchAnomalyScores.list': {
		input: BigmlEndpointInputSchemas.batchAnomalyScoresList,
		output: BigmlEndpointOutputSchemas.batchAnomalyScoresList,
	},
	'batchCentroids.list': {
		input: BigmlEndpointInputSchemas.batchCentroidsList,
		output: BigmlEndpointOutputSchemas.batchCentroidsList,
	},
	'batchPredictions.list': {
		input: BigmlEndpointInputSchemas.batchPredictionsList,
		output: BigmlEndpointOutputSchemas.batchPredictionsList,
	},
	'batchProjections.list': {
		input: BigmlEndpointInputSchemas.batchProjectionsList,
		output: BigmlEndpointOutputSchemas.batchProjectionsList,
	},
	'batchTopicDistributions.list': {
		input: BigmlEndpointInputSchemas.batchTopicDistributionsList,
		output: BigmlEndpointOutputSchemas.batchTopicDistributionsList,
	},
	'centroids.list': {
		input: BigmlEndpointInputSchemas.centroidsList,
		output: BigmlEndpointOutputSchemas.centroidsList,
	},
	'clusters.list': {
		input: BigmlEndpointInputSchemas.clustersList,
		output: BigmlEndpointOutputSchemas.clustersList,
	},
	'composites.list': {
		input: BigmlEndpointInputSchemas.compositesList,
		output: BigmlEndpointOutputSchemas.compositesList,
	},
	'correlations.list': {
		input: BigmlEndpointInputSchemas.correlationsList,
		output: BigmlEndpointOutputSchemas.correlationsList,
	},
	'datasets.list': {
		input: BigmlEndpointInputSchemas.datasetsList,
		output: BigmlEndpointOutputSchemas.datasetsList,
	},
	'deepnets.list': {
		input: BigmlEndpointInputSchemas.deepnetsList,
		output: BigmlEndpointOutputSchemas.deepnetsList,
	},
	'ensembles.list': {
		input: BigmlEndpointInputSchemas.ensemblesList,
		output: BigmlEndpointOutputSchemas.ensemblesList,
	},
	'evaluations.list': {
		input: BigmlEndpointInputSchemas.evaluationsList,
		output: BigmlEndpointOutputSchemas.evaluationsList,
	},
	'executions.list': {
		input: BigmlEndpointInputSchemas.executionsList,
		output: BigmlEndpointOutputSchemas.executionsList,
	},
	'forecasts.list': {
		input: BigmlEndpointInputSchemas.forecastsList,
		output: BigmlEndpointOutputSchemas.forecastsList,
	},
	'fusions.list': {
		input: BigmlEndpointInputSchemas.fusionsList,
		output: BigmlEndpointOutputSchemas.fusionsList,
	},
	'libraries.list': {
		input: BigmlEndpointInputSchemas.librariesList,
		output: BigmlEndpointOutputSchemas.librariesList,
	},
	'linearRegressions.list': {
		input: BigmlEndpointInputSchemas.linearRegressionsList,
		output: BigmlEndpointOutputSchemas.linearRegressionsList,
	},
	'logisticRegressions.list': {
		input: BigmlEndpointInputSchemas.logisticRegressionsList,
		output: BigmlEndpointOutputSchemas.logisticRegressionsList,
	},
	'models.list': {
		input: BigmlEndpointInputSchemas.modelsList,
		output: BigmlEndpointOutputSchemas.modelsList,
	},
	'optimls.list': {
		input: BigmlEndpointInputSchemas.optimlsList,
		output: BigmlEndpointOutputSchemas.optimlsList,
	},
	'pcas.list': {
		input: BigmlEndpointInputSchemas.pcasList,
		output: BigmlEndpointOutputSchemas.pcasList,
	},
	'predictions.list': {
		input: BigmlEndpointInputSchemas.predictionsList,
		output: BigmlEndpointOutputSchemas.predictionsList,
	},
	'projections.list': {
		input: BigmlEndpointInputSchemas.projectionsList,
		output: BigmlEndpointOutputSchemas.projectionsList,
	},
	'samples.list': {
		input: BigmlEndpointInputSchemas.samplesList,
		output: BigmlEndpointOutputSchemas.samplesList,
	},
	'scripts.list': {
		input: BigmlEndpointInputSchemas.scriptsList,
		output: BigmlEndpointOutputSchemas.scriptsList,
	},
	'statisticalTests.list': {
		input: BigmlEndpointInputSchemas.statisticalTestsList,
		output: BigmlEndpointOutputSchemas.statisticalTestsList,
	},
	'timeSeries.list': {
		input: BigmlEndpointInputSchemas.timeSeriesList,
		output: BigmlEndpointOutputSchemas.timeSeriesList,
	},
	'topicDistributions.list': {
		input: BigmlEndpointInputSchemas.topicDistributionsList,
		output: BigmlEndpointOutputSchemas.topicDistributionsList,
	},
	'topicModels.list': {
		input: BigmlEndpointInputSchemas.topicModelsList,
		output: BigmlEndpointOutputSchemas.topicModelsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof bigmlEndpointsNested>;

const bigmlWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof bigmlWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bigmlEndpointMeta = {
	'projects.create': { riskLevel: 'write', description: 'Create a project' },
	'projects.get': { riskLevel: 'read', description: 'Retrieve a project' },
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a project',
	},
	'projects.list': { riskLevel: 'read', description: 'List projects' },
	'sources.get': { riskLevel: 'read', description: 'Retrieve a data source' },
	'sources.update': {
		riskLevel: 'write',
		description:
			"Update a data source's name, description, tags, parsing configuration, or per-field properties",
	},
	'sources.list': { riskLevel: 'read', description: 'List data sources' },
	'externalConnectors.create': {
		riskLevel: 'write',
		description: 'Create an external data connector',
	},
	'externalConnectors.get': {
		riskLevel: 'read',
		description: 'Retrieve an external data connector',
	},
	'configurations.get': {
		riskLevel: 'read',
		description: 'Retrieve a saved configuration',
	},
	'configurations.list': {
		riskLevel: 'read',
		description: 'List saved configurations',
	},
	'anomalies.list': {
		riskLevel: 'read',
		description: 'List anomaly resources',
	},
	'anomalyScores.list': {
		riskLevel: 'read',
		description: 'List anomaly score resources',
	},
	'associationSets.list': {
		riskLevel: 'read',
		description: 'List association set resources',
	},
	'associations.list': {
		riskLevel: 'read',
		description: 'List association resources',
	},
	'batchAnomalyScores.list': {
		riskLevel: 'read',
		description: 'List batch anomaly score resources',
	},
	'batchCentroids.list': {
		riskLevel: 'read',
		description: 'List batch centroid resources',
	},
	'batchPredictions.list': {
		riskLevel: 'read',
		description: 'List batch prediction resources',
	},
	'batchProjections.list': {
		riskLevel: 'read',
		description: 'List batch projection resources',
	},
	'batchTopicDistributions.list': {
		riskLevel: 'read',
		description: 'List batch topic distribution resources',
	},
	'centroids.list': {
		riskLevel: 'read',
		description: 'List centroid resources',
	},
	'clusters.list': { riskLevel: 'read', description: 'List cluster resources' },
	'composites.list': {
		riskLevel: 'read',
		description: 'List composite resources',
	},
	'correlations.list': {
		riskLevel: 'read',
		description: 'List correlation resources',
	},
	'datasets.list': { riskLevel: 'read', description: 'List dataset resources' },
	'deepnets.list': { riskLevel: 'read', description: 'List deepnet resources' },
	'ensembles.list': {
		riskLevel: 'read',
		description: 'List ensemble resources',
	},
	'evaluations.list': {
		riskLevel: 'read',
		description: 'List evaluation resources',
	},
	'executions.list': {
		riskLevel: 'read',
		description: 'List execution resources',
	},
	'forecasts.list': {
		riskLevel: 'read',
		description: 'List forecast resources',
	},
	'fusions.list': { riskLevel: 'read', description: 'List fusion resources' },
	'libraries.list': {
		riskLevel: 'read',
		description: 'List library resources',
	},
	'linearRegressions.list': {
		riskLevel: 'read',
		description: 'List linear regression resources',
	},
	'logisticRegressions.list': {
		riskLevel: 'read',
		description: 'List logistic regression resources',
	},
	'models.list': { riskLevel: 'read', description: 'List model resources' },
	'optimls.list': { riskLevel: 'read', description: 'List optiml resources' },
	'pcas.list': { riskLevel: 'read', description: 'List pca resources' },
	'predictions.list': {
		riskLevel: 'read',
		description: 'List prediction resources',
	},
	'projections.list': {
		riskLevel: 'read',
		description: 'List projection resources',
	},
	'samples.list': { riskLevel: 'read', description: 'List sample resources' },
	'scripts.list': { riskLevel: 'read', description: 'List script resources' },
	'statisticalTests.list': {
		riskLevel: 'read',
		description: 'List statistical test resources',
	},
	'timeSeries.list': {
		riskLevel: 'read',
		description: 'List time series resources',
	},
	'topicDistributions.list': {
		riskLevel: 'read',
		description: 'List topic distribution resources',
	},
	'topicModels.list': {
		riskLevel: 'read',
		description: 'List topic model resources',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof bigmlEndpointsNested>;

export type BaseBigmlPlugin<T extends BigmlPluginOptions> = CorsairPlugin<
	'bigml',
	typeof BigmlSchema,
	typeof bigmlEndpointsNested,
	typeof bigmlWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof bigmlAuthConfig
>;

export type InternalBigmlPlugin = BaseBigmlPlugin<BigmlPluginOptions>;

export type ExternalBigmlPlugin<T extends BigmlPluginOptions> =
	BaseBigmlPlugin<T>;

export function bigml<const T extends BigmlPluginOptions>(
	incomingOptions: BigmlPluginOptions & T = {} as BigmlPluginOptions & T,
): ExternalBigmlPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bigml',
		authConfig: bigmlAuthConfig,
		schema: BigmlSchema,
		options: options,
		hooks: options.hooks,
		endpoints: bigmlEndpointsNested,
		webhooks: bigmlWebhooksNested,
		endpointMeta: bigmlEndpointMeta,
		endpointSchemas: bigmlEndpointSchemas,
		webhookSchemas: bigmlWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BigmlKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBigmlPlugin;
}

export type {
	BigmlEndpointInputs,
	BigmlEndpointOutputs,
} from './endpoints/types';
export type { BigmlWebhookOutputs } from './webhooks/types';
