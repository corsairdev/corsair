import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Data, Folders, Notifications, Tasks } from './endpoints';
import type {
	WacheteEndpointInputs,
	WacheteEndpointOutputs,
} from './endpoints/types';
import {
	WacheteEndpointInputSchemas,
	WacheteEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { WacheteSchema } from './schema';

export type WachetePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWachetePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof wacheteEndpointsNested>;
};

export type WacheteContext = CorsairPluginContext<
	typeof WacheteSchema,
	WachetePluginOptions
>;

export type WacheteKeyBuilderContext = KeyBuilderContext<WachetePluginOptions>;

export type WacheteBoundEndpoints = BindEndpoints<
	typeof wacheteEndpointsNested
>;

type WacheteEndpoint<K extends keyof WacheteEndpointOutputs> = CorsairEndpoint<
	WacheteContext,
	WacheteEndpointInputs[K],
	WacheteEndpointOutputs[K]
>;

export type WacheteEndpoints = {
	tasksUpsert: WacheteEndpoint<'tasksUpsert'>;
	tasksGet: WacheteEndpoint<'tasksGet'>;
	tasksDelete: WacheteEndpoint<'tasksDelete'>;
	tasksSearch: WacheteEndpoint<'tasksSearch'>;
	tasksPages: WacheteEndpoint<'tasksPages'>;
	notificationsList: WacheteEndpoint<'notificationsList'>;
	notificationsGet: WacheteEndpoint<'notificationsGet'>;
	dataList: WacheteEndpoint<'dataList'>;
	foldersList: WacheteEndpoint<'foldersList'>;
	foldersUpsert: WacheteEndpoint<'foldersUpsert'>;
	foldersDelete: WacheteEndpoint<'foldersDelete'>;
	foldersMove: WacheteEndpoint<'foldersMove'>;
};

const wacheteEndpointsNested = {
	tasks: {
		upsert: Tasks.upsert,
		get: Tasks.get,
		delete: Tasks.remove,
		search: Tasks.search,
		pages: Tasks.pages,
	},
	notifications: {
		list: Notifications.list,
		get: Notifications.get,
	},
	data: {
		list: Data.list,
	},
	folders: {
		list: Folders.list,
		upsert: Folders.upsert,
		delete: Folders.remove,
		move: Folders.move,
	},
} as const;

export const wacheteEndpointSchemas = {
	'tasks.upsert': {
		input: WacheteEndpointInputSchemas.tasksUpsert,
		output: WacheteEndpointOutputSchemas.tasksUpsert,
	},
	'tasks.get': {
		input: WacheteEndpointInputSchemas.tasksGet,
		output: WacheteEndpointOutputSchemas.tasksGet,
	},
	'tasks.delete': {
		input: WacheteEndpointInputSchemas.tasksDelete,
		output: WacheteEndpointOutputSchemas.tasksDelete,
	},
	'tasks.search': {
		input: WacheteEndpointInputSchemas.tasksSearch,
		output: WacheteEndpointOutputSchemas.tasksSearch,
	},
	'tasks.pages': {
		input: WacheteEndpointInputSchemas.tasksPages,
		output: WacheteEndpointOutputSchemas.tasksPages,
	},
	'notifications.list': {
		input: WacheteEndpointInputSchemas.notificationsList,
		output: WacheteEndpointOutputSchemas.notificationsList,
	},
	'notifications.get': {
		input: WacheteEndpointInputSchemas.notificationsGet,
		output: WacheteEndpointOutputSchemas.notificationsGet,
	},
	'data.list': {
		input: WacheteEndpointInputSchemas.dataList,
		output: WacheteEndpointOutputSchemas.dataList,
	},
	'folders.list': {
		input: WacheteEndpointInputSchemas.foldersList,
		output: WacheteEndpointOutputSchemas.foldersList,
	},
	'folders.upsert': {
		input: WacheteEndpointInputSchemas.foldersUpsert,
		output: WacheteEndpointOutputSchemas.foldersUpsert,
	},
	'folders.delete': {
		input: WacheteEndpointInputSchemas.foldersDelete,
		output: WacheteEndpointOutputSchemas.foldersDelete,
	},
	'folders.move': {
		input: WacheteEndpointInputSchemas.foldersMove,
		output: WacheteEndpointOutputSchemas.foldersMove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof wacheteEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const wacheteEndpointMeta = {
	'tasks.upsert': {
		riskLevel: 'write',
		description:
			'Create a monitor, or update one by sending its id; sets the URL, the part of the page watched, how often to check and who to notify',
	},
	'tasks.get': {
		riskLevel: 'read',
		description:
			'Read one monitor with its settings, its last value and when that value changed',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a monitor and its history; this cannot be undone',
	},
	'tasks.search': {
		riskLevel: 'read',
		description: 'Search monitors by name, returning at most 500 and no paging',
	},
	'tasks.pages': {
		riskLevel: 'read',
		description: 'List the pages a Portal monitor is crawling',
	},
	'notifications.list': {
		riskLevel: 'read',
		description:
			'List triggered notifications newest first, filtered by monitor and date range',
	},
	'notifications.get': {
		riskLevel: 'read',
		description:
			'Read one notification: the monitor name, URL, time and the HTML that was sent',
	},
	'data.list': {
		riskLevel: 'read',
		description:
			"Read a monitor's check history, optionally as a diff per entry",
	},
	'folders.list': {
		riskLevel: 'read',
		description:
			'List a folder subfolders and monitors, with the path to that folder',
	},
	'folders.upsert': {
		riskLevel: 'write',
		description: 'Create a folder, or rename and move one by sending its id',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a folder with every subfolder and monitor inside it; this cannot be undone',
	},
	'folders.move': {
		riskLevel: 'write',
		description: 'Move monitors and folders into another folder',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof wacheteEndpointsNested>;

export type BaseWachetePlugin<T extends WachetePluginOptions> = CorsairPlugin<
	'wachete',
	typeof WacheteSchema,
	typeof wacheteEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalWachetePlugin = BaseWachetePlugin<WachetePluginOptions>;

export type ExternalWachetePlugin<T extends WachetePluginOptions> =
	BaseWachetePlugin<T>;

export function wachete<const T extends WachetePluginOptions>(
	incomingOptions: WachetePluginOptions & T = {} as WachetePluginOptions & T,
): ExternalWachetePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'wachete',
		schema: WacheteSchema,
		options: options,
		hooks: options.hooks,
		endpoints: wacheteEndpointsNested,
		webhooks: {},
		endpointMeta: wacheteEndpointMeta,
		endpointSchemas: wacheteEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: WacheteKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('wachete', ctx.authType ?? 'api_key');
		},
	} satisfies InternalWachetePlugin;
}

export {
	clearWacheteTokenCache,
	isWacheteFailure,
	login,
	parseWacheteKey,
	resolveWacheteToken,
	WACHETE_API_BASE,
	WacheteAPIError,
} from './client';

export type {
	DataListInput,
	DataListResponse,
	DeleteResponse,
	FolderDeleteInput,
	FolderListInput,
	FolderListResponse,
	FolderMoveInput,
	FolderMoveResponse,
	FolderResponse,
	FolderUpsertInput,
	NotificationHtmlResponse,
	NotificationsGetInput,
	NotificationsListInput,
	NotificationsListResponse,
	PagesResponse,
	TaskResponse,
	TasksDeleteInput,
	TasksGetInput,
	TasksPagesInput,
	TasksSearchInput,
	TasksSearchResponse,
	TasksUpsertInput,
	WacheteEndpointInputs,
	WacheteEndpointOutputs,
	WacheteFolder,
	WacheteNotification,
	WacheteTask,
} from './endpoints/types';
