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
	Account,
	Incidents,
	MaintenanceWindows,
	MonitorGroups,
	Monitors,
	Stats,
	StatusPages,
	Tags,
} from './endpoints';
import type {
	UptimeRobotEndpointInputs,
	UptimeRobotEndpointOutputs,
} from './endpoints/types';
import {
	UptimeRobotEndpointInputSchemas,
	UptimeRobotEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { UptimeRobotSchema } from './schema';

export type UptimeRobotPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalUptimeRobotPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof uptimeRobotEndpointsNested>;
};

export type UptimeRobotContext = CorsairPluginContext<
	typeof UptimeRobotSchema,
	UptimeRobotPluginOptions
>;

export type UptimeRobotKeyBuilderContext =
	KeyBuilderContext<UptimeRobotPluginOptions>;

export type UptimeRobotBoundEndpoints = BindEndpoints<
	typeof uptimeRobotEndpointsNested
>;

type UptimeRobotEndpoint<K extends keyof UptimeRobotEndpointOutputs> =
	CorsairEndpoint<
		UptimeRobotContext,
		UptimeRobotEndpointInputs[K],
		UptimeRobotEndpointOutputs[K]
	>;

export type UptimeRobotEndpoints = {
	monitorsList: UptimeRobotEndpoint<'monitorsList'>;
	monitorsGet: UptimeRobotEndpoint<'monitorsGet'>;
	monitorsCreate: UptimeRobotEndpoint<'monitorsCreate'>;
	monitorsUpdate: UptimeRobotEndpoint<'monitorsUpdate'>;
	monitorsDelete: UptimeRobotEndpoint<'monitorsDelete'>;
	monitorsPause: UptimeRobotEndpoint<'monitorsPause'>;
	monitorsStart: UptimeRobotEndpoint<'monitorsStart'>;
	monitorsReset: UptimeRobotEndpoint<'monitorsReset'>;
	statsUptime: UptimeRobotEndpoint<'statsUptime'>;
	statsMonitorUptime: UptimeRobotEndpoint<'statsMonitorUptime'>;
	statsResponseTime: UptimeRobotEndpoint<'statsResponseTime'>;
	incidentsList: UptimeRobotEndpoint<'incidentsList'>;
	incidentsGet: UptimeRobotEndpoint<'incidentsGet'>;
	incidentsComments: UptimeRobotEndpoint<'incidentsComments'>;
	incidentsAddComment: UptimeRobotEndpoint<'incidentsAddComment'>;
	statusPagesList: UptimeRobotEndpoint<'statusPagesList'>;
	statusPagesGet: UptimeRobotEndpoint<'statusPagesGet'>;
	statusPagesCreate: UptimeRobotEndpoint<'statusPagesCreate'>;
	statusPagesDelete: UptimeRobotEndpoint<'statusPagesDelete'>;
	statusPagesAnnouncements: UptimeRobotEndpoint<'statusPagesAnnouncements'>;
	statusPagesCreateAnnouncement: UptimeRobotEndpoint<'statusPagesCreateAnnouncement'>;
	maintenanceWindowsList: UptimeRobotEndpoint<'maintenanceWindowsList'>;
	maintenanceWindowsCreate: UptimeRobotEndpoint<'maintenanceWindowsCreate'>;
	maintenanceWindowsUpdate: UptimeRobotEndpoint<'maintenanceWindowsUpdate'>;
	maintenanceWindowsDelete: UptimeRobotEndpoint<'maintenanceWindowsDelete'>;
	monitorGroupsList: UptimeRobotEndpoint<'monitorGroupsList'>;
	monitorGroupsCreate: UptimeRobotEndpoint<'monitorGroupsCreate'>;
	monitorGroupsDelete: UptimeRobotEndpoint<'monitorGroupsDelete'>;
	tagsList: UptimeRobotEndpoint<'tagsList'>;
	tagsDelete: UptimeRobotEndpoint<'tagsDelete'>;
	accountMe: UptimeRobotEndpoint<'accountMe'>;
};

const uptimeRobotEndpointsNested = {
	monitors: {
		list: Monitors.list,
		get: Monitors.get,
		create: Monitors.create,
		update: Monitors.update,
		delete: Monitors.remove,
		pause: Monitors.pause,
		start: Monitors.start,
		reset: Monitors.reset,
	},
	stats: {
		uptime: Stats.uptime,
		monitorUptime: Stats.monitorUptime,
		responseTime: Stats.responseTime,
	},
	incidents: {
		list: Incidents.list,
		get: Incidents.get,
		comments: Incidents.comments,
		addComment: Incidents.addComment,
	},
	statusPages: {
		list: StatusPages.list,
		get: StatusPages.get,
		create: StatusPages.create,
		delete: StatusPages.remove,
		announcements: StatusPages.announcements,
		createAnnouncement: StatusPages.createAnnouncement,
	},
	maintenanceWindows: {
		list: MaintenanceWindows.list,
		create: MaintenanceWindows.create,
		update: MaintenanceWindows.update,
		delete: MaintenanceWindows.remove,
	},
	monitorGroups: {
		list: MonitorGroups.list,
		create: MonitorGroups.create,
		delete: MonitorGroups.remove,
	},
	tags: {
		list: Tags.list,
		delete: Tags.remove,
	},
	account: {
		me: Account.me,
	},
} as const;

export const uptimeRobotEndpointSchemas = {
	'monitors.list': {
		input: UptimeRobotEndpointInputSchemas.monitorsList,
		output: UptimeRobotEndpointOutputSchemas.monitorsList,
	},
	'monitors.get': {
		input: UptimeRobotEndpointInputSchemas.monitorsGet,
		output: UptimeRobotEndpointOutputSchemas.monitorsGet,
	},
	'monitors.create': {
		input: UptimeRobotEndpointInputSchemas.monitorsCreate,
		output: UptimeRobotEndpointOutputSchemas.monitorsCreate,
	},
	'monitors.update': {
		input: UptimeRobotEndpointInputSchemas.monitorsUpdate,
		output: UptimeRobotEndpointOutputSchemas.monitorsUpdate,
	},
	'monitors.delete': {
		input: UptimeRobotEndpointInputSchemas.monitorsDelete,
		output: UptimeRobotEndpointOutputSchemas.monitorsDelete,
	},
	'monitors.pause': {
		input: UptimeRobotEndpointInputSchemas.monitorsPause,
		output: UptimeRobotEndpointOutputSchemas.monitorsPause,
	},
	'monitors.start': {
		input: UptimeRobotEndpointInputSchemas.monitorsStart,
		output: UptimeRobotEndpointOutputSchemas.monitorsStart,
	},
	'monitors.reset': {
		input: UptimeRobotEndpointInputSchemas.monitorsReset,
		output: UptimeRobotEndpointOutputSchemas.monitorsReset,
	},
	'stats.uptime': {
		input: UptimeRobotEndpointInputSchemas.statsUptime,
		output: UptimeRobotEndpointOutputSchemas.statsUptime,
	},
	'stats.monitorUptime': {
		input: UptimeRobotEndpointInputSchemas.statsMonitorUptime,
		output: UptimeRobotEndpointOutputSchemas.statsMonitorUptime,
	},
	'stats.responseTime': {
		input: UptimeRobotEndpointInputSchemas.statsResponseTime,
		output: UptimeRobotEndpointOutputSchemas.statsResponseTime,
	},
	'incidents.list': {
		input: UptimeRobotEndpointInputSchemas.incidentsList,
		output: UptimeRobotEndpointOutputSchemas.incidentsList,
	},
	'incidents.get': {
		input: UptimeRobotEndpointInputSchemas.incidentsGet,
		output: UptimeRobotEndpointOutputSchemas.incidentsGet,
	},
	'incidents.comments': {
		input: UptimeRobotEndpointInputSchemas.incidentsComments,
		output: UptimeRobotEndpointOutputSchemas.incidentsComments,
	},
	'incidents.addComment': {
		input: UptimeRobotEndpointInputSchemas.incidentsAddComment,
		output: UptimeRobotEndpointOutputSchemas.incidentsAddComment,
	},
	'statusPages.list': {
		input: UptimeRobotEndpointInputSchemas.statusPagesList,
		output: UptimeRobotEndpointOutputSchemas.statusPagesList,
	},
	'statusPages.get': {
		input: UptimeRobotEndpointInputSchemas.statusPagesGet,
		output: UptimeRobotEndpointOutputSchemas.statusPagesGet,
	},
	'statusPages.create': {
		input: UptimeRobotEndpointInputSchemas.statusPagesCreate,
		output: UptimeRobotEndpointOutputSchemas.statusPagesCreate,
	},
	'statusPages.delete': {
		input: UptimeRobotEndpointInputSchemas.statusPagesDelete,
		output: UptimeRobotEndpointOutputSchemas.statusPagesDelete,
	},
	'statusPages.announcements': {
		input: UptimeRobotEndpointInputSchemas.statusPagesAnnouncements,
		output: UptimeRobotEndpointOutputSchemas.statusPagesAnnouncements,
	},
	'statusPages.createAnnouncement': {
		input: UptimeRobotEndpointInputSchemas.statusPagesCreateAnnouncement,
		output: UptimeRobotEndpointOutputSchemas.statusPagesCreateAnnouncement,
	},
	'maintenanceWindows.list': {
		input: UptimeRobotEndpointInputSchemas.maintenanceWindowsList,
		output: UptimeRobotEndpointOutputSchemas.maintenanceWindowsList,
	},
	'maintenanceWindows.create': {
		input: UptimeRobotEndpointInputSchemas.maintenanceWindowsCreate,
		output: UptimeRobotEndpointOutputSchemas.maintenanceWindowsCreate,
	},
	'maintenanceWindows.update': {
		input: UptimeRobotEndpointInputSchemas.maintenanceWindowsUpdate,
		output: UptimeRobotEndpointOutputSchemas.maintenanceWindowsUpdate,
	},
	'maintenanceWindows.delete': {
		input: UptimeRobotEndpointInputSchemas.maintenanceWindowsDelete,
		output: UptimeRobotEndpointOutputSchemas.maintenanceWindowsDelete,
	},
	'monitorGroups.list': {
		input: UptimeRobotEndpointInputSchemas.monitorGroupsList,
		output: UptimeRobotEndpointOutputSchemas.monitorGroupsList,
	},
	'monitorGroups.create': {
		input: UptimeRobotEndpointInputSchemas.monitorGroupsCreate,
		output: UptimeRobotEndpointOutputSchemas.monitorGroupsCreate,
	},
	'monitorGroups.delete': {
		input: UptimeRobotEndpointInputSchemas.monitorGroupsDelete,
		output: UptimeRobotEndpointOutputSchemas.monitorGroupsDelete,
	},
	'tags.list': {
		input: UptimeRobotEndpointInputSchemas.tagsList,
		output: UptimeRobotEndpointOutputSchemas.tagsList,
	},
	'tags.delete': {
		input: UptimeRobotEndpointInputSchemas.tagsDelete,
		output: UptimeRobotEndpointOutputSchemas.tagsDelete,
	},
	'account.me': {
		input: UptimeRobotEndpointInputSchemas.accountMe,
		output: UptimeRobotEndpointOutputSchemas.accountMe,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof uptimeRobotEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const uptimeRobotEndpointMeta = {
	'monitors.list': {
		riskLevel: 'read',
		description:
			'List monitors, filtered by name, URL, status, tag, group or custom field, with cursor paging',
	},
	'monitors.get': {
		riskLevel: 'read',
		description:
			'Read one monitor with its current status, interval, tags and last incident',
	},
	'monitors.create': {
		riskLevel: 'write',
		description:
			'Create a monitor of any type; the body is checked against the type, so a PORT monitor needs a port and a HEARTBEAT one takes no URL',
	},
	'monitors.update': {
		riskLevel: 'write',
		description:
			'Change a monitor: its name, URL, interval, tags, group, custom fields or credentials; omitted fields keep their value',
	},
	'monitors.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a monitor and its check history; this cannot be undone',
	},
	'monitors.pause': {
		riskLevel: 'write',
		description:
			'Pause a monitor so it stops checking and stops alerting until monitors.start is called',
	},
	'monitors.start': {
		riskLevel: 'write',
		description:
			'Start a paused monitor, or resume one that was paused by UptimeRobot itself after repeated failures',
	},
	'monitors.reset': {
		riskLevel: 'destructive',
		description:
			"Discard a monitor's accumulated statistics and incident history; the monitor itself keeps running",
	},
	'stats.uptime': {
		riskLevel: 'read',
		description:
			'Aggregate uptime across every monitor for a timeframe, with incident totals, MTBF and a log of entries',
	},
	'stats.monitorUptime': {
		riskLevel: 'read',
		description:
			'Uptime percentage and downtime for one monitor over a range of up to 90 days',
	},
	'stats.responseTime': {
		riskLevel: 'read',
		description:
			'Response-time minimum, maximum and average for one monitor, optionally with the full time series',
	},
	'incidents.list': {
		riskLevel: 'read',
		description:
			'List incidents newest first, filtered by monitor, date range, type or root-cause group',
	},
	'incidents.get': {
		riskLevel: 'read',
		description:
			'Read one incident with its root cause: the failing URL, HTTP status and headers',
	},
	'incidents.comments': {
		riskLevel: 'read',
		description: 'List the comments on an incident, with who wrote each one',
	},
	'incidents.addComment': {
		riskLevel: 'write',
		description:
			'Add a comment to an incident, optionally publishing it to the status page at the same time',
	},
	'statusPages.list': {
		riskLevel: 'read',
		description: 'List the public status pages in the account, with paging',
	},
	'statusPages.get': {
		riskLevel: 'read',
		description:
			'Read one status page with its monitors, custom domain and settings',
	},
	'statusPages.create': {
		riskLevel: 'write',
		description:
			'Create a public status page showing chosen monitors or tags, optionally behind a password and on a custom domain',
	},
	'statusPages.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a status page; the monitors it showed keep running',
	},
	'statusPages.announcements': {
		riskLevel: 'read',
		description:
			'List a status page announcements, filtered by OFFLINE, PENDING, PUBLISHED or ARCHIVED',
	},
	'statusPages.createAnnouncement': {
		riskLevel: 'write',
		description:
			'Post an announcement to a status page: Info, Maintenance or Issue, as a draft, scheduled or published now',
	},
	'maintenanceWindows.list': {
		riskLevel: 'read',
		description: 'List maintenance windows with their schedule and monitors',
	},
	'maintenanceWindows.create': {
		riskLevel: 'write',
		description:
			'Create a maintenance window that suppresses alerts once, daily, weekly or monthly for a set duration',
	},
	'maintenanceWindows.update': {
		riskLevel: 'write',
		description:
			'Change a window its schedule, monitors or status; paused stops it suppressing alerts',
	},
	'maintenanceWindows.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a maintenance window, so its monitors start alerting again during that period',
	},
	'monitorGroups.list': {
		riskLevel: 'read',
		description: 'List monitor groups',
	},
	'monitorGroups.create': {
		riskLevel: 'write',
		description:
			'Create a monitor group, filling it with monitors by id or by moving another group whole',
	},
	'monitorGroups.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a monitor group; its monitors are kept and become ungrouped',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List tags, paging by nextCursorId',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a tag, also removing it from every monitor that carried it; the monitors stay',
	},
	'account.me': {
		riskLevel: 'read',
		description:
			'Read the account plan, monitor allowance and monitors in use; the cheapest way to check a key',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof uptimeRobotEndpointsNested
>;

export type BaseUptimeRobotPlugin<T extends UptimeRobotPluginOptions> =
	CorsairPlugin<
		'uptimerobot',
		typeof UptimeRobotSchema,
		typeof uptimeRobotEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalUptimeRobotPlugin =
	BaseUptimeRobotPlugin<UptimeRobotPluginOptions>;

export type ExternalUptimeRobotPlugin<T extends UptimeRobotPluginOptions> =
	BaseUptimeRobotPlugin<T>;

export function uptimerobot<const T extends UptimeRobotPluginOptions>(
	incomingOptions: UptimeRobotPluginOptions &
		T = {} as UptimeRobotPluginOptions & T,
): ExternalUptimeRobotPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'uptimerobot',
		schema: UptimeRobotSchema,
		options: options,
		hooks: options.hooks,
		endpoints: uptimeRobotEndpointsNested,
		webhooks: {},
		endpointMeta: uptimeRobotEndpointMeta,
		endpointSchemas: uptimeRobotEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: UptimeRobotKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('uptimerobot', ctx.authType ?? 'api_key');
		},
	} satisfies InternalUptimeRobotPlugin;
}

export { UptimeRobotAPIError } from './client';

export type {
	AccountMeInput,
	AccountMeResponse,
	IncidentCommentsInput,
	IncidentCommentsResponse,
	IncidentsAddCommentInput,
	IncidentsAddCommentResponse,
	IncidentsGetInput,
	IncidentsGetResponse,
	IncidentsListInput,
	IncidentsListResponse,
	MaintenanceWindowsCreateInput,
	MaintenanceWindowsCreateResponse,
	MaintenanceWindowsDeleteInput,
	MaintenanceWindowsDeleteResponse,
	MaintenanceWindowsListInput,
	MaintenanceWindowsListResponse,
	MaintenanceWindowsUpdateInput,
	MaintenanceWindowsUpdateResponse,
	MonitorActionInput,
	MonitorActionResponse,
	MonitorGroupsCreateInput,
	MonitorGroupsCreateResponse,
	MonitorGroupsDeleteInput,
	MonitorGroupsDeleteResponse,
	MonitorGroupsListInput,
	MonitorGroupsListResponse,
	MonitorsCreateInput,
	MonitorsCreateResponse,
	MonitorsDeleteInput,
	MonitorsDeleteResponse,
	MonitorsGetInput,
	MonitorsGetResponse,
	MonitorsListInput,
	MonitorsListResponse,
	MonitorsResetInput,
	MonitorsResetResponse,
	MonitorsUpdateInput,
	MonitorsUpdateResponse,
	StatsMonitorUptimeInput,
	StatsMonitorUptimeResponse,
	StatsResponseTimeInput,
	StatsResponseTimeResponse,
	StatsUptimeInput,
	StatsUptimeResponse,
	StatusPagesAnnouncementsInput,
	StatusPagesAnnouncementsResponse,
	StatusPagesCreateAnnouncementInput,
	StatusPagesCreateAnnouncementResponse,
	StatusPagesCreateInput,
	StatusPagesCreateResponse,
	StatusPagesDeleteInput,
	StatusPagesDeleteResponse,
	StatusPagesGetInput,
	StatusPagesGetResponse,
	StatusPagesListInput,
	StatusPagesListResponse,
	TagsDeleteInput,
	TagsDeleteResponse,
	TagsListInput,
	TagsListResponse,
	UptimeRobotAnnouncement,
	UptimeRobotEndpointInputs,
	UptimeRobotEndpointOutputs,
	UptimeRobotIncident,
	UptimeRobotIncidentComment,
	UptimeRobotMaintenanceWindow,
	UptimeRobotMonitor,
	UptimeRobotMonitorGroup,
	UptimeRobotStatusPage,
	UptimeRobotTag,
} from './endpoints/types';
