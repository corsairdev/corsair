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
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import type { LinearEndpointInputs, LinearEndpointOutputs } from './endpoints';
import { Comments, Issues, Projects, Teams, Users } from './endpoints';
import {
	LinearEndpointInputSchemas,
	LinearEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LinearSchema } from './schema';
import type {
	CommentCreatedEvent,
	CommentDeletedEvent,
	CommentUpdatedEvent,
	IssueCreatedEvent,
	IssueDeletedEvent,
	IssueUpdatedEvent,
	LinearWebhookOutputs,
	LinearWebhookPayload,
	ProjectCreatedEvent,
	ProjectDeletedEvent,
	ProjectUpdatedEvent,
} from './webhooks';
import { CommentWebhooks, IssueWebhooks, ProjectWebhooks } from './webhooks';
import {
	CommentCreatedEventSchema,
	CommentDeletedEventSchema,
	CommentUpdatedEventSchema,
	IssueCreatedEventSchema,
	IssueDeletedEventSchema,
	IssueUpdatedEventSchema,
	ProjectCreatedEventSchema,
	ProjectDeletedEventSchema,
	ProjectUpdatedEventSchema,
} from './webhooks/types';

export type LinearPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalLinearPlugin['hooks'];
	webhookHooks?: InternalLinearPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Linear plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Linear endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof linearEndpointsNested>;
};

export type LinearContext = CorsairPluginContext<
	typeof LinearSchema,
	LinearPluginOptions
>;
export type LinearKeyBuilderContext = KeyBuilderContext<LinearPluginOptions>;

export type LinearBoundEndpoints = BindEndpoints<typeof linearEndpointsNested>;

type LinearEndpoint<K extends keyof LinearEndpointOutputs> = CorsairEndpoint<
	LinearContext,
	LinearEndpointInputs[K],
	LinearEndpointOutputs[K]
>;

export type LinearEndpoints = {
	issuesList: LinearEndpoint<'issuesList'>;
	issuesGet: LinearEndpoint<'issuesGet'>;
	issuesCreate: LinearEndpoint<'issuesCreate'>;
	issuesUpdate: LinearEndpoint<'issuesUpdate'>;
	issuesDelete: LinearEndpoint<'issuesDelete'>;
	teamsList: LinearEndpoint<'teamsList'>;
	teamsGet: LinearEndpoint<'teamsGet'>;
	usersList: LinearEndpoint<'usersList'>;
	usersGet: LinearEndpoint<'usersGet'>;
	projectsList: LinearEndpoint<'projectsList'>;
	projectsGet: LinearEndpoint<'projectsGet'>;
	projectsCreate: LinearEndpoint<'projectsCreate'>;
	projectsUpdate: LinearEndpoint<'projectsUpdate'>;
	projectsDelete: LinearEndpoint<'projectsDelete'>;
	commentsList: LinearEndpoint<'commentsList'>;
	commentsCreate: LinearEndpoint<'commentsCreate'>;
	commentsUpdate: LinearEndpoint<'commentsUpdate'>;
	commentsDelete: LinearEndpoint<'commentsDelete'>;
};

type LinearWebhook<
	K extends keyof LinearWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	LinearContext,
	LinearWebhookPayload<TEvent>,
	LinearWebhookOutputs[K]
>;

export type LinearWebhooks = {
	issueCreate: LinearWebhook<'issueCreate', IssueCreatedEvent>;
	issueUpdate: LinearWebhook<'issueUpdate', IssueUpdatedEvent>;
	issueRemove: LinearWebhook<'issueRemove', IssueDeletedEvent>;
	commentCreate: LinearWebhook<'commentCreate', CommentCreatedEvent>;
	commentUpdate: LinearWebhook<'commentUpdate', CommentUpdatedEvent>;
	commentRemove: LinearWebhook<'commentRemove', CommentDeletedEvent>;
	projectCreate: LinearWebhook<'projectCreate', ProjectCreatedEvent>;
	projectUpdate: LinearWebhook<'projectUpdate', ProjectUpdatedEvent>;
	projectRemove: LinearWebhook<'projectRemove', ProjectDeletedEvent>;
};

export type LinearBoundWebhooks = BindWebhooks<LinearWebhooks>;

const linearWebhooksNested = {
	issues: {
		create: IssueWebhooks.create,
		update: IssueWebhooks.update,
		remove: IssueWebhooks.remove,
	},
	comments: {
		create: CommentWebhooks.create,
		update: CommentWebhooks.update,
		remove: CommentWebhooks.remove,
	},
	projects: {
		create: ProjectWebhooks.create,
		update: ProjectWebhooks.update,
		remove: ProjectWebhooks.remove,
	},
} as const;

const linearEndpointsNested = {
	issues: {
		list: Issues.list,
		get: Issues.get,
		create: Issues.create,
		update: Issues.update,
		delete: Issues.delete,
	},
	comments: {
		list: Comments.list,
		create: Comments.create,
		update: Comments.update,
		delete: Comments.delete,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.delete,
	},
	teams: {
		list: Teams.list,
		get: Teams.get,
	},
	users: {
		list: Users.list,
		get: Users.get,
	},
} as const;

export const linearEndpointSchemas = {
	'issues.list': {
		input: LinearEndpointInputSchemas.issuesList,
		output: LinearEndpointOutputSchemas.issuesList,
	},
	'issues.get': {
		input: LinearEndpointInputSchemas.issuesGet,
		output: LinearEndpointOutputSchemas.issuesGet,
	},
	'issues.create': {
		input: LinearEndpointInputSchemas.issuesCreate,
		output: LinearEndpointOutputSchemas.issuesCreate,
	},
	'issues.update': {
		input: LinearEndpointInputSchemas.issuesUpdate,
		output: LinearEndpointOutputSchemas.issuesUpdate,
	},
	'issues.delete': {
		input: LinearEndpointInputSchemas.issuesDelete,
		output: LinearEndpointOutputSchemas.issuesDelete,
	},
	'comments.list': {
		input: LinearEndpointInputSchemas.commentsList,
		output: LinearEndpointOutputSchemas.commentsList,
	},
	'comments.create': {
		input: LinearEndpointInputSchemas.commentsCreate,
		output: LinearEndpointOutputSchemas.commentsCreate,
	},
	'comments.update': {
		input: LinearEndpointInputSchemas.commentsUpdate,
		output: LinearEndpointOutputSchemas.commentsUpdate,
	},
	'comments.delete': {
		input: LinearEndpointInputSchemas.commentsDelete,
		output: LinearEndpointOutputSchemas.commentsDelete,
	},
	'projects.list': {
		input: LinearEndpointInputSchemas.projectsList,
		output: LinearEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: LinearEndpointInputSchemas.projectsGet,
		output: LinearEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: LinearEndpointInputSchemas.projectsCreate,
		output: LinearEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: LinearEndpointInputSchemas.projectsUpdate,
		output: LinearEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: LinearEndpointInputSchemas.projectsDelete,
		output: LinearEndpointOutputSchemas.projectsDelete,
	},
	'teams.list': {
		input: LinearEndpointInputSchemas.teamsList,
		output: LinearEndpointOutputSchemas.teamsList,
	},
	'teams.get': {
		input: LinearEndpointInputSchemas.teamsGet,
		output: LinearEndpointOutputSchemas.teamsGet,
	},
	'users.list': {
		input: LinearEndpointInputSchemas.usersList,
		output: LinearEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: LinearEndpointInputSchemas.usersGet,
		output: LinearEndpointOutputSchemas.usersGet,
	},
} as const;

const linearWebhookSchemas = {
	'issues.create': {
		description: 'A new issue was created',
		payload: IssueCreatedEventSchema,
		response: IssueCreatedEventSchema,
	},
	'issues.update': {
		description: 'An issue was updated',
		payload: IssueUpdatedEventSchema,
		response: IssueUpdatedEventSchema,
	},
	'issues.remove': {
		description: 'An issue was deleted',
		payload: IssueDeletedEventSchema,
		response: IssueDeletedEventSchema,
	},
	'comments.create': {
		description: 'A comment was added to an issue',
		payload: CommentCreatedEventSchema,
		response: CommentCreatedEventSchema,
	},
	'comments.update': {
		description: 'A comment was updated',
		payload: CommentUpdatedEventSchema,
		response: CommentUpdatedEventSchema,
	},
	'comments.remove': {
		description: 'A comment was deleted',
		payload: CommentDeletedEventSchema,
		response: CommentDeletedEventSchema,
	},
	'projects.create': {
		description: 'A new project was created',
		payload: ProjectCreatedEventSchema,
		response: ProjectCreatedEventSchema,
	},
	'projects.update': {
		description: 'A project was updated',
		payload: ProjectUpdatedEventSchema,
		response: ProjectUpdatedEventSchema,
	},
	'projects.remove': {
		description: 'A project was deleted',
		payload: ProjectDeletedEventSchema,
		response: ProjectDeletedEventSchema,
	},
} as const;

const defaultAuthType = 'api_key' as const;

/**
 * Risk-level metadata for each Linear endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const linearEndpointMeta = {
	'issues.list': { riskLevel: 'read', description: 'List issues in a team' },
	'issues.get': { riskLevel: 'read', description: 'Get a specific issue' },
	'issues.create': { riskLevel: 'write', description: 'Create a new issue' },
	'issues.update': {
		riskLevel: 'write',
		description: 'Update an existing issue',
	},
	'issues.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete an issue [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List comments on an issue',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Post a comment on an issue',
	},
	'comments.update': { riskLevel: 'write', description: 'Update a comment' },
	'comments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a comment [DESTRUCTIVE]',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects in a team',
	},
	'projects.get': { riskLevel: 'read', description: 'Get a specific project' },
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update an existing project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a project [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List teams in the workspace',
	},
	'teams.get': { riskLevel: 'read', description: 'Get a specific team' },
	'users.list': {
		riskLevel: 'read',
		description: 'List users in the workspace',
	},
	'users.get': { riskLevel: 'read', description: 'Get a specific user' },
} satisfies RequiredPluginEndpointMeta<typeof linearEndpointsNested>;

export type BaseLinearPlugin<T extends LinearPluginOptions> = CorsairPlugin<
	'linear',
	typeof LinearSchema,
	typeof linearEndpointsNested,
	typeof linearWebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalLinearPlugin = BaseLinearPlugin<LinearPluginOptions>;

export type ExternalLinearPlugin<T extends LinearPluginOptions> =
	BaseLinearPlugin<T>;

export function linear<const T extends LinearPluginOptions>(
	incomingOptions: LinearPluginOptions & T = {} as LinearPluginOptions & T,
): ExternalLinearPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'linear',
		schema: LinearSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: linearEndpointsNested,
		webhooks: linearWebhooksNested,
		endpointMeta: linearEndpointMeta,
		endpointSchemas: linearEndpointSchemas,
		webhookSchemas: linearWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasLinearSignature = 'linear-signature' in headers;
			return hasLinearSignature;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LinearKeyBuilderContext, source) => {
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
	} satisfies InternalLinearPlugin;
}

export {
	createLinearEventMatch,
	verifyLinearWebhookSignature,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CommentCreatedEvent,
	CommentDeletedEvent,
	CommentUpdatedEvent,
	IssueCreatedEvent,
	IssueDeletedEvent,
	IssueUpdatedEvent,
	LinearEventMap,
	LinearEventName,
	LinearWebhookEvent,
	LinearWebhookOutputs,
	ProjectCreatedEvent,
	ProjectDeletedEvent,
	ProjectUpdatedEvent,
	WebhookData,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	Comment,
	CommentConnection,
	CommentCreateResponse,
	CommentDeleteResponse,
	CommentsListResponse,
	CommentUpdateResponse,
	CreateCommentInput,
	CreateIssueInput,
	CreateProjectInput,
	Cycle,
	Issue,
	IssueConnection,
	IssueCreateResponse,
	IssueDeleteResponse,
	IssueGetResponse,
	IssuePriority,
	IssuesListResponse,
	IssueUpdateResponse,
	Label,
	LinearEndpointInputs,
	LinearEndpointOutputs,
	PageInfo,
	Project,
	ProjectConnection,
	ProjectCreateResponse,
	ProjectDeleteResponse,
	ProjectGetResponse,
	ProjectState,
	ProjectsListResponse,
	ProjectUpdateResponse,
	Team,
	TeamConnection,
	TeamGetResponse,
	TeamsListResponse,
	UpdateCommentInput,
	UpdateIssueInput,
	UpdateProjectInput,
	User,
	WorkflowState,
	WorkflowStateType,
} from './endpoints/types';
