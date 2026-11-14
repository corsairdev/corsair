import type {
	AuthTypes,
	BindEndpoints,
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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Configurations,
	Datasets,
	Events,
	Experiments,
	Metrics,
	Projects,
	Sessions,
} from './endpoints';
import type {
	HoneyHiveEndpointInputs,
	HoneyHiveEndpointOutputs,
} from './endpoints/types';
import {
	HoneyHiveEndpointInputSchemas,
	HoneyHiveEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HoneyHiveSchema } from './schema';

export type HoneyHivePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	baseUrl?: string;
	hooks?: InternalHoneyHivePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof honeyHiveEndpointsNested>;
};

export type HoneyHiveContext = CorsairPluginContext<
	typeof HoneyHiveSchema,
	HoneyHivePluginOptions
>;

export type HoneyHiveKeyBuilderContext =
	KeyBuilderContext<HoneyHivePluginOptions>;

export type HoneyHiveBoundEndpoints = BindEndpoints<
	typeof honeyHiveEndpointsNested
>;

type HoneyHiveEndpoint<K extends keyof HoneyHiveEndpointOutputs> =
	CorsairEndpoint<
		HoneyHiveContext,
		HoneyHiveEndpointInputs[K],
		HoneyHiveEndpointOutputs[K]
	>;

export type HoneyHiveEndpoints = {
	sessionsCreate: HoneyHiveEndpoint<'sessionsCreate'>;
	sessionsCreateEventBatch: HoneyHiveEndpoint<'sessionsCreateEventBatch'>;
	eventsCreate: HoneyHiveEndpoint<'eventsCreate'>;
	eventsCreateBatch: HoneyHiveEndpoint<'eventsCreateBatch'>;
	eventsGet: HoneyHiveEndpoint<'eventsGet'>;
	eventsGetLegacy: HoneyHiveEndpoint<'eventsGetLegacy'>;
	eventsUpdate: HoneyHiveEndpoint<'eventsUpdate'>;
	eventsSearch: HoneyHiveEndpoint<'eventsSearch'>;
	eventsSearchLegacy: HoneyHiveEndpoint<'eventsSearchLegacy'>;
	datasetsList: HoneyHiveEndpoint<'datasetsList'>;
	datasetsCreate: HoneyHiveEndpoint<'datasetsCreate'>;
	datasetsUpdate: HoneyHiveEndpoint<'datasetsUpdate'>;
	datasetsDelete: HoneyHiveEndpoint<'datasetsDelete'>;
	datasetsAddDatapoints: HoneyHiveEndpoint<'datasetsAddDatapoints'>;
	datasetsRemoveDatapoint: HoneyHiveEndpoint<'datasetsRemoveDatapoint'>;
	datasetsListLegacy: HoneyHiveEndpoint<'datasetsListLegacy'>;
	datasetsCreateLegacy: HoneyHiveEndpoint<'datasetsCreateLegacy'>;
	datasetsUpdateLegacy: HoneyHiveEndpoint<'datasetsUpdateLegacy'>;
	datasetsDeleteLegacy: HoneyHiveEndpoint<'datasetsDeleteLegacy'>;
	experimentsListRuns: HoneyHiveEndpoint<'experimentsListRuns'>;
	experimentsCreateRun: HoneyHiveEndpoint<'experimentsCreateRun'>;
	experimentsGetRun: HoneyHiveEndpoint<'experimentsGetRun'>;
	experimentsUpdateRun: HoneyHiveEndpoint<'experimentsUpdateRun'>;
	experimentsDeleteRun: HoneyHiveEndpoint<'experimentsDeleteRun'>;
	experimentsGetSummary: HoneyHiveEndpoint<'experimentsGetSummary'>;
	experimentsGetMetrics: HoneyHiveEndpoint<'experimentsGetMetrics'>;
	experimentsGetRunSchema: HoneyHiveEndpoint<'experimentsGetRunSchema'>;
	experimentsGetRunsSchema: HoneyHiveEndpoint<'experimentsGetRunsSchema'>;
	experimentsCompare: HoneyHiveEndpoint<'experimentsCompare'>;
	experimentsCompareEvents: HoneyHiveEndpoint<'experimentsCompareEvents'>;
	experimentsListRunsLegacy: HoneyHiveEndpoint<'experimentsListRunsLegacy'>;
	experimentsCreateRunLegacy: HoneyHiveEndpoint<'experimentsCreateRunLegacy'>;
	experimentsGetRunLegacy: HoneyHiveEndpoint<'experimentsGetRunLegacy'>;
	metricsList: HoneyHiveEndpoint<'metricsList'>;
	metricsCreate: HoneyHiveEndpoint<'metricsCreate'>;
	metricsUpdate: HoneyHiveEndpoint<'metricsUpdate'>;
	metricsDelete: HoneyHiveEndpoint<'metricsDelete'>;
	metricsRun: HoneyHiveEndpoint<'metricsRun'>;
	metricsListVersions: HoneyHiveEndpoint<'metricsListVersions'>;
	metricsCreateVersion: HoneyHiveEndpoint<'metricsCreateVersion'>;
	metricsDeployVersion: HoneyHiveEndpoint<'metricsDeployVersion'>;
	configurationsList: HoneyHiveEndpoint<'configurationsList'>;
	configurationsCreate: HoneyHiveEndpoint<'configurationsCreate'>;
	configurationsUpdate: HoneyHiveEndpoint<'configurationsUpdate'>;
	configurationsDelete: HoneyHiveEndpoint<'configurationsDelete'>;
	projectsCreate: HoneyHiveEndpoint<'projectsCreate'>;
	projectsGet: HoneyHiveEndpoint<'projectsGet'>;
	projectsUpdate: HoneyHiveEndpoint<'projectsUpdate'>;
	projectsDelete: HoneyHiveEndpoint<'projectsDelete'>;
};

const honeyHiveEndpointsNested = {
	sessions: {
		create: Sessions.create,
		createEventBatch: Sessions.createEventBatch,
	},
	events: {
		create: Events.create,
		createBatch: Events.createBatch,
		get: Events.get,
		getLegacy: Events.getLegacy,
		update: Events.update,
		search: Events.search,
		searchLegacy: Events.searchLegacy,
	},
	datasets: {
		list: Datasets.list,
		create: Datasets.create,
		update: Datasets.update,
		delete: Datasets.delete,
		addDatapoints: Datasets.addDatapoints,
		removeDatapoint: Datasets.removeDatapoint,
		listLegacy: Datasets.listLegacy,
		createLegacy: Datasets.createLegacy,
		updateLegacy: Datasets.updateLegacy,
		deleteLegacy: Datasets.deleteLegacy,
	},
	experiments: {
		listRuns: Experiments.listRuns,
		createRun: Experiments.createRun,
		getRun: Experiments.getRun,
		updateRun: Experiments.updateRun,
		deleteRun: Experiments.deleteRun,
		getSummary: Experiments.getSummary,
		getMetrics: Experiments.getMetrics,
		getRunSchema: Experiments.getRunSchema,
		getRunsSchema: Experiments.getRunsSchema,
		compare: Experiments.compare,
		compareEvents: Experiments.compareEvents,
		listRunsLegacy: Experiments.listRunsLegacy,
		createRunLegacy: Experiments.createRunLegacy,
		getRunLegacy: Experiments.getRunLegacy,
	},
	metrics: {
		list: Metrics.list,
		create: Metrics.create,
		update: Metrics.update,
		delete: Metrics.delete,
		run: Metrics.run,
		listVersions: Metrics.listVersions,
		createVersion: Metrics.createVersion,
		deployVersion: Metrics.deployVersion,
	},
	configurations: {
		list: Configurations.list,
		create: Configurations.create,
		update: Configurations.update,
		delete: Configurations.delete,
	},
	projects: {
		create: Projects.create,
		get: Projects.get,
		update: Projects.update,
		delete: Projects.delete,
	},
} as const;

export const honeyHiveEndpointSchemas = {
	'sessions.create': {
		input: HoneyHiveEndpointInputSchemas.sessionsCreate,
		output: HoneyHiveEndpointOutputSchemas.sessionsCreate,
	},
	'sessions.createEventBatch': {
		input: HoneyHiveEndpointInputSchemas.sessionsCreateEventBatch,
		output: HoneyHiveEndpointOutputSchemas.sessionsCreateEventBatch,
	},
	'events.create': {
		input: HoneyHiveEndpointInputSchemas.eventsCreate,
		output: HoneyHiveEndpointOutputSchemas.eventsCreate,
	},
	'events.createBatch': {
		input: HoneyHiveEndpointInputSchemas.eventsCreateBatch,
		output: HoneyHiveEndpointOutputSchemas.eventsCreateBatch,
	},
	'events.get': {
		input: HoneyHiveEndpointInputSchemas.eventsGet,
		output: HoneyHiveEndpointOutputSchemas.eventsGet,
	},
	'events.getLegacy': {
		input: HoneyHiveEndpointInputSchemas.eventsGetLegacy,
		output: HoneyHiveEndpointOutputSchemas.eventsGetLegacy,
	},
	'events.update': {
		input: HoneyHiveEndpointInputSchemas.eventsUpdate,
		output: HoneyHiveEndpointOutputSchemas.eventsUpdate,
	},
	'events.search': {
		input: HoneyHiveEndpointInputSchemas.eventsSearch,
		output: HoneyHiveEndpointOutputSchemas.eventsSearch,
	},
	'events.searchLegacy': {
		input: HoneyHiveEndpointInputSchemas.eventsSearchLegacy,
		output: HoneyHiveEndpointOutputSchemas.eventsSearchLegacy,
	},
	'datasets.list': {
		input: HoneyHiveEndpointInputSchemas.datasetsList,
		output: HoneyHiveEndpointOutputSchemas.datasetsList,
	},
	'datasets.create': {
		input: HoneyHiveEndpointInputSchemas.datasetsCreate,
		output: HoneyHiveEndpointOutputSchemas.datasetsCreate,
	},
	'datasets.update': {
		input: HoneyHiveEndpointInputSchemas.datasetsUpdate,
		output: HoneyHiveEndpointOutputSchemas.datasetsUpdate,
	},
	'datasets.delete': {
		input: HoneyHiveEndpointInputSchemas.datasetsDelete,
		output: HoneyHiveEndpointOutputSchemas.datasetsDelete,
	},
	'datasets.addDatapoints': {
		input: HoneyHiveEndpointInputSchemas.datasetsAddDatapoints,
		output: HoneyHiveEndpointOutputSchemas.datasetsAddDatapoints,
	},
	'datasets.removeDatapoint': {
		input: HoneyHiveEndpointInputSchemas.datasetsRemoveDatapoint,
		output: HoneyHiveEndpointOutputSchemas.datasetsRemoveDatapoint,
	},
	'datasets.listLegacy': {
		input: HoneyHiveEndpointInputSchemas.datasetsListLegacy,
		output: HoneyHiveEndpointOutputSchemas.datasetsListLegacy,
	},
	'datasets.createLegacy': {
		input: HoneyHiveEndpointInputSchemas.datasetsCreateLegacy,
		output: HoneyHiveEndpointOutputSchemas.datasetsCreateLegacy,
	},
	'datasets.updateLegacy': {
		input: HoneyHiveEndpointInputSchemas.datasetsUpdateLegacy,
		output: HoneyHiveEndpointOutputSchemas.datasetsUpdateLegacy,
	},
	'datasets.deleteLegacy': {
		input: HoneyHiveEndpointInputSchemas.datasetsDeleteLegacy,
		output: HoneyHiveEndpointOutputSchemas.datasetsDeleteLegacy,
	},
	'experiments.listRuns': {
		input: HoneyHiveEndpointInputSchemas.experimentsListRuns,
		output: HoneyHiveEndpointOutputSchemas.experimentsListRuns,
	},
	'experiments.createRun': {
		input: HoneyHiveEndpointInputSchemas.experimentsCreateRun,
		output: HoneyHiveEndpointOutputSchemas.experimentsCreateRun,
	},
	'experiments.getRun': {
		input: HoneyHiveEndpointInputSchemas.experimentsGetRun,
		output: HoneyHiveEndpointOutputSchemas.experimentsGetRun,
	},
	'experiments.updateRun': {
		input: HoneyHiveEndpointInputSchemas.experimentsUpdateRun,
		output: HoneyHiveEndpointOutputSchemas.experimentsUpdateRun,
	},
	'experiments.deleteRun': {
		input: HoneyHiveEndpointInputSchemas.experimentsDeleteRun,
		output: HoneyHiveEndpointOutputSchemas.experimentsDeleteRun,
	},
	'experiments.getSummary': {
		input: HoneyHiveEndpointInputSchemas.experimentsGetSummary,
		output: HoneyHiveEndpointOutputSchemas.experimentsGetSummary,
	},
	'experiments.getMetrics': {
		input: HoneyHiveEndpointInputSchemas.experimentsGetMetrics,
		output: HoneyHiveEndpointOutputSchemas.experimentsGetMetrics,
	},
	'experiments.getRunSchema': {
		input: HoneyHiveEndpointInputSchemas.experimentsGetRunSchema,
		output: HoneyHiveEndpointOutputSchemas.experimentsGetRunSchema,
	},
	'experiments.getRunsSchema': {
		input: HoneyHiveEndpointInputSchemas.experimentsGetRunsSchema,
		output: HoneyHiveEndpointOutputSchemas.experimentsGetRunsSchema,
	},
	'experiments.compare': {
		input: HoneyHiveEndpointInputSchemas.experimentsCompare,
		output: HoneyHiveEndpointOutputSchemas.experimentsCompare,
	},
	'experiments.compareEvents': {
		input: HoneyHiveEndpointInputSchemas.experimentsCompareEvents,
		output: HoneyHiveEndpointOutputSchemas.experimentsCompareEvents,
	},
	'experiments.listRunsLegacy': {
		input: HoneyHiveEndpointInputSchemas.experimentsListRunsLegacy,
		output: HoneyHiveEndpointOutputSchemas.experimentsListRunsLegacy,
	},
	'experiments.createRunLegacy': {
		input: HoneyHiveEndpointInputSchemas.experimentsCreateRunLegacy,
		output: HoneyHiveEndpointOutputSchemas.experimentsCreateRunLegacy,
	},
	'experiments.getRunLegacy': {
		input: HoneyHiveEndpointInputSchemas.experimentsGetRunLegacy,
		output: HoneyHiveEndpointOutputSchemas.experimentsGetRunLegacy,
	},
	'metrics.list': {
		input: HoneyHiveEndpointInputSchemas.metricsList,
		output: HoneyHiveEndpointOutputSchemas.metricsList,
	},
	'metrics.create': {
		input: HoneyHiveEndpointInputSchemas.metricsCreate,
		output: HoneyHiveEndpointOutputSchemas.metricsCreate,
	},
	'metrics.update': {
		input: HoneyHiveEndpointInputSchemas.metricsUpdate,
		output: HoneyHiveEndpointOutputSchemas.metricsUpdate,
	},
	'metrics.delete': {
		input: HoneyHiveEndpointInputSchemas.metricsDelete,
		output: HoneyHiveEndpointOutputSchemas.metricsDelete,
	},
	'metrics.run': {
		input: HoneyHiveEndpointInputSchemas.metricsRun,
		output: HoneyHiveEndpointOutputSchemas.metricsRun,
	},
	'metrics.listVersions': {
		input: HoneyHiveEndpointInputSchemas.metricsListVersions,
		output: HoneyHiveEndpointOutputSchemas.metricsListVersions,
	},
	'metrics.createVersion': {
		input: HoneyHiveEndpointInputSchemas.metricsCreateVersion,
		output: HoneyHiveEndpointOutputSchemas.metricsCreateVersion,
	},
	'metrics.deployVersion': {
		input: HoneyHiveEndpointInputSchemas.metricsDeployVersion,
		output: HoneyHiveEndpointOutputSchemas.metricsDeployVersion,
	},
	'configurations.list': {
		input: HoneyHiveEndpointInputSchemas.configurationsList,
		output: HoneyHiveEndpointOutputSchemas.configurationsList,
	},
	'configurations.create': {
		input: HoneyHiveEndpointInputSchemas.configurationsCreate,
		output: HoneyHiveEndpointOutputSchemas.configurationsCreate,
	},
	'configurations.update': {
		input: HoneyHiveEndpointInputSchemas.configurationsUpdate,
		output: HoneyHiveEndpointOutputSchemas.configurationsUpdate,
	},
	'configurations.delete': {
		input: HoneyHiveEndpointInputSchemas.configurationsDelete,
		output: HoneyHiveEndpointOutputSchemas.configurationsDelete,
	},
	'projects.create': {
		input: HoneyHiveEndpointInputSchemas.projectsCreate,
		output: HoneyHiveEndpointOutputSchemas.projectsCreate,
	},
	'projects.get': {
		input: HoneyHiveEndpointInputSchemas.projectsGet,
		output: HoneyHiveEndpointOutputSchemas.projectsGet,
	},
	'projects.update': {
		input: HoneyHiveEndpointInputSchemas.projectsUpdate,
		output: HoneyHiveEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: HoneyHiveEndpointInputSchemas.projectsDelete,
		output: HoneyHiveEndpointOutputSchemas.projectsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof honeyHiveEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const honeyHiveEndpointMeta = {
	'sessions.create': {
		riskLevel: 'write',
		description: 'Start a new session',
	},
	'sessions.createEventBatch': {
		riskLevel: 'write',
		description: 'Add a batch of events to a session',
	},
	'events.create': {
		riskLevel: 'write',
		description: 'Create a new trace event',
	},
	'events.createBatch': {
		riskLevel: 'write',
		description: 'Create a batch of trace events',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Get a trace event by project and event ID',
	},
	'events.getLegacy': {
		riskLevel: 'read',
		description: 'Get a trace event by event ID (legacy)',
	},
	'events.update': {
		riskLevel: 'write',
		description: 'Update a trace event',
	},
	'events.search': {
		riskLevel: 'read',
		description: 'Search trace events within a project',
	},
	'events.searchLegacy': {
		riskLevel: 'read',
		description: 'Search trace events (legacy)',
	},
	'datasets.list': {
		riskLevel: 'read',
		description: 'List datasets in a project',
	},
	'datasets.create': {
		riskLevel: 'destructive',
		description: 'Create a new dataset in a project',
	},
	'datasets.update': {
		riskLevel: 'destructive',
		description: 'Update an existing dataset in a project',
	},
	'datasets.delete': {
		riskLevel: 'destructive',
		description: 'Delete a dataset from a project',
	},
	'datasets.addDatapoints': {
		riskLevel: 'destructive',
		description: 'Add datapoints to a dataset',
	},
	'datasets.removeDatapoint': {
		riskLevel: 'destructive',
		description: 'Remove a datapoint from a dataset',
	},
	'datasets.listLegacy': {
		riskLevel: 'read',
		description: 'List datasets (legacy)',
	},
	'datasets.createLegacy': {
		riskLevel: 'destructive',
		description: 'Create a new dataset (legacy)',
	},
	'datasets.updateLegacy': {
		riskLevel: 'destructive',
		description: 'Update a dataset (legacy)',
	},
	'datasets.deleteLegacy': {
		riskLevel: 'destructive',
		description: 'Delete a dataset (legacy)',
	},
	'experiments.listRuns': {
		riskLevel: 'read',
		description: 'List evaluation runs in a project',
	},
	'experiments.createRun': {
		riskLevel: 'destructive',
		description: 'Create an evaluation run in a project',
	},
	'experiments.getRun': {
		riskLevel: 'read',
		description: 'Get evaluation run details',
	},
	'experiments.updateRun': {
		riskLevel: 'destructive',
		description: 'Update an evaluation run',
	},
	'experiments.deleteRun': {
		riskLevel: 'destructive',
		description: 'Delete an evaluation run',
	},
	'experiments.getSummary': {
		riskLevel: 'read',
		description: 'Get summary statistics for an evaluation run',
	},
	'experiments.getMetrics': {
		riskLevel: 'read',
		description: 'Get metric events for an evaluation run',
	},
	'experiments.getRunSchema': {
		riskLevel: 'read',
		description: 'Get event schema for a single run',
	},
	'experiments.getRunsSchema': {
		riskLevel: 'read',
		description: 'Get event schema across runs in a project',
	},
	'experiments.compare': {
		riskLevel: 'read',
		description: 'Compare two evaluation runs',
	},
	'experiments.compareEvents': {
		riskLevel: 'read',
		description: 'Compare events between two evaluation runs',
	},
	'experiments.listRunsLegacy': {
		riskLevel: 'read',
		description: 'List evaluation runs (legacy)',
	},
	'experiments.createRunLegacy': {
		riskLevel: 'destructive',
		description: 'Create an evaluation run (legacy)',
	},
	'experiments.getRunLegacy': {
		riskLevel: 'read',
		description: 'Get evaluation run details (legacy)',
	},
	'metrics.list': {
		riskLevel: 'read',
		description: 'List all metrics and evaluators',
	},
	'metrics.create': {
		riskLevel: 'write',
		description: 'Create a new evaluator metric',
	},
	'metrics.update': {
		riskLevel: 'write',
		description: 'Update an evaluator metric',
	},
	'metrics.delete': {
		riskLevel: 'destructive',
		description: 'Delete an evaluator metric',
	},
	'metrics.run': {
		riskLevel: 'write',
		description: 'Run an evaluator metric on an event',
	},
	'metrics.listVersions': {
		riskLevel: 'read',
		description: 'List versions of a metric',
	},
	'metrics.createVersion': {
		riskLevel: 'write',
		description: 'Create a new version snapshot for a metric',
	},
	'metrics.deployVersion': {
		riskLevel: 'write',
		description: 'Deploy a specific version of a metric',
	},
	'configurations.list': {
		riskLevel: 'read',
		description: 'List LLM and pipeline configurations',
	},
	'configurations.create': {
		riskLevel: 'destructive',
		description: 'Create a new configuration',
	},
	'configurations.update': {
		riskLevel: 'destructive',
		description: 'Update an existing configuration',
	},
	'configurations.delete': {
		riskLevel: 'destructive',
		description: 'Delete a configuration',
	},
	'projects.create': {
		riskLevel: 'destructive',
		description: 'Create a new project in a workspace',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get details for a project',
	},
	'projects.update': {
		riskLevel: 'destructive',
		description: 'Update a project name or description',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof honeyHiveEndpointsNested
>;

export const honeyHiveAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseHoneyHivePlugin<T extends HoneyHivePluginOptions> =
	CorsairPlugin<
		'honeyhive',
		typeof HoneyHiveSchema,
		typeof honeyHiveEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalHoneyHivePlugin =
	BaseHoneyHivePlugin<HoneyHivePluginOptions>;

export type ExternalHoneyHivePlugin<T extends HoneyHivePluginOptions> =
	BaseHoneyHivePlugin<T>;

export function honeyhive<const T extends HoneyHivePluginOptions>(
	incomingOptions: HoneyHivePluginOptions & T = {} as HoneyHivePluginOptions &
		T,
): ExternalHoneyHivePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'honeyhive',
		authConfig: honeyHiveAuthConfig,
		schema: HoneyHiveSchema,
		options,
		hooks: options.hooks,
		endpoints: honeyHiveEndpointsNested,
		// HoneyHive exposes no documented webhook endpoints; webhooks are excluded per plugin spec.
		webhooks: {},
		endpointMeta: honeyHiveEndpointMeta,
		endpointSchemas: honeyHiveEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: HoneyHiveKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('honeyhive', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('honeyhive', 'api_key');
			return apiKey;
		},
	} satisfies InternalHoneyHivePlugin;
}

export * from './endpoints/types';
