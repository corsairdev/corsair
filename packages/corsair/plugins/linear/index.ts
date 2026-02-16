import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import type {
	LinearEndpointInputs,
	LinearEndpointOutputs,
} from './endpoints';
import { Comments, Issues, Projects, Teams } from './endpoints';
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

export type LinearPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalLinearPlugin['hooks'];
	webhookHooks?: InternalLinearPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
};

export type LinearContext = CorsairPluginContext<
	typeof LinearSchema,
	LinearPluginOptions
>;
export type LinearKeyBuilderContext = KeyBuilderContext<LinearPluginOptions>;

export type LinearBoundEndpoints = BindEndpoints<typeof linearEndpointsNested>;

type LinearEndpoint<
	K extends keyof LinearEndpointOutputs,
> = CorsairEndpoint<
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

type LinearWebhook<K extends keyof LinearWebhookOutputs, TEvent> = CorsairWebhook<
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
} as const;

const defaultAuthType: AuthTypes = 'api_key';

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
				const res = await ctx.keys.getWebhookSignature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.getApiKey();

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
