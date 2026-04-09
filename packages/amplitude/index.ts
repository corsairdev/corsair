import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import {
	Annotations,
	Charts,
	Cohorts,
	Dashboards,
	Events,
	Exports,
	Users,
} from './endpoints';
import type {
	AmplitudeEndpointInputs,
	AmplitudeEndpointOutputs,
} from './endpoints/types';
import {
	AmplitudeEndpointInputSchemas,
	AmplitudeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AmplitudeSchema } from './schema';
import {
	AnnotationWebhooks,
	CohortWebhooks,
	EventWebhooks,
	ExperimentWebhooks,
	MonitorWebhooks,
} from './webhooks';
import type {
	AmplitudeAnnotationCreatedEvent,
	AmplitudeAnnotationUpdatedEvent,
	AmplitudeCohortComputedEvent,
	AmplitudeExperimentExposureEvent,
	AmplitudeIdentifyEvent,
	AmplitudeMonitorAlertEvent,
	AmplitudeTrackEvent,
	AmplitudeWebhookOutputs,
	AmplitudeWebhookPayload,
} from './webhooks/types';
import {
	AmplitudeAnnotationCreatedEventSchema,
	AmplitudeAnnotationUpdatedEventSchema,
	AmplitudeCohortComputedEventSchema,
	AmplitudeExperimentExposureEventSchema,
	AmplitudeIdentifyEventSchema,
	AmplitudeMonitorAlertEventSchema,
	AmplitudeTrackEventSchema,
} from './webhooks/types';

export type AmplitudePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAmplitudePlugin['hooks'];
	webhookHooks?: InternalAmplitudePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof amplitudeEndpointsNested>;
};

export type AmplitudeContext = CorsairPluginContext<
	typeof AmplitudeSchema,
	AmplitudePluginOptions
>;

export type AmplitudeKeyBuilderContext =
	KeyBuilderContext<AmplitudePluginOptions>;

export type AmplitudeBoundEndpoints = BindEndpoints<
	typeof amplitudeEndpointsNested
>;

type AmplitudeEndpoint<
	K extends keyof AmplitudeEndpointOutputs,
	Input = AmplitudeEndpointInputs[K],
> = CorsairEndpoint<AmplitudeContext, Input, AmplitudeEndpointOutputs[K]>;

export type AmplitudeEndpoints = {
	eventsUpload: AmplitudeEndpoint<'eventsUpload'>;
	eventsUploadBatch: AmplitudeEndpoint<'eventsUploadBatch'>;
	eventsIdentifyUser: AmplitudeEndpoint<'eventsIdentifyUser'>;
	eventsGetList: AmplitudeEndpoint<'eventsGetList'>;
	usersSearch: AmplitudeEndpoint<'usersSearch'>;
	usersGetProfile: AmplitudeEndpoint<'usersGetProfile'>;
	usersGetActivity: AmplitudeEndpoint<'usersGetActivity'>;
	cohortsList: AmplitudeEndpoint<'cohortsList'>;
	cohortsGet: AmplitudeEndpoint<'cohortsGet'>;
	cohortsCreate: AmplitudeEndpoint<'cohortsCreate'>;
	cohortsGetMembers: AmplitudeEndpoint<'cohortsGetMembers'>;
	chartsGet: AmplitudeEndpoint<'chartsGet'>;
	dashboardsList: AmplitudeEndpoint<'dashboardsList'>;
	dashboardsGet: AmplitudeEndpoint<'dashboardsGet'>;
	annotationsList: AmplitudeEndpoint<'annotationsList'>;
	annotationsCreate: AmplitudeEndpoint<'annotationsCreate'>;
	exportsGetData: AmplitudeEndpoint<'exportsGetData'>;
};

type AmplitudeWebhook<
	K extends keyof AmplitudeWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	AmplitudeContext,
	AmplitudeWebhookPayload<TEvent>,
	AmplitudeWebhookOutputs[K]
>;

export type AmplitudeWebhooks = {
	eventsTrack: AmplitudeWebhook<'eventsTrack', AmplitudeTrackEvent>;
	eventsIdentify: AmplitudeWebhook<'eventsIdentify', AmplitudeIdentifyEvent>;
	annotationsCreated: AmplitudeWebhook<
		'annotationsCreated',
		AmplitudeAnnotationCreatedEvent
	>;
	annotationsUpdated: AmplitudeWebhook<
		'annotationsUpdated',
		AmplitudeAnnotationUpdatedEvent
	>;
	monitorsAlert: AmplitudeWebhook<'monitorsAlert', AmplitudeMonitorAlertEvent>;
	cohortsComputed: AmplitudeWebhook<
		'cohortsComputed',
		AmplitudeCohortComputedEvent
	>;
	experimentsExposure: AmplitudeWebhook<
		'experimentsExposure',
		AmplitudeExperimentExposureEvent
	>;
};

export type AmplitudeBoundWebhooks = BindWebhooks<AmplitudeWebhooks>;

const amplitudeEndpointsNested = {
	events: {
		upload: Events.upload,
		uploadBatch: Events.uploadBatch,
		identifyUser: Events.identifyUser,
		getList: Events.getList,
	},
	users: {
		search: Users.search,
		getProfile: Users.getProfile,
		getActivity: Users.getActivity,
	},
	cohorts: {
		list: Cohorts.list,
		get: Cohorts.get,
		create: Cohorts.create,
		getMembers: Cohorts.getMembers,
	},
	charts: {
		get: Charts.get,
	},
	dashboards: {
		list: Dashboards.list,
		get: Dashboards.get,
	},
	annotations: {
		list: Annotations.list,
		create: Annotations.create,
	},
	exports: {
		getData: Exports.getData,
	},
} as const;

const amplitudeWebhooksNested = {
	events: {
		track: EventWebhooks.track,
		identify: EventWebhooks.identify,
	},
	annotations: {
		created: AnnotationWebhooks.created,
		updated: AnnotationWebhooks.updated,
	},
	monitors: {
		alert: MonitorWebhooks.alert,
	},
	cohorts: {
		computed: CohortWebhooks.computed,
	},
	experiments: {
		exposure: ExperimentWebhooks.exposure,
	},
} as const;

export const amplitudeEndpointSchemas = {
	'events.upload': {
		input: AmplitudeEndpointInputSchemas.eventsUpload,
		output: AmplitudeEndpointOutputSchemas.eventsUpload,
	},
	'events.uploadBatch': {
		input: AmplitudeEndpointInputSchemas.eventsUploadBatch,
		output: AmplitudeEndpointOutputSchemas.eventsUploadBatch,
	},
	'events.identifyUser': {
		input: AmplitudeEndpointInputSchemas.eventsIdentifyUser,
		output: AmplitudeEndpointOutputSchemas.eventsIdentifyUser,
	},
	'events.getList': {
		input: AmplitudeEndpointInputSchemas.eventsGetList,
		output: AmplitudeEndpointOutputSchemas.eventsGetList,
	},
	'users.search': {
		input: AmplitudeEndpointInputSchemas.usersSearch,
		output: AmplitudeEndpointOutputSchemas.usersSearch,
	},
	'users.getProfile': {
		input: AmplitudeEndpointInputSchemas.usersGetProfile,
		output: AmplitudeEndpointOutputSchemas.usersGetProfile,
	},
	'users.getActivity': {
		input: AmplitudeEndpointInputSchemas.usersGetActivity,
		output: AmplitudeEndpointOutputSchemas.usersGetActivity,
	},
	'cohorts.list': {
		input: AmplitudeEndpointInputSchemas.cohortsList,
		output: AmplitudeEndpointOutputSchemas.cohortsList,
	},
	'cohorts.get': {
		input: AmplitudeEndpointInputSchemas.cohortsGet,
		output: AmplitudeEndpointOutputSchemas.cohortsGet,
	},
	'cohorts.create': {
		input: AmplitudeEndpointInputSchemas.cohortsCreate,
		output: AmplitudeEndpointOutputSchemas.cohortsCreate,
	},
	'cohorts.getMembers': {
		input: AmplitudeEndpointInputSchemas.cohortsGetMembers,
		output: AmplitudeEndpointOutputSchemas.cohortsGetMembers,
	},
	'charts.get': {
		input: AmplitudeEndpointInputSchemas.chartsGet,
		output: AmplitudeEndpointOutputSchemas.chartsGet,
	},
	'dashboards.list': {
		input: AmplitudeEndpointInputSchemas.dashboardsList,
		output: AmplitudeEndpointOutputSchemas.dashboardsList,
	},
	'dashboards.get': {
		input: AmplitudeEndpointInputSchemas.dashboardsGet,
		output: AmplitudeEndpointOutputSchemas.dashboardsGet,
	},
	'annotations.list': {
		input: AmplitudeEndpointInputSchemas.annotationsList,
		output: AmplitudeEndpointOutputSchemas.annotationsList,
	},
	'annotations.create': {
		input: AmplitudeEndpointInputSchemas.annotationsCreate,
		output: AmplitudeEndpointOutputSchemas.annotationsCreate,
	},
	'exports.getData': {
		input: AmplitudeEndpointInputSchemas.exportsGetData,
		output: AmplitudeEndpointOutputSchemas.exportsGetData,
	},
} as const;

const amplitudeEndpointMeta = {
	'events.upload': {
		riskLevel: 'write',
		description: 'Upload one or more events to Amplitude via HTTP API v2',
	},
	'events.uploadBatch': {
		riskLevel: 'write',
		description: 'Batch upload events to Amplitude',
	},
	'events.identifyUser': {
		riskLevel: 'write',
		description: 'Set or update user properties via the Identify API',
	},
	'events.getList': {
		riskLevel: 'read',
		description: 'List all event types tracked in the project',
	},
	'users.search': {
		riskLevel: 'read',
		description: 'Search for users by user ID or device ID',
	},
	'users.getProfile': {
		riskLevel: 'read',
		description: 'Get the profile and properties for a specific user',
	},
	'users.getActivity': {
		riskLevel: 'read',
		description: 'Get recent event activity for a specific user',
	},
	'cohorts.list': {
		riskLevel: 'read',
		description: 'List all cohorts in the project',
	},
	'cohorts.get': {
		riskLevel: 'read',
		description: 'Get details for a specific cohort by ID',
	},
	'cohorts.create': {
		riskLevel: 'write',
		description: 'Create a new static cohort from a list of user or device IDs',
	},
	'cohorts.getMembers': {
		riskLevel: 'read',
		description: 'Retrieve the member download for a cohort export request',
	},
	'charts.get': {
		riskLevel: 'read',
		description: 'Get the data results for a specific chart by ID',
	},
	'dashboards.list': {
		riskLevel: 'read',
		description: 'List all dashboards in the project',
	},
	'dashboards.get': {
		riskLevel: 'read',
		description: 'Get details and chart list for a specific dashboard',
	},
	'annotations.list': {
		riskLevel: 'read',
		description: 'List all chart annotations for the project',
	},
	'annotations.create': {
		riskLevel: 'write',
		description: 'Create a new chart annotation on a specific date',
	},
	'exports.getData': {
		riskLevel: 'read',
		description:
			'Export raw event data for a given time range as a zip archive',
	},
} satisfies RequiredPluginEndpointMeta<typeof amplitudeEndpointsNested>;

const amplitudeWebhookSchemas = {
	'events.track': {
		description: 'An event was tracked by Amplitude',
		payload: AmplitudeTrackEventSchema,
		response: AmplitudeTrackEventSchema,
	},
	'events.identify': {
		description: 'A user identify call was received by Amplitude',
		payload: AmplitudeIdentifyEventSchema,
		response: AmplitudeIdentifyEventSchema,
	},
	'annotations.created': {
		description: 'A new chart annotation was created',
		payload: AmplitudeAnnotationCreatedEventSchema,
		response: AmplitudeAnnotationCreatedEventSchema,
	},
	'annotations.updated': {
		description: 'A chart annotation was updated',
		payload: AmplitudeAnnotationUpdatedEventSchema,
		response: AmplitudeAnnotationUpdatedEventSchema,
	},
	'monitors.alert': {
		description: 'An alert monitor threshold was triggered',
		payload: AmplitudeMonitorAlertEventSchema,
		response: AmplitudeMonitorAlertEventSchema,
	},
	'cohorts.computed': {
		description: 'A cohort finished computing',
		payload: AmplitudeCohortComputedEventSchema,
		response: AmplitudeCohortComputedEventSchema,
	},
	'experiments.exposure': {
		description: 'An experiment exposure was tracked for a user',
		payload: AmplitudeExperimentExposureEventSchema,
		response: AmplitudeExperimentExposureEventSchema,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const amplitudeAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAmplitudePlugin<T extends AmplitudePluginOptions> =
	CorsairPlugin<
		'amplitude',
		typeof AmplitudeSchema,
		typeof amplitudeEndpointsNested,
		typeof amplitudeWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalAmplitudePlugin =
	BaseAmplitudePlugin<AmplitudePluginOptions>;

export type ExternalAmplitudePlugin<T extends AmplitudePluginOptions> =
	BaseAmplitudePlugin<T>;

export function amplitude<const T extends AmplitudePluginOptions>(
	incomingOptions: AmplitudePluginOptions & T = {} as AmplitudePluginOptions &
		T,
): ExternalAmplitudePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'amplitude',
		schema: AmplitudeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: amplitudeEndpointsNested,
		webhooks: amplitudeWebhooksNested,
		endpointMeta: amplitudeEndpointMeta,
		endpointSchemas: amplitudeEndpointSchemas,
		webhookSchemas: amplitudeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-amplitude-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AmplitudeKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}
			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) return '';
				return res;
			}
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) return '';
				return res;
			}
			return '';
		},
	} satisfies InternalAmplitudePlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AmplitudeAnnotationCreatedEvent,
	AmplitudeAnnotationUpdatedEvent,
	AmplitudeCohortComputedEvent,
	AmplitudeExperimentExposureEvent,
	AmplitudeIdentifyEvent,
	AmplitudeMonitorAlertEvent,
	AmplitudeTrackEvent,
	AmplitudeWebhookOutputs,
	AmplitudeWebhookPayload,
} from './webhooks/types';

export { createAmplitudeMatch } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AmplitudeEndpointInputs,
	AmplitudeEndpointOutputs,
	AnnotationsCreateInput,
	AnnotationsCreateResponse,
	AnnotationsListInput,
	AnnotationsListResponse,
	ChartsGetInput,
	ChartsGetResponse,
	CohortsCreateInput,
	CohortsCreateResponse,
	CohortsGetInput,
	CohortsGetMembersInput,
	CohortsGetMembersResponse,
	CohortsGetResponse,
	CohortsListInput,
	CohortsListResponse,
	DashboardsGetInput,
	DashboardsGetResponse,
	DashboardsListInput,
	DashboardsListResponse,
	EventsGetListInput,
	EventsGetListResponse,
	EventsIdentifyUserInput,
	EventsIdentifyUserResponse,
	EventsUploadBatchInput,
	EventsUploadBatchResponse,
	EventsUploadInput,
	EventsUploadResponse,
	ExportsGetDataInput,
	ExportsGetDataResponse,
	UsersGetActivityInput,
	UsersGetActivityResponse,
	UsersGetProfileInput,
	UsersGetProfileResponse,
	UsersSearchInput,
	UsersSearchResponse,
} from './endpoints/types';
