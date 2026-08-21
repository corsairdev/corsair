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
	getCmaToken,
	graphQlContentApiPersistedQuery,
	graphQlContentApiQuery,
} from './endpoints';
import type {
	ContentfulGraphqlEndpointInputs,
	ContentfulGraphqlEndpointOutputs,
} from './endpoints/types';
import {
	ContentfulGraphqlEndpointInputSchemas,
	ContentfulGraphqlEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ContentfulGraphqlSchema } from './schema';

export type ContentfulGraphqlPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalContentfulGraphqlPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof contentfulGraphqlEndpointsNested
	>;
};

export type ContentfulGraphqlContext = CorsairPluginContext<
	typeof ContentfulGraphqlSchema,
	ContentfulGraphqlPluginOptions,
	undefined,
	typeof contentfulGraphqlAuthConfig
>;

export type ContentfulGraphqlKeyBuilderContext = KeyBuilderContext<
	ContentfulGraphqlPluginOptions,
	typeof contentfulGraphqlAuthConfig
>;

export type ContentfulGraphqlBoundEndpoints = BindEndpoints<
	typeof contentfulGraphqlEndpointsNested
>;

type ContentfulGraphqlEndpoint<
	K extends keyof ContentfulGraphqlEndpointOutputs,
> = CorsairEndpoint<
	ContentfulGraphqlContext,
	ContentfulGraphqlEndpointInputs[K],
	ContentfulGraphqlEndpointOutputs[K]
>;

export type ContentfulGraphqlEndpoints = {
	getCmaToken: ContentfulGraphqlEndpoint<'getCmaToken'>;
	graphQlContentApiQuery: ContentfulGraphqlEndpoint<'graphQlContentApiQuery'>;
	graphQlContentApiPersistedQuery: ContentfulGraphqlEndpoint<'graphQlContentApiPersistedQuery'>;
};

const contentfulGraphqlEndpointsNested = {
	getCmaToken,
	graphQlContentApiQuery,
	graphQlContentApiPersistedQuery,
} as const;

export const contentfulGraphqlEndpointSchemas = {
	getCmaToken: {
		input: ContentfulGraphqlEndpointInputSchemas.getCmaToken,
		output: ContentfulGraphqlEndpointOutputSchemas.getCmaToken,
	},
	graphQlContentApiQuery: {
		input: ContentfulGraphqlEndpointInputSchemas.graphQlContentApiQuery,
		output: ContentfulGraphqlEndpointOutputSchemas.graphQlContentApiQuery,
	},
	graphQlContentApiPersistedQuery: {
		input:
			ContentfulGraphqlEndpointInputSchemas.graphQlContentApiPersistedQuery,
		output:
			ContentfulGraphqlEndpointOutputSchemas.graphQlContentApiPersistedQuery,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof contentfulGraphqlEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const contentfulGraphqlEndpointMeta = {
	getCmaToken: {
		riskLevel: 'read',
		description:
			'Get the stored Contentful access token, space ID, and environment ID',
	},
	graphQlContentApiQuery: {
		riskLevel: 'read',
		description:
			'Run a GraphQL query against the Contentful GraphQL Content API for the configured space and environment',
	},
	graphQlContentApiPersistedQuery: {
		riskLevel: 'read',
		description:
			'Run an automatic persisted query (APQ) against the Contentful GraphQL Content API using a SHA-256 hash',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof contentfulGraphqlEndpointsNested
>;

export const contentfulGraphqlAuthConfig = {
	api_key: {
		account: ['space_id', 'environment_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseContentfulGraphqlPlugin<
	T extends ContentfulGraphqlPluginOptions,
> = CorsairPlugin<
	'contentfulgraphql',
	typeof ContentfulGraphqlSchema,
	typeof contentfulGraphqlEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof contentfulGraphqlAuthConfig
>;

export type InternalContentfulGraphqlPlugin =
	BaseContentfulGraphqlPlugin<ContentfulGraphqlPluginOptions>;

export type ExternalContentfulGraphqlPlugin<
	T extends ContentfulGraphqlPluginOptions,
> = BaseContentfulGraphqlPlugin<T>;

export function contentfulgraphql<
	const T extends ContentfulGraphqlPluginOptions,
>(
	incomingOptions: ContentfulGraphqlPluginOptions &
		T = {} as ContentfulGraphqlPluginOptions & T,
): ExternalContentfulGraphqlPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'contentfulgraphql',
		authConfig: contentfulGraphqlAuthConfig,
		schema: ContentfulGraphqlSchema,
		options: options,
		hooks: options.hooks,
		endpoints: contentfulGraphqlEndpointsNested,
		webhooks: {},
		endpointMeta: contentfulGraphqlEndpointMeta,
		endpointSchemas: contentfulGraphqlEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ContentfulGraphqlKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					throw new AuthMissingError('contentfulgraphql', 'api_key');
				}

				return res;
			}

			throw new AuthMissingError('contentfulgraphql', 'api_key');
		},
	} satisfies InternalContentfulGraphqlPlugin;
}

export type {
	ContentfulGraphqlEndpointInputs,
	ContentfulGraphqlEndpointOutputs,
	GetCmaTokenInput,
	GetCmaTokenResponse,
	GraphQlContentApiPersistedQueryInput,
	GraphQlContentApiPersistedQueryResponse,
	GraphQlContentApiQueryInput,
	GraphQlContentApiQueryResponse,
} from './endpoints/types';

export {
	ContentfulGraphqlEndpointInputSchemas,
	ContentfulGraphqlEndpointOutputSchemas,
	GetCmaTokenInputSchema,
	GetCmaTokenResponseSchema,
	GraphQlContentApiPersistedQueryInputSchema,
	GraphQlContentApiPersistedQueryResponseSchema,
	GraphQlContentApiQueryInputSchema,
	GraphQlContentApiQueryResponseSchema,
} from './endpoints/types';
