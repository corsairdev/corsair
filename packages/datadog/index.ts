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
import type { DatadogCredentials } from './client';
import { packDatadogKey } from './client';
import {
	ApiKeysEndpoints,
	AwsEndpoints,
	DashboardsEndpoints,
	DowntimesEndpoints,
	EventsEndpoints,
	HostsEndpoints,
	IncidentsEndpoints,
	LogsEndpoints,
	MetricsEndpoints,
	MonitorsEndpoints,
	RolesEndpoints,
	ServicesEndpoints,
	SlosEndpoints,
	SpansEndpoints,
	SyntheticsEndpoints,
	TagsEndpoints,
	UsageEndpoints,
	UsersEndpoints,
	WebhooksEndpoints,
} from './endpoints';
import type {
	DatadogEndpointInputs,
	DatadogEndpointOutputs,
} from './endpoints/types';
import {
	DatadogEndpointInputSchemas,
	DatadogEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DatadogSchema } from './schema';

/**
 * Auth config for Datadog API-key authentication.
 * - api_key (base field): the Datadog API key (DD-API-KEY)
 * - app_key: the Datadog application key (DD-APPLICATION-KEY), required by
 *   most management endpoints
 * - site: Datadog region site (datadoghq.com, datadoghq.eu, us3.datadoghq.com,
 *   us5.datadoghq.com, ap1.datadoghq.com); defaults to datadoghq.com
 */
export const datadogAuthConfig = {
	api_key: {
		account: ['app_key', 'site'] as const,
	},
} as const satisfies PluginAuthConfig;

export type DatadogPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Pre-packed key (JSON credentials or a bare API key). Prefer `credentials`. */
	key?: string;
	/** Datadog credentials supplied directly instead of via stored account keys. */
	credentials?: DatadogCredentials;
	hooks?: InternalDatadogPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Datadog plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof datadogEndpointsNested>;
};

export type DatadogContext = CorsairPluginContext<
	typeof DatadogSchema,
	DatadogPluginOptions,
	undefined,
	typeof datadogAuthConfig
>;

export type DatadogKeyBuilderContext = KeyBuilderContext<
	DatadogPluginOptions,
	typeof datadogAuthConfig
>;

type DatadogEndpoint<K extends keyof DatadogEndpointOutputs> = CorsairEndpoint<
	DatadogContext,
	DatadogEndpointInputs[K],
	DatadogEndpointOutputs[K]
>;

export type DatadogEndpoints = {
	dashboardsList: DatadogEndpoint<'dashboardsList'>;
	dashboardsGet: DatadogEndpoint<'dashboardsGet'>;
	dashboardsCreate: DatadogEndpoint<'dashboardsCreate'>;
	dashboardsUpdate: DatadogEndpoint<'dashboardsUpdate'>;
	dashboardsDelete: DatadogEndpoint<'dashboardsDelete'>;
	monitorsList: DatadogEndpoint<'monitorsList'>;
	monitorsSearch: DatadogEndpoint<'monitorsSearch'>;
	monitorsGet: DatadogEndpoint<'monitorsGet'>;
	monitorsCreate: DatadogEndpoint<'monitorsCreate'>;
	monitorsUpdate: DatadogEndpoint<'monitorsUpdate'>;
	monitorsDelete: DatadogEndpoint<'monitorsDelete'>;
	monitorsMute: DatadogEndpoint<'monitorsMute'>;
	monitorsUnmute: DatadogEndpoint<'monitorsUnmute'>;
	slosList: DatadogEndpoint<'slosList'>;
	slosCreate: DatadogEndpoint<'slosCreate'>;
	syntheticsListTests: DatadogEndpoint<'syntheticsListTests'>;
	syntheticsGetApiTest: DatadogEndpoint<'syntheticsGetApiTest'>;
	syntheticsCreateApiTest: DatadogEndpoint<'syntheticsCreateApiTest'>;
	syntheticsListLocations: DatadogEndpoint<'syntheticsListLocations'>;
	eventsList: DatadogEndpoint<'eventsList'>;
	eventsCreate: DatadogEndpoint<'eventsCreate'>;
	downtimesList: DatadogEndpoint<'downtimesList'>;
	downtimesCreate: DatadogEndpoint<'downtimesCreate'>;
	webhooksGet: DatadogEndpoint<'webhooksGet'>;
	webhooksCreate: DatadogEndpoint<'webhooksCreate'>;
	hostsList: DatadogEndpoint<'hostsList'>;
	hostsTotals: DatadogEndpoint<'hostsTotals'>;
	tagsList: DatadogEndpoint<'tagsList'>;
	tagsGetHost: DatadogEndpoint<'tagsGetHost'>;
	tagsUpdateHost: DatadogEndpoint<'tagsUpdateHost'>;
	servicesListDefinitions: DatadogEndpoint<'servicesListDefinitions'>;
	spansSearch: DatadogEndpoint<'spansSearch'>;
	spansAggregate: DatadogEndpoint<'spansAggregate'>;
	logsSearch: DatadogEndpoint<'logsSearch'>;
	logsAggregate: DatadogEndpoint<'logsAggregate'>;
	logsListIndexes: DatadogEndpoint<'logsListIndexes'>;
	metricsListActive: DatadogEndpoint<'metricsListActive'>;
	metricsQuery: DatadogEndpoint<'metricsQuery'>;
	metricsSubmit: DatadogEndpoint<'metricsSubmit'>;
	usersList: DatadogEndpoint<'usersList'>;
	rolesList: DatadogEndpoint<'rolesList'>;
	apiKeysList: DatadogEndpoint<'apiKeysList'>;
	incidentsList: DatadogEndpoint<'incidentsList'>;
	awsList: DatadogEndpoint<'awsList'>;
	usageGetSummary: DatadogEndpoint<'usageGetSummary'>;
};

export const datadogEndpointsNested = {
	dashboards: {
		list: DashboardsEndpoints.list,
		get: DashboardsEndpoints.get,
		create: DashboardsEndpoints.create,
		update: DashboardsEndpoints.update,
		delete: DashboardsEndpoints.delete,
	},
	monitors: {
		list: MonitorsEndpoints.list,
		search: MonitorsEndpoints.search,
		get: MonitorsEndpoints.get,
		create: MonitorsEndpoints.create,
		update: MonitorsEndpoints.update,
		delete: MonitorsEndpoints.delete,
		mute: MonitorsEndpoints.mute,
		unmute: MonitorsEndpoints.unmute,
	},
	slos: {
		list: SlosEndpoints.list,
		create: SlosEndpoints.create,
	},
	synthetics: {
		listTests: SyntheticsEndpoints.listTests,
		getApiTest: SyntheticsEndpoints.getApiTest,
		createApiTest: SyntheticsEndpoints.createApiTest,
		listLocations: SyntheticsEndpoints.listLocations,
	},
	events: {
		list: EventsEndpoints.list,
		create: EventsEndpoints.create,
	},
	downtimes: {
		list: DowntimesEndpoints.list,
		create: DowntimesEndpoints.create,
	},
	webhooks: {
		get: WebhooksEndpoints.get,
		create: WebhooksEndpoints.create,
	},
	hosts: {
		list: HostsEndpoints.list,
		totals: HostsEndpoints.totals,
	},
	tags: {
		list: TagsEndpoints.list,
		getHost: TagsEndpoints.getHost,
		updateHost: TagsEndpoints.updateHost,
	},
	services: {
		listDefinitions: ServicesEndpoints.listDefinitions,
	},
	spans: {
		search: SpansEndpoints.search,
		aggregate: SpansEndpoints.aggregate,
	},
	logs: {
		search: LogsEndpoints.search,
		aggregate: LogsEndpoints.aggregate,
		listIndexes: LogsEndpoints.listIndexes,
	},
	metrics: {
		listActive: MetricsEndpoints.listActive,
		query: MetricsEndpoints.query,
		submit: MetricsEndpoints.submit,
	},
	users: {
		list: UsersEndpoints.list,
	},
	roles: {
		list: RolesEndpoints.list,
	},
	apiKeys: {
		list: ApiKeysEndpoints.list,
	},
	incidents: {
		list: IncidentsEndpoints.list,
	},
	aws: {
		list: AwsEndpoints.list,
	},
	usage: {
		getSummary: UsageEndpoints.getSummary,
	},
} as const;

export type DatadogBoundEndpoints = BindEndpoints<
	typeof datadogEndpointsNested
>;

export const datadogEndpointSchemas = {
	'dashboards.list': {
		input: DatadogEndpointInputSchemas.dashboardsList,
		output: DatadogEndpointOutputSchemas.dashboardsList,
	},
	'dashboards.get': {
		input: DatadogEndpointInputSchemas.dashboardsGet,
		output: DatadogEndpointOutputSchemas.dashboardsGet,
	},
	'dashboards.create': {
		input: DatadogEndpointInputSchemas.dashboardsCreate,
		output: DatadogEndpointOutputSchemas.dashboardsCreate,
	},
	'dashboards.update': {
		input: DatadogEndpointInputSchemas.dashboardsUpdate,
		output: DatadogEndpointOutputSchemas.dashboardsUpdate,
	},
	'dashboards.delete': {
		input: DatadogEndpointInputSchemas.dashboardsDelete,
		output: DatadogEndpointOutputSchemas.dashboardsDelete,
	},
	'monitors.list': {
		input: DatadogEndpointInputSchemas.monitorsList,
		output: DatadogEndpointOutputSchemas.monitorsList,
	},
	'monitors.search': {
		input: DatadogEndpointInputSchemas.monitorsSearch,
		output: DatadogEndpointOutputSchemas.monitorsSearch,
	},
	'monitors.get': {
		input: DatadogEndpointInputSchemas.monitorsGet,
		output: DatadogEndpointOutputSchemas.monitorsGet,
	},
	'monitors.create': {
		input: DatadogEndpointInputSchemas.monitorsCreate,
		output: DatadogEndpointOutputSchemas.monitorsCreate,
	},
	'monitors.update': {
		input: DatadogEndpointInputSchemas.monitorsUpdate,
		output: DatadogEndpointOutputSchemas.monitorsUpdate,
	},
	'monitors.delete': {
		input: DatadogEndpointInputSchemas.monitorsDelete,
		output: DatadogEndpointOutputSchemas.monitorsDelete,
	},
	'monitors.mute': {
		input: DatadogEndpointInputSchemas.monitorsMute,
		output: DatadogEndpointOutputSchemas.monitorsMute,
	},
	'monitors.unmute': {
		input: DatadogEndpointInputSchemas.monitorsUnmute,
		output: DatadogEndpointOutputSchemas.monitorsUnmute,
	},
	'slos.list': {
		input: DatadogEndpointInputSchemas.slosList,
		output: DatadogEndpointOutputSchemas.slosList,
	},
	'slos.create': {
		input: DatadogEndpointInputSchemas.slosCreate,
		output: DatadogEndpointOutputSchemas.slosCreate,
	},
	'synthetics.listTests': {
		input: DatadogEndpointInputSchemas.syntheticsListTests,
		output: DatadogEndpointOutputSchemas.syntheticsListTests,
	},
	'synthetics.getApiTest': {
		input: DatadogEndpointInputSchemas.syntheticsGetApiTest,
		output: DatadogEndpointOutputSchemas.syntheticsGetApiTest,
	},
	'synthetics.createApiTest': {
		input: DatadogEndpointInputSchemas.syntheticsCreateApiTest,
		output: DatadogEndpointOutputSchemas.syntheticsCreateApiTest,
	},
	'synthetics.listLocations': {
		input: DatadogEndpointInputSchemas.syntheticsListLocations,
		output: DatadogEndpointOutputSchemas.syntheticsListLocations,
	},
	'events.list': {
		input: DatadogEndpointInputSchemas.eventsList,
		output: DatadogEndpointOutputSchemas.eventsList,
	},
	'events.create': {
		input: DatadogEndpointInputSchemas.eventsCreate,
		output: DatadogEndpointOutputSchemas.eventsCreate,
	},
	'downtimes.list': {
		input: DatadogEndpointInputSchemas.downtimesList,
		output: DatadogEndpointOutputSchemas.downtimesList,
	},
	'downtimes.create': {
		input: DatadogEndpointInputSchemas.downtimesCreate,
		output: DatadogEndpointOutputSchemas.downtimesCreate,
	},
	'webhooks.get': {
		input: DatadogEndpointInputSchemas.webhooksGet,
		output: DatadogEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.create': {
		input: DatadogEndpointInputSchemas.webhooksCreate,
		output: DatadogEndpointOutputSchemas.webhooksCreate,
	},
	'hosts.list': {
		input: DatadogEndpointInputSchemas.hostsList,
		output: DatadogEndpointOutputSchemas.hostsList,
	},
	'hosts.totals': {
		input: DatadogEndpointInputSchemas.hostsTotals,
		output: DatadogEndpointOutputSchemas.hostsTotals,
	},
	'tags.list': {
		input: DatadogEndpointInputSchemas.tagsList,
		output: DatadogEndpointOutputSchemas.tagsList,
	},
	'tags.getHost': {
		input: DatadogEndpointInputSchemas.tagsGetHost,
		output: DatadogEndpointOutputSchemas.tagsGetHost,
	},
	'tags.updateHost': {
		input: DatadogEndpointInputSchemas.tagsUpdateHost,
		output: DatadogEndpointOutputSchemas.tagsUpdateHost,
	},
	'services.listDefinitions': {
		input: DatadogEndpointInputSchemas.servicesListDefinitions,
		output: DatadogEndpointOutputSchemas.servicesListDefinitions,
	},
	'spans.search': {
		input: DatadogEndpointInputSchemas.spansSearch,
		output: DatadogEndpointOutputSchemas.spansSearch,
	},
	'spans.aggregate': {
		input: DatadogEndpointInputSchemas.spansAggregate,
		output: DatadogEndpointOutputSchemas.spansAggregate,
	},
	'logs.search': {
		input: DatadogEndpointInputSchemas.logsSearch,
		output: DatadogEndpointOutputSchemas.logsSearch,
	},
	'logs.aggregate': {
		input: DatadogEndpointInputSchemas.logsAggregate,
		output: DatadogEndpointOutputSchemas.logsAggregate,
	},
	'logs.listIndexes': {
		input: DatadogEndpointInputSchemas.logsListIndexes,
		output: DatadogEndpointOutputSchemas.logsListIndexes,
	},
	'metrics.listActive': {
		input: DatadogEndpointInputSchemas.metricsListActive,
		output: DatadogEndpointOutputSchemas.metricsListActive,
	},
	'metrics.query': {
		input: DatadogEndpointInputSchemas.metricsQuery,
		output: DatadogEndpointOutputSchemas.metricsQuery,
	},
	'metrics.submit': {
		input: DatadogEndpointInputSchemas.metricsSubmit,
		output: DatadogEndpointOutputSchemas.metricsSubmit,
	},
	'users.list': {
		input: DatadogEndpointInputSchemas.usersList,
		output: DatadogEndpointOutputSchemas.usersList,
	},
	'roles.list': {
		input: DatadogEndpointInputSchemas.rolesList,
		output: DatadogEndpointOutputSchemas.rolesList,
	},
	'apiKeys.list': {
		input: DatadogEndpointInputSchemas.apiKeysList,
		output: DatadogEndpointOutputSchemas.apiKeysList,
	},
	'incidents.list': {
		input: DatadogEndpointInputSchemas.incidentsList,
		output: DatadogEndpointOutputSchemas.incidentsList,
	},
	'aws.list': {
		input: DatadogEndpointInputSchemas.awsList,
		output: DatadogEndpointOutputSchemas.awsList,
	},
	'usage.getSummary': {
		input: DatadogEndpointInputSchemas.usageGetSummary,
		output: DatadogEndpointOutputSchemas.usageGetSummary,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof datadogEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Risk-level metadata for each Datadog endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const datadogEndpointMeta = {
	'dashboards.list': { riskLevel: 'read', description: 'List dashboards' },
	'dashboards.get': {
		riskLevel: 'read',
		description: 'Get a dashboard with its widgets',
	},
	'dashboards.create': {
		riskLevel: 'write',
		description: 'Create a dashboard',
	},
	'dashboards.update': {
		riskLevel: 'write',
		description: 'Update a dashboard',
	},
	'dashboards.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a dashboard [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'monitors.list': { riskLevel: 'read', description: 'List monitors' },
	'monitors.search': { riskLevel: 'read', description: 'Search monitors' },
	'monitors.get': { riskLevel: 'read', description: 'Get a monitor' },
	'monitors.create': { riskLevel: 'write', description: 'Create a monitor' },
	'monitors.update': { riskLevel: 'write', description: 'Update a monitor' },
	'monitors.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a monitor [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'monitors.mute': {
		riskLevel: 'write',
		description: 'Mute a monitor (suppresses alerting)',
	},
	'monitors.unmute': { riskLevel: 'write', description: 'Unmute a monitor' },
	'slos.list': { riskLevel: 'read', description: 'List SLOs' },
	'slos.create': { riskLevel: 'write', description: 'Create an SLO' },
	'synthetics.listTests': {
		riskLevel: 'read',
		description: 'List synthetic tests',
	},
	'synthetics.getApiTest': {
		riskLevel: 'read',
		description: 'Get a synthetic API test',
	},
	'synthetics.createApiTest': {
		riskLevel: 'write',
		description: 'Create a synthetic API test',
	},
	'synthetics.listLocations': {
		riskLevel: 'read',
		description: 'List synthetic test locations',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List events in a time window',
	},
	'events.create': { riskLevel: 'write', description: 'Post an event' },
	'downtimes.list': { riskLevel: 'read', description: 'List downtimes' },
	'downtimes.create': {
		riskLevel: 'write',
		description: 'Schedule a downtime (suppresses monitor alerts)',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get a webhook integration by name',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook integration',
	},
	'hosts.list': { riskLevel: 'read', description: 'List infrastructure hosts' },
	'hosts.totals': {
		riskLevel: 'read',
		description: 'Get host totals (active/up)',
	},
	'tags.list': { riskLevel: 'read', description: 'List host tags' },
	'tags.getHost': { riskLevel: 'read', description: 'Get tags for a host' },
	'tags.updateHost': {
		riskLevel: 'write',
		description: 'Replace tags for a host',
	},
	'services.listDefinitions': {
		riskLevel: 'read',
		description: 'List APM service definitions',
	},
	'spans.search': { riskLevel: 'read', description: 'Search APM spans' },
	'spans.aggregate': {
		riskLevel: 'read',
		description: 'Aggregate APM span analytics',
	},
	'logs.search': { riskLevel: 'read', description: 'Search logs' },
	'logs.aggregate': {
		riskLevel: 'read',
		description: 'Aggregate log analytics',
	},
	'logs.listIndexes': { riskLevel: 'read', description: 'List log indexes' },
	'metrics.listActive': {
		riskLevel: 'read',
		description: 'List actively reporting metrics',
	},
	'metrics.query': {
		riskLevel: 'read',
		description: 'Query timeseries points',
	},
	'metrics.submit': {
		riskLevel: 'write',
		description: 'Submit metric series points',
	},
	'users.list': { riskLevel: 'read', description: 'List organization users' },
	'roles.list': { riskLevel: 'read', description: 'List roles' },
	'apiKeys.list': {
		riskLevel: 'read',
		description: 'List API key metadata',
	},
	'incidents.list': { riskLevel: 'read', description: 'List incidents' },
	'aws.list': {
		riskLevel: 'read',
		description: 'List AWS integration accounts',
	},
	'usage.getSummary': {
		riskLevel: 'read',
		description: 'Get usage summary across products',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof datadogEndpointsNested>;

export type BaseDatadogPlugin<T extends DatadogPluginOptions> = CorsairPlugin<
	'datadog',
	typeof DatadogSchema,
	typeof datadogEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof datadogAuthConfig
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * because the internal plugin has to provide options for all possible auth
 * methods while the external plugin narrows to the user's selected method.
 */
export type InternalDatadogPlugin = BaseDatadogPlugin<DatadogPluginOptions>;

export type ExternalDatadogPlugin<T extends DatadogPluginOptions> =
	BaseDatadogPlugin<T>;

export function datadog<const T extends DatadogPluginOptions>(
	incomingOptions: DatadogPluginOptions & T = {} as DatadogPluginOptions & T,
): ExternalDatadogPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'datadog',
		authConfig: datadogAuthConfig,
		schema: DatadogSchema,
		options: options,
		hooks: options.hooks,
		endpoints: datadogEndpointsNested,
		webhooks: {},
		endpointMeta: datadogEndpointMeta,
		endpointSchemas: datadogEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DatadogKeyBuilderContext, _source) => {
			if (options.key) {
				return options.key;
			}

			if (options.credentials) {
				return packDatadogKey(options.credentials);
			}

			if (ctx.authType === 'api_key') {
				const [apiKey, appKey, site] = await Promise.all([
					ctx.keys.get_api_key(),
					ctx.keys.get_app_key(),
					ctx.keys.get_site(),
				]);

				if (!apiKey) {
					throw new AuthMissingError('datadog', 'api_key');
				}

				return packDatadogKey({
					apiKey,
					appKey: appKey ?? undefined,
					site: site ?? undefined,
				});
			}

			throw new AuthMissingError('datadog', 'api_key');
		},
	} satisfies InternalDatadogPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	DatadogCredentials,
	DatadogQueryValue,
	DatadogRequestOptions,
} from './client';
export {
	DatadogAPIError,
	DEFAULT_DATADOG_SITE,
	packDatadogKey,
	parseDatadogKey,
} from './client';
export type {
	Dashboard,
	DashboardSummary,
	DatadogEndpointInputs,
	DatadogEndpointOutputs,
	DatadogEvent,
	Downtime,
	Host,
	Monitor,
	Slo,
	SyntheticsTest,
	WebhookConfig,
} from './endpoints/types';
export {
	DatadogEndpointInputSchemas,
	DatadogEndpointOutputSchemas,
} from './endpoints/types';
export type {
	DatadogDashboardEntity,
	DatadogIncidentEntity,
	DatadogMonitorEntity,
	DatadogSloEntity,
} from './schema';
export { DatadogSchema } from './schema';
