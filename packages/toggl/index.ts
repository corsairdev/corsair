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
import {
	Clients,
	Me,
	Organizations,
	Projects,
	Tags,
	Tasks,
	TimeEntries,
	Workspaces,
} from './endpoints';
import type {
	TogglEndpointInputs,
	TogglEndpointOutputs,
} from './endpoints/types';
import {
	TogglEndpointInputSchemas,
	TogglEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TogglSchema } from './schema';
import { resolveTogglOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchTogglTenantWebhook } from './webhooks/tenant-matcher';
import type { TogglWebhookOutputs } from './webhooks/types';

export type TogglPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTogglPlugin['hooks'];
	webhookHooks?: InternalTogglPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof togglEndpointsNested>;
};

export type TogglContext = CorsairPluginContext<
	typeof TogglSchema,
	TogglPluginOptions
>;

export type TogglKeyBuilderContext = KeyBuilderContext<TogglPluginOptions>;

export type TogglBoundEndpoints = BindEndpoints<typeof togglEndpointsNested>;

type TogglEndpoint<K extends keyof TogglEndpointOutputs> = CorsairEndpoint<
	TogglContext,
	TogglEndpointInputs[K],
	TogglEndpointOutputs[K]
>;

export type TogglEndpoints = {
	meGet: TogglEndpoint<'meGet'>;
	meUpdate: TogglEndpoint<'meUpdate'>;
	meGetPreferences: TogglEndpoint<'meGetPreferences'>;
	meUpdatePreferences: TogglEndpoint<'meUpdatePreferences'>;
	workspacesList: TogglEndpoint<'workspacesList'>;
	workspacesGet: TogglEndpoint<'workspacesGet'>;
	workspacesUpdate: TogglEndpoint<'workspacesUpdate'>;
	workspacesGetUsers: TogglEndpoint<'workspacesGetUsers'>;
	organizationsGet: TogglEndpoint<'organizationsGet'>;
	organizationsUpdate: TogglEndpoint<'organizationsUpdate'>;
	organizationsGetWorkspaces: TogglEndpoint<'organizationsGetWorkspaces'>;
	clientsList: TogglEndpoint<'clientsList'>;
	clientsGet: TogglEndpoint<'clientsGet'>;
	clientsCreate: TogglEndpoint<'clientsCreate'>;
	clientsUpdate: TogglEndpoint<'clientsUpdate'>;
	clientsDelete: TogglEndpoint<'clientsDelete'>;
	projectsList: TogglEndpoint<'projectsList'>;
	projectsGet: TogglEndpoint<'projectsGet'>;
	projectsCreate: TogglEndpoint<'projectsCreate'>;
	projectsUpdate: TogglEndpoint<'projectsUpdate'>;
	projectsDelete: TogglEndpoint<'projectsDelete'>;
	tasksList: TogglEndpoint<'tasksList'>;
	tasksGet: TogglEndpoint<'tasksGet'>;
	tasksCreate: TogglEndpoint<'tasksCreate'>;
	tasksUpdate: TogglEndpoint<'tasksUpdate'>;
	tasksDelete: TogglEndpoint<'tasksDelete'>;
	tagsList: TogglEndpoint<'tagsList'>;
	tagsCreate: TogglEndpoint<'tagsCreate'>;
	tagsUpdate: TogglEndpoint<'tagsUpdate'>;
	tagsDelete: TogglEndpoint<'tagsDelete'>;
	timeEntriesList: TogglEndpoint<'timeEntriesList'>;
	timeEntriesGetCurrent: TogglEndpoint<'timeEntriesGetCurrent'>;
	timeEntriesGet: TogglEndpoint<'timeEntriesGet'>;
	timeEntriesCreate: TogglEndpoint<'timeEntriesCreate'>;
	timeEntriesUpdate: TogglEndpoint<'timeEntriesUpdate'>;
	timeEntriesStop: TogglEndpoint<'timeEntriesStop'>;
	timeEntriesDelete: TogglEndpoint<'timeEntriesDelete'>;
};

export type TogglWebhooks = Record<string, never>;

export type TogglBoundWebhooks = BindWebhooks<TogglWebhooks>;

const togglEndpointsNested = {
	me: {
		get: Me.get,
		update: Me.update,
		getPreferences: Me.getPreferences,
		updatePreferences: Me.updatePreferences,
	},
	workspaces: {
		list: Workspaces.list,
		get: Workspaces.get,
		update: Workspaces.update,
		getUsers: Workspaces.getUsers,
	},
	organizations: {
		get: Organizations.get,
		update: Organizations.update,
		getWorkspaces: Organizations.getWorkspaces,
	},
	clients: {
		list: Clients.list,
		get: Clients.get,
		create: Clients.create,
		update: Clients.update,
		delete: Clients.delete,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.delete,
	},
	tasks: {
		list: Tasks.list,
		get: Tasks.get,
		create: Tasks.create,
		update: Tasks.update,
		delete: Tasks.delete,
	},
	tags: {
		list: Tags.list,
		create: Tags.create,
		update: Tags.update,
		delete: Tags.delete,
	},
	timeEntries: {
		list: TimeEntries.list,
		getCurrent: TimeEntries.getCurrent,
		get: TimeEntries.get,
		create: TimeEntries.create,
		update: TimeEntries.update,
		stop: TimeEntries.stop,
		delete: TimeEntries.delete,
	},
} as const;

/**
 * Toggl's Webhooks API is not wired up in this plugin. The OSS catalog lists
 * zero triggers for Toggl, so webhook support is tracked separately rather than
 * shipped half-built here.
 */
const togglWebhooksNested = {} as const;

export const togglEndpointSchemas = {
	'me.get': {
		input: TogglEndpointInputSchemas.meGet,
		output: TogglEndpointOutputSchemas.meGet,
	},
	'me.update': {
		input: TogglEndpointInputSchemas.meUpdate,
		output: TogglEndpointOutputSchemas.meUpdate,
	},
	'me.getPreferences': {
		input: TogglEndpointInputSchemas.meGetPreferences,
		output: TogglEndpointOutputSchemas.meGetPreferences,
	},
	'me.updatePreferences': {
		input: TogglEndpointInputSchemas.meUpdatePreferences,
		output: TogglEndpointOutputSchemas.meUpdatePreferences,
	},
	'workspaces.list': {
		input: TogglEndpointInputSchemas.workspacesList,
		output: TogglEndpointOutputSchemas.workspacesList,
	},
	'workspaces.get': {
		input: TogglEndpointInputSchemas.workspacesGet,
		output: TogglEndpointOutputSchemas.workspacesGet,
	},
	'workspaces.update': {
		input: TogglEndpointInputSchemas.workspacesUpdate,
		output: TogglEndpointOutputSchemas.workspacesUpdate,
	},
	'workspaces.getUsers': {
		input: TogglEndpointInputSchemas.workspacesGetUsers,
		output: TogglEndpointOutputSchemas.workspacesGetUsers,
	},
	'organizations.get': {
		input: TogglEndpointInputSchemas.organizationsGet,
		output: TogglEndpointOutputSchemas.organizationsGet,
	},
	'organizations.update': {
		input: TogglEndpointInputSchemas.organizationsUpdate,
		output: TogglEndpointOutputSchemas.organizationsUpdate,
	},
	'organizations.getWorkspaces': {
		input: TogglEndpointInputSchemas.organizationsGetWorkspaces,
		output: TogglEndpointOutputSchemas.organizationsGetWorkspaces,
	},
	'clients.list': {
		input: TogglEndpointInputSchemas.clientsList,
		output: TogglEndpointOutputSchemas.clientsList,
	},
	'clients.get': {
		input: TogglEndpointInputSchemas.clientsGet,
		output: TogglEndpointOutputSchemas.clientsGet,
	},
	'clients.create': {
		input: TogglEndpointInputSchemas.clientsCreate,
		output: TogglEndpointOutputSchemas.clientsCreate,
	},
	'clients.update': {
		input: TogglEndpointInputSchemas.clientsUpdate,
		output: TogglEndpointOutputSchemas.clientsUpdate,
	},
	'clients.delete': {
		input: TogglEndpointInputSchemas.clientsDelete,
		output: TogglEndpointOutputSchemas.clientsDelete,
	},
	'projects.list': {
		input: TogglEndpointInputSchemas.projectsList,
		output: TogglEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: TogglEndpointInputSchemas.projectsGet,
		output: TogglEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: TogglEndpointInputSchemas.projectsCreate,
		output: TogglEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: TogglEndpointInputSchemas.projectsUpdate,
		output: TogglEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: TogglEndpointInputSchemas.projectsDelete,
		output: TogglEndpointOutputSchemas.projectsDelete,
	},
	'tasks.list': {
		input: TogglEndpointInputSchemas.tasksList,
		output: TogglEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: TogglEndpointInputSchemas.tasksGet,
		output: TogglEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: TogglEndpointInputSchemas.tasksCreate,
		output: TogglEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: TogglEndpointInputSchemas.tasksUpdate,
		output: TogglEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: TogglEndpointInputSchemas.tasksDelete,
		output: TogglEndpointOutputSchemas.tasksDelete,
	},
	'tags.list': {
		input: TogglEndpointInputSchemas.tagsList,
		output: TogglEndpointOutputSchemas.tagsList,
	},
	'tags.create': {
		input: TogglEndpointInputSchemas.tagsCreate,
		output: TogglEndpointOutputSchemas.tagsCreate,
	},
	'tags.update': {
		input: TogglEndpointInputSchemas.tagsUpdate,
		output: TogglEndpointOutputSchemas.tagsUpdate,
	},
	'tags.delete': {
		input: TogglEndpointInputSchemas.tagsDelete,
		output: TogglEndpointOutputSchemas.tagsDelete,
	},
	'timeEntries.list': {
		input: TogglEndpointInputSchemas.timeEntriesList,
		output: TogglEndpointOutputSchemas.timeEntriesList,
	},
	'timeEntries.getCurrent': {
		input: TogglEndpointInputSchemas.timeEntriesGetCurrent,
		output: TogglEndpointOutputSchemas.timeEntriesGetCurrent,
	},
	'timeEntries.get': {
		input: TogglEndpointInputSchemas.timeEntriesGet,
		output: TogglEndpointOutputSchemas.timeEntriesGet,
	},
	'timeEntries.create': {
		input: TogglEndpointInputSchemas.timeEntriesCreate,
		output: TogglEndpointOutputSchemas.timeEntriesCreate,
	},
	'timeEntries.update': {
		input: TogglEndpointInputSchemas.timeEntriesUpdate,
		output: TogglEndpointOutputSchemas.timeEntriesUpdate,
	},
	'timeEntries.stop': {
		input: TogglEndpointInputSchemas.timeEntriesStop,
		output: TogglEndpointOutputSchemas.timeEntriesStop,
	},
	'timeEntries.delete': {
		input: TogglEndpointInputSchemas.timeEntriesDelete,
		output: TogglEndpointOutputSchemas.timeEntriesDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof togglEndpointsNested>;

const togglWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof togglWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const togglEndpointMeta = {
	'me.get': {
		riskLevel: 'read',
		description: 'Get the authenticated Toggl user',
	},
	'me.update': {
		riskLevel: 'write',
		description: 'Update the authenticated user profile',
	},
	'me.getPreferences': {
		riskLevel: 'read',
		description: 'Get the authenticated user preferences',
	},
	'me.updatePreferences': {
		riskLevel: 'write',
		description: 'Update the authenticated user preferences',
	},
	'workspaces.list': {
		riskLevel: 'read',
		description: 'List workspaces the user belongs to',
	},
	'workspaces.get': { riskLevel: 'read', description: 'Get a workspace by id' },
	'workspaces.update': {
		riskLevel: 'write',
		description: 'Update workspace settings',
	},
	'workspaces.getUsers': {
		riskLevel: 'read',
		description: 'List users in a workspace',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get an organization by id',
	},
	'organizations.update': {
		riskLevel: 'write',
		description: 'Rename an organization',
	},
	'organizations.getWorkspaces': {
		riskLevel: 'read',
		description: 'List workspaces in an organization',
	},
	'clients.list': {
		riskLevel: 'read',
		description: 'List clients in a workspace',
	},
	'clients.get': { riskLevel: 'read', description: 'Get a client by id' },
	'clients.create': { riskLevel: 'write', description: 'Create a client' },
	'clients.update': {
		riskLevel: 'write',
		description: 'Update or archive a client',
	},
	'clients.delete': {
		riskLevel: 'destructive',
		description: 'Delete a client [DESTRUCTIVE]',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects in a workspace',
	},
	'projects.get': { riskLevel: 'read', description: 'Get a project by id' },
	'projects.create': { riskLevel: 'write', description: 'Create a project' },
	'projects.update': { riskLevel: 'write', description: 'Update a project' },
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project and its time entries [DESTRUCTIVE]',
	},
	'tasks.list': { riskLevel: 'read', description: 'List tasks in a project' },
	'tasks.get': { riskLevel: 'read', description: 'Get a task by id' },
	'tasks.create': { riskLevel: 'write', description: 'Create a task' },
	'tasks.update': { riskLevel: 'write', description: 'Update a task' },
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a task [DESTRUCTIVE]',
	},
	'tags.list': { riskLevel: 'read', description: 'List tags in a workspace' },
	'tags.create': { riskLevel: 'write', description: 'Create a tag' },
	'tags.update': { riskLevel: 'write', description: 'Rename a tag' },
	'tags.delete': {
		riskLevel: 'destructive',
		description: 'Delete a tag [DESTRUCTIVE]',
	},
	'timeEntries.list': {
		riskLevel: 'read',
		description: 'List the current user time entries',
	},
	'timeEntries.getCurrent': {
		riskLevel: 'read',
		description: 'Get the currently running time entry, if any',
	},
	'timeEntries.get': {
		riskLevel: 'read',
		description: 'Get a time entry by id',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description: 'Create or start a time entry',
	},
	'timeEntries.update': {
		riskLevel: 'write',
		description: 'Update a time entry',
	},
	'timeEntries.stop': {
		riskLevel: 'write',
		description: 'Stop a running time entry',
	},
	'timeEntries.delete': {
		riskLevel: 'destructive',
		description: 'Delete a time entry [DESTRUCTIVE]',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof togglEndpointsNested>;

/**
 * Toggl issues a single per-user API token with no OAuth flow, so account
 * scoping keys off the tenant's external id.
 */
export const togglAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTogglPlugin<T extends TogglPluginOptions> = CorsairPlugin<
	'toggl',
	typeof TogglSchema,
	typeof togglEndpointsNested,
	typeof togglWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTogglPlugin = BaseTogglPlugin<TogglPluginOptions>;

export type ExternalTogglPlugin<T extends TogglPluginOptions> =
	BaseTogglPlugin<T>;

export function toggl<const T extends TogglPluginOptions>(
	incomingOptions: TogglPluginOptions & T = {} as TogglPluginOptions & T,
): ExternalTogglPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'toggl',
		authConfig: togglAuthConfig,
		schema: TogglSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: togglEndpointsNested,
		webhooks: togglWebhooksNested,
		endpointMeta: togglEndpointMeta,
		endpointSchemas: togglEndpointSchemas,
		webhookSchemas: togglWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchTogglTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveTogglOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TogglKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalTogglPlugin;
}

export type {
	TogglClient,
	TogglEndpointInputs,
	TogglEndpointOutputs,
	TogglOrganization,
	TogglProject,
	TogglTag,
	TogglTask,
	TogglTimeEntry,
	TogglUser,
	TogglWorkspace,
} from './endpoints/types';
export type { TogglWebhookOutputs } from './webhooks/types';
