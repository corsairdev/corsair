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
	Alerts,
	Annotations,
	BatchExports,
	Cohorts,
	Dashboards,
	EarlyAccessFeatures,
	ErrorTracking,
	EventDefinitions,
	Events,
	Experiments,
	FeatureFlags,
	HogFunctions,
	Insights,
	LlmAnalytics,
	Logs,
	Notebooks,
	Organizations,
	Persons,
	Projects,
	PropertyDefinitions,
	Query,
	SessionRecordingPlaylists,
	SessionRecordings,
	Surveys,
	WarehouseTables,
	WebAnalytics,
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
	organizationsList: PostHogEndpoint<'organizationsList'>;
	organizationsGet: PostHogEndpoint<'organizationsGet'>;
	projectsList: PostHogEndpoint<'projectsList'>;
	projectsGet: PostHogEndpoint<'projectsGet'>;
	queryRun: PostHogEndpoint<'queryRun'>;
	eventsList: PostHogEndpoint<'eventsList'>;
	errorTrackingIssuesList: PostHogEndpoint<'errorTrackingIssuesList'>;
	webAnalyticsOverview: PostHogEndpoint<'webAnalyticsOverview'>;
	webAnalyticsStats: PostHogEndpoint<'webAnalyticsStats'>;
	llmAnalyticsTraces: PostHogEndpoint<'llmAnalyticsTraces'>;
	llmAnalyticsCosts: PostHogEndpoint<'llmAnalyticsCosts'>;
	logsQuery: PostHogEndpoint<'logsQuery'>;
	insightsList: PostHogEndpoint<'insightsList'>;
	insightsGet: PostHogEndpoint<'insightsGet'>;
	insightsCreate: PostHogEndpoint<'insightsCreate'>;
	insightsUpdate: PostHogEndpoint<'insightsUpdate'>;
	insightsDelete: PostHogEndpoint<'insightsDelete'>;
	dashboardsList: PostHogEndpoint<'dashboardsList'>;
	dashboardsGet: PostHogEndpoint<'dashboardsGet'>;
	dashboardsCreate: PostHogEndpoint<'dashboardsCreate'>;
	dashboardsUpdate: PostHogEndpoint<'dashboardsUpdate'>;
	dashboardsDelete: PostHogEndpoint<'dashboardsDelete'>;
	personsList: PostHogEndpoint<'personsList'>;
	personsGet: PostHogEndpoint<'personsGet'>;
	personsUpdateProperty: PostHogEndpoint<'personsUpdateProperty'>;
	personsDeleteProperty: PostHogEndpoint<'personsDeleteProperty'>;
	cohortsList: PostHogEndpoint<'cohortsList'>;
	cohortsGet: PostHogEndpoint<'cohortsGet'>;
	cohortsCreate: PostHogEndpoint<'cohortsCreate'>;
	cohortsUpdate: PostHogEndpoint<'cohortsUpdate'>;
	actionsList: PostHogEndpoint<'actionsList'>;
	actionsGet: PostHogEndpoint<'actionsGet'>;
	actionsCreate: PostHogEndpoint<'actionsCreate'>;
	annotationsList: PostHogEndpoint<'annotationsList'>;
	annotationsCreate: PostHogEndpoint<'annotationsCreate'>;
	annotationsUpdate: PostHogEndpoint<'annotationsUpdate'>;
	annotationsDelete: PostHogEndpoint<'annotationsDelete'>;
	eventDefinitionsList: PostHogEndpoint<'eventDefinitionsList'>;
	propertyDefinitionsList: PostHogEndpoint<'propertyDefinitionsList'>;
	notebooksList: PostHogEndpoint<'notebooksList'>;
	notebooksGet: PostHogEndpoint<'notebooksGet'>;
	notebooksCreate: PostHogEndpoint<'notebooksCreate'>;
	alertsList: PostHogEndpoint<'alertsList'>;
	alertsGet: PostHogEndpoint<'alertsGet'>;
	featureFlagsList: PostHogEndpoint<'featureFlagsList'>;
	featureFlagsGet: PostHogEndpoint<'featureFlagsGet'>;
	featureFlagsCreate: PostHogEndpoint<'featureFlagsCreate'>;
	featureFlagsUpdate: PostHogEndpoint<'featureFlagsUpdate'>;
	featureFlagsDelete: PostHogEndpoint<'featureFlagsDelete'>;
	experimentsList: PostHogEndpoint<'experimentsList'>;
	experimentsGet: PostHogEndpoint<'experimentsGet'>;
	experimentsCreate: PostHogEndpoint<'experimentsCreate'>;
	experimentsUpdate: PostHogEndpoint<'experimentsUpdate'>;
	surveysList: PostHogEndpoint<'surveysList'>;
	surveysGet: PostHogEndpoint<'surveysGet'>;
	surveysCreate: PostHogEndpoint<'surveysCreate'>;
	surveysUpdate: PostHogEndpoint<'surveysUpdate'>;
	surveysDelete: PostHogEndpoint<'surveysDelete'>;
	earlyAccessFeaturesList: PostHogEndpoint<'earlyAccessFeaturesList'>;
	sessionRecordingsList: PostHogEndpoint<'sessionRecordingsList'>;
	sessionRecordingsGet: PostHogEndpoint<'sessionRecordingsGet'>;
	sessionRecordingPlaylistsList: PostHogEndpoint<'sessionRecordingPlaylistsList'>;
	batchExportsList: PostHogEndpoint<'batchExportsList'>;
	hogFunctionsList: PostHogEndpoint<'hogFunctionsList'>;
	hogFunctionsGet: PostHogEndpoint<'hogFunctionsGet'>;
	warehouseTablesList: PostHogEndpoint<'warehouseTablesList'>;
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
		list: Events.list,
	},
	organizations: {
		list: Organizations.list,
		get: Organizations.get,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
	},
	query: {
		run: Query.run,
	},
	errorTracking: {
		issuesList: ErrorTracking.issuesList,
	},
	webAnalytics: {
		overview: WebAnalytics.overview,
		stats: WebAnalytics.stats,
	},
	llmAnalytics: {
		traces: LlmAnalytics.traces,
		costs: LlmAnalytics.costs,
	},
	logs: {
		query: Logs.query,
	},
	insights: {
		list: Insights.list,
		get: Insights.get,
		create: Insights.create,
		update: Insights.update,
		delete: Insights.delete,
	},
	dashboards: {
		list: Dashboards.list,
		get: Dashboards.get,
		create: Dashboards.create,
		update: Dashboards.update,
		delete: Dashboards.delete,
	},
	persons: {
		list: Persons.list,
		get: Persons.get,
		updateProperty: Persons.updateProperty,
		deleteProperty: Persons.deleteProperty,
	},
	cohorts: {
		list: Cohorts.list,
		get: Cohorts.get,
		create: Cohorts.create,
		update: Cohorts.update,
	},
	actions: {
		list: Actions.list,
		get: Actions.get,
		create: Actions.create,
	},
	annotations: {
		list: Annotations.list,
		create: Annotations.create,
		update: Annotations.update,
		delete: Annotations.delete,
	},
	eventDefinitions: {
		list: EventDefinitions.list,
	},
	propertyDefinitions: {
		list: PropertyDefinitions.list,
	},
	notebooks: {
		list: Notebooks.list,
		get: Notebooks.get,
		create: Notebooks.create,
	},
	alerts: {
		list: Alerts.list,
		get: Alerts.get,
	},
	featureFlags: {
		list: FeatureFlags.list,
		get: FeatureFlags.get,
		create: FeatureFlags.create,
		update: FeatureFlags.update,
		delete: FeatureFlags.delete,
	},
	experiments: {
		list: Experiments.list,
		get: Experiments.get,
		create: Experiments.create,
		update: Experiments.update,
	},
	surveys: {
		list: Surveys.list,
		get: Surveys.get,
		create: Surveys.create,
		update: Surveys.update,
		delete: Surveys.delete,
	},
	earlyAccessFeatures: {
		list: EarlyAccessFeatures.list,
	},
	sessionRecordings: {
		list: SessionRecordings.list,
		get: SessionRecordings.get,
	},
	sessionRecordingPlaylists: {
		list: SessionRecordingPlaylists.list,
	},
	batchExports: {
		list: BatchExports.list,
	},
	hogFunctions: {
		list: HogFunctions.list,
		get: HogFunctions.get,
	},
	warehouseTables: {
		list: WarehouseTables.list,
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
	'organizations.list': {
		input: PostHogEndpointInputSchemas.organizationsList,
		output: PostHogEndpointOutputSchemas.organizationsList,
	},
	'organizations.get': {
		input: PostHogEndpointInputSchemas.organizationsGet,
		output: PostHogEndpointOutputSchemas.organizationsGet,
	},
	'projects.list': {
		input: PostHogEndpointInputSchemas.projectsList,
		output: PostHogEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: PostHogEndpointInputSchemas.projectsGet,
		output: PostHogEndpointOutputSchemas.projectsGet,
	},
	'query.run': {
		input: PostHogEndpointInputSchemas.queryRun,
		output: PostHogEndpointOutputSchemas.queryRun,
	},
	'events.list': {
		input: PostHogEndpointInputSchemas.eventsList,
		output: PostHogEndpointOutputSchemas.eventsList,
	},
	'errorTracking.issuesList': {
		input: PostHogEndpointInputSchemas.errorTrackingIssuesList,
		output: PostHogEndpointOutputSchemas.errorTrackingIssuesList,
	},
	'webAnalytics.overview': {
		input: PostHogEndpointInputSchemas.webAnalyticsOverview,
		output: PostHogEndpointOutputSchemas.webAnalyticsOverview,
	},
	'webAnalytics.stats': {
		input: PostHogEndpointInputSchemas.webAnalyticsStats,
		output: PostHogEndpointOutputSchemas.webAnalyticsStats,
	},
	'llmAnalytics.traces': {
		input: PostHogEndpointInputSchemas.llmAnalyticsTraces,
		output: PostHogEndpointOutputSchemas.llmAnalyticsTraces,
	},
	'llmAnalytics.costs': {
		input: PostHogEndpointInputSchemas.llmAnalyticsCosts,
		output: PostHogEndpointOutputSchemas.llmAnalyticsCosts,
	},
	'logs.query': {
		input: PostHogEndpointInputSchemas.logsQuery,
		output: PostHogEndpointOutputSchemas.logsQuery,
	},
	'insights.list': {
		input: PostHogEndpointInputSchemas.insightsList,
		output: PostHogEndpointOutputSchemas.insightsList,
	},
	'insights.get': {
		input: PostHogEndpointInputSchemas.insightsGet,
		output: PostHogEndpointOutputSchemas.insightsGet,
	},
	'insights.create': {
		input: PostHogEndpointInputSchemas.insightsCreate,
		output: PostHogEndpointOutputSchemas.insightsCreate,
	},
	'insights.update': {
		input: PostHogEndpointInputSchemas.insightsUpdate,
		output: PostHogEndpointOutputSchemas.insightsUpdate,
	},
	'insights.delete': {
		input: PostHogEndpointInputSchemas.insightsDelete,
		output: PostHogEndpointOutputSchemas.insightsDelete,
	},
	'dashboards.list': {
		input: PostHogEndpointInputSchemas.dashboardsList,
		output: PostHogEndpointOutputSchemas.dashboardsList,
	},
	'dashboards.get': {
		input: PostHogEndpointInputSchemas.dashboardsGet,
		output: PostHogEndpointOutputSchemas.dashboardsGet,
	},
	'dashboards.create': {
		input: PostHogEndpointInputSchemas.dashboardsCreate,
		output: PostHogEndpointOutputSchemas.dashboardsCreate,
	},
	'dashboards.update': {
		input: PostHogEndpointInputSchemas.dashboardsUpdate,
		output: PostHogEndpointOutputSchemas.dashboardsUpdate,
	},
	'dashboards.delete': {
		input: PostHogEndpointInputSchemas.dashboardsDelete,
		output: PostHogEndpointOutputSchemas.dashboardsDelete,
	},
	'persons.list': {
		input: PostHogEndpointInputSchemas.personsList,
		output: PostHogEndpointOutputSchemas.personsList,
	},
	'persons.get': {
		input: PostHogEndpointInputSchemas.personsGet,
		output: PostHogEndpointOutputSchemas.personsGet,
	},
	'persons.updateProperty': {
		input: PostHogEndpointInputSchemas.personsUpdateProperty,
		output: PostHogEndpointOutputSchemas.personsUpdateProperty,
	},
	'persons.deleteProperty': {
		input: PostHogEndpointInputSchemas.personsDeleteProperty,
		output: PostHogEndpointOutputSchemas.personsDeleteProperty,
	},
	'cohorts.list': {
		input: PostHogEndpointInputSchemas.cohortsList,
		output: PostHogEndpointOutputSchemas.cohortsList,
	},
	'cohorts.get': {
		input: PostHogEndpointInputSchemas.cohortsGet,
		output: PostHogEndpointOutputSchemas.cohortsGet,
	},
	'cohorts.create': {
		input: PostHogEndpointInputSchemas.cohortsCreate,
		output: PostHogEndpointOutputSchemas.cohortsCreate,
	},
	'cohorts.update': {
		input: PostHogEndpointInputSchemas.cohortsUpdate,
		output: PostHogEndpointOutputSchemas.cohortsUpdate,
	},
	'actions.list': {
		input: PostHogEndpointInputSchemas.actionsList,
		output: PostHogEndpointOutputSchemas.actionsList,
	},
	'actions.get': {
		input: PostHogEndpointInputSchemas.actionsGet,
		output: PostHogEndpointOutputSchemas.actionsGet,
	},
	'actions.create': {
		input: PostHogEndpointInputSchemas.actionsCreate,
		output: PostHogEndpointOutputSchemas.actionsCreate,
	},
	'annotations.list': {
		input: PostHogEndpointInputSchemas.annotationsList,
		output: PostHogEndpointOutputSchemas.annotationsList,
	},
	'annotations.create': {
		input: PostHogEndpointInputSchemas.annotationsCreate,
		output: PostHogEndpointOutputSchemas.annotationsCreate,
	},
	'annotations.update': {
		input: PostHogEndpointInputSchemas.annotationsUpdate,
		output: PostHogEndpointOutputSchemas.annotationsUpdate,
	},
	'annotations.delete': {
		input: PostHogEndpointInputSchemas.annotationsDelete,
		output: PostHogEndpointOutputSchemas.annotationsDelete,
	},
	'eventDefinitions.list': {
		input: PostHogEndpointInputSchemas.eventDefinitionsList,
		output: PostHogEndpointOutputSchemas.eventDefinitionsList,
	},
	'propertyDefinitions.list': {
		input: PostHogEndpointInputSchemas.propertyDefinitionsList,
		output: PostHogEndpointOutputSchemas.propertyDefinitionsList,
	},
	'notebooks.list': {
		input: PostHogEndpointInputSchemas.notebooksList,
		output: PostHogEndpointOutputSchemas.notebooksList,
	},
	'notebooks.get': {
		input: PostHogEndpointInputSchemas.notebooksGet,
		output: PostHogEndpointOutputSchemas.notebooksGet,
	},
	'notebooks.create': {
		input: PostHogEndpointInputSchemas.notebooksCreate,
		output: PostHogEndpointOutputSchemas.notebooksCreate,
	},
	'alerts.list': {
		input: PostHogEndpointInputSchemas.alertsList,
		output: PostHogEndpointOutputSchemas.alertsList,
	},
	'alerts.get': {
		input: PostHogEndpointInputSchemas.alertsGet,
		output: PostHogEndpointOutputSchemas.alertsGet,
	},
	'featureFlags.list': {
		input: PostHogEndpointInputSchemas.featureFlagsList,
		output: PostHogEndpointOutputSchemas.featureFlagsList,
	},
	'featureFlags.get': {
		input: PostHogEndpointInputSchemas.featureFlagsGet,
		output: PostHogEndpointOutputSchemas.featureFlagsGet,
	},
	'featureFlags.create': {
		input: PostHogEndpointInputSchemas.featureFlagsCreate,
		output: PostHogEndpointOutputSchemas.featureFlagsCreate,
	},
	'featureFlags.update': {
		input: PostHogEndpointInputSchemas.featureFlagsUpdate,
		output: PostHogEndpointOutputSchemas.featureFlagsUpdate,
	},
	'featureFlags.delete': {
		input: PostHogEndpointInputSchemas.featureFlagsDelete,
		output: PostHogEndpointOutputSchemas.featureFlagsDelete,
	},
	'experiments.list': {
		input: PostHogEndpointInputSchemas.experimentsList,
		output: PostHogEndpointOutputSchemas.experimentsList,
	},
	'experiments.get': {
		input: PostHogEndpointInputSchemas.experimentsGet,
		output: PostHogEndpointOutputSchemas.experimentsGet,
	},
	'experiments.create': {
		input: PostHogEndpointInputSchemas.experimentsCreate,
		output: PostHogEndpointOutputSchemas.experimentsCreate,
	},
	'experiments.update': {
		input: PostHogEndpointInputSchemas.experimentsUpdate,
		output: PostHogEndpointOutputSchemas.experimentsUpdate,
	},
	'surveys.list': {
		input: PostHogEndpointInputSchemas.surveysList,
		output: PostHogEndpointOutputSchemas.surveysList,
	},
	'surveys.get': {
		input: PostHogEndpointInputSchemas.surveysGet,
		output: PostHogEndpointOutputSchemas.surveysGet,
	},
	'surveys.create': {
		input: PostHogEndpointInputSchemas.surveysCreate,
		output: PostHogEndpointOutputSchemas.surveysCreate,
	},
	'surveys.update': {
		input: PostHogEndpointInputSchemas.surveysUpdate,
		output: PostHogEndpointOutputSchemas.surveysUpdate,
	},
	'surveys.delete': {
		input: PostHogEndpointInputSchemas.surveysDelete,
		output: PostHogEndpointOutputSchemas.surveysDelete,
	},
	'earlyAccessFeatures.list': {
		input: PostHogEndpointInputSchemas.earlyAccessFeaturesList,
		output: PostHogEndpointOutputSchemas.earlyAccessFeaturesList,
	},
	'sessionRecordings.list': {
		input: PostHogEndpointInputSchemas.sessionRecordingsList,
		output: PostHogEndpointOutputSchemas.sessionRecordingsList,
	},
	'sessionRecordings.get': {
		input: PostHogEndpointInputSchemas.sessionRecordingsGet,
		output: PostHogEndpointOutputSchemas.sessionRecordingsGet,
	},
	'sessionRecordingPlaylists.list': {
		input: PostHogEndpointInputSchemas.sessionRecordingPlaylistsList,
		output: PostHogEndpointOutputSchemas.sessionRecordingPlaylistsList,
	},
	'batchExports.list': {
		input: PostHogEndpointInputSchemas.batchExportsList,
		output: PostHogEndpointOutputSchemas.batchExportsList,
	},
	'hogFunctions.list': {
		input: PostHogEndpointInputSchemas.hogFunctionsList,
		output: PostHogEndpointOutputSchemas.hogFunctionsList,
	},
	'hogFunctions.get': {
		input: PostHogEndpointInputSchemas.hogFunctionsGet,
		output: PostHogEndpointOutputSchemas.hogFunctionsGet,
	},
	'warehouseTables.list': {
		input: PostHogEndpointInputSchemas.warehouseTablesList,
		output: PostHogEndpointOutputSchemas.warehouseTablesList,
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
	'organizations.list': {
		riskLevel: 'read',
		description: 'List the organizations the key can access',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get an organization (defaults to the current one)',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List the projects of an organization',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get the project settings (timezone, name, project token)',
	},
	'query.run': {
		riskLevel: 'read',
		description:
			'Run a HogQL (SQL) query or any PostHog query kind (trends, funnels and others)',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List recent events with chosen columns and filters',
	},
	'errorTracking.issuesList': {
		riskLevel: 'read',
		description:
			'List error tracking issues with occurrence, user and session counts',
	},
	'webAnalytics.overview': {
		riskLevel: 'read',
		description:
			'Get web analytics totals (visitors, views, sessions, bounce rate, duration)',
	},
	'webAnalytics.stats': {
		riskLevel: 'read',
		description:
			'Get web analytics by page, source, UTM, device, browser or country',
	},
	'llmAnalytics.traces': {
		riskLevel: 'read',
		description: 'List LLM traces with latency, tokens and cost',
	},
	'llmAnalytics.costs': {
		riskLevel: 'read',
		description: 'Get LLM generation counts and cost per model',
	},
	'logs.query': {
		riskLevel: 'read',
		description: 'Search logs by service, severity, text or attributes',
	},
	'insights.list': {
		riskLevel: 'read',
		description: 'List saved insights',
	},
	'insights.get': {
		riskLevel: 'read',
		description: 'Get a saved insight with its query and result',
	},
	'insights.create': {
		riskLevel: 'write',
		description: 'Save a new insight from a query',
	},
	'insights.update': {
		riskLevel: 'write',
		description:
			'Update an insight (name, query, description, dashboards, tags)',
	},
	'insights.delete': {
		riskLevel: 'destructive',
		description: 'Delete an insight (PostHog keeps it restorable)',
	},
	'dashboards.list': {
		riskLevel: 'read',
		description: 'List dashboards',
	},
	'dashboards.get': {
		riskLevel: 'read',
		description: 'Get a dashboard with its tiles',
	},
	'dashboards.create': {
		riskLevel: 'write',
		description: 'Create a dashboard',
	},
	'dashboards.update': {
		riskLevel: 'write',
		description: 'Update a dashboard (name, description, pinned, tags)',
	},
	'dashboards.delete': {
		riskLevel: 'destructive',
		description: 'Delete a dashboard (PostHog keeps it restorable)',
	},
	'persons.list': {
		riskLevel: 'read',
		description: 'List or search persons',
	},
	'persons.get': {
		riskLevel: 'read',
		description: 'Get a person by id',
	},
	'persons.updateProperty': {
		riskLevel: 'write',
		description: 'Set one property on a person',
	},
	'persons.deleteProperty': {
		riskLevel: 'destructive',
		description: 'Remove one property from a person',
	},
	'cohorts.list': {
		riskLevel: 'read',
		description: 'List cohorts',
	},
	'cohorts.get': {
		riskLevel: 'read',
		description: 'Get a cohort with its matching rules',
	},
	'cohorts.create': {
		riskLevel: 'write',
		description: 'Create a cohort',
	},
	'cohorts.update': {
		riskLevel: 'write',
		description: 'Update a cohort (name, description, rules)',
	},
	'actions.list': {
		riskLevel: 'read',
		description: 'List actions',
	},
	'actions.get': {
		riskLevel: 'read',
		description: 'Get an action with its steps',
	},
	'actions.create': {
		riskLevel: 'write',
		description: 'Create an action from event, URL or element steps',
	},
	'annotations.list': {
		riskLevel: 'read',
		description: 'List annotations',
	},
	'annotations.create': {
		riskLevel: 'write',
		description: 'Create an annotation on charts',
	},
	'annotations.update': {
		riskLevel: 'write',
		description: 'Update an annotation',
	},
	'annotations.delete': {
		riskLevel: 'destructive',
		description: 'Delete an annotation',
	},
	'eventDefinitions.list': {
		riskLevel: 'read',
		description: 'List event names seen in the project',
	},
	'propertyDefinitions.list': {
		riskLevel: 'read',
		description: 'List event, person, group or session property names',
	},
	'notebooks.list': {
		riskLevel: 'read',
		description: 'List notebooks',
	},
	'notebooks.get': {
		riskLevel: 'read',
		description: 'Get a notebook with its content',
	},
	'notebooks.create': {
		riskLevel: 'write',
		description: 'Create a notebook from a title and text',
	},
	'alerts.list': {
		riskLevel: 'read',
		description: 'List insight alerts',
	},
	'alerts.get': {
		riskLevel: 'read',
		description: 'Get an insight alert',
	},
	'featureFlags.list': {
		riskLevel: 'read',
		description: 'List feature flags',
	},
	'featureFlags.get': {
		riskLevel: 'read',
		description: 'Get a feature flag with its release conditions',
	},
	'featureFlags.create': {
		riskLevel: 'write',
		description: 'Create a feature flag',
	},
	'featureFlags.update': {
		riskLevel: 'write',
		description:
			'Update a feature flag (name, active, release conditions, tags)',
	},
	'featureFlags.delete': {
		riskLevel: 'destructive',
		description: 'Delete a feature flag (PostHog keeps it restorable)',
	},
	'experiments.list': {
		riskLevel: 'read',
		description: 'List experiments',
	},
	'experiments.get': {
		riskLevel: 'read',
		description: 'Get an experiment',
	},
	'experiments.create': {
		riskLevel: 'write',
		description: 'Create a draft experiment and its feature flag',
	},
	'experiments.update': {
		riskLevel: 'write',
		description:
			'Update an experiment (name, description, variants, metrics, archived)',
	},
	'surveys.list': {
		riskLevel: 'read',
		description: 'List surveys',
	},
	'surveys.get': {
		riskLevel: 'read',
		description: 'Get a survey with its questions',
	},
	'surveys.create': {
		riskLevel: 'write',
		description: 'Create a draft survey',
	},
	'surveys.update': {
		riskLevel: 'write',
		description: 'Update a survey (name, description, questions, archived)',
	},
	'surveys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a survey and its settings',
	},
	'earlyAccessFeatures.list': {
		riskLevel: 'read',
		description: 'List early access features',
	},
	'sessionRecordings.list': {
		riskLevel: 'read',
		description: 'List session recordings',
	},
	'sessionRecordings.get': {
		riskLevel: 'read',
		description: 'Get session recording metadata',
	},
	'sessionRecordingPlaylists.list': {
		riskLevel: 'read',
		description: 'List saved recording playlists and collections',
	},
	'batchExports.list': {
		riskLevel: 'read',
		description: 'List batch exports',
	},
	'hogFunctions.list': {
		riskLevel: 'read',
		description: 'List destinations, transformations and other Hog functions',
	},
	'hogFunctions.get': {
		riskLevel: 'read',
		description: 'Get a Hog function with its code, inputs and filters',
	},
	'warehouseTables.list': {
		riskLevel: 'read',
		description: 'List data warehouse tables',
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
