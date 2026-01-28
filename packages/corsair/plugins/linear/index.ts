import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
} from '../../core';
import type { PickAuth } from '../../core/constants';
import type { LinearEndpointOutputs } from './endpoints';
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
	LinearWebhookEvent,
	LinearWebhookOutputs,
	ProjectCreatedEvent,
	ProjectDeletedEvent,
	ProjectUpdatedEvent,
} from './webhooks';
import { CommentWebhooks, IssueWebhooks, ProjectWebhooks } from './webhooks';

export type LinearPluginOptions = {
	authType: PickAuth<'api_key'>;
	hooks?: LinearPlugin['hooks'];
	webhookHooks?: LinearPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
};

export type LinearContext = CorsairPluginContext<
	typeof LinearSchema,
	LinearPluginOptions
>;

export type LinearBoundEndpoints = BindEndpoints<LinearEndpoints>;

type LinearEndpoint<
	K extends keyof LinearEndpointOutputs,
	Input,
> = CorsairEndpoint<LinearContext, Input, LinearEndpointOutputs[K]>;

export type LinearEndpoints = {
	issuesList: LinearEndpoint<
		'issuesList',
		{ teamId?: string; first?: number; after?: string }
	>;
	issuesGet: LinearEndpoint<'issuesGet', { id: string }>;
	issuesCreate: LinearEndpoint<
		'issuesCreate',
		{
			title: string;
			description?: string;
			teamId: string;
			assigneeId?: string;
			priority?: 0 | 1 | 2 | 3 | 4;
			estimate?: number;
			stateId?: string;
			projectId?: string;
			cycleId?: string;
			parentId?: string;
			labelIds?: string[];
			subscriberIds?: string[];
			dueDate?: string;
		}
	>;
	issuesUpdate: LinearEndpoint<
		'issuesUpdate',
		{
			id: string;
			input: {
				title?: string;
				description?: string;
				assigneeId?: string;
				priority?: 0 | 1 | 2 | 3 | 4;
				estimate?: number;
				stateId?: string;
				projectId?: string;
				cycleId?: string;
				parentId?: string;
				labelIds?: string[];
				subscriberIds?: string[];
				dueDate?: string;
			};
		}
	>;
	issuesDelete: LinearEndpoint<'issuesDelete', { id: string }>;
	teamsList: LinearEndpoint<'teamsList', { first?: number; after?: string }>;
	teamsGet: LinearEndpoint<'teamsGet', { id: string }>;
	projectsList: LinearEndpoint<
		'projectsList',
		{ first?: number; after?: string }
	>;
	projectsGet: LinearEndpoint<'projectsGet', { id: string }>;
	projectsCreate: LinearEndpoint<
		'projectsCreate',
		{
			name: string;
			description?: string;
			icon?: string;
			color?: string;
			teamIds: string[];
			leadId?: string;
			state?: 'planned' | 'started' | 'paused' | 'completed' | 'canceled';
			priority?: number;
			startDate?: string;
			targetDate?: string;
		}
	>;
	projectsUpdate: LinearEndpoint<
		'projectsUpdate',
		{
			id: string;
			input: {
				name?: string;
				description?: string;
				icon?: string;
				color?: string;
				teamIds?: string[];
				leadId?: string;
				state?: 'planned' | 'started' | 'paused' | 'completed' | 'canceled';
				priority?: number;
				startDate?: string;
				targetDate?: string;
			};
		}
	>;
	projectsDelete: LinearEndpoint<'projectsDelete', { id: string }>;
	commentsList: LinearEndpoint<
		'commentsList',
		{ issueId: string; first?: number; after?: string }
	>;
	commentsCreate: LinearEndpoint<
		'commentsCreate',
		{ issueId: string; body: string; parentId?: string }
	>;
	commentsUpdate: LinearEndpoint<
		'commentsUpdate',
		{ id: string; input: { body?: string } }
	>;
	commentsDelete: LinearEndpoint<'commentsDelete', { id: string }>;
};

type LinearWebhook<
	K extends keyof LinearWebhookOutputs,
	TEvent,
> = CorsairWebhook<LinearContext, LinearWebhookEvent, LinearWebhookOutputs[K]>;

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

export type LinearPlugin = CorsairPlugin<
	'linear',
	typeof LinearSchema,
	typeof linearEndpointsNested,
	typeof linearWebhooksNested,
	LinearPluginOptions
>;

export function linear(options: LinearPluginOptions) {
	return {
		id: 'linear',
		schema: LinearSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: linearEndpointsNested,
		webhooks: linearWebhooksNested,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
	} satisfies LinearPlugin;
}
