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
import { Collaborators, Organizations, Projects } from './endpoints';
import type {
	BugsnagEndpointInputs,
	BugsnagEndpointOutputs,
} from './endpoints/types';
import {
	BugsnagEndpointInputSchemas,
	BugsnagEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BugsnagSchema } from './schema';

export type BugsnagPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBugsnagPlugin['hooks'];
	webhookHooks?: InternalBugsnagPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bugsnagEndpointsNested>;
};

/**
 * BugSnag authenticates with a personal auth token presented as
 * `Authorization: token <value>`.
 *
 * There is no second credential: unlike Harvest's account id or Zendesk's subdomain,
 * the token alone identifies the user and the organizations they can reach, so no
 * `account` keys are declared and there is no resolution chain.
 */
export const bugsnagAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BugsnagContext = CorsairPluginContext<
	typeof BugsnagSchema,
	BugsnagPluginOptions,
	undefined,
	typeof bugsnagAuthConfig
>;

export type BugsnagKeyBuilderContext = KeyBuilderContext<BugsnagPluginOptions>;

export type BugsnagBoundEndpoints = BindEndpoints<
	typeof bugsnagEndpointsNested
>;

type BugsnagEndpoint<K extends keyof BugsnagEndpointOutputs> = CorsairEndpoint<
	BugsnagContext,
	BugsnagEndpointInputs[K],
	BugsnagEndpointOutputs[K]
>;

export type BugsnagEndpoints = {
	organizationsList: BugsnagEndpoint<'organizationsList'>;
	organizationsGet: BugsnagEndpoint<'organizationsGet'>;
	projectsList: BugsnagEndpoint<'projectsList'>;
	projectsGet: BugsnagEndpoint<'projectsGet'>;
	projectsCreate: BugsnagEndpoint<'projectsCreate'>;
	projectsDelete: BugsnagEndpoint<'projectsDelete'>;
	collaboratorsList: BugsnagEndpoint<'collaboratorsList'>;
	collaboratorsGet: BugsnagEndpoint<'collaboratorsGet'>;
};

/**
 * BugSnag can send webhooks for events such as a new error or a new release, but
 * they are configured per project in the dashboard and are not part of the Data
 * Access API surface the OSS catalog describes - none of its 60 operations manages a
 * subscription. The catalog lists zero triggers accordingly, and none is registered.
 */
export type BugsnagWebhooks = Record<string, never>;

export type BugsnagBoundWebhooks = BindWebhooks<BugsnagWebhooks>;

const bugsnagEndpointsNested = {
	organizations: {
		list: Organizations.list,
		get: Organizations.get,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		delete: Projects.remove,
	},
	collaborators: {
		list: Collaborators.list,
		get: Collaborators.get,
	},
} as const;

const bugsnagWebhooksNested = {} as const;

export const bugsnagEndpointSchemas = {
	'organizations.list': {
		input: BugsnagEndpointInputSchemas.organizationsList,
		output: BugsnagEndpointOutputSchemas.organizationsList,
	},
	'organizations.get': {
		input: BugsnagEndpointInputSchemas.organizationsGet,
		output: BugsnagEndpointOutputSchemas.organizationsGet,
	},
	'projects.list': {
		input: BugsnagEndpointInputSchemas.projectsList,
		output: BugsnagEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: BugsnagEndpointInputSchemas.projectsGet,
		output: BugsnagEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: BugsnagEndpointInputSchemas.projectsCreate,
		output: BugsnagEndpointOutputSchemas.projectsCreate,
	},
	'projects.delete': {
		input: BugsnagEndpointInputSchemas.projectsDelete,
		output: BugsnagEndpointOutputSchemas.projectsDelete,
	},
	'collaborators.list': {
		input: BugsnagEndpointInputSchemas.collaboratorsList,
		output: BugsnagEndpointOutputSchemas.collaboratorsList,
	},
	'collaborators.get': {
		input: BugsnagEndpointInputSchemas.collaboratorsGet,
		output: BugsnagEndpointOutputSchemas.collaboratorsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bugsnagEndpointsNested
>;

export const bugsnagWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof bugsnagWebhooksNested
	>;

/**
 * Risk levels follow what an operation can destroy.
 *
 * `projects.delete` is `destructive` rather than `write` because it removes a
 * project's entire error history irreversibly. Reads are `read`, and creating a
 * project is `write`.
 */
export const bugsnagEndpointMeta = {
	'organizations.list': {
		riskLevel: 'read',
		description: "List the organizations the token's owner belongs to",
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get a single organization',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List the projects in an organization',
	},
	'projects.get': { riskLevel: 'read', description: 'Get a single project' },
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project in an organization',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project and its entire error history',
	},
	'collaborators.list': {
		riskLevel: 'read',
		description: 'List the collaborators on an organization',
	},
	'collaborators.get': {
		riskLevel: 'read',
		description: 'Get a single collaborator',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof bugsnagEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseBugsnagPlugin<T extends BugsnagPluginOptions> = CorsairPlugin<
	'bugsnag',
	typeof BugsnagSchema,
	typeof bugsnagEndpointsNested,
	typeof bugsnagWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBugsnagPlugin = BaseBugsnagPlugin<BugsnagPluginOptions>;

export type ExternalBugsnagPlugin<T extends BugsnagPluginOptions> =
	BaseBugsnagPlugin<T>;

/**
 * Builds the BugSnag plugin.
 *
 * BugSnag authenticates with a personal auth token, presented as the literal scheme
 * `token` rather than `Bearer`. Nothing else is required.
 */
export function bugsnag<const T extends BugsnagPluginOptions>(
	incomingOptions: BugsnagPluginOptions & T = {} as BugsnagPluginOptions & T,
): ExternalBugsnagPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bugsnag',
		authConfig: bugsnagAuthConfig,
		schema: BugsnagSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: bugsnagEndpointsNested,
		webhooks: bugsnagWebhooksNested,
		endpointMeta: bugsnagEndpointMeta,
		endpointSchemas: bugsnagEndpointSchemas,
		webhookSchemas: bugsnagWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BugsnagKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBugsnagPlugin;
}

export type {
	BugsnagEndpointInputs,
	BugsnagEndpointOutputs,
} from './endpoints/types';
export type {
	BugsnagCollaboratorEntity,
	BugsnagOrganizationEntity,
	BugsnagProjectEntity,
} from './schema/database';
