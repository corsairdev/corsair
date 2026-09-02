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
import {
	deleteBuild,
	downloadBuildLog,
	getBuildArtifacts,
	getBuildByVersion,
	getProjectBadge,
	getProjectBranchBadge,
	getPublicProjectBadge,
	getRole,
	listCollaborators,
	listEnvironments,
	listProjects,
	listRoles,
	listUserInvitations,
	listUsers,
} from './endpoints';
import type { EndpointInputs, EndpointOutputs } from './endpoints/types';
import { EndpointInputSchemas, EndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AppVeyorSchema } from './schema';

export type AppVeyorPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAppVeyorPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof appveyorEndpointsNested>;
};

export type AppVeyorContext = CorsairPluginContext<
	typeof AppVeyorSchema,
	AppVeyorPluginOptions
>;
export type AppVeyorKeyBuilderContext =
	KeyBuilderContext<AppVeyorPluginOptions>;
export type AppVeyorEndpoint<K extends keyof EndpointOutputs> = CorsairEndpoint<
	AppVeyorContext,
	EndpointInputs[K],
	EndpointOutputs[K]
>;

export type AppVeyorEndpoints = {
	builds: {
		delete: AppVeyorEndpoint<'buildsDelete'>;
		downloadLog: AppVeyorEndpoint<'buildsDownloadLog'>;
		getArtifacts: AppVeyorEndpoint<'buildsGetArtifacts'>;
		getByVersion: AppVeyorEndpoint<'buildsGetByVersion'>;
	};
	environments: { list: AppVeyorEndpoint<'environmentsList'> };
	projects: {
		getBranchStatusBadge: AppVeyorEndpoint<'projectsGetBranchBadge'>;
		getStatusBadge: AppVeyorEndpoint<'projectsGetBadge'>;
		list: AppVeyorEndpoint<'projectsList'>;
		getPublicStatusBadge: AppVeyorEndpoint<'projectsGetPublicBadge'>;
	};
	roles: {
		get: AppVeyorEndpoint<'rolesGet'>;
		list: AppVeyorEndpoint<'rolesList'>;
	};
	users: {
		listInvitations: AppVeyorEndpoint<'usersInvitationsList'>;
		list: AppVeyorEndpoint<'usersList'>;
	};
	collaborators: { list: AppVeyorEndpoint<'collaboratorsList'> };
};

const appveyorEndpointsNested = {
	builds: {
		delete: deleteBuild,
		downloadLog: downloadBuildLog,
		getArtifacts: getBuildArtifacts,
		getByVersion: getBuildByVersion,
	},
	environments: { list: listEnvironments },
	projects: {
		getBranchStatusBadge: getProjectBranchBadge,
		getStatusBadge: getProjectBadge,
		list: listProjects,
		getPublicStatusBadge: getPublicProjectBadge,
	},
	roles: { get: getRole, list: listRoles },
	users: { listInvitations: listUserInvitations, list: listUsers },
	collaborators: { list: listCollaborators },
} as const;

export const appveyorEndpointSchemas = {
	'builds.delete': {
		input: EndpointInputSchemas.buildsDelete,
		output: EndpointOutputSchemas.buildsDelete,
	},
	'builds.downloadLog': {
		input: EndpointInputSchemas.buildsDownloadLog,
		output: EndpointOutputSchemas.buildsDownloadLog,
	},
	'builds.getArtifacts': {
		input: EndpointInputSchemas.buildsGetArtifacts,
		output: EndpointOutputSchemas.buildsGetArtifacts,
	},
	'builds.getByVersion': {
		input: EndpointInputSchemas.buildsGetByVersion,
		output: EndpointOutputSchemas.buildsGetByVersion,
	},
	'environments.list': {
		input: EndpointInputSchemas.environmentsList,
		output: EndpointOutputSchemas.environmentsList,
	},
	'projects.getBranchStatusBadge': {
		input: EndpointInputSchemas.projectsGetBranchBadge,
		output: EndpointOutputSchemas.projectsGetBranchBadge,
	},
	'projects.getStatusBadge': {
		input: EndpointInputSchemas.projectsGetBadge,
		output: EndpointOutputSchemas.projectsGetBadge,
	},
	'projects.list': {
		input: EndpointInputSchemas.projectsList,
		output: EndpointOutputSchemas.projectsList,
	},
	'projects.getPublicStatusBadge': {
		input: EndpointInputSchemas.projectsGetPublicBadge,
		output: EndpointOutputSchemas.projectsGetPublicBadge,
	},
	'roles.get': {
		input: EndpointInputSchemas.rolesGet,
		output: EndpointOutputSchemas.rolesGet,
	},
	'roles.list': {
		input: EndpointInputSchemas.rolesList,
		output: EndpointOutputSchemas.rolesList,
	},
	'users.listInvitations': {
		input: EndpointInputSchemas.usersInvitationsList,
		output: EndpointOutputSchemas.usersInvitationsList,
	},
	'users.list': {
		input: EndpointInputSchemas.usersList,
		output: EndpointOutputSchemas.usersList,
	},
	'collaborators.list': {
		input: EndpointInputSchemas.collaboratorsList,
		output: EndpointOutputSchemas.collaboratorsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof appveyorEndpointsNested
>;

const appveyorEndpointMeta = {
	'builds.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a build',
	},
	'builds.downloadLog': {
		riskLevel: 'read',
		description: 'Download a build job log',
	},
	'builds.getArtifacts': {
		riskLevel: 'read',
		description: 'Get build artifacts',
	},
	'builds.getByVersion': {
		riskLevel: 'read',
		description: 'Get a build by version',
	},
	'environments.list': {
		riskLevel: 'read',
		description: 'List deployment environments',
	},
	'projects.getBranchStatusBadge': {
		riskLevel: 'read',
		description: 'Get a project branch status badge',
	},
	'projects.getStatusBadge': {
		riskLevel: 'read',
		description: 'Get a project status badge',
	},
	'projects.list': { riskLevel: 'read', description: 'List AppVeyor projects' },
	'projects.getPublicStatusBadge': {
		riskLevel: 'read',
		description: 'Get a public project status badge',
	},
	'roles.get': { riskLevel: 'read', description: 'Get a role' },
	'roles.list': { riskLevel: 'read', description: 'List roles' },
	'users.listInvitations': {
		riskLevel: 'read',
		description: 'List user invitations',
	},
	'users.list': { riskLevel: 'read', description: 'List users' },
	'collaborators.list': {
		riskLevel: 'read',
		description: 'List collaborators',
	},
} satisfies RequiredPluginEndpointMeta<typeof appveyorEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';
export const appveyorAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;
export type AppVeyorBoundEndpoints = BindEndpoints<
	typeof appveyorEndpointsNested
>;
export type BaseAppVeyorPlugin<T extends AppVeyorPluginOptions> = CorsairPlugin<
	'appveyor',
	typeof AppVeyorSchema,
	typeof appveyorEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;
export type InternalAppVeyorPlugin = BaseAppVeyorPlugin<AppVeyorPluginOptions>;
export type ExternalAppVeyorPlugin<T extends AppVeyorPluginOptions> =
	BaseAppVeyorPlugin<T>;

export function appveyor<const T extends AppVeyorPluginOptions>(
	incomingOptions: AppVeyorPluginOptions & T = {} as AppVeyorPluginOptions & T,
): ExternalAppVeyorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'appveyor',
		authConfig: appveyorAuthConfig,
		schema: AppVeyorSchema,
		options,
		hooks: options.hooks,
		endpoints: appveyorEndpointsNested,
		webhooks: {},
		endpointMeta: appveyorEndpointMeta,
		endpointSchemas: appveyorEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: AppVeyorKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('appveyor', 'api_key');
		},
	} satisfies InternalAppVeyorPlugin;
}

export * from './client';
export type { EndpointInputs, EndpointOutputs } from './endpoints/types';
