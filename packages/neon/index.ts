import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type { NeonEndpointInputs, NeonEndpointOutputs } from './endpoints/types';
import { NeonEndpointInputSchemas, NeonEndpointOutputSchemas } from './endpoints/types';
import type {
	NeonWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Projects, Branches, Databases, Roles, Operations } from './endpoints';
import { NeonSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchNeonTenantWebhook } from './webhooks/tenant-matcher';
import { resolveNeonOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type NeonPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalNeonPlugin['hooks'];
	webhookHooks?: InternalNeonPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof neonEndpointsNested>;
};

export type NeonContext = CorsairPluginContext<
	typeof NeonSchema,
	NeonPluginOptions
>;

export type NeonKeyBuilderContext = KeyBuilderContext<NeonPluginOptions>;

export type NeonBoundEndpoints = BindEndpoints<typeof neonEndpointsNested>;

type NeonEndpoint<
	K extends keyof NeonEndpointOutputs,
> = CorsairEndpoint<
	NeonContext,
	NeonEndpointInputs[K],
	NeonEndpointOutputs[K]
>;

export type NeonEndpoints = {
	projectsList: NeonEndpoint<'projectsList'>;
	projectsGet: NeonEndpoint<'projectsGet'>;
	projectsCreate: NeonEndpoint<'projectsCreate'>;
	branchesList: NeonEndpoint<'branchesList'>;
	branchesGet: NeonEndpoint<'branchesGet'>;
	branchesCreate: NeonEndpoint<'branchesCreate'>;
	databasesList: NeonEndpoint<'databasesList'>;
	databasesCreate: NeonEndpoint<'databasesCreate'>;
	rolesList: NeonEndpoint<'rolesList'>;
	rolesCreate: NeonEndpoint<'rolesCreate'>;
	operationsGet: NeonEndpoint<'operationsGet'>;
};

type NeonWebhook<
	K extends keyof NeonWebhookOutputs,
	TEvent,
> = CorsairWebhook<NeonContext, TEvent, NeonWebhookOutputs[K]>;

export type NeonWebhooks = {
	example: NeonWebhook<'example', ExampleEvent>;
};

export type NeonBoundWebhooks = BindWebhooks<NeonWebhooks>;

const neonEndpointsNested = {
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
	},
	branches: {
		list: Branches.list,
		get: Branches.get,
		create: Branches.create,
	},
	databases: {
		list: Databases.list,
		create: Databases.create,
	},
	roles: {
		list: Roles.list,
		create: Roles.create,
	},
	operations: {
		get: Operations.get,
	},
} as const;

const neonWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const neonEndpointSchemas = {
	'projects.list': {
		input: NeonEndpointInputSchemas.projectsList,
		output: NeonEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: NeonEndpointInputSchemas.projectsGet,
		output: NeonEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: NeonEndpointInputSchemas.projectsCreate,
		output: NeonEndpointOutputSchemas.projectsCreate,
	},
	'branches.list': {
		input: NeonEndpointInputSchemas.branchesList,
		output: NeonEndpointOutputSchemas.branchesList,
	},
	'branches.get': {
		input: NeonEndpointInputSchemas.branchesGet,
		output: NeonEndpointOutputSchemas.branchesGet,
	},
	'branches.create': {
		input: NeonEndpointInputSchemas.branchesCreate,
		output: NeonEndpointOutputSchemas.branchesCreate,
	},
	'databases.list': {
		input: NeonEndpointInputSchemas.databasesList,
		output: NeonEndpointOutputSchemas.databasesList,
	},
	'databases.create': {
		input: NeonEndpointInputSchemas.databasesCreate,
		output: NeonEndpointOutputSchemas.databasesCreate,
	},
	'roles.list': {
		input: NeonEndpointInputSchemas.rolesList,
		output: NeonEndpointOutputSchemas.rolesList,
	},
	'roles.create': {
		input: NeonEndpointInputSchemas.rolesCreate,
		output: NeonEndpointOutputSchemas.rolesCreate,
	},
	'operations.get': {
		input: NeonEndpointInputSchemas.operationsGet,
		output: NeonEndpointOutputSchemas.operationsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof neonEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const neonEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List all Neon projects',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a Neon project by ID',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new Neon project',
	},
	'branches.list': {
		riskLevel: 'read',
		description: 'List branches in a project',
	},
	'branches.get': {
		riskLevel: 'read',
		description: 'Get a branch by ID',
	},
	'branches.create': {
		riskLevel: 'write',
		description: 'Create a new branch',
	},
	'databases.list': {
		riskLevel: 'read',
		description: 'List databases in a branch',
	},
	'databases.create': {
		riskLevel: 'write',
		description: 'Create a new database',
	},
	'roles.list': {
		riskLevel: 'read',
		description: 'List roles in a branch',
	},
	'roles.create': {
		riskLevel: 'write',
		description: 'Create a new role',
	},
	'operations.get': {
		riskLevel: 'read',
		description: 'Get operation status',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof neonEndpointsNested>;

export const neonAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseNeonPlugin<T extends NeonPluginOptions> = CorsairPlugin<
	'neon',
	typeof NeonSchema,
	typeof neonEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof neonAuthConfig
>;

export type InternalNeonPlugin = BaseNeonPlugin<NeonPluginOptions>;

export type ExternalNeonPlugin<T extends NeonPluginOptions> =
	BaseNeonPlugin<T>;

export function neon<const T extends NeonPluginOptions>(
	incomingOptions: NeonPluginOptions & T = {} as NeonPluginOptions & T,
): ExternalNeonPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'neon',
		authConfig: neonAuthConfig,
		schema: NeonSchema,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: neonEndpointsNested,
		endpointMeta: neonEndpointMeta,
		endpointSchemas: neonEndpointSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// Neon doesn't currently have public webhooks, this is placeholder
			return 'x-neon-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchNeonTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveNeonOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: NeonKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalNeonPlugin;
}

export type {
	ExampleEvent,
	NeonWebhookOutputs,
} from './webhooks/types';

export type {
	NeonEndpointInputs,
	NeonEndpointOutputs,
	ProjectsListInput,
	ProjectsListResponse,
	ProjectCreateInput,
	ProjectGetInput,
	Project,
	BranchesListInput,
	BranchesListResponse,
	BranchCreateInput,
	BranchGetInput,
	Branch,
	DatabasesListInput,
	DatabasesListResponse,
	DatabaseCreateInput,
	Database,
	RolesListInput,
	RolesListResponse,
	RoleCreateInput,
	Role,
	OperationGetInput,
	Operation,
} from './endpoints/types';
