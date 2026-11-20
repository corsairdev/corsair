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
import {
	ContactGroups,
	Heartbeat,
	Locations,
	MaintenanceWindows,
	Pagespeed,
	SSL,
	Uptime,
} from './endpoints';
import type {
	StatusCakeEndpointInputs,
	StatusCakeEndpointOutputs,
} from './endpoints/types';
import {
	StatusCakeEndpointInputSchemas,
	StatusCakeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { StatuscakeSchema } from './schema';

export type StatusCakePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** StatusCake API token (account panel, Manage API keys). */
	key?: string;
	hooks?: InternalStatusCakePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof statuscakeEndpointsNested>;
};

export type StatusCakeContext = CorsairPluginContext<
	typeof StatuscakeSchema,
	StatusCakePluginOptions
>;

export type StatusCakeKeyBuilderContext =
	KeyBuilderContext<StatusCakePluginOptions>;

export type StatusCakeBoundEndpoints = BindEndpoints<
	typeof statuscakeEndpointsNested
>;

type StatusCakeEndpoint<K extends keyof StatusCakeEndpointOutputs> =
	CorsairEndpoint<
		StatusCakeContext,
		StatusCakeEndpointInputs[K],
		StatusCakeEndpointOutputs[K]
	>;

export type StatusCakeEndpoints = {
	[K in keyof StatusCakeEndpointOutputs]: StatusCakeEndpoint<K>;
};

const statuscakeEndpointsNested = {
	contactGroups: {
		list: ContactGroups.list,
		create: ContactGroups.create,
		get: ContactGroups.get,
		update: ContactGroups.update,
		delete: ContactGroups.remove,
	},
	heartbeat: {
		list: Heartbeat.list,
		create: Heartbeat.create,
		get: Heartbeat.get,
		update: Heartbeat.update,
		delete: Heartbeat.remove,
	},
	maintenanceWindows: {
		list: MaintenanceWindows.list,
		create: MaintenanceWindows.create,
		get: MaintenanceWindows.get,
		update: MaintenanceWindows.update,
		delete: MaintenanceWindows.remove,
	},
	pagespeed: {
		list: Pagespeed.list,
		create: Pagespeed.create,
		get: Pagespeed.get,
		update: Pagespeed.update,
		delete: Pagespeed.remove,
		history: Pagespeed.history,
	},
	ssl: {
		list: SSL.list,
		create: SSL.create,
		get: SSL.get,
		update: SSL.update,
		delete: SSL.remove,
	},
	uptime: {
		list: Uptime.list,
		create: Uptime.create,
		get: Uptime.get,
		update: Uptime.update,
		delete: Uptime.remove,
		alerts: Uptime.alerts,
		history: Uptime.history,
		periods: Uptime.periods,
	},
	locations: {
		uptime: Locations.uptime,
		pagespeed: Locations.pagespeed,
	},
} as const;

export const statuscakeEndpointSchemas = {
	'contactGroups.list': {
		input: StatusCakeEndpointInputSchemas.contactGroupsList,
		output: StatusCakeEndpointOutputSchemas.contactGroupsList,
	},
	'contactGroups.create': {
		input: StatusCakeEndpointInputSchemas.contactGroupsCreate,
		output: StatusCakeEndpointOutputSchemas.contactGroupsCreate,
	},
	'contactGroups.get': {
		input: StatusCakeEndpointInputSchemas.contactGroupsGet,
		output: StatusCakeEndpointOutputSchemas.contactGroupsGet,
	},
	'contactGroups.update': {
		input: StatusCakeEndpointInputSchemas.contactGroupsUpdate,
		output: StatusCakeEndpointOutputSchemas.contactGroupsUpdate,
	},
	'contactGroups.delete': {
		input: StatusCakeEndpointInputSchemas.contactGroupsDelete,
		output: StatusCakeEndpointOutputSchemas.contactGroupsDelete,
	},
	'heartbeat.list': {
		input: StatusCakeEndpointInputSchemas.heartbeatList,
		output: StatusCakeEndpointOutputSchemas.heartbeatList,
	},
	'heartbeat.create': {
		input: StatusCakeEndpointInputSchemas.heartbeatCreate,
		output: StatusCakeEndpointOutputSchemas.heartbeatCreate,
	},
	'heartbeat.get': {
		input: StatusCakeEndpointInputSchemas.heartbeatGet,
		output: StatusCakeEndpointOutputSchemas.heartbeatGet,
	},
	'heartbeat.update': {
		input: StatusCakeEndpointInputSchemas.heartbeatUpdate,
		output: StatusCakeEndpointOutputSchemas.heartbeatUpdate,
	},
	'heartbeat.delete': {
		input: StatusCakeEndpointInputSchemas.heartbeatDelete,
		output: StatusCakeEndpointOutputSchemas.heartbeatDelete,
	},
	'maintenanceWindows.list': {
		input: StatusCakeEndpointInputSchemas.maintenanceWindowsList,
		output: StatusCakeEndpointOutputSchemas.maintenanceWindowsList,
	},
	'maintenanceWindows.create': {
		input: StatusCakeEndpointInputSchemas.maintenanceWindowsCreate,
		output: StatusCakeEndpointOutputSchemas.maintenanceWindowsCreate,
	},
	'maintenanceWindows.get': {
		input: StatusCakeEndpointInputSchemas.maintenanceWindowsGet,
		output: StatusCakeEndpointOutputSchemas.maintenanceWindowsGet,
	},
	'maintenanceWindows.update': {
		input: StatusCakeEndpointInputSchemas.maintenanceWindowsUpdate,
		output: StatusCakeEndpointOutputSchemas.maintenanceWindowsUpdate,
	},
	'maintenanceWindows.delete': {
		input: StatusCakeEndpointInputSchemas.maintenanceWindowsDelete,
		output: StatusCakeEndpointOutputSchemas.maintenanceWindowsDelete,
	},
	'pagespeed.list': {
		input: StatusCakeEndpointInputSchemas.pagespeedList,
		output: StatusCakeEndpointOutputSchemas.pagespeedList,
	},
	'pagespeed.create': {
		input: StatusCakeEndpointInputSchemas.pagespeedCreate,
		output: StatusCakeEndpointOutputSchemas.pagespeedCreate,
	},
	'pagespeed.get': {
		input: StatusCakeEndpointInputSchemas.pagespeedGet,
		output: StatusCakeEndpointOutputSchemas.pagespeedGet,
	},
	'pagespeed.update': {
		input: StatusCakeEndpointInputSchemas.pagespeedUpdate,
		output: StatusCakeEndpointOutputSchemas.pagespeedUpdate,
	},
	'pagespeed.delete': {
		input: StatusCakeEndpointInputSchemas.pagespeedDelete,
		output: StatusCakeEndpointOutputSchemas.pagespeedDelete,
	},
	'pagespeed.history': {
		input: StatusCakeEndpointInputSchemas.pagespeedHistory,
		output: StatusCakeEndpointOutputSchemas.pagespeedHistory,
	},
	'ssl.list': {
		input: StatusCakeEndpointInputSchemas.sslList,
		output: StatusCakeEndpointOutputSchemas.sslList,
	},
	'ssl.create': {
		input: StatusCakeEndpointInputSchemas.sslCreate,
		output: StatusCakeEndpointOutputSchemas.sslCreate,
	},
	'ssl.get': {
		input: StatusCakeEndpointInputSchemas.sslGet,
		output: StatusCakeEndpointOutputSchemas.sslGet,
	},
	'ssl.update': {
		input: StatusCakeEndpointInputSchemas.sslUpdate,
		output: StatusCakeEndpointOutputSchemas.sslUpdate,
	},
	'ssl.delete': {
		input: StatusCakeEndpointInputSchemas.sslDelete,
		output: StatusCakeEndpointOutputSchemas.sslDelete,
	},
	'uptime.list': {
		input: StatusCakeEndpointInputSchemas.uptimeList,
		output: StatusCakeEndpointOutputSchemas.uptimeList,
	},
	'uptime.create': {
		input: StatusCakeEndpointInputSchemas.uptimeCreate,
		output: StatusCakeEndpointOutputSchemas.uptimeCreate,
	},
	'uptime.get': {
		input: StatusCakeEndpointInputSchemas.uptimeGet,
		output: StatusCakeEndpointOutputSchemas.uptimeGet,
	},
	'uptime.update': {
		input: StatusCakeEndpointInputSchemas.uptimeUpdate,
		output: StatusCakeEndpointOutputSchemas.uptimeUpdate,
	},
	'uptime.delete': {
		input: StatusCakeEndpointInputSchemas.uptimeDelete,
		output: StatusCakeEndpointOutputSchemas.uptimeDelete,
	},
	'uptime.alerts': {
		input: StatusCakeEndpointInputSchemas.uptimeAlerts,
		output: StatusCakeEndpointOutputSchemas.uptimeAlerts,
	},
	'uptime.history': {
		input: StatusCakeEndpointInputSchemas.uptimeHistory,
		output: StatusCakeEndpointOutputSchemas.uptimeHistory,
	},
	'uptime.periods': {
		input: StatusCakeEndpointInputSchemas.uptimePeriods,
		output: StatusCakeEndpointOutputSchemas.uptimePeriods,
	},
	'locations.uptime': {
		input: StatusCakeEndpointInputSchemas.uptimeLocations,
		output: StatusCakeEndpointOutputSchemas.uptimeLocations,
	},
	'locations.pagespeed': {
		input: StatusCakeEndpointInputSchemas.pagespeedLocations,
		output: StatusCakeEndpointOutputSchemas.pagespeedLocations,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof statuscakeEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const statuscakeEndpointMeta = {
	'contactGroups.list': {
		riskLevel: 'read',
		description:
			'List contact groups with their email addresses, mobile numbers and integrations, paged',
	},
	'contactGroups.create': {
		riskLevel: 'write',
		description: 'Create a contact group to alert when a check fails',
	},
	'contactGroups.get': {
		riskLevel: 'read',
		description: 'Get one contact group by ID',
	},
	'contactGroups.update': {
		riskLevel: 'write',
		description:
			"Change a contact group's name, addresses, numbers, integrations or ping URL; only the fields passed change",
	},
	'contactGroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a contact group; checks using it keep running but no longer alert it',
	},
	'heartbeat.list': {
		riskLevel: 'read',
		description:
			'List heartbeat (cron monitoring) checks with their status and uptime, filtered by state or tags and paged',
	},
	'heartbeat.create': {
		riskLevel: 'write',
		description:
			'Create a heartbeat check that alerts when a job stops pinging its URL',
	},
	'heartbeat.get': {
		riskLevel: 'read',
		description: 'Get one heartbeat check with its last tested time and uptime',
	},
	'heartbeat.update': {
		riskLevel: 'write',
		description:
			"Change a heartbeat check's name, period, contact groups, host, paused state or tags; only the fields passed change",
	},
	'heartbeat.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a heartbeat check; this cannot be undone',
	},
	'maintenanceWindows.list': {
		riskLevel: 'read',
		description:
			'List maintenance windows with their state and schedule, paged',
	},
	'maintenanceWindows.create': {
		riskLevel: 'write',
		description:
			'Create a maintenance window that silences chosen uptime checks, by ID or by tags, for a time period',
	},
	'maintenanceWindows.get': {
		riskLevel: 'read',
		description: 'Get one maintenance window by ID',
	},
	'maintenanceWindows.update': {
		riskLevel: 'write',
		description:
			"Change a maintenance window's schedule, timezone, repeat interval, covered checks or tags; only the fields passed change",
	},
	'maintenanceWindows.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a maintenance window; alerts resume immediately',
	},
	'pagespeed.list': {
		riskLevel: 'read',
		description: 'List pagespeed checks with their latest stats, paged',
	},
	'pagespeed.create': {
		riskLevel: 'write',
		description:
			'Create a pagespeed check that runs from a chosen region and can alert on page size or load time',
	},
	'pagespeed.get': {
		riskLevel: 'read',
		description: 'Get one pagespeed check with its latest stats',
	},
	'pagespeed.update': {
		riskLevel: 'write',
		description:
			"Change a pagespeed check's target, rate, region, alert thresholds or paused state; only the fields passed change",
	},
	'pagespeed.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a pagespeed check; this cannot be undone',
	},
	'pagespeed.history': {
		riskLevel: 'read',
		description:
			'Read recorded pagespeed results (loadtime, filesize, requests) newest first, in a time window with a next link for paging',
	},
	'ssl.list': {
		riskLevel: 'read',
		description:
			'List SSL checks with certificate validity, scores and flags, paged',
	},
	'ssl.create': {
		riskLevel: 'write',
		description: 'Create an SSL check that alerts before a certificate expires',
	},
	'ssl.get': {
		riskLevel: 'read',
		description:
			'Get one SSL check with certificate dates, issuer, scores and mixed content',
	},
	'ssl.update': {
		riskLevel: 'write',
		description:
			"Change an SSL check's target, rate, alerting or paused state; only the fields passed change",
	},
	'ssl.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete an SSL check; this cannot be undone',
	},
	'uptime.list': {
		riskLevel: 'read',
		description:
			'List uptime checks with type, status and uptime percentage, filtered by state or tags and paged',
	},
	'uptime.create': {
		riskLevel: 'write',
		description:
			'Create an uptime check for a URL, domain or port, with content checks, basic auth, regions and alert settings',
	},
	'uptime.get': {
		riskLevel: 'read',
		description: 'Get one uptime check with its full configuration and status',
	},
	'uptime.update': {
		riskLevel: 'write',
		description:
			"Change an uptime check's configuration; only the fields passed change. Sending a field empty clears it",
	},
	'uptime.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete an uptime check; this cannot be undone',
	},
	'uptime.alerts': {
		riskLevel: 'read',
		description:
			'Read the alerts a check sent, newest first, in a time window with a next link for paging',
	},
	'uptime.history': {
		riskLevel: 'read',
		description:
			'Read recorded check results (loadtime, status code) newest first, in a time window with a next link for paging',
	},
	'uptime.periods': {
		riskLevel: 'read',
		description:
			'Read the check up/down periods, newest first, in a time window with a next link for paging',
	},
	'locations.uptime': {
		riskLevel: 'read',
		description:
			'List monitoring locations uptime checks can run from, with their current status',
	},
	'locations.pagespeed': {
		riskLevel: 'read',
		description: 'List monitoring locations pagespeed checks can run from',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof statuscakeEndpointsNested
>;

export type BaseStatusCakePlugin<T extends StatusCakePluginOptions> =
	CorsairPlugin<
		'statuscake',
		typeof StatuscakeSchema,
		typeof statuscakeEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalStatusCakePlugin =
	BaseStatusCakePlugin<StatusCakePluginOptions>;

export type ExternalStatusCakePlugin<T extends StatusCakePluginOptions> =
	BaseStatusCakePlugin<T>;

export function statuscake<const T extends StatusCakePluginOptions>(
	incomingOptions: StatusCakePluginOptions & T = {} as StatusCakePluginOptions &
		T,
): ExternalStatusCakePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'statuscake',
		schema: StatuscakeSchema,
		options: options,
		hooks: options.hooks,
		endpoints: statuscakeEndpointsNested,
		webhooks: {},
		endpointMeta: statuscakeEndpointMeta,
		endpointSchemas: statuscakeEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: StatusCakeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('statuscake', ctx.authType ?? 'api_key');
		},
	} satisfies InternalStatusCakePlugin;
}

export { StatusCakeAPIError } from './client';
export type {
	StatusCakeContactGroup,
	StatusCakeEndpointInputs,
	StatusCakeEndpointOutputs,
	StatusCakeHeartbeatTest,
	StatusCakeMaintenanceWindow,
	StatusCakeMonitoringLocation,
	StatusCakePagespeedHistoryResult,
	StatusCakePagespeedTest,
	StatusCakeSSLTest,
	StatusCakeUptimeAlert,
	StatusCakeUptimeHistoryResult,
	StatusCakeUptimePeriod,
	StatusCakeUptimeTest,
} from './endpoints/types';
