import type {
	AuthTypes,
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
import {
	FoldersEndpoints,
	ListsEndpoints,
	SpacesEndpoints,
	TasksEndpoints,
	WorkspacesEndpoints,
} from './endpoints';
import type {
	ClickupEndpointInputs,
	ClickupEndpointOutputs,
} from './endpoints/types';
import {
	ClickupEndpointInputSchemas,
	ClickupEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClickupSchema } from './schema';

export type ClickupPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalClickupPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof clickupEndpointsNested>;
};

export type ClickupContext = CorsairPluginContext<
	typeof ClickupSchema,
	ClickupPluginOptions
>;

export type ClickupKeyBuilderContext = KeyBuilderContext<ClickupPluginOptions>;

export type ClickupBoundEndpoints = BindEndpoints<
	typeof clickupEndpointsNested
>;

type ClickupEndpoint<K extends keyof ClickupEndpointOutputs> = CorsairEndpoint<
	ClickupContext,
	ClickupEndpointInputs[K],
	ClickupEndpointOutputs[K]
>;

export type ClickupEndpoints = {
	workspacesGet: ClickupEndpoint<'workspacesGet'>;
	spacesList: ClickupEndpoint<'spacesList'>;
	foldersList: ClickupEndpoint<'foldersList'>;
	listsList: ClickupEndpoint<'listsList'>;
	tasksList: ClickupEndpoint<'tasksList'>;
	tasksGet: ClickupEndpoint<'tasksGet'>;
	tasksCreate: ClickupEndpoint<'tasksCreate'>;
	tasksUpdate: ClickupEndpoint<'tasksUpdate'>;
	tasksDelete: ClickupEndpoint<'tasksDelete'>;
};

const clickupEndpointsNested = {
	workspaces: {
		get: WorkspacesEndpoints.get,
	},
	spaces: {
		list: SpacesEndpoints.list,
	},
	folders: {
		list: FoldersEndpoints.list,
	},
	lists: {
		list: ListsEndpoints.list,
	},
	tasks: {
		list: TasksEndpoints.list,
		get: TasksEndpoints.get,
		create: TasksEndpoints.create,
		update: TasksEndpoints.update,
		delete: TasksEndpoints.delete,
	},
} as const;

// Webhooks empty because we decided to omit them for v1
const clickupWebhooksNested = {} as const;

export const clickupEndpointSchemas = {
	'workspaces.get': {
		input: ClickupEndpointInputSchemas.workspacesGet,
		output: ClickupEndpointOutputSchemas.workspacesGet,
	},
	'spaces.list': {
		input: ClickupEndpointInputSchemas.spacesList,
		output: ClickupEndpointOutputSchemas.spacesList,
	},
	'folders.list': {
		input: ClickupEndpointInputSchemas.foldersList,
		output: ClickupEndpointOutputSchemas.foldersList,
	},
	'lists.list': {
		input: ClickupEndpointInputSchemas.listsList,
		output: ClickupEndpointOutputSchemas.listsList,
	},
	'tasks.list': {
		input: ClickupEndpointInputSchemas.tasksList,
		output: ClickupEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: ClickupEndpointInputSchemas.tasksGet,
		output: ClickupEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: ClickupEndpointInputSchemas.tasksCreate,
		output: ClickupEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: ClickupEndpointInputSchemas.tasksUpdate,
		output: ClickupEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: ClickupEndpointInputSchemas.tasksDelete,
		output: ClickupEndpointOutputSchemas.tasksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof clickupEndpointsNested
>;

const clickupWebhookSchemas = {} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const clickupEndpointMeta = {
	'workspaces.get': {
		riskLevel: 'read',
		description: 'List Workspaces (Teams)',
	},
	'spaces.list': {
		riskLevel: 'read',
		description: 'List Spaces in a Workspace',
	},
	'folders.list': { riskLevel: 'read', description: 'List Folders in a Space' },
	'lists.list': { riskLevel: 'read', description: 'List Lists in a Folder' },
	'tasks.list': { riskLevel: 'read', description: 'List Tasks in a List' },
	'tasks.get': { riskLevel: 'read', description: 'Get a single Task' },
	'tasks.create': { riskLevel: 'write', description: 'Create a new Task' },
	'tasks.update': {
		riskLevel: 'write',
		description: 'Update an existing Task',
	},
	'tasks.delete': { riskLevel: 'destructive', description: 'Delete a Task' },
} as const satisfies RequiredPluginEndpointMeta<typeof clickupEndpointsNested>;

export const clickupAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseClickupPlugin<T extends ClickupPluginOptions> = CorsairPlugin<
	'clickup',
	typeof ClickupSchema,
	typeof clickupEndpointsNested,
	typeof clickupWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalClickupPlugin = BaseClickupPlugin<ClickupPluginOptions>;

export type ExternalClickupPlugin<T extends ClickupPluginOptions> =
	BaseClickupPlugin<T>;

export function clickup<const T extends ClickupPluginOptions>(
	incomingOptions: ClickupPluginOptions & T = {} as ClickupPluginOptions & T,
): ExternalClickupPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'clickup',
		authConfig: clickupAuthConfig,
		schema: ClickupSchema,
		options: options,
		hooks: options.hooks,
		endpoints: clickupEndpointsNested,
		webhooks: clickupWebhooksNested,
		endpointMeta: clickupEndpointMeta,
		endpointSchemas: clickupEndpointSchemas,
		webhookSchemas: clickupWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClickupKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalClickupPlugin;
}

export type {
	ClickupEndpointInputs,
	ClickupEndpointOutputs,
	FoldersListInput,
	FoldersListResponse,
	ListsListInput,
	ListsListResponse,
	SpacesListInput,
	SpacesListResponse,
	TasksCreateInput,
	TasksCreateResponse,
	TasksDeleteInput,
	TasksDeleteResponse,
	TasksGetInput,
	TasksGetResponse,
	TasksListInput,
	TasksListResponse,
	TasksUpdateInput,
	TasksUpdateResponse,
	WorkspacesGetInput,
	WorkspacesGetResponse,
} from './endpoints/types';
