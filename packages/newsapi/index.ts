import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { NewsApiContext } from './context';
import {
	everything,
	headlines,
	legacyArticles,
	listSources,
} from './endpoints';
import {
	ArticleListResponseSchema,
	EverythingInputSchema,
	HeadlinesInputSchema,
	LegacyInputSchema,
	SourceListResponseSchema,
	SourcesInputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NewsApiSchema } from './schema';

export type { NewsApiContext };

export type NewsApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNewsApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof newsEndpointsNested>;
};

export type NewsApiKeyBuilderContext = KeyBuilderContext<NewsApiPluginOptions>;

const newsEndpointsNested = {
	articles: {
		everything,
		headlines,
		legacy: legacyArticles,
	},
	sources: { list: listSources },
} as const;

const newsWebhooksNested = {} as const;

export const newsApiEndpointSchemas = {
	'articles.everything': {
		input: EverythingInputSchema,
		output: ArticleListResponseSchema,
	},
	'articles.headlines': {
		input: HeadlinesInputSchema,
		output: ArticleListResponseSchema,
	},
	'articles.legacy': {
		input: LegacyInputSchema,
		output: ArticleListResponseSchema,
	},
	'sources.list': {
		input: SourcesInputSchema,
		output: SourceListResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof newsEndpointsNested>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;

const newsEndpointMeta = {
	'articles.everything': read('Search articles across NewsAPI sources.'),
	'articles.headlines': read('Read current top headlines.'),
	'articles.legacy': read('Read articles from the legacy v1 source endpoint.'),
	'sources.list': read('List NewsAPI publishers.'),
} as const satisfies RequiredPluginEndpointMeta<typeof newsEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const newsApiAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseNewsApiPlugin<T extends NewsApiPluginOptions> = CorsairPlugin<
	'newsapi',
	typeof NewsApiSchema,
	typeof newsEndpointsNested,
	typeof newsWebhooksNested,
	T,
	typeof defaultAuthType
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
		authConfig: newsApiAuthConfig,
		schema: NewsApiSchema,
		options,
		hooks: options.hooks,
		endpoints: newsEndpointsNested,
		webhooks: newsWebhooksNested,
		endpointMeta: newsEndpointMeta,
		endpointSchemas: newsApiEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: NewsApiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalNewsApiPlugin;
}
