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
import { BuildkiteEndpointsImpl as Endpoints } from './endpoints';
import type {
	BuildkiteEndpointInputs,
	BuildkiteEndpointOutputs,
} from './endpoints/types';
import {
	BuildkiteEndpointInputSchemas,
	BuildkiteEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BuildkiteSchema } from './schema';

export type BuildkitePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBuildkitePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof buildkiteEndpointsNested>;
};

export type BuildkiteContext = CorsairPluginContext<
	typeof BuildkiteSchema,
	BuildkitePluginOptions
>;

export type BuildkiteKeyBuilderContext =
	KeyBuilderContext<BuildkitePluginOptions>;

export type BuildkiteBoundEndpoints = BindEndpoints<
	typeof buildkiteEndpointsNested
>;

type BuildkiteEndpoint<K extends keyof BuildkiteEndpointOutputs> =
	CorsairEndpoint<
		BuildkiteContext,
		BuildkiteEndpointInputs[K],
		BuildkiteEndpointOutputs[K]
	>;

export type BuildkiteEndpoints = {
	getCurrentAccessToken: BuildkiteEndpoint<'getCurrentAccessToken'>;
	getMeta: BuildkiteEndpoint<'getMeta'>;
	getUser: BuildkiteEndpoint<'getUser'>;
	listOrganizations: BuildkiteEndpoint<'listOrganizations'>;
	listPipelineAgents: BuildkiteEndpoint<'listPipelineAgents'>;
};

const buildkiteEndpointsNested = {
	getCurrentAccessToken: Endpoints.getCurrentAccessToken,
	getMeta: Endpoints.getMeta,
	getUser: Endpoints.getUser,
	listOrganizations: Endpoints.listOrganizations,
	listPipelineAgents: Endpoints.listPipelineAgents,
} as const;

export const buildkiteEndpointSchemas = {
	getCurrentAccessToken: {
		input: BuildkiteEndpointInputSchemas.getCurrentAccessToken,
		output: BuildkiteEndpointOutputSchemas.getCurrentAccessToken,
	},
	getMeta: {
		input: BuildkiteEndpointInputSchemas.getMeta,
		output: BuildkiteEndpointOutputSchemas.getMeta,
	},
	getUser: {
		input: BuildkiteEndpointInputSchemas.getUser,
		output: BuildkiteEndpointOutputSchemas.getUser,
	},
	listOrganizations: {
		input: BuildkiteEndpointInputSchemas.listOrganizations,
		output: BuildkiteEndpointOutputSchemas.listOrganizations,
	},
	listPipelineAgents: {
		input: BuildkiteEndpointInputSchemas.listPipelineAgents,
		output: BuildkiteEndpointOutputSchemas.listPipelineAgents,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof buildkiteEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const buildkiteEndpointMeta = {
	getCurrentAccessToken: {
		riskLevel: 'read',
		description:
			'Retrieve the authenticated API access token details. Use when you need to confirm the validity and scopes of the current API token.',
	},
	getMeta: {
		riskLevel: 'read',
		description:
			'Retrieve metadata about the Buildkite API. Use when you need to fetch webhook IP addresses for firewall or security configurations.',
	},
	getUser: {
		riskLevel: 'read',
		description:
			'Retrieve details about the current authenticated user. Use when you need to get information about the user account that owns the API token.',
	},
	listOrganizations: {
		riskLevel: 'read',
		description:
			'List all organizations the current user is a member of. Use when you need to discover available organizations or get organization slugs for other operations.',
	},
	listPipelineAgents: {
		riskLevel: 'read',
		description:
			'List connected agents for an organization. Use after confirming the organization slug. Supports optional filtering and pagination.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof buildkiteEndpointsNested
>;

export const buildkiteAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBuildkitePlugin<T extends BuildkitePluginOptions> =
	CorsairPlugin<
		'buildkite',
		typeof BuildkiteSchema,
		typeof buildkiteEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalBuildkitePlugin =
	BaseBuildkitePlugin<BuildkitePluginOptions>;

export type ExternalBuildkitePlugin<T extends BuildkitePluginOptions> =
	BaseBuildkitePlugin<T>;

export function buildkite<const T extends BuildkitePluginOptions>(
	incomingOptions: BuildkitePluginOptions & T = {} as BuildkitePluginOptions &
		T,
): ExternalBuildkitePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'buildkite',
		authConfig: buildkiteAuthConfig,
		schema: BuildkiteSchema,
		options: options,
		hooks: options.hooks,
		endpoints: buildkiteEndpointsNested,
		webhooks: {},
		endpointMeta: buildkiteEndpointMeta,
		endpointSchemas: buildkiteEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BuildkiteKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				return (await ctx.keys.get_api_key()) ?? '';
			}

			return '';
		},
	} satisfies InternalBuildkitePlugin;
}

export {
	BuildkiteAPIError,
	BuildkiteRateLimitError,
	makeBuildkiteRequest,
} from './client';
export type {
	BuildkiteEndpointInputs,
	BuildkiteEndpointOutputs,
} from './endpoints/types';
