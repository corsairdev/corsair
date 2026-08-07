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
	ImagesEndpoints,
	OrganizationsEndpoints,
	RepositoriesEndpoints,
	TagsEndpoints,
	TeamsEndpoints,
	WebhooksEndpoints,
} from './endpoints';
import type {
	DockerHubEndpointInputs,
	DockerHubEndpointOutputs,
} from './endpoints/types';
import {
	DockerHubEndpointInputSchemas,
	DockerHubEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DockerHubSchema } from './schema';

export type DockerHubPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Personal Access Token override for scripts/demos. */
	key?: string;
	/** Username for optional JWT exchange (create org). */
	username?: string;
	hooks?: InternalDockerHubPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dockerHubEndpointsNested>;
};

export type DockerHubContext = CorsairPluginContext<
	typeof DockerHubSchema,
	DockerHubPluginOptions
>;

export type DockerHubKeyBuilderContext =
	KeyBuilderContext<DockerHubPluginOptions>;

export type DockerHubBoundEndpoints = BindEndpoints<
	typeof dockerHubEndpointsNested
>;

type DockerHubEndpoint<K extends keyof DockerHubEndpointOutputs> =
	CorsairEndpoint<
		DockerHubContext,
		DockerHubEndpointInputs[K],
		DockerHubEndpointOutputs[K]
	>;

export type DockerHubEndpoints = {
	repositoriesList: DockerHubEndpoint<'repositoriesList'>;
	repositoriesGet: DockerHubEndpoint<'repositoriesGet'>;
	repositoriesCreate: DockerHubEndpoint<'repositoriesCreate'>;
	repositoriesDelete: DockerHubEndpoint<'repositoriesDelete'>;
	tagsList: DockerHubEndpoint<'tagsList'>;
	tagsGet: DockerHubEndpoint<'tagsGet'>;
	tagsDelete: DockerHubEndpoint<'tagsDelete'>;
	imagesList: DockerHubEndpoint<'imagesList'>;
	imagesGet: DockerHubEndpoint<'imagesGet'>;
	imagesDelete: DockerHubEndpoint<'imagesDelete'>;
	organizationsList: DockerHubEndpoint<'organizationsList'>;
	organizationsCreate: DockerHubEndpoint<'organizationsCreate'>;
	organizationsDelete: DockerHubEndpoint<'organizationsDelete'>;
	organizationsListMembers: DockerHubEndpoint<'organizationsListMembers'>;
	organizationsAddMember: DockerHubEndpoint<'organizationsAddMember'>;
	organizationsRemoveMember: DockerHubEndpoint<'organizationsRemoveMember'>;
	organizationsListAccessTokens: DockerHubEndpoint<'organizationsListAccessTokens'>;
	teamsList: DockerHubEndpoint<'teamsList'>;
	teamsGet: DockerHubEndpoint<'teamsGet'>;
	teamsDelete: DockerHubEndpoint<'teamsDelete'>;
	teamsListMembers: DockerHubEndpoint<'teamsListMembers'>;
	teamsRemoveMember: DockerHubEndpoint<'teamsRemoveMember'>;
	webhooksList: DockerHubEndpoint<'webhooksList'>;
	webhooksGet: DockerHubEndpoint<'webhooksGet'>;
	webhooksCreate: DockerHubEndpoint<'webhooksCreate'>;
	webhooksDelete: DockerHubEndpoint<'webhooksDelete'>;
};

const dockerHubEndpointsNested = {
	repositories: {
		list: RepositoriesEndpoints.list,
		get: RepositoriesEndpoints.get,
		create: RepositoriesEndpoints.create,
		delete: RepositoriesEndpoints.delete,
	},
	tags: {
		list: TagsEndpoints.list,
		get: TagsEndpoints.get,
		delete: TagsEndpoints.delete,
	},
	images: {
		list: ImagesEndpoints.list,
		get: ImagesEndpoints.get,
		delete: ImagesEndpoints.delete,
	},
	organizations: {
		list: OrganizationsEndpoints.list,
		create: OrganizationsEndpoints.create,
		delete: OrganizationsEndpoints.delete,
		listMembers: OrganizationsEndpoints.listMembers,
		addMember: OrganizationsEndpoints.addMember,
		removeMember: OrganizationsEndpoints.removeMember,
		listAccessTokens: OrganizationsEndpoints.listAccessTokens,
	},
	teams: {
		list: TeamsEndpoints.list,
		get: TeamsEndpoints.get,
		delete: TeamsEndpoints.delete,
		listMembers: TeamsEndpoints.listMembers,
		removeMember: TeamsEndpoints.removeMember,
	},
	webhooks: {
		list: WebhooksEndpoints.list,
		get: WebhooksEndpoints.get,
		create: WebhooksEndpoints.create,
		delete: WebhooksEndpoints.delete,
	},
} as const;

export const dockerHubEndpointSchemas = {
	'repositories.list': {
		input: DockerHubEndpointInputSchemas.repositoriesList,
		output: DockerHubEndpointOutputSchemas.repositoriesList,
	},
	'repositories.get': {
		input: DockerHubEndpointInputSchemas.repositoriesGet,
		output: DockerHubEndpointOutputSchemas.repositoriesGet,
	},
	'repositories.create': {
		input: DockerHubEndpointInputSchemas.repositoriesCreate,
		output: DockerHubEndpointOutputSchemas.repositoriesCreate,
	},
	'repositories.delete': {
		input: DockerHubEndpointInputSchemas.repositoriesDelete,
		output: DockerHubEndpointOutputSchemas.repositoriesDelete,
	},
	'tags.list': {
		input: DockerHubEndpointInputSchemas.tagsList,
		output: DockerHubEndpointOutputSchemas.tagsList,
	},
	'tags.get': {
		input: DockerHubEndpointInputSchemas.tagsGet,
		output: DockerHubEndpointOutputSchemas.tagsGet,
	},
	'tags.delete': {
		input: DockerHubEndpointInputSchemas.tagsDelete,
		output: DockerHubEndpointOutputSchemas.tagsDelete,
	},
	'images.list': {
		input: DockerHubEndpointInputSchemas.imagesList,
		output: DockerHubEndpointOutputSchemas.imagesList,
	},
	'images.get': {
		input: DockerHubEndpointInputSchemas.imagesGet,
		output: DockerHubEndpointOutputSchemas.imagesGet,
	},
	'images.delete': {
		input: DockerHubEndpointInputSchemas.imagesDelete,
		output: DockerHubEndpointOutputSchemas.imagesDelete,
	},
	'organizations.list': {
		input: DockerHubEndpointInputSchemas.organizationsList,
		output: DockerHubEndpointOutputSchemas.organizationsList,
	},
	'organizations.create': {
		input: DockerHubEndpointInputSchemas.organizationsCreate,
		output: DockerHubEndpointOutputSchemas.organizationsCreate,
	},
	'organizations.delete': {
		input: DockerHubEndpointInputSchemas.organizationsDelete,
		output: DockerHubEndpointOutputSchemas.organizationsDelete,
	},
	'organizations.listMembers': {
		input: DockerHubEndpointInputSchemas.organizationsListMembers,
		output: DockerHubEndpointOutputSchemas.organizationsListMembers,
	},
	'organizations.addMember': {
		input: DockerHubEndpointInputSchemas.organizationsAddMember,
		output: DockerHubEndpointOutputSchemas.organizationsAddMember,
	},
	'organizations.removeMember': {
		input: DockerHubEndpointInputSchemas.organizationsRemoveMember,
		output: DockerHubEndpointOutputSchemas.organizationsRemoveMember,
	},
	'organizations.listAccessTokens': {
		input: DockerHubEndpointInputSchemas.organizationsListAccessTokens,
		output: DockerHubEndpointOutputSchemas.organizationsListAccessTokens,
	},
	'teams.list': {
		input: DockerHubEndpointInputSchemas.teamsList,
		output: DockerHubEndpointOutputSchemas.teamsList,
	},
	'teams.get': {
		input: DockerHubEndpointInputSchemas.teamsGet,
		output: DockerHubEndpointOutputSchemas.teamsGet,
	},
	'teams.delete': {
		input: DockerHubEndpointInputSchemas.teamsDelete,
		output: DockerHubEndpointOutputSchemas.teamsDelete,
	},
	'teams.listMembers': {
		input: DockerHubEndpointInputSchemas.teamsListMembers,
		output: DockerHubEndpointOutputSchemas.teamsListMembers,
	},
	'teams.removeMember': {
		input: DockerHubEndpointInputSchemas.teamsRemoveMember,
		output: DockerHubEndpointOutputSchemas.teamsRemoveMember,
	},
	'webhooks.list': {
		input: DockerHubEndpointInputSchemas.webhooksList,
		output: DockerHubEndpointOutputSchemas.webhooksList,
	},
	'webhooks.get': {
		input: DockerHubEndpointInputSchemas.webhooksGet,
		output: DockerHubEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.create': {
		input: DockerHubEndpointInputSchemas.webhooksCreate,
		output: DockerHubEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.delete': {
		input: DockerHubEndpointInputSchemas.webhooksDelete,
		output: DockerHubEndpointOutputSchemas.webhooksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dockerHubEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dockerHubEndpointMeta = {
	'repositories.list': {
		riskLevel: 'read',
		description: 'List repositories under a namespace',
	},
	'repositories.get': {
		riskLevel: 'read',
		description: 'Get repository metadata',
	},
	'repositories.create': {
		riskLevel: 'write',
		description: 'Create a repository under a namespace',
	},
	'repositories.delete': {
		riskLevel: 'destructive',
		description: 'Delete a repository (idempotent)',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List tags for a repository',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Get a specific repository tag',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		description: 'Delete a repository tag',
	},
	'images.list': {
		riskLevel: 'read',
		description: 'List platform image variants (from tags)',
	},
	'images.get': {
		riskLevel: 'read',
		description: 'Get image variant by digest',
	},
	'images.delete': {
		riskLevel: 'destructive',
		description: 'Bulk-delete images by digest',
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List organizations for the authenticated user',
	},
	'organizations.create': {
		riskLevel: 'write',
		description: 'Create a Docker Hub organization',
	},
	'organizations.delete': {
		riskLevel: 'destructive',
		description: 'Delete an organization (idempotent)',
	},
	'organizations.listMembers': {
		riskLevel: 'read',
		description: 'List organization members',
	},
	'organizations.addMember': {
		riskLevel: 'write',
		description: 'Invite a member to an organization',
	},
	'organizations.removeMember': {
		riskLevel: 'destructive',
		description: 'Remove a member from an organization',
	},
	'organizations.listAccessTokens': {
		riskLevel: 'read',
		description: 'List organization access tokens',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List teams (groups) in an organization',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Get team details',
	},
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Delete a team (idempotent)',
	},
	'teams.listMembers': {
		riskLevel: 'read',
		description: 'List team members',
	},
	'teams.removeMember': {
		riskLevel: 'destructive',
		description: 'Remove a member from a team',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List repository webhooks',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get a repository webhook',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a repository webhook with hook URL',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a repository webhook',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dockerHubEndpointsNested
>;

export const dockerHubAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDockerHubPlugin<T extends DockerHubPluginOptions> =
	CorsairPlugin<
		'dockerhub',
		typeof DockerHubSchema,
		typeof dockerHubEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalDockerHubPlugin =
	BaseDockerHubPlugin<DockerHubPluginOptions>;

export type ExternalDockerHubPlugin<T extends DockerHubPluginOptions> =
	BaseDockerHubPlugin<T>;

export function dockerhub<const T extends DockerHubPluginOptions>(
	// cast: empty default satisfies generic T when callers omit options
	incomingOptions: DockerHubPluginOptions & T = {} as DockerHubPluginOptions &
		T,
): ExternalDockerHubPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dockerhub',
		authConfig: dockerHubAuthConfig,
		schema: DockerHubSchema,
		options,
		hooks: options.hooks,
		endpoints: dockerHubEndpointsNested,
		webhooks: {},
		endpointMeta: dockerHubEndpointMeta,
		endpointSchemas: dockerHubEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DockerHubKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				// Public GETs work without a token
				return res ?? '';
			}
			if (source === 'endpoint') {
				throw new AuthMissingError(
					'api_key',
					'Docker Hub Personal Access Token is required',
				);
			}
			return '';
		},
	} satisfies InternalDockerHubPlugin;
}

export type {
	DockerHubEndpointInputs,
	DockerHubEndpointOutputs,
} from './endpoints/types';
