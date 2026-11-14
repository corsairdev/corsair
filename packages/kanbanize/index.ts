import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Account,
	Boards,
	Cards,
	Columns,
	Comments,
	Lanes,
	Subtasks,
	Tags,
	Webhooks,
	Workflows,
} from './endpoints';
import type {
	KanbanizeEndpointInputs,
	KanbanizeEndpointOutputs,
} from './endpoints/types';
import {
	KanbanizeEndpointInputSchemas,
	KanbanizeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KanbanizeSchema } from './schema';

export type KanbanizePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The account subdomain: `acme` for `acme.kanbanize.com`. Every account is
	 * served from its own host, so a call without one cannot be addressed.
	 * Falls back to the stored credential.
	 */
	subdomain?: string;
	hooks?: InternalKanbanizePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kanbanizeEndpointsNested>;
};

/**
 * The subdomain is an account-level field, so the key manager generates
 * `get_subdomain()` for it. `integration_credentials` is only installed for
 * `oauth_2`, which this plugin does not use.
 */
export const kanbanizeAuthConfig = {
	api_key: {
		account: ['subdomain'] as const,
	},
} as const satisfies PluginAuthConfig;

export type KanbanizeContext = CorsairPluginContext<
	typeof KanbanizeSchema,
	KanbanizePluginOptions,
	undefined,
	typeof kanbanizeAuthConfig
>;

export type KanbanizeKeyBuilderContext = KeyBuilderContext<
	KanbanizePluginOptions,
	typeof kanbanizeAuthConfig
>;

export type KanbanizeBoundEndpoints = BindEndpoints<
	typeof kanbanizeEndpointsNested
>;

type KanbanizeEndpoint<K extends keyof KanbanizeEndpointOutputs> =
	CorsairEndpoint<
		KanbanizeContext,
		KanbanizeEndpointInputs[K],
		KanbanizeEndpointOutputs[K]
	>;

export type KanbanizeEndpoints = {
	boardsList: KanbanizeEndpoint<'boardsList'>;
	boardsGet: KanbanizeEndpoint<'boardsGet'>;
	boardsCreate: KanbanizeEndpoint<'boardsCreate'>;
	boardsUpdate: KanbanizeEndpoint<'boardsUpdate'>;
	boardsRemove: KanbanizeEndpoint<'boardsRemove'>;
	workflowsList: KanbanizeEndpoint<'workflowsList'>;
	workflowsGet: KanbanizeEndpoint<'workflowsGet'>;
	workflowsCreate: KanbanizeEndpoint<'workflowsCreate'>;
	workflowsUpdate: KanbanizeEndpoint<'workflowsUpdate'>;
	workflowsRemove: KanbanizeEndpoint<'workflowsRemove'>;
	columnsList: KanbanizeEndpoint<'columnsList'>;
	columnsGet: KanbanizeEndpoint<'columnsGet'>;
	columnsCreate: KanbanizeEndpoint<'columnsCreate'>;
	columnsUpdate: KanbanizeEndpoint<'columnsUpdate'>;
	columnsRemove: KanbanizeEndpoint<'columnsRemove'>;
	lanesList: KanbanizeEndpoint<'lanesList'>;
	lanesGet: KanbanizeEndpoint<'lanesGet'>;
	lanesCreate: KanbanizeEndpoint<'lanesCreate'>;
	lanesUpdate: KanbanizeEndpoint<'lanesUpdate'>;
	lanesRemove: KanbanizeEndpoint<'lanesRemove'>;
	cardsList: KanbanizeEndpoint<'cardsList'>;
	cardsGet: KanbanizeEndpoint<'cardsGet'>;
	cardsCreate: KanbanizeEndpoint<'cardsCreate'>;
	cardsUpdate: KanbanizeEndpoint<'cardsUpdate'>;
	cardsRemove: KanbanizeEndpoint<'cardsRemove'>;
	commentsList: KanbanizeEndpoint<'commentsList'>;
	commentsCreate: KanbanizeEndpoint<'commentsCreate'>;
	subtasksList: KanbanizeEndpoint<'subtasksList'>;
	subtasksCreate: KanbanizeEndpoint<'subtasksCreate'>;
	subtasksUpdate: KanbanizeEndpoint<'subtasksUpdate'>;
	subtasksRemove: KanbanizeEndpoint<'subtasksRemove'>;
	tagsList: KanbanizeEndpoint<'tagsList'>;
	usersList: KanbanizeEndpoint<'usersList'>;
	meGet: KanbanizeEndpoint<'meGet'>;
	limitsGet: KanbanizeEndpoint<'limitsGet'>;
	webhooksList: KanbanizeEndpoint<'webhooksList'>;
	webhooksCreate: KanbanizeEndpoint<'webhooksCreate'>;
	webhooksUpdate: KanbanizeEndpoint<'webhooksUpdate'>;
	webhooksRemove: KanbanizeEndpoint<'webhooksRemove'>;
};

const kanbanizeEndpointsNested = {
	boards: {
		list: Boards.list,
		get: Boards.get,
		create: Boards.create,
		update: Boards.update,
		delete: Boards.remove,
	},
	workflows: {
		list: Workflows.list,
		get: Workflows.get,
		create: Workflows.create,
		update: Workflows.update,
		delete: Workflows.remove,
	},
	columns: {
		list: Columns.list,
		get: Columns.get,
		create: Columns.create,
		update: Columns.update,
		delete: Columns.remove,
	},
	lanes: {
		list: Lanes.list,
		get: Lanes.get,
		create: Lanes.create,
		update: Lanes.update,
		delete: Lanes.remove,
	},
	cards: {
		list: Cards.list,
		get: Cards.get,
		create: Cards.create,
		update: Cards.update,
		delete: Cards.remove,
	},
	comments: {
		list: Comments.list,
		create: Comments.create,
	},
	subtasks: {
		list: Subtasks.list,
		create: Subtasks.create,
		update: Subtasks.update,
		delete: Subtasks.remove,
	},
	tags: {
		list: Tags.list,
	},
	users: {
		list: Account.users,
	},
	me: {
		get: Account.me,
	},
	limits: {
		get: Account.limits,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.remove,
	},
} as const;

export const kanbanizeEndpointSchemas = {
	'boards.list': {
		input: KanbanizeEndpointInputSchemas.boardsList,
		output: KanbanizeEndpointOutputSchemas.boardsList,
	},
	'boards.get': {
		input: KanbanizeEndpointInputSchemas.boardsGet,
		output: KanbanizeEndpointOutputSchemas.boardsGet,
	},
	'boards.create': {
		input: KanbanizeEndpointInputSchemas.boardsCreate,
		output: KanbanizeEndpointOutputSchemas.boardsCreate,
	},
	'boards.update': {
		input: KanbanizeEndpointInputSchemas.boardsUpdate,
		output: KanbanizeEndpointOutputSchemas.boardsUpdate,
	},
	'boards.delete': {
		input: KanbanizeEndpointInputSchemas.boardsRemove,
		output: KanbanizeEndpointOutputSchemas.boardsRemove,
	},
	'workflows.list': {
		input: KanbanizeEndpointInputSchemas.workflowsList,
		output: KanbanizeEndpointOutputSchemas.workflowsList,
	},
	'workflows.get': {
		input: KanbanizeEndpointInputSchemas.workflowsGet,
		output: KanbanizeEndpointOutputSchemas.workflowsGet,
	},
	'workflows.create': {
		input: KanbanizeEndpointInputSchemas.workflowsCreate,
		output: KanbanizeEndpointOutputSchemas.workflowsCreate,
	},
	'workflows.update': {
		input: KanbanizeEndpointInputSchemas.workflowsUpdate,
		output: KanbanizeEndpointOutputSchemas.workflowsUpdate,
	},
	'workflows.delete': {
		input: KanbanizeEndpointInputSchemas.workflowsRemove,
		output: KanbanizeEndpointOutputSchemas.workflowsRemove,
	},
	'columns.list': {
		input: KanbanizeEndpointInputSchemas.columnsList,
		output: KanbanizeEndpointOutputSchemas.columnsList,
	},
	'columns.get': {
		input: KanbanizeEndpointInputSchemas.columnsGet,
		output: KanbanizeEndpointOutputSchemas.columnsGet,
	},
	'columns.create': {
		input: KanbanizeEndpointInputSchemas.columnsCreate,
		output: KanbanizeEndpointOutputSchemas.columnsCreate,
	},
	'columns.update': {
		input: KanbanizeEndpointInputSchemas.columnsUpdate,
		output: KanbanizeEndpointOutputSchemas.columnsUpdate,
	},
	'columns.delete': {
		input: KanbanizeEndpointInputSchemas.columnsRemove,
		output: KanbanizeEndpointOutputSchemas.columnsRemove,
	},
	'lanes.list': {
		input: KanbanizeEndpointInputSchemas.lanesList,
		output: KanbanizeEndpointOutputSchemas.lanesList,
	},
	'lanes.get': {
		input: KanbanizeEndpointInputSchemas.lanesGet,
		output: KanbanizeEndpointOutputSchemas.lanesGet,
	},
	'lanes.create': {
		input: KanbanizeEndpointInputSchemas.lanesCreate,
		output: KanbanizeEndpointOutputSchemas.lanesCreate,
	},
	'lanes.update': {
		input: KanbanizeEndpointInputSchemas.lanesUpdate,
		output: KanbanizeEndpointOutputSchemas.lanesUpdate,
	},
	'lanes.delete': {
		input: KanbanizeEndpointInputSchemas.lanesRemove,
		output: KanbanizeEndpointOutputSchemas.lanesRemove,
	},
	'cards.list': {
		input: KanbanizeEndpointInputSchemas.cardsList,
		output: KanbanizeEndpointOutputSchemas.cardsList,
	},
	'cards.get': {
		input: KanbanizeEndpointInputSchemas.cardsGet,
		output: KanbanizeEndpointOutputSchemas.cardsGet,
	},
	'cards.create': {
		input: KanbanizeEndpointInputSchemas.cardsCreate,
		output: KanbanizeEndpointOutputSchemas.cardsCreate,
	},
	'cards.update': {
		input: KanbanizeEndpointInputSchemas.cardsUpdate,
		output: KanbanizeEndpointOutputSchemas.cardsUpdate,
	},
	'cards.delete': {
		input: KanbanizeEndpointInputSchemas.cardsRemove,
		output: KanbanizeEndpointOutputSchemas.cardsRemove,
	},
	'comments.list': {
		input: KanbanizeEndpointInputSchemas.commentsList,
		output: KanbanizeEndpointOutputSchemas.commentsList,
	},
	'comments.create': {
		input: KanbanizeEndpointInputSchemas.commentsCreate,
		output: KanbanizeEndpointOutputSchemas.commentsCreate,
	},
	'subtasks.list': {
		input: KanbanizeEndpointInputSchemas.subtasksList,
		output: KanbanizeEndpointOutputSchemas.subtasksList,
	},
	'subtasks.create': {
		input: KanbanizeEndpointInputSchemas.subtasksCreate,
		output: KanbanizeEndpointOutputSchemas.subtasksCreate,
	},
	'subtasks.update': {
		input: KanbanizeEndpointInputSchemas.subtasksUpdate,
		output: KanbanizeEndpointOutputSchemas.subtasksUpdate,
	},
	'subtasks.delete': {
		input: KanbanizeEndpointInputSchemas.subtasksRemove,
		output: KanbanizeEndpointOutputSchemas.subtasksRemove,
	},
	'tags.list': {
		input: KanbanizeEndpointInputSchemas.tagsList,
		output: KanbanizeEndpointOutputSchemas.tagsList,
	},
	'users.list': {
		input: KanbanizeEndpointInputSchemas.usersList,
		output: KanbanizeEndpointOutputSchemas.usersList,
	},
	'me.get': {
		input: KanbanizeEndpointInputSchemas.meGet,
		output: KanbanizeEndpointOutputSchemas.meGet,
	},
	'limits.get': {
		input: KanbanizeEndpointInputSchemas.limitsGet,
		output: KanbanizeEndpointOutputSchemas.limitsGet,
	},
	'webhooks.list': {
		input: KanbanizeEndpointInputSchemas.webhooksList,
		output: KanbanizeEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: KanbanizeEndpointInputSchemas.webhooksCreate,
		output: KanbanizeEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: KanbanizeEndpointInputSchemas.webhooksUpdate,
		output: KanbanizeEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: KanbanizeEndpointInputSchemas.webhooksRemove,
		output: KanbanizeEndpointOutputSchemas.webhooksRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof kanbanizeEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const kanbanizeEndpointMeta = {
	'boards.list': {
		riskLevel: 'read',
		description:
			'List boards, optionally limited to IDs, workspaces or the boards the key’s user is assigned to, with optional workflows and structure',
	},
	'boards.get': {
		riskLevel: 'read',
		description: 'One board with its workspace, type and revision',
	},
	'boards.create': {
		riskLevel: 'write',
		description:
			'Create a Kanban board or an AI Canvas in a workspace; it starts with a cards workflow and an initiatives workflow',
	},
	'boards.update': {
		riskLevel: 'write',
		description:
			'Rename a board, change its description, or archive and restore it',
	},
	'boards.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a board with every card, workflow, column and lane on it; it cannot be restored',
	},
	'workflows.list': {
		riskLevel: 'read',
		description: 'The workflows on a board, in display order',
	},
	'workflows.get': {
		riskLevel: 'read',
		description: 'One workflow on a board',
	},
	'workflows.create': {
		riskLevel: 'write',
		description: 'Create a cards, initiative or timeline workflow on a board',
	},
	'workflows.update': {
		riskLevel: 'write',
		description: 'Rename a workflow, move it, or enable and disable it',
	},
	'workflows.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a workflow with its columns, lanes and any cards in them; it cannot be restored',
	},
	'columns.list': {
		riskLevel: 'read',
		description: 'The columns on a board, including subcolumns',
	},
	'columns.get': {
		riskLevel: 'read',
		description: 'One column with its section, position and WIP limit',
	},
	'columns.create': {
		riskLevel: 'write',
		description:
			'Create a main column in a workflow section, or a subcolumn under another column',
	},
	'columns.update': {
		riskLevel: 'write',
		description:
			'Rename a column, set its WIP limit, move it between sections, or reparent a subcolumn',
	},
	'columns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a column and its subcolumns; cards in it are lost, so they are moved first in practice',
	},
	'lanes.list': {
		riskLevel: 'read',
		description: 'The lanes on a board, including nested ones',
	},
	'lanes.get': {
		riskLevel: 'read',
		description: 'One lane on a board',
	},
	'lanes.create': {
		riskLevel: 'write',
		description:
			'Create a lane on a workflow, or a nested lane under another lane',
	},
	'lanes.update': {
		riskLevel: 'write',
		description: 'Rename a lane, move it, or reparent it',
	},
	'lanes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a lane with its nested lanes and any cards in them',
	},
	'cards.list': {
		riskLevel: 'read',
		description:
			'Cards filtered by board, workflow, column, lane, owner, state or date, paged and with optional `expand` for custom fields, subtasks and links',
	},
	'cards.get': {
		riskLevel: 'read',
		description:
			'One card with its description, custom fields, subtasks and linked cards',
	},
	'cards.create': {
		riskLevel: 'write',
		description:
			'Create a card in a column and lane, with an owner, priority, deadline, tags, custom fields and subtasks, or from a template',
	},
	'cards.update': {
		riskLevel: 'write',
		description:
			'Change a card’s fields, move it to another column or lane, add or remove tags and custom fields, or archive and discard it',
	},
	'cards.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a card with its comments and subtasks; it cannot be restored',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'The comments on a card, oldest first',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Add a comment to a card',
	},
	'subtasks.list': {
		riskLevel: 'read',
		description: 'The subtasks of a card',
	},
	'subtasks.create': {
		riskLevel: 'write',
		description: 'Add a subtask to a card, with an owner and a deadline',
	},
	'subtasks.update': {
		riskLevel: 'write',
		description: 'Change a subtask, or mark it finished or unfinished',
	},
	'subtasks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a subtask from a card; it cannot be restored',
	},
	'tags.list': {
		riskLevel: 'read',
		description:
			'Every tag on the account, with its availability and enabled state',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'Every user on the account, for looking up owner and watcher IDs',
	},
	'me.get': {
		riskLevel: 'read',
		description: 'The user the API key belongs to',
	},
	'limits.get': {
		riskLevel: 'read',
		description:
			'The account’s hourly and minutely request ceilings, which is what a 429 is measured against',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'Webhooks registered on the account, with their board and URL',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Register a URL to receive a board’s events. The plugin does not handle the deliveries itself',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			'Point a webhook at another URL or board, or enable and disable it',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook so its URL stops receiving events',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof kanbanizeEndpointsNested
>;

export type BaseKanbanizePlugin<T extends KanbanizePluginOptions> =
	CorsairPlugin<
		'kanbanize',
		typeof KanbanizeSchema,
		typeof kanbanizeEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof kanbanizeAuthConfig
	>;

export type InternalKanbanizePlugin =
	BaseKanbanizePlugin<KanbanizePluginOptions>;

export type ExternalKanbanizePlugin<T extends KanbanizePluginOptions> =
	BaseKanbanizePlugin<T>;

export function kanbanize<const T extends KanbanizePluginOptions>(
	incomingOptions: KanbanizePluginOptions & T = {} as KanbanizePluginOptions &
		T,
): ExternalKanbanizePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kanbanize',
		schema: KanbanizeSchema,
		options,
		hooks: options.hooks,
		endpoints: kanbanizeEndpointsNested,
		webhooks: {},
		authConfig: kanbanizeAuthConfig,
		endpointMeta: kanbanizeEndpointMeta,
		endpointSchemas: kanbanizeEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KanbanizeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('kanbanize', ctx.authType ?? 'api_key');
		},
	} satisfies InternalKanbanizePlugin;
}

export {
	isKanbanizeAuthError,
	isKanbanizeRateLimit,
	KanbanizeAPIError,
	kanbanizeErrorCode,
} from './client';

export type {
	ApiLimitsInput,
	ApiLimitsResponse,
	BoardCreateInput,
	BoardGetInput,
	BoardRemoveInput,
	BoardResponse,
	BoardsListInput,
	BoardsListResponse,
	BoardUpdateInput,
	CardCreateInput,
	CardGetInput,
	CardRemoveInput,
	CardResponse,
	CardsListInput,
	CardsListResponse,
	CardUpdateInput,
	ColumnCreateInput,
	ColumnGetInput,
	ColumnRemoveInput,
	ColumnResponse,
	ColumnsListInput,
	ColumnsListResponse,
	ColumnUpdateInput,
	CommentCreateInput,
	CommentResponse,
	CommentsListInput,
	CommentsListResponse,
	DeletedResponse,
	KanbanizeBoard,
	KanbanizeCard,
	KanbanizeColumn,
	KanbanizeComment,
	KanbanizeLane,
	KanbanizeSubtask,
	KanbanizeTag,
	KanbanizeUser,
	KanbanizeWebhook,
	KanbanizeWorkflow,
	LaneCreateInput,
	LaneGetInput,
	LaneRemoveInput,
	LaneResponse,
	LanesListInput,
	LanesListResponse,
	LaneUpdateInput,
	MeInput,
	MeResponse,
	SubtaskCreateInput,
	SubtaskRemoveInput,
	SubtaskResponse,
	SubtasksListInput,
	SubtasksListResponse,
	SubtaskUpdateInput,
	TagsListInput,
	TagsListResponse,
	UsersListInput,
	UsersListResponse,
	WebhookCreateInput,
	WebhookRemoveInput,
	WebhookResponse,
	WebhooksListInput,
	WebhooksListResponse,
	WebhookUpdateInput,
	WorkflowCreateInput,
	WorkflowGetInput,
	WorkflowRemoveInput,
	WorkflowResponse,
	WorkflowsListInput,
	WorkflowsListResponse,
	WorkflowUpdateInput,
} from './endpoints/types';
