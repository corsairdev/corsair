import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { TaskLists, Tasks } from './endpoints';
import type {
	GoogleTasksEndpointInputs,
	GoogleTasksEndpointOutputs,
} from './endpoints/types';
import {
	GoogleTasksEndpointInputSchemas,
	GoogleTasksEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoogleTasksSchema } from './schema';

const READ_SCOPE = 'https://www.googleapis.com/auth/tasks.readonly';
const WRITE_SCOPE = 'https://www.googleapis.com/auth/tasks';

export type GoogleTasksPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** Use the view-only Google scope when this connection will only call reads. */
	scopeMode?: 'readonly' | 'full';
	hooks?: InternalGoogleTasksPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof googleTasksEndpointsNested>;
};

export type GoogleTasksContext = CorsairPluginContext<
	typeof GoogleTasksSchema,
	GoogleTasksPluginOptions
>;

export type GoogleTasksKeyBuilderContext =
	KeyBuilderContext<GoogleTasksPluginOptions>;
export type GoogleTasksBoundEndpoints = BindEndpoints<
	typeof googleTasksEndpointsNested
>;

type GoogleTasksEndpoint<K extends keyof GoogleTasksEndpointOutputs> =
	CorsairEndpoint<
		GoogleTasksContext,
		GoogleTasksEndpointInputs[K],
		GoogleTasksEndpointOutputs[K]
	>;

export type GoogleTasksEndpoints = {
	taskListsList: GoogleTasksEndpoint<'taskListsList'>;
	taskListsGet: GoogleTasksEndpoint<'taskListsGet'>;
	taskListsInsert: GoogleTasksEndpoint<'taskListsInsert'>;
	taskListsUpdate: GoogleTasksEndpoint<'taskListsUpdate'>;
	taskListsPatch: GoogleTasksEndpoint<'taskListsPatch'>;
	taskListsDelete: GoogleTasksEndpoint<'taskListsDelete'>;
	tasksList: GoogleTasksEndpoint<'tasksList'>;
	tasksGet: GoogleTasksEndpoint<'tasksGet'>;
	tasksInsert: GoogleTasksEndpoint<'tasksInsert'>;
	tasksUpdate: GoogleTasksEndpoint<'tasksUpdate'>;
	tasksPatch: GoogleTasksEndpoint<'tasksPatch'>;
	tasksDelete: GoogleTasksEndpoint<'tasksDelete'>;
	tasksMove: GoogleTasksEndpoint<'tasksMove'>;
	tasksClear: GoogleTasksEndpoint<'tasksClear'>;
};

const googleTasksEndpointsNested = {
	taskLists: {
		list: TaskLists.list,
		get: TaskLists.get,
		insert: TaskLists.insert,
		update: TaskLists.update,
		patch: TaskLists.patch,
		delete: TaskLists.deleteTaskList,
	},
	tasks: {
		list: Tasks.list,
		get: Tasks.get,
		insert: Tasks.insert,
		update: Tasks.update,
		patch: Tasks.patch,
		delete: Tasks.deleteTask,
		move: Tasks.move,
		clear: Tasks.clear,
	},
} as const;

const googleTasksWebhooksNested = {} as const;

export const googleTasksEndpointSchemas = {
	'taskLists.list': {
		input: GoogleTasksEndpointInputSchemas.taskListsList,
		output: GoogleTasksEndpointOutputSchemas.taskListsList,
	},
	'taskLists.get': {
		input: GoogleTasksEndpointInputSchemas.taskListsGet,
		output: GoogleTasksEndpointOutputSchemas.taskListsGet,
	},
	'taskLists.insert': {
		input: GoogleTasksEndpointInputSchemas.taskListsInsert,
		output: GoogleTasksEndpointOutputSchemas.taskListsInsert,
	},
	'taskLists.update': {
		input: GoogleTasksEndpointInputSchemas.taskListsUpdate,
		output: GoogleTasksEndpointOutputSchemas.taskListsUpdate,
	},
	'taskLists.patch': {
		input: GoogleTasksEndpointInputSchemas.taskListsPatch,
		output: GoogleTasksEndpointOutputSchemas.taskListsPatch,
	},
	'taskLists.delete': {
		input: GoogleTasksEndpointInputSchemas.taskListsDelete,
		output: GoogleTasksEndpointOutputSchemas.taskListsDelete,
	},
	'tasks.list': {
		input: GoogleTasksEndpointInputSchemas.tasksList,
		output: GoogleTasksEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: GoogleTasksEndpointInputSchemas.tasksGet,
		output: GoogleTasksEndpointOutputSchemas.tasksGet,
	},
	'tasks.insert': {
		input: GoogleTasksEndpointInputSchemas.tasksInsert,
		output: GoogleTasksEndpointOutputSchemas.tasksInsert,
	},
	'tasks.update': {
		input: GoogleTasksEndpointInputSchemas.tasksUpdate,
		output: GoogleTasksEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.patch': {
		input: GoogleTasksEndpointInputSchemas.tasksPatch,
		output: GoogleTasksEndpointOutputSchemas.tasksPatch,
	},
	'tasks.delete': {
		input: GoogleTasksEndpointInputSchemas.tasksDelete,
		output: GoogleTasksEndpointOutputSchemas.tasksDelete,
	},
	'tasks.move': {
		input: GoogleTasksEndpointInputSchemas.tasksMove,
		output: GoogleTasksEndpointOutputSchemas.tasksMove,
	},
	'tasks.clear': {
		input: GoogleTasksEndpointInputSchemas.tasksClear,
		output: GoogleTasksEndpointOutputSchemas.tasksClear,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof googleTasksEndpointsNested
>;

const googleTasksEndpointMeta = {
	'taskLists.list': {
		riskLevel: 'read',
		description: `List a page of task lists. OAuth scope: ${READ_SCOPE} or ${WRITE_SCOPE}.`,
	},
	'taskLists.get': {
		riskLevel: 'read',
		description: `Get one task list. OAuth scope: ${READ_SCOPE} or ${WRITE_SCOPE}.`,
	},
	'taskLists.insert': {
		riskLevel: 'write',
		description: `Create a task list. OAuth scope: ${WRITE_SCOPE}.`,
	},
	'taskLists.update': {
		riskLevel: 'write',
		description: `Replace a task list. OAuth scope: ${WRITE_SCOPE}.`,
	},
	'taskLists.patch': {
		riskLevel: 'write',
		description: `Partially update a task list. OAuth scope: ${WRITE_SCOPE}.`,
	},
	'taskLists.delete': {
		riskLevel: 'destructive',
		description: `Delete a task list; assigned tasks and their source tasks may also be deleted. OAuth scope: ${WRITE_SCOPE}.`,
	},
	'tasks.list': {
		riskLevel: 'read',
		description: `List a page of tasks with the documented filters. OAuth scope: ${READ_SCOPE} or ${WRITE_SCOPE}.`,
	},
	'tasks.get': {
		riskLevel: 'read',
		description: `Get one task. OAuth scope: ${READ_SCOPE} or ${WRITE_SCOPE}.`,
	},
	'tasks.insert': {
		riskLevel: 'write',
		description: `Create a task, optionally under a parent or after a sibling. OAuth scope: ${WRITE_SCOPE}.`,
	},
	'tasks.update': {
		riskLevel: 'write',
		description: `Replace a task. OAuth scope: ${WRITE_SCOPE}.`,
	},
	'tasks.patch': {
		riskLevel: 'write',
		description: `Partially update a task. OAuth scope: ${WRITE_SCOPE}.`,
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: `Delete a task; assigned tasks may also delete their source task. OAuth scope: ${WRITE_SCOPE}.`,
	},
	'tasks.move': {
		riskLevel: 'write',
		description: `Move a task within or between task lists or change its parent. OAuth scope: ${WRITE_SCOPE}.`,
	},
	'tasks.clear': {
		riskLevel: 'destructive',
		description: `Hide all completed tasks in a task list. OAuth scope: ${WRITE_SCOPE}.`,
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof googleTasksEndpointsNested
>;

const googleTasksAuthConfig = {
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

export type BaseGoogleTasksPlugin<T extends GoogleTasksPluginOptions> =
	CorsairPlugin<
		'googletasks',
		typeof GoogleTasksSchema,
		typeof googleTasksEndpointsNested,
		typeof googleTasksWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleTasksPlugin =
	BaseGoogleTasksPlugin<GoogleTasksPluginOptions>;
export type ExternalGoogleTasksPlugin<T extends GoogleTasksPluginOptions> =
	BaseGoogleTasksPlugin<T>;
export type GoogleTasksBoundWebhooks = BindWebhooks<
	typeof googleTasksWebhooksNested
>;

export function googletasks<const T extends GoogleTasksPluginOptions>(
	incomingOptions: GoogleTasksPluginOptions &
		T = {} as GoogleTasksPluginOptions & T,
): ExternalGoogleTasksPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
		scopeMode: incomingOptions.scopeMode ?? 'full',
	};
	const { DEFAULT: builtInDefault, ...builtInHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerHandlers } =
		options.errorHandlers ?? {};

	return {
		id: 'googletasks',
		authConfig: googleTasksAuthConfig,
		schema: GoogleTasksSchema,
		options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [options.scopeMode === 'readonly' ? READ_SCOPE : WRITE_SCOPE],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		endpoints: googleTasksEndpointsNested,
		webhooks: googleTasksWebhooksNested,
		endpointMeta: googleTasksEndpointMeta,
		endpointSchemas: googleTasksEndpointSchemas,
		webhookSchemas: {} satisfies RequiredPluginWebhookSchemas<
			typeof googleTasksWebhooksNested
		>,
		errorHandlers: {
			...callerHandlers,
			...builtInHandlers,
			...callerHandlers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: GoogleTasksKeyBuilderContext) => {
			if (ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('googletasks', 'oauth_2');
			}
			return getOAuthAccessToken(ctx, {
				plugin: 'googletasks',
				tokenUrl: 'https://oauth2.googleapis.com/token',
			});
		},
	} satisfies InternalGoogleTasksPlugin;
}

export type { GoogleTasksEndpointInputs, GoogleTasksEndpointOutputs };
