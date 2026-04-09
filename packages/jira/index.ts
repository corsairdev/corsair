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
	Comments,
	Groups,
	Issues,
	Projects,
	Sprints,
	Users,
} from './endpoints';
import type {
	JiraEndpointInputs,
	JiraEndpointOutputs,
} from './endpoints/types';
import {
	JiraEndpointInputSchemas,
	JiraEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { JiraSchema } from './schema';
import { IssueWebhooks, ProjectWebhooks } from './webhooks';
import type {
	JiraWebhookOutputs,
	NewIssueEvent,
	NewProjectEvent,
	UpdatedIssueEvent,
} from './webhooks/types';
import {
	JiraNewIssuePayloadSchema,
	JiraNewProjectPayloadSchema,
	JiraUpdatedIssuePayloadSchema,
	NewIssueEventSchema,
	NewProjectEventSchema,
	UpdatedIssueEventSchema,
} from './webhooks/types';

export type JiraPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	/**
	 * Jira Cloud URL, e.g. 'https://your-domain.atlassian.net'
	 * Required for all API calls.
	 */
	cloudUrl?: string;
	hooks?: InternalJiraPlugin['hooks'];
	webhookHooks?: InternalJiraPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Jira plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Jira endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof jiraEndpointsNested>;
};

/**
 * Extends the base api_key auth config with a `cloud_url` account field.
 * This allows the Jira Cloud URL (e.g. https://your-domain.atlassian.net) to be
 * stored in the database and set via `corsair auth`, rather than hard-coded in options.
 */
export const jiraAuthConfig = {
	api_key: {
		account: ['cloud_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type JiraContext = CorsairPluginContext<
	typeof JiraSchema,
	JiraPluginOptions,
	undefined,
	typeof jiraAuthConfig
>;

export type JiraKeyBuilderContext = KeyBuilderContext<
	JiraPluginOptions,
	typeof jiraAuthConfig
>;

export type JiraBoundEndpoints = BindEndpoints<typeof jiraEndpointsNested>;

type JiraEndpoint<K extends keyof JiraEndpointOutputs> = CorsairEndpoint<
	JiraContext,
	JiraEndpointInputs[K],
	JiraEndpointOutputs[K]
>;

export type JiraEndpoints = {
	issuesCreate: JiraEndpoint<'issuesCreate'>;
	issuesGet: JiraEndpoint<'issuesGet'>;
	issuesEdit: JiraEndpoint<'issuesEdit'>;
	issuesDelete: JiraEndpoint<'issuesDelete'>;
	issuesSearch: JiraEndpoint<'issuesSearch'>;
	issuesAssign: JiraEndpoint<'issuesAssign'>;
	issuesGetTransitions: JiraEndpoint<'issuesGetTransitions'>;
	issuesTransition: JiraEndpoint<'issuesTransition'>;
	issuesBulkCreate: JiraEndpoint<'issuesBulkCreate'>;
	issuesBulkFetch: JiraEndpoint<'issuesBulkFetch'>;
	issuesAddAttachment: JiraEndpoint<'issuesAddAttachment'>;
	issuesAddWatcher: JiraEndpoint<'issuesAddWatcher'>;
	issuesRemoveWatcher: JiraEndpoint<'issuesRemoveWatcher'>;
	issuesLinkIssues: JiraEndpoint<'issuesLinkIssues'>;
	commentsAdd: JiraEndpoint<'commentsAdd'>;
	commentsGet: JiraEndpoint<'commentsGet'>;
	commentsList: JiraEndpoint<'commentsList'>;
	commentsUpdate: JiraEndpoint<'commentsUpdate'>;
	commentsDelete: JiraEndpoint<'commentsDelete'>;
	projectsCreate: JiraEndpoint<'projectsCreate'>;
	projectsGet: JiraEndpoint<'projectsGet'>;
	projectsList: JiraEndpoint<'projectsList'>;
	projectsGetRoles: JiraEndpoint<'projectsGetRoles'>;
	sprintsCreate: JiraEndpoint<'sprintsCreate'>;
	sprintsList: JiraEndpoint<'sprintsList'>;
	sprintsMoveIssues: JiraEndpoint<'sprintsMoveIssues'>;
	sprintsListBoards: JiraEndpoint<'sprintsListBoards'>;
	usersGetCurrent: JiraEndpoint<'usersGetCurrent'>;
	usersFind: JiraEndpoint<'usersFind'>;
	usersGetAll: JiraEndpoint<'usersGetAll'>;
	groupsGetAll: JiraEndpoint<'groupsGetAll'>;
	groupsCreate: JiraEndpoint<'groupsCreate'>;
};

type JiraWebhook<K extends keyof JiraWebhookOutputs, TEvent> = CorsairWebhook<
	JiraContext,
	TEvent,
	JiraWebhookOutputs[K]
>;

export type JiraWebhooks = {
	newIssue: JiraWebhook<'newIssue', NewIssueEvent>;
	updatedIssue: JiraWebhook<'updatedIssue', UpdatedIssueEvent>;
	newProject: JiraWebhook<'newProject', NewProjectEvent>;
};

export type JiraBoundWebhooks = BindWebhooks<JiraWebhooks>;

const jiraEndpointsNested = {
	issues: {
		create: Issues.create,
		get: Issues.get,
		edit: Issues.edit,
		delete: Issues.delete,
		search: Issues.search,
		assign: Issues.assign,
		getTransitions: Issues.getTransitions,
		transition: Issues.transition,
		bulkCreate: Issues.bulkCreate,
		bulkFetch: Issues.bulkFetch,
		addAttachment: Issues.addAttachment,
		addWatcher: Issues.addWatcher,
		removeWatcher: Issues.removeWatcher,
		linkIssues: Issues.linkIssues,
	},
	comments: {
		add: Comments.add,
		get: Comments.get,
		list: Comments.list,
		update: Comments.update,
		delete: Comments.delete,
	},
	projects: {
		create: Projects.create,
		get: Projects.get,
		list: Projects.list,
		getRoles: Projects.getRoles,
	},
	sprints: {
		create: Sprints.create,
		list: Sprints.list,
		moveIssues: Sprints.moveIssues,
		listBoards: Sprints.listBoards,
	},
	users: {
		getCurrent: Users.getCurrent,
		find: Users.find,
		getAll: Users.getAll,
	},
	groups: {
		getAll: Groups.getAll,
		create: Groups.create,
	},
} as const;

const jiraWebhooksNested = {
	issues: {
		newIssue: IssueWebhooks.newIssue,
		updatedIssue: IssueWebhooks.updatedIssue,
	},
	projects: {
		newProject: ProjectWebhooks.newProject,
	},
} as const;

export const jiraEndpointSchemas = {
	'issues.create': {
		input: JiraEndpointInputSchemas.issuesCreate,
		output: JiraEndpointOutputSchemas.issuesCreate,
	},
	'issues.get': {
		input: JiraEndpointInputSchemas.issuesGet,
		output: JiraEndpointOutputSchemas.issuesGet,
	},
	'issues.edit': {
		input: JiraEndpointInputSchemas.issuesEdit,
		output: JiraEndpointOutputSchemas.issuesEdit,
	},
	'issues.delete': {
		input: JiraEndpointInputSchemas.issuesDelete,
		output: JiraEndpointOutputSchemas.issuesDelete,
	},
	'issues.search': {
		input: JiraEndpointInputSchemas.issuesSearch,
		output: JiraEndpointOutputSchemas.issuesSearch,
	},
	'issues.assign': {
		input: JiraEndpointInputSchemas.issuesAssign,
		output: JiraEndpointOutputSchemas.issuesAssign,
	},
	'issues.getTransitions': {
		input: JiraEndpointInputSchemas.issuesGetTransitions,
		output: JiraEndpointOutputSchemas.issuesGetTransitions,
	},
	'issues.transition': {
		input: JiraEndpointInputSchemas.issuesTransition,
		output: JiraEndpointOutputSchemas.issuesTransition,
	},
	'issues.bulkCreate': {
		input: JiraEndpointInputSchemas.issuesBulkCreate,
		output: JiraEndpointOutputSchemas.issuesBulkCreate,
	},
	'issues.bulkFetch': {
		input: JiraEndpointInputSchemas.issuesBulkFetch,
		output: JiraEndpointOutputSchemas.issuesBulkFetch,
	},
	'issues.addAttachment': {
		input: JiraEndpointInputSchemas.issuesAddAttachment,
		output: JiraEndpointOutputSchemas.issuesAddAttachment,
	},
	'issues.addWatcher': {
		input: JiraEndpointInputSchemas.issuesAddWatcher,
		output: JiraEndpointOutputSchemas.issuesAddWatcher,
	},
	'issues.removeWatcher': {
		input: JiraEndpointInputSchemas.issuesRemoveWatcher,
		output: JiraEndpointOutputSchemas.issuesRemoveWatcher,
	},
	'issues.linkIssues': {
		input: JiraEndpointInputSchemas.issuesLinkIssues,
		output: JiraEndpointOutputSchemas.issuesLinkIssues,
	},
	'comments.add': {
		input: JiraEndpointInputSchemas.commentsAdd,
		output: JiraEndpointOutputSchemas.commentsAdd,
	},
	'comments.get': {
		input: JiraEndpointInputSchemas.commentsGet,
		output: JiraEndpointOutputSchemas.commentsGet,
	},
	'comments.list': {
		input: JiraEndpointInputSchemas.commentsList,
		output: JiraEndpointOutputSchemas.commentsList,
	},
	'comments.update': {
		input: JiraEndpointInputSchemas.commentsUpdate,
		output: JiraEndpointOutputSchemas.commentsUpdate,
	},
	'comments.delete': {
		input: JiraEndpointInputSchemas.commentsDelete,
		output: JiraEndpointOutputSchemas.commentsDelete,
	},
	'projects.create': {
		input: JiraEndpointInputSchemas.projectsCreate,
		output: JiraEndpointOutputSchemas.projectsCreate,
	},
	'projects.get': {
		input: JiraEndpointInputSchemas.projectsGet,
		output: JiraEndpointOutputSchemas.projectsGet,
	},
	'projects.list': {
		input: JiraEndpointInputSchemas.projectsList,
		output: JiraEndpointOutputSchemas.projectsList,
	},
	'projects.getRoles': {
		input: JiraEndpointInputSchemas.projectsGetRoles,
		output: JiraEndpointOutputSchemas.projectsGetRoles,
	},
	'sprints.create': {
		input: JiraEndpointInputSchemas.sprintsCreate,
		output: JiraEndpointOutputSchemas.sprintsCreate,
	},
	'sprints.list': {
		input: JiraEndpointInputSchemas.sprintsList,
		output: JiraEndpointOutputSchemas.sprintsList,
	},
	'sprints.moveIssues': {
		input: JiraEndpointInputSchemas.sprintsMoveIssues,
		output: JiraEndpointOutputSchemas.sprintsMoveIssues,
	},
	'sprints.listBoards': {
		input: JiraEndpointInputSchemas.sprintsListBoards,
		output: JiraEndpointOutputSchemas.sprintsListBoards,
	},
	'users.getCurrent': {
		input: JiraEndpointInputSchemas.usersGetCurrent,
		output: JiraEndpointOutputSchemas.usersGetCurrent,
	},
	'users.find': {
		input: JiraEndpointInputSchemas.usersFind,
		output: JiraEndpointOutputSchemas.usersFind,
	},
	'users.getAll': {
		input: JiraEndpointInputSchemas.usersGetAll,
		output: JiraEndpointOutputSchemas.usersGetAll,
	},
	'groups.getAll': {
		input: JiraEndpointInputSchemas.groupsGetAll,
		output: JiraEndpointOutputSchemas.groupsGetAll,
	},
	'groups.create': {
		input: JiraEndpointInputSchemas.groupsCreate,
		output: JiraEndpointOutputSchemas.groupsCreate,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const jiraEndpointMeta = {
	'issues.create': {
		riskLevel: 'write',
		description: 'Create a new Jira issue',
	},
	'issues.get': {
		riskLevel: 'read',
		description: 'Get a Jira issue by ID or key',
	},
	'issues.edit': {
		riskLevel: 'write',
		description: 'Edit an existing Jira issue',
	},
	'issues.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Jira issue [DESTRUCTIVE]',
	},
	'issues.search': {
		riskLevel: 'read',
		description: 'Search issues using JQL',
	},
	'issues.assign': {
		riskLevel: 'write',
		description: 'Assign a Jira issue to a user',
	},
	'issues.getTransitions': {
		riskLevel: 'read',
		description: 'Get available transitions for a Jira issue',
	},
	'issues.transition': {
		riskLevel: 'write',
		description: 'Transition a Jira issue to a new status',
	},
	'issues.bulkCreate': {
		riskLevel: 'write',
		description: 'Bulk create multiple Jira issues',
	},
	'issues.bulkFetch': {
		riskLevel: 'read',
		description: 'Bulk fetch multiple Jira issues by ID or key',
	},
	'issues.addAttachment': {
		riskLevel: 'write',
		description: 'Add an attachment to a Jira issue',
	},
	'issues.addWatcher': {
		riskLevel: 'write',
		description: 'Add a watcher to a Jira issue',
	},
	'issues.removeWatcher': {
		riskLevel: 'write',
		description: 'Remove a watcher from a Jira issue',
	},
	'issues.linkIssues': {
		riskLevel: 'write',
		description: 'Link two Jira issues together',
	},
	'comments.add': {
		riskLevel: 'write',
		description: 'Add a comment to a Jira issue',
	},
	'comments.get': {
		riskLevel: 'read',
		description: 'Get a specific comment on a Jira issue',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List all comments on a Jira issue',
	},
	'comments.update': {
		riskLevel: 'write',
		description: 'Update a comment on a Jira issue',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a comment from a Jira issue [DESTRUCTIVE]',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new Jira project',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a Jira project by ID or key',
	},
	'projects.list': { riskLevel: 'read', description: 'List Jira projects' },
	'projects.getRoles': {
		riskLevel: 'read',
		description: 'Get project roles for a Jira project',
	},
	'sprints.create': {
		riskLevel: 'write',
		description: 'Create a new sprint on a Jira board',
	},
	'sprints.list': {
		riskLevel: 'read',
		description: 'List sprints for a Jira board',
	},
	'sprints.moveIssues': {
		riskLevel: 'write',
		description: 'Move issues to a sprint',
	},
	'sprints.listBoards': { riskLevel: 'read', description: 'List Jira boards' },
	'users.getCurrent': {
		riskLevel: 'read',
		description: 'Get the currently authenticated Jira user',
	},
	'users.find': { riskLevel: 'read', description: 'Search for Jira users' },
	'users.getAll': { riskLevel: 'read', description: 'Get all Jira users' },
	'groups.getAll': { riskLevel: 'read', description: 'Get all Jira groups' },
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a new Jira group',
	},
} satisfies RequiredPluginEndpointMeta<typeof jiraEndpointsNested>;

const jiraWebhookSchemas = {
	'issues.newIssue': {
		description: 'Triggered when a new issue is created in Jira',
		payload: JiraNewIssuePayloadSchema,
		response: NewIssueEventSchema,
	},
	'issues.updatedIssue': {
		description: 'Triggered when an issue is updated in Jira',
		payload: JiraUpdatedIssuePayloadSchema,
		response: UpdatedIssueEventSchema,
	},
	'projects.newProject': {
		description: 'Triggered when a new project is created in Jira',
		payload: JiraNewProjectPayloadSchema,
		response: NewProjectEventSchema,
	},
} as const;

export type BaseJiraPlugin<T extends JiraPluginOptions> = CorsairPlugin<
	'jira',
	typeof JiraSchema,
	typeof jiraEndpointsNested,
	typeof jiraWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof jiraAuthConfig
>;

export type InternalJiraPlugin = BaseJiraPlugin<JiraPluginOptions>;

export type ExternalJiraPlugin<T extends JiraPluginOptions> = BaseJiraPlugin<T>;

export function jira<const T extends JiraPluginOptions>(
	incomingOptions: JiraPluginOptions & T = {} as JiraPluginOptions & T,
): ExternalJiraPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'jira',
		schema: JiraSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: jiraEndpointsNested,
		webhooks: jiraWebhooksNested,
		authConfig: jiraAuthConfig,
		endpointMeta: jiraEndpointMeta,
		endpointSchemas: jiraEndpointSchemas,
		webhookSchemas: jiraWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-atlassian-webhook-identifier' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: JiraKeyBuilderContext, source) => {
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
	} satisfies InternalJiraPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	JiraWebhookOutputs,
	JiraWebhookPayload,
	NewIssueEvent,
	NewProjectEvent,
	UpdatedIssueEvent,
} from './webhooks/types';

export { createJiraMatch } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CommentsAddInput,
	CommentsAddResponse,
	CommentsDeleteInput,
	CommentsDeleteResponse,
	CommentsGetInput,
	CommentsGetResponse,
	CommentsListInput,
	CommentsListResponse,
	CommentsUpdateInput,
	CommentsUpdateResponse,
	GroupsCreateInput,
	GroupsCreateResponse,
	GroupsGetAllInput,
	GroupsGetAllResponse,
	IssuesAddAttachmentInput,
	IssuesAddAttachmentResponse,
	IssuesAddWatcherInput,
	IssuesAddWatcherResponse,
	IssuesAssignInput,
	IssuesAssignResponse,
	IssuesBulkCreateInput,
	IssuesBulkCreateResponse,
	IssuesBulkFetchInput,
	IssuesBulkFetchResponse,
	IssuesCreateInput,
	IssuesCreateResponse,
	IssuesDeleteInput,
	IssuesDeleteResponse,
	IssuesEditInput,
	IssuesEditResponse,
	IssuesGetInput,
	IssuesGetResponse,
	IssuesGetTransitionsInput,
	IssuesGetTransitionsResponse,
	IssuesLinkIssuesInput,
	IssuesLinkIssuesResponse,
	IssuesRemoveWatcherInput,
	IssuesRemoveWatcherResponse,
	IssuesSearchInput,
	IssuesSearchResponse,
	IssuesTransitionInput,
	IssuesTransitionResponse,
	JiraEndpointInputs,
	JiraEndpointOutputs,
	ProjectsCreateInput,
	ProjectsCreateResponse,
	ProjectsGetInput,
	ProjectsGetResponse,
	ProjectsGetRolesInput,
	ProjectsGetRolesResponse,
	ProjectsListInput,
	ProjectsListResponse,
	SprintsCreateInput,
	SprintsCreateResponse,
	SprintsListBoardsInput,
	SprintsListBoardsResponse,
	SprintsListInput,
	SprintsListResponse,
	SprintsMoveIssuesInput,
	SprintsMoveIssuesResponse,
	UsersFindInput,
	UsersFindResponse,
	UsersGetAllInput,
	UsersGetAllResponse,
	UsersGetCurrentInput,
	UsersGetCurrentResponse,
} from './endpoints/types';
