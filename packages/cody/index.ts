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
import { Graphql, Search, Viewer } from './endpoints';
import type {
	CodyEndpointInputs,
	CodyEndpointOutputs,
} from './endpoints/types';
import {
	CodyEndpointInputSchemas,
	CodyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CodySchema } from './schema';

const codyEndpointsNested = {
	viewer: {
		get: Viewer.get,
	},
	search: {
		get: Search.get,
	},
	graphql: {
		post: Graphql.post,
	},
} as const;

const codyWebhooksNested = {} as const;

export type CodyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalCodyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof codyEndpointsNested>;
};

export type CodyContext = CorsairPluginContext<
	typeof CodySchema,
	CodyPluginOptions
>;

export type CodyKeyBuilderContext = KeyBuilderContext<CodyPluginOptions>;

type CodyEndpoint<K extends keyof CodyEndpointOutputs> = CorsairEndpoint<
	CodyContext,
	CodyEndpointInputs[K],
	CodyEndpointOutputs[K]
>;

export type CodyEndpoints = {
	viewer: CodyEndpoint<'viewer'>;
	search: CodyEndpoint<'search'>;
	graphql: CodyEndpoint<'graphql'>;
};

export type CodyBoundEndpoints = BindEndpoints<typeof codyEndpointsNested>;

export const codyEndpointSchemas = {
	'viewer.get': {
		input: CodyEndpointInputSchemas.viewer,
		output: CodyEndpointOutputSchemas.viewer,
	},
	'search.get': {
		input: CodyEndpointInputSchemas.search,
		output: CodyEndpointOutputSchemas.search,
	},
	'graphql.post': {
		input: CodyEndpointInputSchemas.graphql,
		output: CodyEndpointOutputSchemas.graphql,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof codyEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';

const codyEndpointMeta = {
	'viewer.get': {
		riskLevel: 'read',
		description: 'Get the authenticated Sourcegraph user',
	},
	'search.get': {
		riskLevel: 'read',
		description: 'Search Sourcegraph code and count matches',
	},
	'graphql.post': {
		riskLevel: 'write',
		description: 'Run a raw Sourcegraph GraphQL operation',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof codyEndpointsNested>;

export const codyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCodyPlugin<T extends CodyPluginOptions> = CorsairPlugin<
	'cody',
	typeof CodySchema,
	typeof codyEndpointsNested,
	typeof codyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCodyPlugin = BaseCodyPlugin<CodyPluginOptions>;

export type ExternalCodyPlugin<T extends CodyPluginOptions> = BaseCodyPlugin<T>;

export function cody<const T extends CodyPluginOptions>(
	incomingOptions: CodyPluginOptions & T = {} as CodyPluginOptions & T,
): ExternalCodyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'cody',
		authConfig: codyAuthConfig,
		schema: CodySchema,
		options,
		oauthConfig: {
			providerName: 'Sourcegraph',
			authUrl: 'https://sourcegraph.com/.auth/idp/oauth/authorize',
			tokenUrl: 'https://sourcegraph.com/.auth/idp/oauth/token',
			scopes: ['user:all'],
		},
		hooks: options.hooks,
		endpoints: codyEndpointsNested,
		webhooks: codyWebhooksNested,
		endpointMeta: codyEndpointMeta,
		endpointSchemas: codyEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CodyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('cody', 'api_key');
				}

				return key;
			}

			if (ctx.authType === 'oauth_2') {
				const token = await ctx.keys.get_access_token();

				if (!token) {
					throw new AuthMissingError('cody', 'oauth_2');
				}

				return token;
			}

			throw new AuthMissingError('cody', 'api_key');
		},
	} satisfies InternalCodyPlugin;
}

export type {
	CodyEndpointInputs,
	CodyEndpointOutputs,
	GraphqlInput,
	GraphqlResponse,
	SearchInput,
	SearchResponse,
	ViewerResponse,
} from './endpoints/types';
