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
import { Contacts, Folders, Tasks, Timelogs } from './endpoints';
import type {
	WrikeEndpointInputs,
	WrikeEndpointOutputs,
} from './endpoints/types';
import {
	WrikeEndpointInputSchemas,
	WrikeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { WrikeSchema } from './schema';

/** Wrike runs the same v4 API on three hosts; an account lives on one. */
export type WrikeHostOption = 'www' | 'eu' | 'us2';

export type WrikePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The region the account lives in. A token only works against its own host,
	 * and nothing in the token says which, so this is configured.
	 */
	host?: WrikeHostOption;
	hooks?: InternalWrikePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof wrikeEndpointsNested>;
};

export type WrikeContext = CorsairPluginContext<
	typeof WrikeSchema,
	WrikePluginOptions
>;

export type WrikeKeyBuilderContext = KeyBuilderContext<WrikePluginOptions>;

export type WrikeBoundEndpoints = BindEndpoints<typeof wrikeEndpointsNested>;

type WrikeEndpoint<K extends keyof WrikeEndpointOutputs> = CorsairEndpoint<
	WrikeContext,
	WrikeEndpointInputs[K],
	WrikeEndpointOutputs[K]
>;

export type WrikeEndpoints = {
	tasksList: WrikeEndpoint<'tasksList'>;
	tasksGet: WrikeEndpoint<'tasksGet'>;
	tasksCreate: WrikeEndpoint<'tasksCreate'>;
	tasksUpdate: WrikeEndpoint<'tasksUpdate'>;
	tasksDelete: WrikeEndpoint<'tasksDelete'>;
	foldersList: WrikeEndpoint<'foldersList'>;
	foldersGet: WrikeEndpoint<'foldersGet'>;
	foldersCreate: WrikeEndpoint<'foldersCreate'>;
	foldersTasks: WrikeEndpoint<'foldersTasks'>;
	foldersUpdate: WrikeEndpoint<'foldersUpdate'>;
	foldersDelete: WrikeEndpoint<'foldersDelete'>;
	timelogsList: WrikeEndpoint<'timelogsList'>;
	timelogsCreate: WrikeEndpoint<'timelogsCreate'>;
	timelogsDelete: WrikeEndpoint<'timelogsDelete'>;
	taskTimelogs: WrikeEndpoint<'taskTimelogs'>;
	taskComments: WrikeEndpoint<'taskComments'>;
	taskCommentsCreate: WrikeEndpoint<'taskCommentsCreate'>;
	commentsList: WrikeEndpoint<'commentsList'>;
	commentsUpdate: WrikeEndpoint<'commentsUpdate'>;
	commentsDelete: WrikeEndpoint<'commentsDelete'>;
	contactsList: WrikeEndpoint<'contactsList'>;
	contactsGet: WrikeEndpoint<'contactsGet'>;
	accountGet: WrikeEndpoint<'accountGet'>;
};

const wrikeEndpointsNested = {
	tasks: {
		list: Tasks.list,
		get: Tasks.get,
		create: Tasks.create,
		update: Tasks.update,
		delete: Tasks.remove,
	},
	folders: {
		list: Folders.list,
		get: Folders.get,
		create: Folders.create,
		tasks: Folders.tasks,
		update: Folders.update,
		delete: Folders.remove,
	},
	timelogs: {
		list: Timelogs.list,
		task: Timelogs.task,
		create: Timelogs.create,
		delete: Timelogs.remove,
	},
	comments: {
		list: Timelogs.listComments,
		task: Timelogs.taskComments,
		create: Timelogs.taskCommentsCreate,
		update: Timelogs.updateComment,
		delete: Timelogs.removeComment,
	},
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
	},
	account: {
		get: Contacts.account,
	},
} as const;

export const wrikeEndpointSchemas = {
	'tasks.list': {
		input: WrikeEndpointInputSchemas.tasksList,
		output: WrikeEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: WrikeEndpointInputSchemas.tasksGet,
		output: WrikeEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: WrikeEndpointInputSchemas.tasksCreate,
		output: WrikeEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: WrikeEndpointInputSchemas.tasksUpdate,
		output: WrikeEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: WrikeEndpointInputSchemas.tasksDelete,
		output: WrikeEndpointOutputSchemas.tasksDelete,
	},
	'folders.list': {
		input: WrikeEndpointInputSchemas.foldersList,
		output: WrikeEndpointOutputSchemas.foldersList,
	},
	'folders.get': {
		input: WrikeEndpointInputSchemas.foldersGet,
		output: WrikeEndpointOutputSchemas.foldersGet,
	},
	'folders.create': {
		input: WrikeEndpointInputSchemas.foldersCreate,
		output: WrikeEndpointOutputSchemas.foldersCreate,
	},
	'folders.tasks': {
		input: WrikeEndpointInputSchemas.foldersTasks,
		output: WrikeEndpointOutputSchemas.foldersTasks,
	},
	'folders.update': {
		input: WrikeEndpointInputSchemas.foldersUpdate,
		output: WrikeEndpointOutputSchemas.foldersUpdate,
	},
	'folders.delete': {
		input: WrikeEndpointInputSchemas.foldersDelete,
		output: WrikeEndpointOutputSchemas.foldersDelete,
	},
	'timelogs.list': {
		input: WrikeEndpointInputSchemas.timelogsList,
		output: WrikeEndpointOutputSchemas.timelogsList,
	},
	'timelogs.task': {
		input: WrikeEndpointInputSchemas.taskTimelogs,
		output: WrikeEndpointOutputSchemas.taskTimelogs,
	},
	'timelogs.create': {
		input: WrikeEndpointInputSchemas.timelogsCreate,
		output: WrikeEndpointOutputSchemas.timelogsCreate,
	},
	'timelogs.delete': {
		input: WrikeEndpointInputSchemas.timelogsDelete,
		output: WrikeEndpointOutputSchemas.timelogsDelete,
	},
	'comments.list': {
		input: WrikeEndpointInputSchemas.commentsList,
		output: WrikeEndpointOutputSchemas.commentsList,
	},
	'comments.task': {
		input: WrikeEndpointInputSchemas.taskComments,
		output: WrikeEndpointOutputSchemas.taskComments,
	},
	'comments.create': {
		input: WrikeEndpointInputSchemas.taskCommentsCreate,
		output: WrikeEndpointOutputSchemas.taskCommentsCreate,
	},
	'comments.update': {
		input: WrikeEndpointInputSchemas.commentsUpdate,
		output: WrikeEndpointOutputSchemas.commentsUpdate,
	},
	'comments.delete': {
		input: WrikeEndpointInputSchemas.commentsDelete,
		output: WrikeEndpointOutputSchemas.commentsDelete,
	},
	'contacts.list': {
		input: WrikeEndpointInputSchemas.contactsList,
		output: WrikeEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: WrikeEndpointInputSchemas.contactsGet,
		output: WrikeEndpointOutputSchemas.contactsGet,
	},
	'account.get': {
		input: WrikeEndpointInputSchemas.accountGet,
		output: WrikeEndpointOutputSchemas.accountGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof wrikeEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const wrikeEndpointMeta = {
	'tasks.list': {
		riskLevel: 'read',
		description:
			'Search tasks account-wide by title, status, dates, author or assignee, with paging and sorting',
	},
	'tasks.get': {
		riskLevel: 'read',
		description:
			'Read one task with its status, dates, assignees and custom fields',
	},
	'tasks.create': {
		riskLevel: 'write',
		description:
			'Create a task in a folder, with assignees, dates, custom fields and metadata; Wrike has no account-level create',
	},
	'tasks.update': {
		riskLevel: 'write',
		description:
			'Change a task title, status, dates, assignees or followers, or restore it from the recycle bin',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description:
			'Move a task to the recycle bin, which a later update with restore can undo',
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'List folders and projects, each with its parent and scope',
	},
	'folders.get': {
		riskLevel: 'read',
		description: 'Read one folder or project',
	},
	'folders.create': {
		riskLevel: 'write',
		description:
			'Create a folder inside another, or in the account root when given its virtual root id',
	},
	'folders.tasks': {
		riskLevel: 'read',
		description:
			'List the tasks in a folder, optionally including every descendant folder',
	},
	'folders.update': {
		riskLevel: 'write',
		description:
			'Rename a folder, change its description or move it between parents',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		description:
			'Move a folder and every folder and task inside it to the recycle bin unless they have parents outside the deleted folder; Wrike does not refuse a folder with contents',
	},
	'timelogs.list': {
		riskLevel: 'read',
		description:
			'List the time logged on the account, filtered by tracked or created date, or only your own',
	},
	'timelogs.task': {
		riskLevel: 'read',
		description: 'List the time logged against one task',
	},
	'timelogs.create': {
		riskLevel: 'write',
		description:
			'Log hours against a task for a tracked date, with a comment (Wrike requires one, which may be empty) and an optional category',
	},
	'timelogs.delete': {
		riskLevel: 'destructive',
		description: 'Delete a logged time entry',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List comments across the account, up to a limit',
	},
	'comments.task': {
		riskLevel: 'read',
		description: 'List the comments on a task',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Post a comment on a task',
	},
	'comments.update': {
		riskLevel: 'write',
		description:
			'Edit the text of a comment you wrote; Wrike allows it only in the 5 minutes after posting',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a comment',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List the contacts on the account, optionally only active ones or only yourself',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Read one contact by id, or `me` for the one behind the token',
	},
	'account.get': {
		riskLevel: 'read',
		description:
			'Read the account, including the virtual root folder id that a task or folder create needs as its parent',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof wrikeEndpointsNested>;

export type BaseWrikePlugin<T extends WrikePluginOptions> = CorsairPlugin<
	'wrike',
	typeof WrikeSchema,
	typeof wrikeEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalWrikePlugin = BaseWrikePlugin<WrikePluginOptions>;

export type ExternalWrikePlugin<T extends WrikePluginOptions> =
	BaseWrikePlugin<T>;

export function wrike<const T extends WrikePluginOptions>(
	incomingOptions: WrikePluginOptions & T = {} as WrikePluginOptions & T,
): ExternalWrikePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'wrike',
		schema: WrikeSchema,
		options: options,
		hooks: options.hooks,
		endpoints: wrikeEndpointsNested,
		webhooks: {},
		endpointMeta: wrikeEndpointMeta,
		endpointSchemas: wrikeEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: WrikeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('wrike', ctx.authType ?? 'api_key');
		},
	} satisfies InternalWrikePlugin;
}

export type { WrikeHost } from './client';
export {
	id,
	isWrikeFailure,
	segment,
	WRIKE_API_BASE,
	WRIKE_HOSTS,
	WrikeAPIError,
} from './client';

export type {
	AccountGetInput,
	AccountGetResponse,
	CommentsDeleteInput,
	CommentsListInput,
	CommentsUpdateInput,
	CommentsUpdateResponse,
	ContactsGetInput,
	ContactsGetResponse,
	ContactsListInput,
	ContactsListResponse,
	DeleteResponse,
	FoldersCreateInput,
	FoldersCreateResponse,
	FoldersDeleteInput,
	FoldersGetInput,
	FoldersGetResponse,
	FoldersListInput,
	FoldersListResponse,
	FoldersTasksInput,
	FoldersTasksResponse,
	FoldersUpdateInput,
	FoldersUpdateResponse,
	TaskCommentsCreateInput,
	TaskCommentsCreateResponse,
	TaskCommentsInput,
	TaskCommentsResponse,
	TasksCreateInput,
	TasksCreateResponse,
	TasksDeleteInput,
	TasksGetInput,
	TasksGetResponse,
	TasksListInput,
	TasksListResponse,
	TasksTimelogsInput,
	TasksUpdateInput,
	TasksUpdateResponse,
	TimelogsCreateInput,
	TimelogsCreateResponse,
	TimelogsDeleteInput,
	TimelogsListInput,
	TimelogsListResponse,
	WrikeAccount,
	WrikeComment,
	WrikeContact,
	WrikeEndpointInputs,
	WrikeEndpointOutputs,
	WrikeFolder,
	WrikeTask,
	WrikeTimelog,
} from './endpoints/types';
