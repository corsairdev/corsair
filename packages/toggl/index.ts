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
	Reference,
	Smail,
	Tags,
	Tasks,
	TimeEntries,
	Webhooks,
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
	clientsArchive: TogglEndpoint<'clientsArchive'>;
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
	meGetLogged: TogglEndpoint<'meGetLogged'>;
	meGetLocation: TogglEndpoint<'meGetLocation'>;
	meGetQuota: TogglEndpoint<'meGetQuota'>;
	meGetClients: TogglEndpoint<'meGetClients'>;
	meGetProjects: TogglEndpoint<'meGetProjects'>;
	meGetTags: TogglEndpoint<'meGetTags'>;
	meGetTasks: TogglEndpoint<'meGetTasks'>;
	meDisableProductEmails: TogglEndpoint<'meDisableProductEmails'>;
	meDisableWeeklyReport: TogglEndpoint<'meDisableWeeklyReport'>;
	referenceGetCountries: TogglEndpoint<'referenceGetCountries'>;
	referenceGetCountrySubdivisions: TogglEndpoint<'referenceGetCountrySubdivisions'>;
	referenceGetCurrencies: TogglEndpoint<'referenceGetCurrencies'>;
	referenceGetTimezones: TogglEndpoint<'referenceGetTimezones'>;
	referenceGetTimezoneOffsets: TogglEndpoint<'referenceGetTimezoneOffsets'>;
	referenceGetKeys: TogglEndpoint<'referenceGetKeys'>;
	organizationsCreate: TogglEndpoint<'organizationsCreate'>;
	organizationsGetGroups: TogglEndpoint<'organizationsGetGroups'>;
	organizationsCreateGroup: TogglEndpoint<'organizationsCreateGroup'>;
	organizationsDeleteGroup: TogglEndpoint<'organizationsDeleteGroup'>;
	organizationsGetUsers: TogglEndpoint<'organizationsGetUsers'>;
	organizationsCreateInvitation: TogglEndpoint<'organizationsCreateInvitation'>;
	organizationsGetPlans: TogglEndpoint<'organizationsGetPlans'>;
	organizationsGetSubscriptionPlans: TogglEndpoint<'organizationsGetSubscriptionPlans'>;
	workspacesGetLogo: TogglEndpoint<'workspacesGetLogo'>;
	workspacesGetPreferences: TogglEndpoint<'workspacesGetPreferences'>;
	projectsAddUser: TogglEndpoint<'projectsAddUser'>;
	projectsDeleteGroup: TogglEndpoint<'projectsDeleteGroup'>;
	timeEntriesBulkEdit: TogglEndpoint<'timeEntriesBulkEdit'>;
	webhooksGetStatus: TogglEndpoint<'webhooksGetStatus'>;
	webhooksGetEventFilters: TogglEndpoint<'webhooksGetEventFilters'>;
	webhooksListSubscriptions: TogglEndpoint<'webhooksListSubscriptions'>;
	webhooksDeleteSubscription: TogglEndpoint<'webhooksDeleteSubscription'>;
	smailSendDemo: TogglEndpoint<'smailSendDemo'>;
	smailSendContact: TogglEndpoint<'smailSendContact'>;
	smailSendMeet: TogglEndpoint<'smailSendMeet'>;
};

export type TogglWebhooks = Record<string, never>;

export type TogglBoundWebhooks = BindWebhooks<TogglWebhooks>;

const togglEndpointsNested = {
	me: {
		get: Me.get,
		update: Me.update,
		getPreferences: Me.getPreferences,
		updatePreferences: Me.updatePreferences,
		getLogged: Me.getLogged,
		getLocation: Me.getLocation,
		getQuota: Me.getQuota,
		getClients: Me.getClients,
		getProjects: Me.getProjects,
		getTags: Me.getTags,
		getTasks: Me.getTasks,
		disableProductEmails: Me.disableProductEmails,
		disableWeeklyReport: Me.disableWeeklyReport,
	},
	workspaces: {
		list: Workspaces.list,
		get: Workspaces.get,
		update: Workspaces.update,
		getUsers: Workspaces.getUsers,
		getLogo: Workspaces.getLogo,
		getPreferences: Workspaces.getPreferences,
	},
	organizations: {
		get: Organizations.get,
		update: Organizations.update,
		getWorkspaces: Organizations.getWorkspaces,
		create: Organizations.create,
		getGroups: Organizations.getGroups,
		createGroup: Organizations.createGroup,
		deleteGroup: Organizations.deleteGroup,
		getUsers: Organizations.getUsers,
		createInvitation: Organizations.createInvitation,
		getPlans: Organizations.getPlans,
		getSubscriptionPlans: Organizations.getSubscriptionPlans,
	},
	clients: {
		list: Clients.list,
		get: Clients.get,
		create: Clients.create,
		update: Clients.update,
		archive: Clients.archive,
		delete: Clients.delete,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.delete,
		addUser: Projects.addUser,
		deleteGroup: Projects.deleteGroup,
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
		bulkEdit: TimeEntries.bulkEdit,
	},
	reference: {
		getCountries: Reference.getCountries,
		getCountrySubdivisions: Reference.getCountrySubdivisions,
		getCurrencies: Reference.getCurrencies,
		getTimezones: Reference.getTimezones,
		getTimezoneOffsets: Reference.getTimezoneOffsets,
		getKeys: Reference.getKeys,
	},
	webhooks: {
		getStatus: Webhooks.getStatus,
		getEventFilters: Webhooks.getEventFilters,
		listSubscriptions: Webhooks.listSubscriptions,
		deleteSubscription: Webhooks.deleteSubscription,
	},
	smail: {
		sendDemo: Smail.sendDemo,
		sendContact: Smail.sendContact,
		sendMeet: Smail.sendMeet,
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
	'clients.archive': {
		input: TogglEndpointInputSchemas.clientsArchive,
		output: TogglEndpointOutputSchemas.clientsArchive,
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
	'me.getLogged': {
		input: TogglEndpointInputSchemas.meGetLogged,
		output: TogglEndpointOutputSchemas.meGetLogged,
	},
	'me.getLocation': {
		input: TogglEndpointInputSchemas.meGetLocation,
		output: TogglEndpointOutputSchemas.meGetLocation,
	},
	'me.getQuota': {
		input: TogglEndpointInputSchemas.meGetQuota,
		output: TogglEndpointOutputSchemas.meGetQuota,
	},
	'me.getClients': {
		input: TogglEndpointInputSchemas.meGetClients,
		output: TogglEndpointOutputSchemas.meGetClients,
	},
	'me.getProjects': {
		input: TogglEndpointInputSchemas.meGetProjects,
		output: TogglEndpointOutputSchemas.meGetProjects,
	},
	'me.getTags': {
		input: TogglEndpointInputSchemas.meGetTags,
		output: TogglEndpointOutputSchemas.meGetTags,
	},
	'me.getTasks': {
		input: TogglEndpointInputSchemas.meGetTasks,
		output: TogglEndpointOutputSchemas.meGetTasks,
	},
	'me.disableProductEmails': {
		input: TogglEndpointInputSchemas.meDisableProductEmails,
		output: TogglEndpointOutputSchemas.meDisableProductEmails,
	},
	'me.disableWeeklyReport': {
		input: TogglEndpointInputSchemas.meDisableWeeklyReport,
		output: TogglEndpointOutputSchemas.meDisableWeeklyReport,
	},
	'reference.getCountries': {
		input: TogglEndpointInputSchemas.referenceGetCountries,
		output: TogglEndpointOutputSchemas.referenceGetCountries,
	},
	'reference.getCountrySubdivisions': {
		input: TogglEndpointInputSchemas.referenceGetCountrySubdivisions,
		output: TogglEndpointOutputSchemas.referenceGetCountrySubdivisions,
	},
	'reference.getCurrencies': {
		input: TogglEndpointInputSchemas.referenceGetCurrencies,
		output: TogglEndpointOutputSchemas.referenceGetCurrencies,
	},
	'reference.getTimezones': {
		input: TogglEndpointInputSchemas.referenceGetTimezones,
		output: TogglEndpointOutputSchemas.referenceGetTimezones,
	},
	'reference.getTimezoneOffsets': {
		input: TogglEndpointInputSchemas.referenceGetTimezoneOffsets,
		output: TogglEndpointOutputSchemas.referenceGetTimezoneOffsets,
	},
	'reference.getKeys': {
		input: TogglEndpointInputSchemas.referenceGetKeys,
		output: TogglEndpointOutputSchemas.referenceGetKeys,
	},
	'organizations.create': {
		input: TogglEndpointInputSchemas.organizationsCreate,
		output: TogglEndpointOutputSchemas.organizationsCreate,
	},
	'organizations.getGroups': {
		input: TogglEndpointInputSchemas.organizationsGetGroups,
		output: TogglEndpointOutputSchemas.organizationsGetGroups,
	},
	'organizations.createGroup': {
		input: TogglEndpointInputSchemas.organizationsCreateGroup,
		output: TogglEndpointOutputSchemas.organizationsCreateGroup,
	},
	'organizations.deleteGroup': {
		input: TogglEndpointInputSchemas.organizationsDeleteGroup,
		output: TogglEndpointOutputSchemas.organizationsDeleteGroup,
	},
	'organizations.getUsers': {
		input: TogglEndpointInputSchemas.organizationsGetUsers,
		output: TogglEndpointOutputSchemas.organizationsGetUsers,
	},
	'organizations.createInvitation': {
		input: TogglEndpointInputSchemas.organizationsCreateInvitation,
		output: TogglEndpointOutputSchemas.organizationsCreateInvitation,
	},
	'organizations.getPlans': {
		input: TogglEndpointInputSchemas.organizationsGetPlans,
		output: TogglEndpointOutputSchemas.organizationsGetPlans,
	},
	'organizations.getSubscriptionPlans': {
		input: TogglEndpointInputSchemas.organizationsGetSubscriptionPlans,
		output: TogglEndpointOutputSchemas.organizationsGetSubscriptionPlans,
	},
	'workspaces.getLogo': {
		input: TogglEndpointInputSchemas.workspacesGetLogo,
		output: TogglEndpointOutputSchemas.workspacesGetLogo,
	},
	'workspaces.getPreferences': {
		input: TogglEndpointInputSchemas.workspacesGetPreferences,
		output: TogglEndpointOutputSchemas.workspacesGetPreferences,
	},
	'projects.addUser': {
		input: TogglEndpointInputSchemas.projectsAddUser,
		output: TogglEndpointOutputSchemas.projectsAddUser,
	},
	'projects.deleteGroup': {
		input: TogglEndpointInputSchemas.projectsDeleteGroup,
		output: TogglEndpointOutputSchemas.projectsDeleteGroup,
	},
	'timeEntries.bulkEdit': {
		input: TogglEndpointInputSchemas.timeEntriesBulkEdit,
		output: TogglEndpointOutputSchemas.timeEntriesBulkEdit,
	},
	'webhooks.getStatus': {
		input: TogglEndpointInputSchemas.webhooksGetStatus,
		output: TogglEndpointOutputSchemas.webhooksGetStatus,
	},
	'webhooks.getEventFilters': {
		input: TogglEndpointInputSchemas.webhooksGetEventFilters,
		output: TogglEndpointOutputSchemas.webhooksGetEventFilters,
	},
	'webhooks.listSubscriptions': {
		input: TogglEndpointInputSchemas.webhooksListSubscriptions,
		output: TogglEndpointOutputSchemas.webhooksListSubscriptions,
	},
	'webhooks.deleteSubscription': {
		input: TogglEndpointInputSchemas.webhooksDeleteSubscription,
		output: TogglEndpointOutputSchemas.webhooksDeleteSubscription,
	},
	'smail.sendDemo': {
		input: TogglEndpointInputSchemas.smailSendDemo,
		output: TogglEndpointOutputSchemas.smailSendDemo,
	},
	'smail.sendContact': {
		input: TogglEndpointInputSchemas.smailSendContact,
		output: TogglEndpointOutputSchemas.smailSendContact,
	},
	'smail.sendMeet': {
		input: TogglEndpointInputSchemas.smailSendMeet,
		output: TogglEndpointOutputSchemas.smailSendMeet,
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
	'clients.archive': {
		riskLevel: 'write',
		description: 'Archive a client',
	},
	'clients.delete': {
		riskLevel: 'destructive',
		description: 'Delete a client',
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
		description: 'Delete a project and its time entries',
	},
	'tasks.list': { riskLevel: 'read', description: 'List tasks in a project' },
	'tasks.get': { riskLevel: 'read', description: 'Get a task by id' },
	'tasks.create': { riskLevel: 'write', description: 'Create a task' },
	'tasks.update': { riskLevel: 'write', description: 'Update a task' },
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a task',
	},
	'tags.list': { riskLevel: 'read', description: 'List tags in a workspace' },
	'tags.create': { riskLevel: 'write', description: 'Create a tag' },
	'tags.update': { riskLevel: 'write', description: 'Rename a tag' },
	'tags.delete': {
		riskLevel: 'destructive',
		description: 'Delete a tag',
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
		description: 'Delete a time entry',
	},
	'me.getLogged': {
		riskLevel: 'read',
		description: 'Check that the API token is valid',
	},
	'me.getLocation': {
		riskLevel: 'read',
		description: 'Get the last known location of the authenticated user',
	},
	'me.getQuota': {
		riskLevel: 'read',
		description: 'Get remaining API request quota per organization',
	},
	'me.getClients': {
		riskLevel: 'read',
		description: 'List clients across all workspaces the user can access',
	},
	'me.getProjects': {
		riskLevel: 'read',
		description: 'List projects across all workspaces the user can access',
	},
	'me.getTags': {
		riskLevel: 'read',
		description: 'List tags across all workspaces the user can access',
	},
	'me.getTasks': {
		riskLevel: 'read',
		description: 'List tasks across all workspaces the user can access',
	},
	'me.disableProductEmails': {
		riskLevel: 'write',
		description: 'Unsubscribe the account from Toggl product emails',
	},
	'me.disableWeeklyReport': {
		riskLevel: 'write',
		description: 'Unsubscribe the account from the weekly report email',
	},
	'reference.getCountries': {
		riskLevel: 'read',
		description: 'List countries Toggl supports, with VAT settings',
	},
	'reference.getCountrySubdivisions': {
		riskLevel: 'read',
		description: 'List states or provinces for a country id from getCountries',
	},
	'reference.getCurrencies': {
		riskLevel: 'read',
		description: 'List currencies Toggl supports',
	},
	'reference.getTimezones': {
		riskLevel: 'read',
		description: 'List timezones Toggl supports',
	},
	'reference.getTimezoneOffsets': {
		riskLevel: 'read',
		description: 'List timezones with their UTC offsets',
	},
	'reference.getKeys': {
		riskLevel: 'read',
		description: 'Get the JWKS keyset used to verify Toggl JWTs',
	},
	'organizations.create': {
		riskLevel: 'write',
		description: 'Create an organization and its first workspace',
	},
	'organizations.getGroups': {
		riskLevel: 'read',
		description: 'List groups in an organization',
	},
	'organizations.createGroup': {
		riskLevel: 'write',
		description: 'Create a group in an organization',
	},
	'organizations.deleteGroup': {
		riskLevel: 'destructive',
		description: 'Delete an organization group',
	},
	'organizations.getUsers': {
		riskLevel: 'read',
		description: 'List users in an organization',
	},
	'organizations.createInvitation': {
		riskLevel: 'write',
		description: 'Invite people to an organization by email',
	},
	'organizations.getPlans': {
		riskLevel: 'read',
		description: 'Get billing and plan details for an organization',
	},
	'organizations.getSubscriptionPlans': {
		riskLevel: 'read',
		description: 'List subscription plans available to an organization',
	},
	'workspaces.getLogo': {
		riskLevel: 'read',
		description: 'Get the workspace logo URL',
	},
	'workspaces.getPreferences': {
		riskLevel: 'read',
		description: 'Get workspace preferences',
	},
	'projects.addUser': {
		riskLevel: 'write',
		description: 'Add a user to a project',
	},
	'projects.deleteGroup': {
		riskLevel: 'destructive',
		description: 'Delete a project group',
	},
	'timeEntries.bulkEdit': {
		riskLevel: 'write',
		description: 'Bulk edit up to 100 time entries with JSON Patch',
	},
	'webhooks.getStatus': {
		riskLevel: 'read',
		description: 'Check the Toggl webhooks service status',
	},
	'webhooks.getEventFilters': {
		riskLevel: 'read',
		description: 'List event types available for webhook subscriptions',
	},
	'webhooks.listSubscriptions': {
		riskLevel: 'read',
		description: 'List webhook subscriptions for a workspace',
	},
	'webhooks.deleteSubscription': {
		riskLevel: 'destructive',
		description: 'Delete a webhook subscription',
	},
	'smail.sendDemo': {
		riskLevel: 'write',
		description: 'Send a product demo request email',
	},
	'smail.sendContact': {
		riskLevel: 'write',
		description: 'Send an email to a contact',
	},
	'smail.sendMeet': {
		riskLevel: 'write',
		description: 'Send a meeting invitation email',
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

/**
 * Builds the Toggl Track plugin.
 *
 * Toggl authenticates with a per-user API token over HTTP Basic and has no
 * OAuth flow, so only `api_key` auth is offered.
 */
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
