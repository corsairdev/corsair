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
import type { SentryEndpointInputs, SentryEndpointOutputs } from './endpoints';
import {
	Events,
	Issues,
	Organizations,
	Projects,
	Releases,
	Teams,
} from './endpoints';
import {
	SentryEndpointInputSchemas,
	SentryEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SentrySchema } from './schema';
import type {
	CommentCreatedEvent,
	CommentDeletedEvent,
	CommentUpdatedEvent,
	ErrorCreatedEvent,
	EventAlertEvent,
	IssueAssignedEvent,
	IssueCreatedEvent,
	IssueResolvedEvent,
	MetricAlertEvent,
	SentryWebhookOutputs,
	SentryWebhookPayload,
} from './webhooks';
import {
	AlertWebhooks,
	CommentWebhooks,
	ErrorWebhooks,
	IssueWebhooks,
} from './webhooks';
import {
	CommentCreatedEventSchema,
	CommentDeletedEventSchema,
	CommentUpdatedEventSchema,
	ErrorCreatedEventSchema,
	EventAlertEventSchema,
	IssueAssignedEventSchema,
	IssueCreatedEventSchema,
	IssueResolvedEventSchema,
	MetricAlertEventSchema,
} from './webhooks/types';

export type SentryPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalSentryPlugin['hooks'];
	webhookHooks?: InternalSentryPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof sentryEndpointsNested>;
};

export type SentryContext = CorsairPluginContext<
	typeof SentrySchema,
	SentryPluginOptions
>;

export type SentryKeyBuilderContext = KeyBuilderContext<SentryPluginOptions>;

export type SentryBoundEndpoints = BindEndpoints<typeof sentryEndpointsNested>;

type SentryEndpoint<K extends keyof SentryEndpointOutputs> = CorsairEndpoint<
	SentryContext,
	SentryEndpointInputs[K],
	SentryEndpointOutputs[K]
>;

export type SentryEndpoints = {
	eventsGet: SentryEndpoint<'eventsGet'>;
	eventsList: SentryEndpoint<'eventsList'>;
	issuesGet: SentryEndpoint<'issuesGet'>;
	issuesList: SentryEndpoint<'issuesList'>;
	issuesUpdate: SentryEndpoint<'issuesUpdate'>;
	issuesDelete: SentryEndpoint<'issuesDelete'>;
	organizationsGet: SentryEndpoint<'organizationsGet'>;
	organizationsList: SentryEndpoint<'organizationsList'>;
	organizationsCreate: SentryEndpoint<'organizationsCreate'>;
	organizationsUpdate: SentryEndpoint<'organizationsUpdate'>;
	projectsGet: SentryEndpoint<'projectsGet'>;
	projectsList: SentryEndpoint<'projectsList'>;
	projectsCreate: SentryEndpoint<'projectsCreate'>;
	projectsUpdate: SentryEndpoint<'projectsUpdate'>;
	projectsDelete: SentryEndpoint<'projectsDelete'>;
	releasesGet: SentryEndpoint<'releasesGet'>;
	releasesList: SentryEndpoint<'releasesList'>;
	releasesCreate: SentryEndpoint<'releasesCreate'>;
	releasesUpdate: SentryEndpoint<'releasesUpdate'>;
	releasesDelete: SentryEndpoint<'releasesDelete'>;
	teamsGet: SentryEndpoint<'teamsGet'>;
	teamsList: SentryEndpoint<'teamsList'>;
	teamsCreate: SentryEndpoint<'teamsCreate'>;
	teamsUpdate: SentryEndpoint<'teamsUpdate'>;
	teamsDelete: SentryEndpoint<'teamsDelete'>;
};

type SentryWebhook<
	K extends keyof SentryWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	SentryContext,
	SentryWebhookPayload<TEvent>,
	SentryWebhookOutputs[K]
>;

export type SentryWebhooks = {
	issueCreated: SentryWebhook<'issueCreated', IssueCreatedEvent>;
	issueResolved: SentryWebhook<'issueResolved', IssueResolvedEvent>;
	issueAssigned: SentryWebhook<'issueAssigned', IssueAssignedEvent>;
	errorCreated: SentryWebhook<'errorCreated', ErrorCreatedEvent>;
	eventAlert: SentryWebhook<'eventAlert', EventAlertEvent>;
	metricAlert: SentryWebhook<'metricAlert', MetricAlertEvent>;
	commentCreated: SentryWebhook<'commentCreated', CommentCreatedEvent>;
	commentUpdated: SentryWebhook<'commentUpdated', CommentUpdatedEvent>;
	commentDeleted: SentryWebhook<'commentDeleted', CommentDeletedEvent>;
};

export type SentryBoundWebhooks = BindWebhooks<SentryWebhooks>;

const sentryEndpointsNested = {
	events: {
		get: Events.get,
		list: Events.list,
	},
	issues: {
		get: Issues.get,
		list: Issues.list,
		update: Issues.update,
		delete: Issues.delete,
	},
	organizations: {
		get: Organizations.get,
		list: Organizations.list,
		create: Organizations.create,
		update: Organizations.update,
	},
	projects: {
		get: Projects.get,
		list: Projects.list,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.delete,
	},
	releases: {
		get: Releases.get,
		list: Releases.list,
		create: Releases.create,
		update: Releases.update,
		delete: Releases.delete,
	},
	teams: {
		get: Teams.get,
		list: Teams.list,
		create: Teams.create,
		update: Teams.update,
		delete: Teams.delete,
	},
} as const;

const sentryWebhooksNested = {
	issues: {
		created: IssueWebhooks.created,
		resolved: IssueWebhooks.resolved,
		assigned: IssueWebhooks.assigned,
	},
	errors: {
		created: ErrorWebhooks.created,
	},
	alerts: {
		eventAlert: AlertWebhooks.eventAlert,
		metricAlert: AlertWebhooks.metricAlert,
	},
	comments: {
		created: CommentWebhooks.created,
		updated: CommentWebhooks.updated,
		deleted: CommentWebhooks.deleted,
	},
} as const;

export const sentryEndpointSchemas = {
	'events.get': {
		input: SentryEndpointInputSchemas.eventsGet,
		output: SentryEndpointOutputSchemas.eventsGet,
	},
	'events.list': {
		input: SentryEndpointInputSchemas.eventsList,
		output: SentryEndpointOutputSchemas.eventsList,
	},
	'issues.get': {
		input: SentryEndpointInputSchemas.issuesGet,
		output: SentryEndpointOutputSchemas.issuesGet,
	},
	'issues.list': {
		input: SentryEndpointInputSchemas.issuesList,
		output: SentryEndpointOutputSchemas.issuesList,
	},
	'issues.update': {
		input: SentryEndpointInputSchemas.issuesUpdate,
		output: SentryEndpointOutputSchemas.issuesUpdate,
	},
	'issues.delete': {
		input: SentryEndpointInputSchemas.issuesDelete,
		output: SentryEndpointOutputSchemas.issuesDelete,
	},
	'organizations.get': {
		input: SentryEndpointInputSchemas.organizationsGet,
		output: SentryEndpointOutputSchemas.organizationsGet,
	},
	'organizations.list': {
		input: SentryEndpointInputSchemas.organizationsList,
		output: SentryEndpointOutputSchemas.organizationsList,
	},
	'organizations.create': {
		input: SentryEndpointInputSchemas.organizationsCreate,
		output: SentryEndpointOutputSchemas.organizationsCreate,
	},
	'organizations.update': {
		input: SentryEndpointInputSchemas.organizationsUpdate,
		output: SentryEndpointOutputSchemas.organizationsUpdate,
	},
	'projects.get': {
		input: SentryEndpointInputSchemas.projectsGet,
		output: SentryEndpointOutputSchemas.projectsGet,
	},
	'projects.list': {
		input: SentryEndpointInputSchemas.projectsList,
		output: SentryEndpointOutputSchemas.projectsList,
	},
	'projects.create': {
		input: SentryEndpointInputSchemas.projectsCreate,
		output: SentryEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: SentryEndpointInputSchemas.projectsUpdate,
		output: SentryEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: SentryEndpointInputSchemas.projectsDelete,
		output: SentryEndpointOutputSchemas.projectsDelete,
	},
	'releases.get': {
		input: SentryEndpointInputSchemas.releasesGet,
		output: SentryEndpointOutputSchemas.releasesGet,
	},
	'releases.list': {
		input: SentryEndpointInputSchemas.releasesList,
		output: SentryEndpointOutputSchemas.releasesList,
	},
	'releases.create': {
		input: SentryEndpointInputSchemas.releasesCreate,
		output: SentryEndpointOutputSchemas.releasesCreate,
	},
	'releases.update': {
		input: SentryEndpointInputSchemas.releasesUpdate,
		output: SentryEndpointOutputSchemas.releasesUpdate,
	},
	'releases.delete': {
		input: SentryEndpointInputSchemas.releasesDelete,
		output: SentryEndpointOutputSchemas.releasesDelete,
	},
	'teams.get': {
		input: SentryEndpointInputSchemas.teamsGet,
		output: SentryEndpointOutputSchemas.teamsGet,
	},
	'teams.list': {
		input: SentryEndpointInputSchemas.teamsList,
		output: SentryEndpointOutputSchemas.teamsList,
	},
	'teams.create': {
		input: SentryEndpointInputSchemas.teamsCreate,
		output: SentryEndpointOutputSchemas.teamsCreate,
	},
	'teams.update': {
		input: SentryEndpointInputSchemas.teamsUpdate,
		output: SentryEndpointOutputSchemas.teamsUpdate,
	},
	'teams.delete': {
		input: SentryEndpointInputSchemas.teamsDelete,
		output: SentryEndpointOutputSchemas.teamsDelete,
	},
} as const;

const sentryWebhookSchemas = {
	'issues.created': {
		description: 'A new issue was created in Sentry',
		payload: IssueCreatedEventSchema,
		response: IssueCreatedEventSchema,
	},
	'issues.resolved': {
		description: 'An issue was resolved',
		payload: IssueResolvedEventSchema,
		response: IssueResolvedEventSchema,
	},
	'issues.assigned': {
		description: 'An issue was assigned to a user or team',
		payload: IssueAssignedEventSchema,
		response: IssueAssignedEventSchema,
	},
	'errors.created': {
		description: 'A new error event was captured in Sentry',
		payload: ErrorCreatedEventSchema,
		response: ErrorCreatedEventSchema,
	},
	'alerts.eventAlert': {
		description: 'An issue alert rule was triggered',
		payload: EventAlertEventSchema,
		response: EventAlertEventSchema,
	},
	'alerts.metricAlert': {
		description: 'A metric alert was triggered',
		payload: MetricAlertEventSchema,
		response: MetricAlertEventSchema,
	},
	'comments.created': {
		description: 'A comment was added to an issue',
		payload: CommentCreatedEventSchema,
		response: CommentCreatedEventSchema,
	},
	'comments.updated': {
		description: 'A comment was updated',
		payload: CommentUpdatedEventSchema,
		response: CommentUpdatedEventSchema,
	},
	'comments.deleted': {
		description: 'A comment was deleted',
		payload: CommentDeletedEventSchema,
		response: CommentDeletedEventSchema,
	},
} as const;

const defaultAuthType = 'api_key' as const;

const sentryEndpointMeta = {
	'events.get': {
		riskLevel: 'read',
		description: 'Get an event by ID',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List events for a project',
	},
	'issues.get': {
		riskLevel: 'read',
		description: 'Get an issue by ID',
	},
	'issues.list': {
		riskLevel: 'read',
		description: 'List issues for a project',
	},
	'issues.update': {
		riskLevel: 'write',
		description: 'Update an issue',
	},
	'issues.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete an issue [DESTRUCTIVE]',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get an organization by slug',
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List organizations',
	},
	'organizations.create': {
		riskLevel: 'write',
		description: 'Create a new organization',
	},
	'organizations.update': {
		riskLevel: 'write',
		description: 'Update an organization',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a project by slug',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects for an organization',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update a project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a project [DESTRUCTIVE]',
	},
	'releases.get': {
		riskLevel: 'read',
		description: 'Get a release by version ID',
	},
	'releases.list': {
		riskLevel: 'read',
		description: 'List releases for an organization',
	},
	'releases.create': {
		riskLevel: 'write',
		description: 'Create a new release',
	},
	'releases.update': {
		riskLevel: 'write',
		description: 'Update a release',
	},
	'releases.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a release [DESTRUCTIVE]',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Get a team by slug',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List teams for an organization',
	},
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a new team',
	},
	'teams.update': {
		riskLevel: 'write',
		description: 'Update a team',
	},
	'teams.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a team [DESTRUCTIVE]',
	},
} satisfies RequiredPluginEndpointMeta<typeof sentryEndpointsNested>;

export const sentryAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSentryPlugin<T extends SentryPluginOptions> = CorsairPlugin<
	'sentry',
	typeof SentrySchema,
	typeof sentryEndpointsNested,
	typeof sentryWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSentryPlugin = BaseSentryPlugin<SentryPluginOptions>;

export type ExternalSentryPlugin<T extends SentryPluginOptions> =
	BaseSentryPlugin<T>;

export function sentry<const T extends SentryPluginOptions>(
	incomingOptions: SentryPluginOptions & T = {} as SentryPluginOptions & T,
): ExternalSentryPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'sentry',
		schema: SentrySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: sentryEndpointsNested,
		webhooks: sentryWebhooksNested,
		endpointMeta: sentryEndpointMeta,
		endpointSchemas: sentryEndpointSchemas,
		webhookSchemas: sentryWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return (
				'sentry-hook-signature' in headers && 'sentry-hook-resource' in headers
			);
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SentryKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalSentryPlugin;
}

export {
	createSentryEventMatch,
	verifySentryWebhookSignature,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CommentCreatedEvent,
	CommentDeletedEvent,
	CommentUpdatedEvent,
	ErrorCreatedEvent,
	EventAlertEvent,
	IssueAssignedEvent,
	IssueCreatedEvent,
	IssueResolvedEvent,
	MetricAlertEvent,
	SentryActor,
	SentryWebhookEvent,
	SentryWebhookOutputs,
	SentryWebhookPayload,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	SentryEndpointInputs,
	SentryEndpointOutputs,
	SentryEventOutput,
	SentryIssueOutput,
	SentryOrganizationOutput,
	SentryProjectOutput,
	SentryReleaseOutput,
	SentryTeamOutput,
} from './endpoints/types';
