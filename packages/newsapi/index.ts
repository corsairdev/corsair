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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Articles, Headlines, Sources } from './endpoints';
import type {
	NewsApiEndpointInputs,
	NewsApiEndpointOutputs,
} from './endpoints/types';
import {
	NewsApiEndpointInputSchemas,
	NewsApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NewsApiSchema } from './schema';

/**
 * News API is a read-only REST API for searching and retrieving live
 * articles: full-text search across 150,000+ sources (articles.getEverything),
 * live top headlines (headlines.getTop), and source lookups (sources.get).
 * It has no write surface and no webhook delivery mechanism.
 *
 * @see https://newsapi.org/docs
 */

export type NewsApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNewsApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the News API plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the News API endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof newsApiEndpointsNested>;
};

export type NewsApiContext = CorsairPluginContext<
	typeof NewsApiSchema,
	NewsApiPluginOptions
>;

export type NewsApiKeyBuilderContext = KeyBuilderContext<NewsApiPluginOptions>;

export type NewsApiBoundEndpoints = BindEndpoints<
	typeof newsApiEndpointsNested
>;

type NewsApiEndpoint<K extends keyof NewsApiEndpointOutputs> = CorsairEndpoint<
	NewsApiContext,
	NewsApiEndpointInputs[K],
	NewsApiEndpointOutputs[K]
>;

export type NewsApiEndpoints = {
	articlesGetEverything: NewsApiEndpoint<'articlesGetEverything'>;
	headlinesGetTop: NewsApiEndpoint<'headlinesGetTop'>;
	sourcesGet: NewsApiEndpoint<'sourcesGet'>;
};

const newsApiEndpointsNested = {
	articles: {
		getEverything: Articles.getEverything,
	},
	headlines: {
		getTop: Headlines.getTop,
	},
	sources: {
		get: Sources.get,
	},
} as const;

export const newsApiEndpointSchemas = {
	'articles.getEverything': {
		input: NewsApiEndpointInputSchemas.articlesGetEverything,
		output: NewsApiEndpointOutputSchemas.articlesGetEverything,
	},
	'headlines.getTop': {
		input: NewsApiEndpointInputSchemas.headlinesGetTop,
		output: NewsApiEndpointOutputSchemas.headlinesGetTop,
	},
	'sources.get': {
		input: NewsApiEndpointInputSchemas.sourcesGet,
		output: NewsApiEndpointOutputSchemas.sourcesGet,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Risk-level metadata for each News API endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 * Every operation is a read — News API has no write surface.
 */
const newsApiEndpointMeta = {
	'articles.getEverything': {
		riskLevel: 'read',
		description:
			'Search every article published by over 150,000 sources; requires at least one of q, sources, language, or domains',
	},
	'headlines.getTop': {
		riskLevel: 'read',
		description:
			'Get live top and breaking headlines filtered by country, category, sources, or keywords',
	},
	'sources.get': {
		riskLevel: 'read',
		description:
			'Get available news sources filtered by category, language, or country',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof newsApiEndpointsNested>;

/**
 * One key, sent as `X-Api-Key`. There is no OAuth flow and no account-specific
 * host or extra credential to resolve.
 */
export const newsApiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseNewsApiPlugin<T extends NewsApiPluginOptions> = CorsairPlugin<
	'newsapi',
	typeof NewsApiSchema,
	typeof newsApiEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof newsApiAuthConfig
>;

export type InternalNewsApiPlugin = BaseNewsApiPlugin<NewsApiPluginOptions>;

export type ExternalNewsApiPlugin<T extends NewsApiPluginOptions> =
	BaseNewsApiPlugin<T>;

export function newsapi<const T extends NewsApiPluginOptions>(
	incomingOptions: NewsApiPluginOptions & T = {} as NewsApiPluginOptions & T,
): ExternalNewsApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'newsapi',
		schema: NewsApiSchema,
		options,
		hooks: options.hooks,
		endpoints: newsApiEndpointsNested,
		webhooks: {},
		endpointMeta: newsApiEndpointMeta,
		endpointSchemas: newsApiEndpointSchemas,
		authConfig: newsApiAuthConfig,
		// News API is request/response only: no webhooks, no event subscriptions.
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: NewsApiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('newsapi', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('newsapi', 'api_key');
		},
	} satisfies InternalNewsApiPlugin;
}

export type {
	Article,
	ArticlesGetEverythingInput,
	GetEverythingResponse,
	GetTopHeadlinesResponse,
	HeadlinesGetTopInput,
	NewsApiEndpointInputs,
	NewsApiEndpointOutputs,
	Source,
	SourcesGetInput,
	SourcesGetResponse,
} from './endpoints/types';
