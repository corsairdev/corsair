import type {
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
import { AuthMissingError } from 'corsair/core';
import { packPostHogCredentials } from './client';
import {
	Actions,
	Annotations,
	Cohorts,
	Dashboards,
	ErrorTracking,
	EventDefinitions,
	Events,
	Experiments,
	FeatureFlags,
	Insights,
	Persons,
	Projects,
	PropertyDefinitions,
	Query,
	SessionRecordings,
	Surveys,
} from './endpoints';
import type {
	PostHogEndpointInputs,
	PostHogEndpointOutputs,
} from './endpoints/types';
import {
	PostHogEndpointInputSchemas,
	PostHogEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PostHogSchema } from './schema';
import type { EventCapturedEvent, PostHogWebhookOutputs } from './webhooks';
import { EventWebhooks } from './webhooks';
import { matchPostHogTenantWebhook } from './webhooks/tenant-matcher';
import { EventCapturedEventSchema } from './webhooks/types';

export type PostHogPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * Project token (phc_...) for capture only, or a personal API key (phx_...)
	 * for capture and every read action.
	 */
	key?: string;
	/** Personal API key (phx_...); takes precedence over `key`. */
	personalApiKey?: string;
	/** Project id; overrides the connection's `project_id`. */
	projectId?: string;
	/**
	 * PostHog app host, e.g. https://eu.posthog.com or a self-hosted URL.
	 * Without it the US cloud is tried first, then the EU cloud.
	 */
	host?: string;
	webhookSecret?: string;
	hooks?: InternalPostHogPlugin['hooks'];
	webhookHooks?: InternalPostHogPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the PostHog plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the PostHog endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof posthogEndpointsNested>;
};

export type PostHogContext = CorsairPluginContext<
	typeof PostHogSchema,
	PostHogPluginOptions
>;
export type PostHogKeyBuilderContext = KeyBuilderContext<
	PostHogPluginOptions,
	typeof posthogAuthConfig
>;

export type PostHogBoundEndpoints = BindEndpoints<
	typeof posthogEndpointsNested
>;

type PostHogEndpoint<K extends keyof PostHogEndpointOutputs> = CorsairEndpoint<
	PostHogContext,
	PostHogEndpointInputs[K],
	PostHogEndpointOutputs[K]
>;

export type PostHogEndpoints = {
	aliasCreate: PostHogEndpoint<'aliasCreate'>;
	eventCreate: PostHogEndpoint<'eventCreate'>;
	identityCreate: PostHogEndpoint<'identityCreate'>;
	trackPage: PostHogEndpoint<'trackPage'>;
	trackScreen: PostHogEndpoint<'trackScreen'>;
	queryRun: PostHogEndpoint<'queryRun'>;
	insightsList: PostHogEndpoint<'insightsList'>;
	insightsGet: PostHogEndpoint<'insightsGet'>;
	dashboardsList: PostHogEndpoint<'dashboardsList'>;
	dashboardsGet: PostHogEndpoint<'dashboardsGet'>;
	personsList: PostHogEndpoint<'personsList'>;
	personsGet: PostHogEndpoint<'personsGet'>;
	featureFlagsList: PostHogEndpoint<'featureFlagsList'>;
	featureFlagsGet: PostHogEndpoint<'featureFlagsGet'>;
	featureFlagsUpdate: PostHogEndpoint<'featureFlagsUpdate'>;
	sessionRecordingsList: PostHogEndpoint<'sessionRecordingsList'>;
	sessionRecordingsGet: PostHogEndpoint<'sessionRecordingsGet'>;
	errorTrackingIssuesList: PostHogEndpoint<'errorTrackingIssuesList'>;
	experimentsList: PostHogEndpoint<'experimentsList'>;
	experimentsGet: PostHogEndpoint<'experimentsGet'>;
	surveysList: PostHogEndpoint<'surveysList'>;
	surveysGet: PostHogEndpoint<'surveysGet'>;
	cohortsList: PostHogEndpoint<'cohortsList'>;
	actionsList: PostHogEndpoint<'actionsList'>;
	annotationsList: PostHogEndpoint<'annotationsList'>;
	annotationsCreate: PostHogEndpoint<'annotationsCreate'>;
	eventDefinitionsList: PostHogEndpoint<'eventDefinitionsList'>;
	propertyDefinitionsList: PostHogEndpoint<'propertyDefinitionsList'>;
	projectsGet: PostHogEndpoint<'projectsGet'>;
};

type PostHogWebhook<
	K extends keyof PostHogWebhookOutputs,
	TEvent,
> = CorsairWebhook<PostHogContext, TEvent, PostHogWebhookOutputs[K]>;

export type PostHogWebhooks = {
	eventCaptured: PostHogWebhook<'eventCaptured', EventCapturedEvent>;
};

export type PostHogBoundWebhooks = BindWebhooks<PostHogWebhooks>;

const posthogEndpointsNested = {
	events: {
		aliasCreate: Events.aliasCreate,
		eventCreate: Events.eventCreate,
		identityCreate: Events.identityCreate,
		trackPage: Events.trackPage,
		trackScreen: Events.trackScreen,
	},
	query: {
		run: Query.run,
	},
	insights: {
		list: Insights.list,
		get: Insights.get,
	},
	dashboards: {
		list: Dashboards.list,
		get: Dashboards.get,
	},
	persons: {
		list: Persons.list,
		get: Persons.get,
	},
	featureFlags: {
		list: FeatureFlags.list,
		get: FeatureFlags.get,
		update: FeatureFlags.update,
	},
	sessionRecordings: {
		list: SessionRecordings.list,
		get: SessionRecordings.get,
	},
	errorTracking: {
		issuesList: ErrorTracking.issuesList,
	},
	experiments: {
		list: Experiments.list,
		get: Experiments.get,
	},
	surveys: {
		list: Surveys.list,
		get: Surveys.get,
	},
	cohorts: {
		list: Cohorts.list,
	},
	actions: {
		list: Actions.list,
	},
	annotations: {
		list: Annotations.list,
		create: Annotations.create,
	},
	eventDefinitions: {
		list: EventDefinitions.list,
	},
	propertyDefinitions: {
		list: PropertyDefinitions.list,
	},
	projects: {
		get: Projects.get,
	},
} as const;

export const posthogEndpointSchemas = {
	'events.aliasCreate': {
		input: PostHogEndpointInputSchemas.aliasCreate,
		output: PostHogEndpointOutputSchemas.aliasCreate,
	},
	'events.eventCreate': {
		input: PostHogEndpointInputSchemas.eventCreate,
		output: PostHogEndpointOutputSchemas.eventCreate,
	},
	'events.identityCreate': {
		input: PostHogEndpointInputSchemas.identityCreate,
		output: PostHogEndpointOutputSchemas.identityCreate,
	},
	'events.trackPage': {
		input: PostHogEndpointInputSchemas.trackPage,
		output: PostHogEndpointOutputSchemas.trackPage,
	},
	'events.trackScreen': {
		input: PostHogEndpointInputSchemas.trackScreen,
		output: PostHogEndpointOutputSchemas.trackScreen,
	},
	'query.run': {
		input: PostHogEndpointInputSchemas.queryRun,
		output: PostHogEndpointOutputSchemas.queryRun,
	},
	'insights.list': {
		input: PostHogEndpointInputSchemas.insightsList,
		output: PostHogEndpointOutputSchemas.insightsList,
	},
	'insights.get': {
		input: PostHogEndpointInputSchemas.insightsGet,
		output: PostHogEndpointOutputSchemas.insightsGet,
	},
	'dashboards.list': {
		input: PostHogEndpointInputSchemas.dashboardsList,
		output: PostHogEndpointOutputSchemas.dashboardsList,
	},
	'dashboards.get': {
		input: PostHogEndpointInputSchemas.dashboardsGet,
		output: PostHogEndpointOutputSchemas.dashboardsGet,
	},
	'persons.list': {
		input: PostHogEndpointInputSchemas.personsList,
		output: PostHogEndpointOutputSchemas.personsList,
	},
	'persons.get': {
		input: PostHogEndpointInputSchemas.personsGet,
		output: PostHogEndpointOutputSchemas.personsGet,
	},
	'featureFlags.list': {
		input: PostHogEndpointInputSchemas.featureFlagsList,
		output: PostHogEndpointOutputSchemas.featureFlagsList,
	},
	'featureFlags.get': {
		input: PostHogEndpointInputSchemas.featureFlagsGet,
		output: PostHogEndpointOutputSchemas.featureFlagsGet,
	},
	'featureFlags.update': {
		input: PostHogEndpointInputSchemas.featureFlagsUpdate,
		output: PostHogEndpointOutputSchemas.featureFlagsUpdate,
	},
	'sessionRecordings.list': {
		input: PostHogEndpointInputSchemas.sessionRecordingsList,
		output: PostHogEndpointOutputSchemas.sessionRecordingsList,
	},
	'sessionRecordings.get': {
		input: PostHogEndpointInputSchemas.sessionRecordingsGet,
		output: PostHogEndpointOutputSchemas.sessionRecordingsGet,
	},
	'errorTracking.issuesList': {
		input: PostHogEndpointInputSchemas.errorTrackingIssuesList,
		output: PostHogEndpointOutputSchemas.errorTrackingIssuesList,
	},
	'experiments.list': {
		input: PostHogEndpointInputSchemas.experimentsList,
		output: PostHogEndpointOutputSchemas.experimentsList,
	},
	'experiments.get': {
		input: PostHogEndpointInputSchemas.experimentsGet,
		output: PostHogEndpointOutputSchemas.experimentsGet,
	},
	'surveys.list': {
		input: PostHogEndpointInputSchemas.surveysList,
		output: PostHogEndpointOutputSchemas.surveysList,
	},
	'surveys.get': {
		input: PostHogEndpointInputSchemas.surveysGet,
		output: PostHogEndpointOutputSchemas.surveysGet,
	},
	'cohorts.list': {
		input: PostHogEndpointInputSchemas.cohortsList,
		output: PostHogEndpointOutputSchemas.cohortsList,
	},
	'actions.list': {
		input: PostHogEndpointInputSchemas.actionsList,
		output: PostHogEndpointOutputSchemas.actionsList,
	},
	'annotations.list': {
		input: PostHogEndpointInputSchemas.annotationsList,
		output: PostHogEndpointOutputSchemas.annotationsList,
	},
	'annotations.create': {
		input: PostHogEndpointInputSchemas.annotationsCreate,
		output: PostHogEndpointOutputSchemas.annotationsCreate,
	},
	'eventDefinitions.list': {
		input: PostHogEndpointInputSchemas.eventDefinitionsList,
		output: PostHogEndpointOutputSchemas.eventDefinitionsList,
	},
	'propertyDefinitions.list': {
		input: PostHogEndpointInputSchemas.propertyDefinitionsList,
		output: PostHogEndpointOutputSchemas.propertyDefinitionsList,
	},
	'projects.get': {
		input: PostHogEndpointInputSchemas.projectsGet,
		output: PostHogEndpointOutputSchemas.projectsGet,
	},
} as const;

const posthogWebhooksNested = {
	events: {
		captured: EventWebhooks.captured,
	},
} as const;

const posthogWebhookSchemas = {
	'events.captured': {
		description: 'A PostHog event was captured',
		payload: EventCapturedEventSchema,
		response: EventCapturedEventSchema,
	},
} as const;

const defaultAuthType = 'api_key' as const;

export const posthogAuthConfig = {
	api_key: { account: ['project_id'] as const },
} as const satisfies PluginAuthConfig;

/**
 * Risk-level metadata for each PostHog endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const posthogEndpointMeta = {
	'events.aliasCreate': {
		riskLevel: 'write',
		description: 'Create an alias linking two distinct user IDs',
	},
	'events.eventCreate': {
		riskLevel: 'write',
		description: 'Ingest an analytics event',
	},
	'events.identityCreate': {
		riskLevel: 'write',
		description: 'Associate properties with a user identity',
	},
	'events.trackPage': {
		riskLevel: 'write',
		description: 'Track a page view event',
	},
	'events.trackScreen': {
		riskLevel: 'write',
		description: 'Track a screen view event',
	},
	'query.run': {
		riskLevel: 'read',
		description:
			'Run a HogQL (SQL) query or any PostHog query kind (trends, funnels and others)',
	},
	'insights.list': {
		riskLevel: 'read',
		description: 'List saved insights',
	},
	'insights.get': {
		riskLevel: 'read',
		description: 'Get a saved insight with its query and result',
	},
	'dashboards.list': {
		riskLevel: 'read',
		description: 'List dashboards',
	},
	'dashboards.get': {
		riskLevel: 'read',
		description: 'Get a dashboard with its tiles',
	},
	'persons.list': {
		riskLevel: 'read',
		description: 'List or search persons',
	},
	'persons.get': {
		riskLevel: 'read',
		description: 'Get a person by id',
	},
	'featureFlags.list': {
		riskLevel: 'read',
		description: 'List feature flags',
	},
	'featureFlags.get': {
		riskLevel: 'read',
		description: 'Get a feature flag with its release conditions',
	},
	'featureFlags.update': {
		riskLevel: 'write',
		description:
			'Update a feature flag (name, active, release conditions, tags)',
	},
	'sessionRecordings.list': {
		riskLevel: 'read',
		description: 'List session recordings',
	},
	'sessionRecordings.get': {
		riskLevel: 'read',
		description: 'Get session recording metadata',
	},
	'errorTracking.issuesList': {
		riskLevel: 'read',
		description:
			'List error tracking issues with occurrence, user and session counts',
	},
	'experiments.list': {
		riskLevel: 'read',
		description: 'List experiments',
	},
	'experiments.get': {
		riskLevel: 'read',
		description: 'Get an experiment',
	},
	'surveys.list': {
		riskLevel: 'read',
		description: 'List surveys',
	},
	'surveys.get': {
		riskLevel: 'read',
		description: 'Get a survey with its questions',
	},
	'cohorts.list': {
		riskLevel: 'read',
		description: 'List cohorts',
	},
	'actions.list': {
		riskLevel: 'read',
		description: 'List actions',
	},
	'annotations.list': {
		riskLevel: 'read',
		description: 'List annotations',
	},
	'annotations.create': {
		riskLevel: 'write',
		description: 'Create an annotation on charts',
	},
	'eventDefinitions.list': {
		riskLevel: 'read',
		description: 'List event names seen in the project',
	},
	'propertyDefinitions.list': {
		riskLevel: 'read',
		description: 'List event, person, group or session property names',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get the project settings (timezone, name, project token)',
	},
} satisfies RequiredPluginEndpointMeta<typeof posthogEndpointsNested>;

export type BasePostHogPlugin<T extends PostHogPluginOptions> = CorsairPlugin<
	'posthog',
	typeof PostHogSchema,
	typeof posthogEndpointsNested,
	typeof posthogWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof posthogAuthConfig
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalPostHogPlugin = BasePostHogPlugin<PostHogPluginOptions>;

export type ExternalPostHogPlugin<T extends PostHogPluginOptions> =
	BasePostHogPlugin<T>;

export function posthog<const T extends PostHogPluginOptions>(
	incomingOptions: PostHogPluginOptions & T = {} as PostHogPluginOptions & T,
): ExternalPostHogPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'posthog',
		authConfig: posthogAuthConfig,
		schema: PostHogSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: posthogEndpointsNested,
		webhooks: posthogWebhooksNested,
		endpointMeta: posthogEndpointMeta,
		endpointSchemas: posthogEndpointSchemas,
		webhookSchemas: posthogWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasPostHogSignature =
				'x-posthog-signature' in headers || 'x-signature' in headers;
			const parsedBody =
				typeof request.body === 'string'
					? JSON.parse(request.body)
					: request.body;
			const hasPostHogPayload =
				typeof parsedBody === 'object' &&
				parsedBody !== null &&
				'event' in parsedBody &&
				'distinct_id' in parsedBody;
			return hasPostHogSignature || hasPostHogPayload;
		},
		pluginTenantWebhookMatcher: matchPostHogTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PostHogKeyBuilderContext, source) => {
			const authType = ctx.authType;

			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					throw new Error(
						'[auth-missing:posthog:webhook_signature]: PostHog webhook signature is missing',
					);
				}

				return res;
			}

			if (source === 'endpoint') {
				let key = options.personalApiKey ?? options.key;
				if (!key && authType === 'api_key') {
					key = (await ctx.keys.get_api_key()) ?? undefined;
				}
				if (!key) {
					throw new AuthMissingError('posthog', 'api_key');
				}

				let projectId = options.projectId;
				if (!projectId && authType === 'api_key') {
					projectId = (await ctx.keys.get_project_id()) ?? undefined;
				}

				return packPostHogCredentials({
					key,
					...(projectId ? { projectId: String(projectId) } : {}),
					...(options.host ? { host: options.host } : {}),
				});
			}

			throw new AuthMissingError('posthog', 'api_key');
		},
	} satisfies InternalPostHogPlugin;
}

export {
	createPostHogEventMatch,
	verifyPostHogWebhookSignature,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	EventCapturedEvent,
	PostHogEventMap,
	PostHogEventName,
	PostHogWebhookEvent,
	PostHogWebhookOutputs,
	PostHogWebhookPayload,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CreateAliasResponse,
	CreateEventResponse,
	CreateIdentityResponse,
	PostHogEndpointOutputs,
	TrackPageResponse,
	TrackScreenResponse,
} from './endpoints/types';
