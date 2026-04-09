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
	Boards,
	Columns,
	Groups,
	Items,
	Updates,
	Users,
	Webhooks,
	Workspaces,
} from './endpoints';
import type {
	MondayEndpointInputs,
	MondayEndpointOutputs,
} from './endpoints/types';
import {
	MondayEndpointInputSchemas,
	MondayEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MondaySchema } from './schema';
import {
	ChallengeWebhooks,
	ColumnWebhooks,
	ItemWebhooks,
	StatusWebhooks,
} from './webhooks';
import type {
	ColumnValueChangedEvent,
	ItemCreatedEvent,
	MondayChallengePayload,
	MondayWebhookOutputs,
	StatusChangedEvent,
} from './webhooks/types';

export type MondayPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalMondayPlugin['hooks'];
	webhookHooks?: InternalMondayPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Monday plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Monday endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof mondayEndpointsNested>;
};

export type MondayContext = CorsairPluginContext<
	typeof MondaySchema,
	MondayPluginOptions
>;

export type MondayKeyBuilderContext = KeyBuilderContext<MondayPluginOptions>;

export type MondayBoundEndpoints = BindEndpoints<typeof mondayEndpointsNested>;

type MondayEndpoint<
	K extends keyof MondayEndpointOutputs,
	Input,
> = CorsairEndpoint<MondayContext, Input, MondayEndpointOutputs[K]>;

export type MondayEndpoints = {
	boardsList: MondayEndpoint<'boardsList', MondayEndpointInputs['boardsList']>;
	boardsGet: MondayEndpoint<'boardsGet', MondayEndpointInputs['boardsGet']>;
	boardsCreate: MondayEndpoint<
		'boardsCreate',
		MondayEndpointInputs['boardsCreate']
	>;
	boardsUpdate: MondayEndpoint<
		'boardsUpdate',
		MondayEndpointInputs['boardsUpdate']
	>;
	boardsArchive: MondayEndpoint<
		'boardsArchive',
		MondayEndpointInputs['boardsArchive']
	>;
	boardsDelete: MondayEndpoint<
		'boardsDelete',
		MondayEndpointInputs['boardsDelete']
	>;
	boardsDuplicate: MondayEndpoint<
		'boardsDuplicate',
		MondayEndpointInputs['boardsDuplicate']
	>;
	itemsList: MondayEndpoint<'itemsList', MondayEndpointInputs['itemsList']>;
	itemsGet: MondayEndpoint<'itemsGet', MondayEndpointInputs['itemsGet']>;
	itemsCreate: MondayEndpoint<
		'itemsCreate',
		MondayEndpointInputs['itemsCreate']
	>;
	itemsUpdate: MondayEndpoint<
		'itemsUpdate',
		MondayEndpointInputs['itemsUpdate']
	>;
	itemsMove: MondayEndpoint<'itemsMove', MondayEndpointInputs['itemsMove']>;
	itemsArchive: MondayEndpoint<
		'itemsArchive',
		MondayEndpointInputs['itemsArchive']
	>;
	itemsDelete: MondayEndpoint<
		'itemsDelete',
		MondayEndpointInputs['itemsDelete']
	>;
	groupsList: MondayEndpoint<'groupsList', MondayEndpointInputs['groupsList']>;
	groupsCreate: MondayEndpoint<
		'groupsCreate',
		MondayEndpointInputs['groupsCreate']
	>;
	groupsUpdate: MondayEndpoint<
		'groupsUpdate',
		MondayEndpointInputs['groupsUpdate']
	>;
	groupsDelete: MondayEndpoint<
		'groupsDelete',
		MondayEndpointInputs['groupsDelete']
	>;
	columnsList: MondayEndpoint<
		'columnsList',
		MondayEndpointInputs['columnsList']
	>;
	columnsCreate: MondayEndpoint<
		'columnsCreate',
		MondayEndpointInputs['columnsCreate']
	>;
	columnsChangeValue: MondayEndpoint<
		'columnsChangeValue',
		MondayEndpointInputs['columnsChangeValue']
	>;
	updatesList: MondayEndpoint<
		'updatesList',
		MondayEndpointInputs['updatesList']
	>;
	updatesCreate: MondayEndpoint<
		'updatesCreate',
		MondayEndpointInputs['updatesCreate']
	>;
	updatesDelete: MondayEndpoint<
		'updatesDelete',
		MondayEndpointInputs['updatesDelete']
	>;
	usersList: MondayEndpoint<'usersList', MondayEndpointInputs['usersList']>;
	usersGet: MondayEndpoint<'usersGet', MondayEndpointInputs['usersGet']>;
	workspacesList: MondayEndpoint<
		'workspacesList',
		MondayEndpointInputs['workspacesList']
	>;
	webhooksList: MondayEndpoint<
		'webhooksList',
		MondayEndpointInputs['webhooksList']
	>;
	webhooksCreate: MondayEndpoint<
		'webhooksCreate',
		MondayEndpointInputs['webhooksCreate']
	>;
	webhooksDelete: MondayEndpoint<
		'webhooksDelete',
		MondayEndpointInputs['webhooksDelete']
	>;
};

type MondayWebhook<
	K extends keyof MondayWebhookOutputs,
	TEvent,
> = CorsairWebhook<MondayContext, TEvent, MondayWebhookOutputs[K]>;

export type MondayWebhooks = {
	challenge: MondayWebhook<'challenge', MondayChallengePayload>;
	itemCreated: MondayWebhook<'itemCreated', ItemCreatedEvent>;
	columnValueChanged: MondayWebhook<
		'columnValueChanged',
		ColumnValueChangedEvent
	>;
	statusChanged: MondayWebhook<'statusChanged', StatusChangedEvent>;
};

export type MondayBoundWebhooks = BindWebhooks<MondayWebhooks>;

const mondayEndpointsNested = {
	boards: {
		list: Boards.list,
		get: Boards.get,
		create: Boards.create,
		update: Boards.update,
		archive: Boards.archive,
		delete: Boards.delete,
		duplicate: Boards.duplicate,
	},
	items: {
		list: Items.list,
		get: Items.get,
		create: Items.create,
		update: Items.update,
		move: Items.move,
		archive: Items.archive,
		delete: Items.delete,
	},
	groups: {
		list: Groups.list,
		create: Groups.create,
		update: Groups.update,
		delete: Groups.delete,
	},
	columns: {
		list: Columns.list,
		create: Columns.create,
		changeValue: Columns.changeValue,
	},
	updates: {
		list: Updates.list,
		create: Updates.create,
		delete: Updates.delete,
	},
	users: {
		list: Users.list,
		get: Users.get,
	},
	workspaces: {
		list: Workspaces.list,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		delete: Webhooks.delete,
	},
} as const;

const mondayWebhooksNested = {
	verification: {
		challenge: ChallengeWebhooks.challenge,
	},
	items: {
		itemCreated: ItemWebhooks.itemCreated,
	},
	columns: {
		columnValueChanged: ColumnWebhooks.columnValueChanged,
	},
	status: {
		statusChanged: StatusWebhooks.statusChanged,
	},
} as const;

export const mondayEndpointSchemas = {
	'boards.list': {
		input: MondayEndpointInputSchemas.boardsList,
		output: MondayEndpointOutputSchemas.boardsList,
	},
	'boards.get': {
		input: MondayEndpointInputSchemas.boardsGet,
		output: MondayEndpointOutputSchemas.boardsGet,
	},
	'boards.create': {
		input: MondayEndpointInputSchemas.boardsCreate,
		output: MondayEndpointOutputSchemas.boardsCreate,
	},
	'boards.update': {
		input: MondayEndpointInputSchemas.boardsUpdate,
		output: MondayEndpointOutputSchemas.boardsUpdate,
	},
	'boards.archive': {
		input: MondayEndpointInputSchemas.boardsArchive,
		output: MondayEndpointOutputSchemas.boardsArchive,
	},
	'boards.delete': {
		input: MondayEndpointInputSchemas.boardsDelete,
		output: MondayEndpointOutputSchemas.boardsDelete,
	},
	'boards.duplicate': {
		input: MondayEndpointInputSchemas.boardsDuplicate,
		output: MondayEndpointOutputSchemas.boardsDuplicate,
	},
	'items.list': {
		input: MondayEndpointInputSchemas.itemsList,
		output: MondayEndpointOutputSchemas.itemsList,
	},
	'items.get': {
		input: MondayEndpointInputSchemas.itemsGet,
		output: MondayEndpointOutputSchemas.itemsGet,
	},
	'items.create': {
		input: MondayEndpointInputSchemas.itemsCreate,
		output: MondayEndpointOutputSchemas.itemsCreate,
	},
	'items.update': {
		input: MondayEndpointInputSchemas.itemsUpdate,
		output: MondayEndpointOutputSchemas.itemsUpdate,
	},
	'items.move': {
		input: MondayEndpointInputSchemas.itemsMove,
		output: MondayEndpointOutputSchemas.itemsMove,
	},
	'items.archive': {
		input: MondayEndpointInputSchemas.itemsArchive,
		output: MondayEndpointOutputSchemas.itemsArchive,
	},
	'items.delete': {
		input: MondayEndpointInputSchemas.itemsDelete,
		output: MondayEndpointOutputSchemas.itemsDelete,
	},
	'groups.list': {
		input: MondayEndpointInputSchemas.groupsList,
		output: MondayEndpointOutputSchemas.groupsList,
	},
	'groups.create': {
		input: MondayEndpointInputSchemas.groupsCreate,
		output: MondayEndpointOutputSchemas.groupsCreate,
	},
	'groups.update': {
		input: MondayEndpointInputSchemas.groupsUpdate,
		output: MondayEndpointOutputSchemas.groupsUpdate,
	},
	'groups.delete': {
		input: MondayEndpointInputSchemas.groupsDelete,
		output: MondayEndpointOutputSchemas.groupsDelete,
	},
	'columns.list': {
		input: MondayEndpointInputSchemas.columnsList,
		output: MondayEndpointOutputSchemas.columnsList,
	},
	'columns.create': {
		input: MondayEndpointInputSchemas.columnsCreate,
		output: MondayEndpointOutputSchemas.columnsCreate,
	},
	'columns.changeValue': {
		input: MondayEndpointInputSchemas.columnsChangeValue,
		output: MondayEndpointOutputSchemas.columnsChangeValue,
	},
	'updates.list': {
		input: MondayEndpointInputSchemas.updatesList,
		output: MondayEndpointOutputSchemas.updatesList,
	},
	'updates.create': {
		input: MondayEndpointInputSchemas.updatesCreate,
		output: MondayEndpointOutputSchemas.updatesCreate,
	},
	'updates.delete': {
		input: MondayEndpointInputSchemas.updatesDelete,
		output: MondayEndpointOutputSchemas.updatesDelete,
	},
	'users.list': {
		input: MondayEndpointInputSchemas.usersList,
		output: MondayEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: MondayEndpointInputSchemas.usersGet,
		output: MondayEndpointOutputSchemas.usersGet,
	},
	'workspaces.list': {
		input: MondayEndpointInputSchemas.workspacesList,
		output: MondayEndpointOutputSchemas.workspacesList,
	},
	'webhooks.list': {
		input: MondayEndpointInputSchemas.webhooksList,
		output: MondayEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: MondayEndpointInputSchemas.webhooksCreate,
		output: MondayEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.delete': {
		input: MondayEndpointInputSchemas.webhooksDelete,
		output: MondayEndpointOutputSchemas.webhooksDelete,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const mondayEndpointMeta = {
	'boards.list': { riskLevel: 'read', description: 'List all boards' },
	'boards.get': {
		riskLevel: 'read',
		description: 'Get a board by ID with groups and columns',
	},
	'boards.create': { riskLevel: 'write', description: 'Create a new board' },
	'boards.update': {
		riskLevel: 'write',
		description: 'Update a board attribute',
	},
	'boards.archive': { riskLevel: 'write', description: 'Archive a board' },
	'boards.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a board',
	},
	'boards.duplicate': { riskLevel: 'write', description: 'Duplicate a board' },
	'items.list': { riskLevel: 'read', description: 'List items in a board' },
	'items.get': {
		riskLevel: 'read',
		description: 'Get an item by ID with column values',
	},
	'items.create': {
		riskLevel: 'write',
		description: 'Create a new item in a board',
	},
	'items.update': {
		riskLevel: 'write',
		description: 'Update a column value on an item',
	},
	'items.move': {
		riskLevel: 'write',
		description: 'Move an item to a different group',
	},
	'items.archive': { riskLevel: 'write', description: 'Archive an item' },
	'items.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete an item',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'List all groups in a board',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a new group in a board',
	},
	'groups.update': {
		riskLevel: 'write',
		description: 'Update a group attribute',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		description: 'Delete a group from a board',
	},
	'columns.list': {
		riskLevel: 'read',
		description: 'List all columns in a board',
	},
	'columns.create': {
		riskLevel: 'write',
		description: 'Create a new column in a board',
	},
	'columns.changeValue': {
		riskLevel: 'write',
		description: 'Change a column value on an item',
	},
	'updates.list': {
		riskLevel: 'read',
		description: 'List updates (comments) on an item',
	},
	'updates.create': {
		riskLevel: 'write',
		description: 'Create an update (comment) on an item',
	},
	'updates.delete': {
		riskLevel: 'destructive',
		description: 'Delete an update (comment)',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List all users in the account',
	},
	'users.get': { riskLevel: 'read', description: 'Get a user by ID' },
	'workspaces.list': { riskLevel: 'read', description: 'List all workspaces' },
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List all webhooks for a board',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Subscribe to a board event via webhook',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Unsubscribe a webhook by ID',
	},
} satisfies RequiredPluginEndpointMeta<typeof mondayEndpointsNested>;

export const mondayAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMondayPlugin<T extends MondayPluginOptions> = CorsairPlugin<
	'monday',
	typeof MondaySchema,
	typeof mondayEndpointsNested,
	typeof mondayWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalMondayPlugin = BaseMondayPlugin<MondayPluginOptions>;

export type ExternalMondayPlugin<T extends MondayPluginOptions> =
	BaseMondayPlugin<T>;

export function monday<const T extends MondayPluginOptions>(
	incomingOptions: MondayPluginOptions & T = {} as MondayPluginOptions & T,
): ExternalMondayPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'monday',
		schema: MondaySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: mondayEndpointsNested,
		webhooks: mondayWebhooksNested,
		endpointMeta: mondayEndpointMeta,
		endpointSchemas: mondayEndpointSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			if ('x-monday-signature' in headers || 'authorization' in headers) {
				return true;
			}
			// Accept Monday.com challenge and event requests which may carry no auth header
			// when no signing secret is configured on the webhook
			try {
				const body =
					typeof request.body === 'string'
						? JSON.parse(request.body)
						: request.body;
				if (typeof body !== 'object' || body === null) return false;
				const b = body as Record<string, unknown>;
				return (
					typeof b.challenge === 'string' ||
					(typeof b.event === 'object' && b.event !== null)
				);
			} catch {
				return false;
			}
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MondayKeyBuilderContext, source) => {
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
	} satisfies InternalMondayPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ColumnValueChangedEvent,
	ItemCreatedEvent,
	MondayChallengePayload,
	MondayWebhookOutputs,
	StatusChangedEvent,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	BoardsArchiveInput,
	BoardsCreateInput,
	BoardsDeleteInput,
	BoardsDuplicateInput,
	BoardsGetInput,
	BoardsListInput,
	BoardsUpdateInput,
	ColumnsChangeValueInput,
	ColumnsCreateInput,
	ColumnsListInput,
	GroupsCreateInput,
	GroupsDeleteInput,
	GroupsListInput,
	GroupsUpdateInput,
	ItemsArchiveInput,
	ItemsCreateInput,
	ItemsDeleteInput,
	ItemsGetInput,
	ItemsListInput,
	ItemsMoveInput,
	ItemsUpdateInput,
	MondayEndpointInputs,
	MondayEndpointOutputs,
	UpdatesCreateInput,
	UpdatesDeleteInput,
	UpdatesListInput,
	UsersGetInput,
	UsersListInput,
	WebhooksCreateInput,
	WebhooksDeleteInput,
	WebhooksListInput,
	WorkspacesListInput,
} from './endpoints/types';
