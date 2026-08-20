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
	ActivityLogs,
	Auth,
	ChangeRequests,
	ConfigLogs,
	Configs,
	DynamicSecrets,
	Environments,
	Groups,
	Integrations,
	Invites,
	ProjectMembers,
	ProjectRoles,
	Projects,
	Secrets,
	ServiceTokens,
	Share,
	Webhooks,
	Workplace,
	WorkplaceRoles,
	WorkplaceUsers,
} from './endpoints';
import type {
	DopplerEndpointInputs,
	DopplerEndpointOutputs,
} from './endpoints/types';
import {
	DopplerEndpointInputSchemas,
	DopplerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DopplerSchema } from './schema';

export type DopplerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDopplerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dopplerEndpointsNested>;
};

/**
 * Doppler authenticates with a single personal (or service) API token across
 * both transports - the documented `/v3` REST API and Doppler Share's
 * `/v1/share` routes. Confirmed live: `/v1/share`'s own spec fragment
 * declares HTTP Basic, but a Bearer token works identically. See
 * `client.ts`.
 */
export const dopplerAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type DopplerContext = CorsairPluginContext<
	typeof DopplerSchema,
	DopplerPluginOptions,
	undefined,
	typeof dopplerAuthConfig
>;

export type DopplerKeyBuilderContext = KeyBuilderContext<DopplerPluginOptions>;

export type DopplerBoundEndpoints = BindEndpoints<
	typeof dopplerEndpointsNested
>;

type DopplerEndpoint<K extends keyof DopplerEndpointOutputs> = CorsairEndpoint<
	DopplerContext,
	DopplerEndpointInputs[K],
	DopplerEndpointOutputs[K]
>;

export type DopplerEndpoints = {
	workplaceGet: DopplerEndpoint<'workplaceGet'>;
	workplaceUpdate: DopplerEndpoint<'workplaceUpdate'>;

	workplaceUsersList: DopplerEndpoint<'workplaceUsersList'>;
	workplaceUsersGet: DopplerEndpoint<'workplaceUsersGet'>;

	workplaceRolesList: DopplerEndpoint<'workplaceRolesList'>;
	workplaceRolesGet: DopplerEndpoint<'workplaceRolesGet'>;
	workplaceRolesListPermissions: DopplerEndpoint<'workplaceRolesListPermissions'>;

	activityLogsList: DopplerEndpoint<'activityLogsList'>;
	activityLogsRetrieve: DopplerEndpoint<'activityLogsRetrieve'>;

	projectsList: DopplerEndpoint<'projectsList'>;
	projectsCreate: DopplerEndpoint<'projectsCreate'>;
	projectsGet: DopplerEndpoint<'projectsGet'>;
	projectsUpdate: DopplerEndpoint<'projectsUpdate'>;
	projectsDelete: DopplerEndpoint<'projectsDelete'>;

	projectRolesList: DopplerEndpoint<'projectRolesList'>;
	projectRolesGet: DopplerEndpoint<'projectRolesGet'>;
	projectRolesListPermissions: DopplerEndpoint<'projectRolesListPermissions'>;

	projectMembersList: DopplerEndpoint<'projectMembersList'>;
	projectMembersGet: DopplerEndpoint<'projectMembersGet'>;
	projectMembersDelete: DopplerEndpoint<'projectMembersDelete'>;

	environmentsList: DopplerEndpoint<'environmentsList'>;
	environmentsCreate: DopplerEndpoint<'environmentsCreate'>;
	environmentsGet: DopplerEndpoint<'environmentsGet'>;
	environmentsDelete: DopplerEndpoint<'environmentsDelete'>;
	environmentsRename: DopplerEndpoint<'environmentsRename'>;

	configsList: DopplerEndpoint<'configsList'>;
	configsCreate: DopplerEndpoint<'configsCreate'>;
	configsGet: DopplerEndpoint<'configsGet'>;
	configsUpdate: DopplerEndpoint<'configsUpdate'>;
	configsDelete: DopplerEndpoint<'configsDelete'>;
	configsClone: DopplerEndpoint<'configsClone'>;
	configsLock: DopplerEndpoint<'configsLock'>;
	configsUnlock: DopplerEndpoint<'configsUnlock'>;

	configLogsList: DopplerEndpoint<'configLogsList'>;
	configLogsGet: DopplerEndpoint<'configLogsGet'>;
	configLogsRollback: DopplerEndpoint<'configLogsRollback'>;

	secretsList: DopplerEndpoint<'secretsList'>;
	secretsGet: DopplerEndpoint<'secretsGet'>;
	secretsDelete: DopplerEndpoint<'secretsDelete'>;
	secretsUpdate: DopplerEndpoint<'secretsUpdate'>;
	secretsDownload: DopplerEndpoint<'secretsDownload'>;
	secretsNames: DopplerEndpoint<'secretsNames'>;
	secretsUpdateNote: DopplerEndpoint<'secretsUpdateNote'>;
	secretsUpdateNoteViaConfig: DopplerEndpoint<'secretsUpdateNoteViaConfig'>;

	dynamicSecretsRevokeLease: DopplerEndpoint<'dynamicSecretsRevokeLease'>;

	serviceTokensList: DopplerEndpoint<'serviceTokensList'>;
	serviceTokensCreate: DopplerEndpoint<'serviceTokensCreate'>;
	serviceTokensDelete: DopplerEndpoint<'serviceTokensDelete'>;

	integrationsList: DopplerEndpoint<'integrationsList'>;

	invitesList: DopplerEndpoint<'invitesList'>;

	groupsDeleteMember: DopplerEndpoint<'groupsDeleteMember'>;

	webhooksList: DopplerEndpoint<'webhooksList'>;
	webhooksAdd: DopplerEndpoint<'webhooksAdd'>;
	webhooksGet: DopplerEndpoint<'webhooksGet'>;
	webhooksUpdate: DopplerEndpoint<'webhooksUpdate'>;
	webhooksDelete: DopplerEndpoint<'webhooksDelete'>;
	webhooksEnable: DopplerEndpoint<'webhooksEnable'>;
	webhooksDisable: DopplerEndpoint<'webhooksDisable'>;

	changeRequestsList: DopplerEndpoint<'changeRequestsList'>;

	shareCreatePlain: DopplerEndpoint<'shareCreatePlain'>;
	shareCreateEncrypted: DopplerEndpoint<'shareCreateEncrypted'>;

	authMe: DopplerEndpoint<'authMe'>;
};

const dopplerEndpointsNested = {
	workplace: {
		get: Workplace.get,
		update: Workplace.update,
	},
	workplaceUsers: {
		list: WorkplaceUsers.list,
		get: WorkplaceUsers.get,
	},
	workplaceRoles: {
		list: WorkplaceRoles.list,
		get: WorkplaceRoles.get,
		listPermissions: WorkplaceRoles.listPermissions,
	},
	activityLogs: {
		list: ActivityLogs.list,
		retrieve: ActivityLogs.retrieve,
	},
	projects: {
		list: Projects.list,
		create: Projects.create,
		get: Projects.get,
		update: Projects.update,
		delete: Projects.remove,
	},
	projectRoles: {
		list: ProjectRoles.list,
		get: ProjectRoles.get,
		listPermissions: ProjectRoles.listPermissions,
	},
	projectMembers: {
		list: ProjectMembers.list,
		get: ProjectMembers.get,
		delete: ProjectMembers.remove,
	},
	environments: {
		list: Environments.list,
		create: Environments.create,
		get: Environments.get,
		delete: Environments.remove,
		rename: Environments.rename,
	},
	configs: {
		list: Configs.list,
		create: Configs.create,
		get: Configs.get,
		update: Configs.update,
		delete: Configs.remove,
		clone: Configs.clone,
		lock: Configs.lock,
		unlock: Configs.unlock,
	},
	configLogs: {
		list: ConfigLogs.list,
		get: ConfigLogs.get,
		rollback: ConfigLogs.rollback,
	},
	secrets: {
		list: Secrets.list,
		get: Secrets.get,
		delete: Secrets.remove,
		update: Secrets.update,
		download: Secrets.download,
		names: Secrets.names,
		updateNote: Secrets.updateNote,
		updateNoteViaConfig: Secrets.updateNoteViaConfig,
	},
	dynamicSecrets: {
		revokeLease: DynamicSecrets.revokeLease,
	},
	serviceTokens: {
		list: ServiceTokens.list,
		create: ServiceTokens.create,
		delete: ServiceTokens.remove,
	},
	integrations: {
		list: Integrations.list,
	},
	invites: {
		list: Invites.list,
	},
	groups: {
		deleteMember: Groups.deleteMember,
	},
	webhooks: {
		list: Webhooks.list,
		add: Webhooks.add,
		get: Webhooks.get,
		update: Webhooks.update,
		delete: Webhooks.remove,
		enable: Webhooks.enable,
		disable: Webhooks.disable,
	},
	changeRequests: {
		list: ChangeRequests.list,
	},
	share: {
		createPlain: Share.createPlain,
		createEncrypted: Share.createEncrypted,
	},
	auth: {
		me: Auth.me,
	},
} as const;

export const dopplerEndpointSchemas = {
	'workplace.get': {
		input: DopplerEndpointInputSchemas.workplaceGet,
		output: DopplerEndpointOutputSchemas.workplaceGet,
	},
	'workplace.update': {
		input: DopplerEndpointInputSchemas.workplaceUpdate,
		output: DopplerEndpointOutputSchemas.workplaceUpdate,
	},

	'workplaceUsers.list': {
		input: DopplerEndpointInputSchemas.workplaceUsersList,
		output: DopplerEndpointOutputSchemas.workplaceUsersList,
	},
	'workplaceUsers.get': {
		input: DopplerEndpointInputSchemas.workplaceUsersGet,
		output: DopplerEndpointOutputSchemas.workplaceUsersGet,
	},

	'workplaceRoles.list': {
		input: DopplerEndpointInputSchemas.workplaceRolesList,
		output: DopplerEndpointOutputSchemas.workplaceRolesList,
	},
	'workplaceRoles.get': {
		input: DopplerEndpointInputSchemas.workplaceRolesGet,
		output: DopplerEndpointOutputSchemas.workplaceRolesGet,
	},
	'workplaceRoles.listPermissions': {
		input: DopplerEndpointInputSchemas.workplaceRolesListPermissions,
		output: DopplerEndpointOutputSchemas.workplaceRolesListPermissions,
	},

	'activityLogs.list': {
		input: DopplerEndpointInputSchemas.activityLogsList,
		output: DopplerEndpointOutputSchemas.activityLogsList,
	},
	'activityLogs.retrieve': {
		input: DopplerEndpointInputSchemas.activityLogsRetrieve,
		output: DopplerEndpointOutputSchemas.activityLogsRetrieve,
	},

	'projects.list': {
		input: DopplerEndpointInputSchemas.projectsList,
		output: DopplerEndpointOutputSchemas.projectsList,
	},
	'projects.create': {
		input: DopplerEndpointInputSchemas.projectsCreate,
		output: DopplerEndpointOutputSchemas.projectsCreate,
	},
	'projects.get': {
		input: DopplerEndpointInputSchemas.projectsGet,
		output: DopplerEndpointOutputSchemas.projectsGet,
	},
	'projects.update': {
		input: DopplerEndpointInputSchemas.projectsUpdate,
		output: DopplerEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: DopplerEndpointInputSchemas.projectsDelete,
		output: DopplerEndpointOutputSchemas.projectsDelete,
	},

	'projectRoles.list': {
		input: DopplerEndpointInputSchemas.projectRolesList,
		output: DopplerEndpointOutputSchemas.projectRolesList,
	},
	'projectRoles.get': {
		input: DopplerEndpointInputSchemas.projectRolesGet,
		output: DopplerEndpointOutputSchemas.projectRolesGet,
	},
	'projectRoles.listPermissions': {
		input: DopplerEndpointInputSchemas.projectRolesListPermissions,
		output: DopplerEndpointOutputSchemas.projectRolesListPermissions,
	},

	'projectMembers.list': {
		input: DopplerEndpointInputSchemas.projectMembersList,
		output: DopplerEndpointOutputSchemas.projectMembersList,
	},
	'projectMembers.get': {
		input: DopplerEndpointInputSchemas.projectMembersGet,
		output: DopplerEndpointOutputSchemas.projectMembersGet,
	},
	'projectMembers.delete': {
		input: DopplerEndpointInputSchemas.projectMembersDelete,
		output: DopplerEndpointOutputSchemas.projectMembersDelete,
	},

	'environments.list': {
		input: DopplerEndpointInputSchemas.environmentsList,
		output: DopplerEndpointOutputSchemas.environmentsList,
	},
	'environments.create': {
		input: DopplerEndpointInputSchemas.environmentsCreate,
		output: DopplerEndpointOutputSchemas.environmentsCreate,
	},
	'environments.get': {
		input: DopplerEndpointInputSchemas.environmentsGet,
		output: DopplerEndpointOutputSchemas.environmentsGet,
	},
	'environments.delete': {
		input: DopplerEndpointInputSchemas.environmentsDelete,
		output: DopplerEndpointOutputSchemas.environmentsDelete,
	},
	'environments.rename': {
		input: DopplerEndpointInputSchemas.environmentsRename,
		output: DopplerEndpointOutputSchemas.environmentsRename,
	},

	'configs.list': {
		input: DopplerEndpointInputSchemas.configsList,
		output: DopplerEndpointOutputSchemas.configsList,
	},
	'configs.create': {
		input: DopplerEndpointInputSchemas.configsCreate,
		output: DopplerEndpointOutputSchemas.configsCreate,
	},
	'configs.get': {
		input: DopplerEndpointInputSchemas.configsGet,
		output: DopplerEndpointOutputSchemas.configsGet,
	},
	'configs.update': {
		input: DopplerEndpointInputSchemas.configsUpdate,
		output: DopplerEndpointOutputSchemas.configsUpdate,
	},
	'configs.delete': {
		input: DopplerEndpointInputSchemas.configsDelete,
		output: DopplerEndpointOutputSchemas.configsDelete,
	},
	'configs.clone': {
		input: DopplerEndpointInputSchemas.configsClone,
		output: DopplerEndpointOutputSchemas.configsClone,
	},
	'configs.lock': {
		input: DopplerEndpointInputSchemas.configsLock,
		output: DopplerEndpointOutputSchemas.configsLock,
	},
	'configs.unlock': {
		input: DopplerEndpointInputSchemas.configsUnlock,
		output: DopplerEndpointOutputSchemas.configsUnlock,
	},

	'configLogs.list': {
		input: DopplerEndpointInputSchemas.configLogsList,
		output: DopplerEndpointOutputSchemas.configLogsList,
	},
	'configLogs.get': {
		input: DopplerEndpointInputSchemas.configLogsGet,
		output: DopplerEndpointOutputSchemas.configLogsGet,
	},
	'configLogs.rollback': {
		input: DopplerEndpointInputSchemas.configLogsRollback,
		output: DopplerEndpointOutputSchemas.configLogsRollback,
	},

	'secrets.list': {
		input: DopplerEndpointInputSchemas.secretsList,
		output: DopplerEndpointOutputSchemas.secretsList,
	},
	'secrets.get': {
		input: DopplerEndpointInputSchemas.secretsGet,
		output: DopplerEndpointOutputSchemas.secretsGet,
	},
	'secrets.delete': {
		input: DopplerEndpointInputSchemas.secretsDelete,
		output: DopplerEndpointOutputSchemas.secretsDelete,
	},
	'secrets.update': {
		input: DopplerEndpointInputSchemas.secretsUpdate,
		output: DopplerEndpointOutputSchemas.secretsUpdate,
	},
	'secrets.download': {
		input: DopplerEndpointInputSchemas.secretsDownload,
		output: DopplerEndpointOutputSchemas.secretsDownload,
	},
	'secrets.names': {
		input: DopplerEndpointInputSchemas.secretsNames,
		output: DopplerEndpointOutputSchemas.secretsNames,
	},
	'secrets.updateNote': {
		input: DopplerEndpointInputSchemas.secretsUpdateNote,
		output: DopplerEndpointOutputSchemas.secretsUpdateNote,
	},
	'secrets.updateNoteViaConfig': {
		input: DopplerEndpointInputSchemas.secretsUpdateNoteViaConfig,
		output: DopplerEndpointOutputSchemas.secretsUpdateNoteViaConfig,
	},

	'dynamicSecrets.revokeLease': {
		input: DopplerEndpointInputSchemas.dynamicSecretsRevokeLease,
		output: DopplerEndpointOutputSchemas.dynamicSecretsRevokeLease,
	},

	'serviceTokens.list': {
		input: DopplerEndpointInputSchemas.serviceTokensList,
		output: DopplerEndpointOutputSchemas.serviceTokensList,
	},
	'serviceTokens.create': {
		input: DopplerEndpointInputSchemas.serviceTokensCreate,
		output: DopplerEndpointOutputSchemas.serviceTokensCreate,
	},
	'serviceTokens.delete': {
		input: DopplerEndpointInputSchemas.serviceTokensDelete,
		output: DopplerEndpointOutputSchemas.serviceTokensDelete,
	},

	'integrations.list': {
		input: DopplerEndpointInputSchemas.integrationsList,
		output: DopplerEndpointOutputSchemas.integrationsList,
	},

	'invites.list': {
		input: DopplerEndpointInputSchemas.invitesList,
		output: DopplerEndpointOutputSchemas.invitesList,
	},

	'groups.deleteMember': {
		input: DopplerEndpointInputSchemas.groupsDeleteMember,
		output: DopplerEndpointOutputSchemas.groupsDeleteMember,
	},

	'webhooks.list': {
		input: DopplerEndpointInputSchemas.webhooksList,
		output: DopplerEndpointOutputSchemas.webhooksList,
	},
	'webhooks.add': {
		input: DopplerEndpointInputSchemas.webhooksAdd,
		output: DopplerEndpointOutputSchemas.webhooksAdd,
	},
	'webhooks.get': {
		input: DopplerEndpointInputSchemas.webhooksGet,
		output: DopplerEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.update': {
		input: DopplerEndpointInputSchemas.webhooksUpdate,
		output: DopplerEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: DopplerEndpointInputSchemas.webhooksDelete,
		output: DopplerEndpointOutputSchemas.webhooksDelete,
	},
	'webhooks.enable': {
		input: DopplerEndpointInputSchemas.webhooksEnable,
		output: DopplerEndpointOutputSchemas.webhooksEnable,
	},
	'webhooks.disable': {
		input: DopplerEndpointInputSchemas.webhooksDisable,
		output: DopplerEndpointOutputSchemas.webhooksDisable,
	},

	'changeRequests.list': {
		input: DopplerEndpointInputSchemas.changeRequestsList,
		output: DopplerEndpointOutputSchemas.changeRequestsList,
	},

	'share.createPlain': {
		input: DopplerEndpointInputSchemas.shareCreatePlain,
		output: DopplerEndpointOutputSchemas.shareCreatePlain,
	},
	'share.createEncrypted': {
		input: DopplerEndpointInputSchemas.shareCreateEncrypted,
		output: DopplerEndpointOutputSchemas.shareCreateEncrypted,
	},

	'auth.me': {
		input: DopplerEndpointInputSchemas.authMe,
		output: DopplerEndpointOutputSchemas.authMe,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dopplerEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

/**
 * Risk levels.
 *
 * `destructive` for anything Doppler cannot undo through this plugin:
 * deleting a project/environment/config/secret/webhook/service token,
 * revoking a lease, or removing a member. `write` covers everything else
 * that changes state, including `configs.lock`/`unlock` (they prevent
 * rename/delete, not secret writes) and
 * `configLogs.rollback` (it *reverts* a change but does so by writing new
 * secret values, the same reasoning CircleCI's `pipelines.trigger` used).
 * `secrets.updateNote`/`updateNoteViaConfig` are `write`, not `destructive`,
 * since a note has no independent value to lose - overwriting it is exactly
 * what the operation is for.
 */
export const dopplerEndpointMeta = {
	'workplace.get': { riskLevel: 'read', description: 'Retrieve the workplace' },
	'workplace.update': {
		riskLevel: 'write',
		description:
			"Update the workplace's name, billing email, or security email",
	},

	'workplaceUsers.list': {
		riskLevel: 'read',
		description: 'List users in the workplace',
	},
	'workplaceUsers.get': {
		riskLevel: 'read',
		description: 'Retrieve a workplace user by id',
	},

	'workplaceRoles.list': {
		riskLevel: 'read',
		description: 'List workplace roles',
	},
	'workplaceRoles.get': {
		riskLevel: 'read',
		description: 'Retrieve a workplace role',
	},
	'workplaceRoles.listPermissions': {
		riskLevel: 'read',
		description: 'List permissions grantable to a workplace role',
	},

	'activityLogs.list': {
		riskLevel: 'read',
		description: 'List workplace activity log entries',
	},
	'activityLogs.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single activity log entry',
	},

	'projects.list': { riskLevel: 'read', description: 'List projects' },
	'projects.create': { riskLevel: 'write', description: 'Create a project' },
	'projects.get': { riskLevel: 'read', description: 'Retrieve a project' },
	'projects.update': {
		riskLevel: 'write',
		description: "Update a project's name or description",
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a project and everything in it',
	},

	'projectRoles.list': {
		riskLevel: 'read',
		description: 'List project-level roles',
	},
	'projectRoles.get': {
		riskLevel: 'read',
		description: 'Retrieve a project-level role',
	},
	'projectRoles.listPermissions': {
		riskLevel: 'read',
		description: 'List permissions grantable to a project-level role',
	},

	'projectMembers.list': {
		riskLevel: 'read',
		description: "List a project's members",
	},
	'projectMembers.get': {
		riskLevel: 'read',
		description: 'Retrieve a project member',
	},
	'projectMembers.delete': {
		riskLevel: 'destructive',
		description: 'Remove a member from a project',
	},

	'environments.list': {
		riskLevel: 'read',
		description: "List a project's environments",
	},
	'environments.create': {
		riskLevel: 'write',
		description: 'Create an environment within a project',
	},
	'environments.get': {
		riskLevel: 'read',
		description: 'Retrieve an environment',
	},
	'environments.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete an environment and its configs',
	},
	'environments.rename': {
		riskLevel: 'write',
		description: "Rename an environment's display name or slug",
	},

	'configs.list': {
		riskLevel: 'read',
		description: "List a project's configs",
	},
	'configs.create': {
		riskLevel: 'write',
		description: 'Create a branch config within an environment',
	},
	'configs.get': { riskLevel: 'read', description: 'Retrieve a config' },
	'configs.update': { riskLevel: 'write', description: 'Rename a config' },
	'configs.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a config and its secrets',
	},
	'configs.clone': {
		riskLevel: 'write',
		description: 'Clone a config into a new branch config',
	},
	'configs.lock': {
		riskLevel: 'write',
		description: 'Lock a config so it cannot be renamed or deleted',
	},
	'configs.unlock': {
		riskLevel: 'write',
		description: 'Unlock a config so it can be renamed or deleted',
	},

	'configLogs.list': {
		riskLevel: 'read',
		description: "List a config's change-log entries",
	},
	'configLogs.get': {
		riskLevel: 'read',
		description: 'Retrieve a config log entry, including its secret diff',
	},
	'configLogs.rollback': {
		riskLevel: 'write',
		description: "Roll a config back to a prior log entry's state",
	},

	'secrets.list': {
		riskLevel: 'read',
		description: "List a config's secrets, values included",
	},
	'secrets.get': {
		riskLevel: 'read',
		description: "Retrieve a single secret's value",
	},
	'secrets.delete': {
		riskLevel: 'destructive',
		description: 'Delete a secret',
	},
	'secrets.update': {
		riskLevel: 'write',
		description: 'Bulk-set (or delete, via null) secrets in a config',
	},
	'secrets.download': {
		riskLevel: 'read',
		description: "Download a config's secrets in a given format",
	},
	'secrets.names': {
		riskLevel: 'read',
		description: "List a config's secret names, without values",
	},
	'secrets.updateNote': {
		riskLevel: 'write',
		description: "Set a secret's note (project-scoped route)",
	},
	'secrets.updateNoteViaConfig': {
		riskLevel: 'write',
		description: "Set a secret's note (config-scoped route)",
	},

	'dynamicSecrets.revokeLease': {
		riskLevel: 'destructive',
		description: 'Revoke a leased dynamic secret credential',
	},

	'serviceTokens.list': {
		riskLevel: 'read',
		description: "List a config's service tokens",
	},
	'serviceTokens.create': {
		riskLevel: 'write',
		description: 'Create a service token for a config',
	},
	'serviceTokens.delete': {
		riskLevel: 'destructive',
		description: 'Revoke a service token',
	},

	'integrations.list': {
		riskLevel: 'read',
		description: 'List third-party integrations',
	},

	'invites.list': {
		riskLevel: 'read',
		description: 'List pending workplace invites',
	},

	'groups.deleteMember': {
		riskLevel: 'destructive',
		description: 'Remove a member from a workplace group',
	},

	'webhooks.list': { riskLevel: 'read', description: 'List webhooks' },
	'webhooks.add': { riskLevel: 'write', description: 'Create a webhook' },
	'webhooks.get': { riskLevel: 'read', description: 'Retrieve a webhook' },
	'webhooks.update': { riskLevel: 'write', description: 'Update a webhook' },
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a webhook',
	},
	'webhooks.enable': { riskLevel: 'write', description: 'Enable a webhook' },
	'webhooks.disable': { riskLevel: 'write', description: 'Disable a webhook' },

	'changeRequests.list': {
		riskLevel: 'read',
		description: 'List change requests (Team/Enterprise plans only)',
	},

	'share.createPlain': {
		riskLevel: 'write',
		description: 'Create a Doppler Share link from a plaintext secret',
	},
	'share.createEncrypted': {
		riskLevel: 'write',
		description:
			'Create a Doppler Share link from a caller-encrypted payload (zero-knowledge)',
	},

	'auth.me': {
		riskLevel: 'read',
		description: 'Read information about the authenticated token',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof dopplerEndpointsNested>;

export type BaseDopplerPlugin<T extends DopplerPluginOptions> = CorsairPlugin<
	'doppler',
	typeof DopplerSchema,
	typeof dopplerEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalDopplerPlugin = BaseDopplerPlugin<DopplerPluginOptions>;

export type ExternalDopplerPlugin<T extends DopplerPluginOptions> =
	BaseDopplerPlugin<T>;

/**
 * The Doppler plugin.
 *
 * **No webhooks as triggers.** The catalog lists no inbound triggers for
 * this plugin; `webhooks.*` here manages Doppler's own outbound webhook
 * resource as ordinary write operations, the same treatment CircleCI gave
 * its webhook-shaped resources.
 *
 * **Two transports, one credential.** See `client.ts` for the full account:
 * the documented `/v3` REST API, and Doppler Share's `/v1/share` routes -
 * confirmed live to accept the same Bearer token despite Share's own spec
 * fragment declaring HTTP Basic.
 *
 * **No official downloadable spec.** Built from `DopplerHQ/cli`'s Go source
 * (Apache-2.0) plus the per-operation OpenAPI fragments embedded in
 * `docs.doppler.com/reference/*.md`, discovered via the `llms.txt` index
 * linked from the site's own `robots.txt`. All 62 catalog operations were
 * mapped and verified 62/62/0 gaps/0 duplicates before any endpoint code was
 * written.
 */
export function doppler<const T extends DopplerPluginOptions>(
	incomingOptions: DopplerPluginOptions & T = {} as DopplerPluginOptions & T,
): ExternalDopplerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'doppler',
		authConfig: dopplerAuthConfig,
		schema: DopplerSchema,
		options: options,
		hooks: options.hooks,
		endpoints: dopplerEndpointsNested,
		webhooks: {},
		endpointMeta: dopplerEndpointMeta,
		endpointSchemas: dopplerEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DopplerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}
			return '';
		},
	} satisfies InternalDopplerPlugin;
}

export type {
	DopplerEndpointInputs,
	DopplerEndpointOutputs,
} from './endpoints/types';
