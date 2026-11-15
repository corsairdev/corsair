import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Auth, Dashboards, DataSources, Datasets, Metrics } from './endpoints';
import type {
	DataboxEndpointInputs,
	DataboxEndpointOutputs,
} from './endpoints/types';
import {
	DataboxEndpointInputSchemas,
	DataboxEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { DataboxSchema } from './schema';

export type DataboxPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDataboxPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof databoxEndpointsNested>;
};

export type DataboxContext = CorsairPluginContext<
	typeof DataboxSchema,
	DataboxPluginOptions
>;

export type DataboxKeyBuilderContext = KeyBuilderContext<DataboxPluginOptions>;

export type DataboxBoundEndpoints = BindEndpoints<
	typeof databoxEndpointsNested
>;

type DataboxEndpoint<K extends keyof DataboxEndpointOutputs> = CorsairEndpoint<
	DataboxContext,
	DataboxEndpointInputs[K],
	DataboxEndpointOutputs[K]
>;

export type DataboxEndpoints = {
	authValidateKey: DataboxEndpoint<'validateKey'>;
	dataSourcesList: DataboxEndpoint<'listDataSources'>;
	dataSourcesCreate: DataboxEndpoint<'createDataSource'>;
	dataSourcesGet: DataboxEndpoint<'getDataSource'>;
	dataSourcesDelete: DataboxEndpoint<'deleteDataSource'>;
	datasetsList: DataboxEndpoint<'listDatasets'>;
	datasetsCreate: DataboxEndpoint<'createDataset'>;
	datasetsGet: DataboxEndpoint<'getDataset'>;
	datasetsListData: DataboxEndpoint<'listDatasetData'>;
	datasetsIngestData: DataboxEndpoint<'ingestDatasetData'>;
	datasetsGetIngestion: DataboxEndpoint<'getIngestion'>;
	metricsList: DataboxEndpoint<'listMetrics'>;
	metricsGetData: DataboxEndpoint<'getMetricData'>;
	dashboardsList: DataboxEndpoint<'listDashboards'>;
};

const databoxEndpointsNested = {
	auth: {
		validateKey: Auth.validateKey,
	},
	dataSources: {
		list: DataSources.list,
		create: DataSources.create,
		get: DataSources.get,
		delete: DataSources.remove,
	},
	datasets: {
		list: Datasets.list,
		create: Datasets.create,
		get: Datasets.get,
		listData: Datasets.listData,
		ingestData: Datasets.ingestData,
		getIngestion: Datasets.getIngestion,
	},
	metrics: {
		list: Metrics.list,
		getData: Metrics.getData,
	},
	dashboards: {
		list: Dashboards.list,
	},
} as const;

export const databoxEndpointSchemas = {
	'auth.validateKey': {
		input: DataboxEndpointInputSchemas.validateKey,
		output: DataboxEndpointOutputSchemas.validateKey,
	},
	'dataSources.list': {
		input: DataboxEndpointInputSchemas.listDataSources,
		output: DataboxEndpointOutputSchemas.listDataSources,
	},
	'dataSources.create': {
		input: DataboxEndpointInputSchemas.createDataSource,
		output: DataboxEndpointOutputSchemas.createDataSource,
	},
	'dataSources.get': {
		input: DataboxEndpointInputSchemas.getDataSource,
		output: DataboxEndpointOutputSchemas.getDataSource,
	},
	'dataSources.delete': {
		input: DataboxEndpointInputSchemas.deleteDataSource,
		output: DataboxEndpointOutputSchemas.deleteDataSource,
	},
	'datasets.list': {
		input: DataboxEndpointInputSchemas.listDatasets,
		output: DataboxEndpointOutputSchemas.listDatasets,
	},
	'datasets.create': {
		input: DataboxEndpointInputSchemas.createDataset,
		output: DataboxEndpointOutputSchemas.createDataset,
	},
	'datasets.get': {
		input: DataboxEndpointInputSchemas.getDataset,
		output: DataboxEndpointOutputSchemas.getDataset,
	},
	'datasets.listData': {
		input: DataboxEndpointInputSchemas.listDatasetData,
		output: DataboxEndpointOutputSchemas.listDatasetData,
	},
	'datasets.ingestData': {
		input: DataboxEndpointInputSchemas.ingestDatasetData,
		output: DataboxEndpointOutputSchemas.ingestDatasetData,
	},
	'datasets.getIngestion': {
		input: DataboxEndpointInputSchemas.getIngestion,
		output: DataboxEndpointOutputSchemas.getIngestion,
	},
	'metrics.list': {
		input: DataboxEndpointInputSchemas.listMetrics,
		output: DataboxEndpointOutputSchemas.listMetrics,
	},
	'metrics.getData': {
		input: DataboxEndpointInputSchemas.getMetricData,
		output: DataboxEndpointOutputSchemas.getMetricData,
	},
	'dashboards.list': {
		input: DataboxEndpointInputSchemas.listDashboards,
		output: DataboxEndpointOutputSchemas.listDashboards,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof databoxEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const databoxEndpointMeta = {
	'auth.validateKey': {
		riskLevel: 'read',
		description:
			'Check that the configured API key is valid; a setup or health check that reads nothing else',
	},
	'dataSources.list': {
		riskLevel: 'read',
		description:
			'List the data sources in the organization, with search, connection filter, sorting and paging',
	},
	'dataSources.create': {
		riskLevel: 'write',
		description:
			'Create a data source for pushing custom data through the API; only a name is required',
	},
	'dataSources.get': {
		riskLevel: 'read',
		description: 'Read one data source, including its status and sync interval',
	},
	'dataSources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a data source and every dataset and record it holds; this cannot be undone',
	},
	'datasets.list': {
		riskLevel: 'read',
		description:
			'List datasets, optionally filtered by data source or type (API-created or merged), with search and paging',
	},
	'datasets.create': {
		riskLevel: 'write',
		description:
			'Create a dataset in a data source with column definitions and an optional primary key that makes re-ingested records overwrite',
	},
	'datasets.get': {
		riskLevel: 'read',
		description: 'Read one dataset with its status, sync and verification info',
	},
	'datasets.listData': {
		riskLevel: 'read',
		description:
			"Read a page of a dataset's records with the column schema; records are keyed by column ID",
	},
	'datasets.ingestData': {
		riskLevel: 'write',
		description:
			'Submit up to 500 records for ingestion; the response carries an ingestionId to poll in datasets.getIngestion',
	},
	'datasets.getIngestion': {
		riskLevel: 'read',
		description:
			"Read one ingestion's status and record counts: how many records were appended, overwritten or rejected",
	},
	'metrics.list': {
		riskLevel: 'read',
		description:
			"List the organization's metrics with their dimensions, optionally filtered by source or name",
	},
	'metrics.getData': {
		riskLevel: 'read',
		description:
			"Read a metric's values over a date range with granularity, dimension breakdowns and filters; may wait for a first sync (up to two minutes)",
	},
	'dashboards.list': {
		riskLevel: 'read',
		description:
			'List dashboards with their tags and the integrations they use',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof databoxEndpointsNested>;

export type BaseDataboxPlugin<T extends DataboxPluginOptions> = CorsairPlugin<
	'databox',
	typeof DataboxSchema,
	typeof databoxEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalDataboxPlugin = BaseDataboxPlugin<DataboxPluginOptions>;

export type ExternalDataboxPlugin<T extends DataboxPluginOptions> =
	BaseDataboxPlugin<T>;

export function databox<const T extends DataboxPluginOptions>(
	incomingOptions: DataboxPluginOptions & T = {} as DataboxPluginOptions & T,
): ExternalDataboxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'databox',
		schema: DataboxSchema,
		options: options,
		hooks: options.hooks,
		endpoints: databoxEndpointsNested,
		webhooks: {},
		endpointMeta: databoxEndpointMeta,
		endpointSchemas: databoxEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: DataboxKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('databox', ctx.authType ?? 'api_key');
		},
	} satisfies InternalDataboxPlugin;
}

export { DataboxAPIError } from './client';

export type {
	CreateDataSourceInput,
	CreateDataSourceResponse,
	CreateDatasetInput,
	CreateDatasetResponse,
	DataboxColumnInput,
	DataboxColumnMetadata,
	DataboxDashboard,
	DataboxDataSource,
	DataboxDataset,
	DataboxDatasetRecord,
	DataboxEndpointInputs,
	DataboxEndpointOutputs,
	DataboxIngestion,
	DataboxMetric,
	DeleteDataSourceInput,
	DeleteDataSourceResponse,
	GetDataSourceInput,
	GetDataSourceResponse,
	GetDatasetInput,
	GetDatasetResponse,
	GetIngestionInput,
	GetIngestionResponse,
	GetMetricDataInput,
	GetMetricDataResponse,
	IngestDatasetDataInput,
	IngestDatasetDataResponse,
	ListDashboardsInput,
	ListDashboardsResponse,
	ListDataSourcesInput,
	ListDataSourcesResponse,
	ListDatasetDataInput,
	ListDatasetDataResponse,
	ListDatasetsInput,
	ListDatasetsResponse,
	ListMetricsInput,
	ListMetricsResponse,
	ValidateKeyInput,
	ValidateKeyResponse,
} from './endpoints/types';
