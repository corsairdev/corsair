import type {
	AuthType,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
} from '../../core';
import * as commentsEndpoints from './endpoints/comments';
import * as issuesEndpoints from './endpoints/issues';
import * as projectsEndpoints from './endpoints/projects';
import * as teamsEndpoints from './endpoints/teams';
import type { LinearCredentials } from './schema';
import { LinearSchema } from './schema';
import type { LinearEndpointOutputs } from './endpoints/types';
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
} from './webhooks/types';
import * as commentsWebhooks from './webhooks/comments';
import * as issuesWebhooks from './webhooks/issues';
import * as projectsWebhooks from './webhooks/projects';

export type LinearPluginOptions = {
	authType: AuthType;
	credentials: LinearCredentials;
	hooks?: CorsairPlugin<'linear', LinearEndpoints>['hooks'] | undefined;
	webhookHooks?: CorsairPlugin<
		'linear',
		LinearEndpoints,
		typeof LinearSchema,
		LinearCredentials,
		typeof linearWebhooksNested
	>['webhookHooks'];
};

export type LinearContext = CorsairPluginContext<
	'linear',
	typeof LinearSchema,
	LinearCredentials
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

type LinearWebhook<K extends keyof LinearWebhookOutputs, TEvent> = CorsairWebhook<
	LinearContext,
	LinearWebhookEvent,
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
		create: issuesWebhooks.issueCreate,
		update: issuesWebhooks.issueUpdate,
		remove: issuesWebhooks.issueRemove,
	},
	comments: {
		create: commentsWebhooks.commentCreate,
		update: commentsWebhooks.commentUpdate,
		remove: commentsWebhooks.commentRemove,
	},
	projects: {
		create: projectsWebhooks.projectCreate,
		update: projectsWebhooks.projectUpdate,
		remove: projectsWebhooks.projectRemove,
	},
} as const;

export function linear(options: LinearPluginOptions) {
	return {
		id: 'linear',
		schema: LinearSchema,
		options: options.credentials,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: {
			issuesList: issuesEndpoints.list,
			issuesGet: issuesEndpoints.get,
			issuesCreate: issuesEndpoints.create,
			issuesUpdate: issuesEndpoints.update,
			issuesDelete: issuesEndpoints.deleteIssue,
			teamsList: teamsEndpoints.list,
			teamsGet: teamsEndpoints.get,
			projectsList: projectsEndpoints.list,
			projectsGet: projectsEndpoints.get,
			projectsCreate: projectsEndpoints.create,
			projectsUpdate: projectsEndpoints.update,
			projectsDelete: projectsEndpoints.deleteProject,
			commentsList: commentsEndpoints.list,
			commentsCreate: commentsEndpoints.create,
			commentsUpdate: commentsEndpoints.update,
			commentsDelete: commentsEndpoints.deleteComment,
		} as LinearEndpoints,
		webhooks: linearWebhooksNested,
	} satisfies CorsairPlugin<
		'linear',
		LinearEndpoints,
		typeof LinearSchema,
		LinearCredentials,
		typeof linearWebhooksNested
	>;
}
