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
import { AuthMissingError } from 'corsair/core';
import type { MotionEndpointInputs, MotionEndpointOutputs } from './endpoints';
import {
	Comments,
	CustomFields,
	CustomFieldValues,
	MotionEndpointInputSchemas,
	MotionEndpointOutputSchemas,
	Projects,
	RecurringTasks,
	Schedules,
	Statuses,
	Tasks,
	Users,
	Workspaces,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { MotionSchema } from './schema';

export type MotionPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMotionPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof motionEndpointsNested>;
};

export type MotionContext = CorsairPluginContext<
	typeof MotionSchema,
	MotionPluginOptions
>;
export type MotionKeyBuilderContext = KeyBuilderContext<MotionPluginOptions>;
export type MotionBoundEndpoints = BindEndpoints<typeof motionEndpointsNested>;
type MotionEndpoint<K extends keyof MotionEndpointOutputs> = CorsairEndpoint<
	MotionContext,
	MotionEndpointInputs[K],
	MotionEndpointOutputs[K]
>;

export type MotionEndpoints = {
	[K in keyof MotionEndpointOutputs]: MotionEndpoint<K>;
};

const motionEndpointsNested = {
	tasks: {
		list: Tasks.list,
		create: Tasks.create,
		get: Tasks.get,
		update: Tasks.update,
		delete: Tasks.delete,
		move: Tasks.move,
		unassign: Tasks.unassign,
	},
	projects: {
		list: Projects.list,
		create: Projects.create,
		get: Projects.get,
	},
	workspaces: { list: Workspaces.list },
	users: { list: Users.list, me: Users.me },
	comments: { list: Comments.list, create: Comments.create },
	recurringTasks: {
		list: RecurringTasks.list,
		create: RecurringTasks.create,
		delete: RecurringTasks.delete,
	},
	customFields: {
		list: CustomFields.list,
		create: CustomFields.create,
		delete: CustomFields.delete,
	},
	customFieldValues: {
		addToProject: CustomFieldValues.addToProject,
		addToTask: CustomFieldValues.addToTask,
		deleteFromProject: CustomFieldValues.deleteFromProject,
		deleteFromTask: CustomFieldValues.deleteFromTask,
	},
	schedules: { list: Schedules.list },
	statuses: { list: Statuses.list },
} as const;

export const motionEndpointSchemas = {
	'tasks.list': {
		input: MotionEndpointInputSchemas.listTasks,
		output: MotionEndpointOutputSchemas.listTasks,
	},
	'tasks.create': {
		input: MotionEndpointInputSchemas.createTask,
		output: MotionEndpointOutputSchemas.createTask,
	},
	'tasks.get': {
		input: MotionEndpointInputSchemas.getTask,
		output: MotionEndpointOutputSchemas.getTask,
	},
	'tasks.update': {
		input: MotionEndpointInputSchemas.updateTask,
		output: MotionEndpointOutputSchemas.updateTask,
	},
	'tasks.delete': {
		input: MotionEndpointInputSchemas.deleteTask,
		output: MotionEndpointOutputSchemas.deleteTask,
	},
	'tasks.move': {
		input: MotionEndpointInputSchemas.moveTask,
		output: MotionEndpointOutputSchemas.moveTask,
	},
	'tasks.unassign': {
		input: MotionEndpointInputSchemas.unassignTask,
		output: MotionEndpointOutputSchemas.unassignTask,
	},
	'projects.list': {
		input: MotionEndpointInputSchemas.listProjects,
		output: MotionEndpointOutputSchemas.listProjects,
	},
	'projects.create': {
		input: MotionEndpointInputSchemas.createProject,
		output: MotionEndpointOutputSchemas.createProject,
	},
	'projects.get': {
		input: MotionEndpointInputSchemas.getProject,
		output: MotionEndpointOutputSchemas.getProject,
	},
	'workspaces.list': {
		input: MotionEndpointInputSchemas.listWorkspaces,
		output: MotionEndpointOutputSchemas.listWorkspaces,
	},
	'users.list': {
		input: MotionEndpointInputSchemas.listUsers,
		output: MotionEndpointOutputSchemas.listUsers,
	},
	'users.me': {
		input: MotionEndpointInputSchemas.getCurrentUser,
		output: MotionEndpointOutputSchemas.getCurrentUser,
	},
	'comments.list': {
		input: MotionEndpointInputSchemas.listComments,
		output: MotionEndpointOutputSchemas.listComments,
	},
	'comments.create': {
		input: MotionEndpointInputSchemas.createComment,
		output: MotionEndpointOutputSchemas.createComment,
	},
	'recurringTasks.list': {
		input: MotionEndpointInputSchemas.listRecurringTasks,
		output: MotionEndpointOutputSchemas.listRecurringTasks,
	},
	'recurringTasks.create': {
		input: MotionEndpointInputSchemas.createRecurringTask,
		output: MotionEndpointOutputSchemas.createRecurringTask,
	},
	'recurringTasks.delete': {
		input: MotionEndpointInputSchemas.deleteRecurringTask,
		output: MotionEndpointOutputSchemas.deleteRecurringTask,
	},
	'customFields.list': {
		input: MotionEndpointInputSchemas.listCustomFields,
		output: MotionEndpointOutputSchemas.listCustomFields,
	},
	'customFields.create': {
		input: MotionEndpointInputSchemas.createCustomField,
		output: MotionEndpointOutputSchemas.createCustomField,
	},
	'customFields.delete': {
		input: MotionEndpointInputSchemas.deleteCustomField,
		output: MotionEndpointOutputSchemas.deleteCustomField,
	},
	'customFieldValues.addToProject': {
		input: MotionEndpointInputSchemas.addProjectCustomFieldValue,
		output: MotionEndpointOutputSchemas.addProjectCustomFieldValue,
	},
	'customFieldValues.addToTask': {
		input: MotionEndpointInputSchemas.addTaskCustomFieldValue,
		output: MotionEndpointOutputSchemas.addTaskCustomFieldValue,
	},
	'customFieldValues.deleteFromProject': {
		input: MotionEndpointInputSchemas.deleteProjectCustomFieldValue,
		output: MotionEndpointOutputSchemas.deleteProjectCustomFieldValue,
	},
	'customFieldValues.deleteFromTask': {
		input: MotionEndpointInputSchemas.deleteTaskCustomFieldValue,
		output: MotionEndpointOutputSchemas.deleteTaskCustomFieldValue,
	},
	'schedules.list': {
		input: MotionEndpointInputSchemas.listSchedules,
		output: MotionEndpointOutputSchemas.listSchedules,
	},
	'statuses.list': {
		input: MotionEndpointInputSchemas.listStatuses,
		output: MotionEndpointOutputSchemas.listStatuses,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof motionEndpointsNested
>;

const motionEndpointMeta = {
	'tasks.list': {
		riskLevel: 'read',
		description: 'List tasks with optional filters and cursor pagination.',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a task.',
	},
	'tasks.get': { riskLevel: 'read', description: 'Get a task.' },
	'tasks.update': {
		riskLevel: 'write',
		description: 'Update a task.',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a task.',
	},
	'tasks.move': {
		riskLevel: 'write',
		description: 'Move a task to another workspace.',
	},
	'tasks.unassign': {
		riskLevel: 'write',
		description: 'Remove the assignee from a task.',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects with cursor pagination.',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project.',
	},
	'projects.get': { riskLevel: 'read', description: 'Get a project.' },
	'workspaces.list': {
		riskLevel: 'read',
		description: 'List workspaces.',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List workspace or team members.',
	},
	'users.me': {
		riskLevel: 'read',
		description: 'Get the authenticated user.',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List comments on a task.',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Create a comment on a task.',
	},
	'recurringTasks.list': {
		riskLevel: 'read',
		description: 'List recurring tasks for a workspace.',
	},
	'recurringTasks.create': {
		riskLevel: 'write',
		description: 'Create a recurring task.',
	},
	'recurringTasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a recurring task.',
	},
	'customFields.list': {
		riskLevel: 'read',
		description: 'List the custom fields of a workspace.',
	},
	'customFields.create': {
		riskLevel: 'write',
		description: 'Create a custom field in a workspace.',
	},
	'customFields.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom field from a workspace.',
	},
	'customFieldValues.addToProject': {
		riskLevel: 'write',
		description: 'Set a custom field value on a project.',
	},
	'customFieldValues.addToTask': {
		riskLevel: 'write',
		description: 'Set a custom field value on a task.',
	},
	'customFieldValues.deleteFromProject': {
		riskLevel: 'destructive',
		description: 'Delete a custom field value from a project.',
	},
	'customFieldValues.deleteFromTask': {
		riskLevel: 'destructive',
		description: 'Delete a custom field value from a task.',
	},
	'schedules.list': {
		riskLevel: 'read',
		description: 'List the schedules available to the workspace.',
	},
	'statuses.list': {
		riskLevel: 'read',
		description: 'List the statuses of a workspace.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof motionEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';
export const motionAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
export type BaseMotionPlugin<T extends MotionPluginOptions> = CorsairPlugin<
	'motion',
	typeof MotionSchema,
	typeof motionEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalMotionPlugin = BaseMotionPlugin<MotionPluginOptions>;
export type ExternalMotionPlugin<T extends MotionPluginOptions> =
	BaseMotionPlugin<T>;

export function motion<const T extends MotionPluginOptions>(
	incomingOptions: MotionPluginOptions & T = {} as MotionPluginOptions & T,
): ExternalMotionPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'motion',
		authConfig: motionAuthConfig,
		schema: MotionSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: motionEndpointsNested,
		webhooks: {},
		endpointMeta: motionEndpointMeta,
		endpointSchemas: motionEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: undefined,
		pluginTenantWebhookMatcher: undefined,
		oauthWebhookTenantLinkResolver: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: MotionKeyBuilderContext, source) => {
			if (source !== 'endpoint')
				throw new AuthMissingError('motion', 'api_key');
			const key =
				options.key ??
				(ctx.authType === 'api_key' ? await ctx.keys.get_api_key() : undefined);
			if (!key) throw new AuthMissingError('motion', 'api_key');
			return key;
		},
	} satisfies InternalMotionPlugin;
}

export type {
	MotionEndpointInputs,
	MotionEndpointOutputs,
} from './endpoints';
