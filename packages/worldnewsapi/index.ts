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
import { News } from './endpoints';
import type {
	WorldNewsApiEndpointInputs,
	WorldNewsApiEndpointOutputs,
} from './endpoints/types';
import {
	WorldNewsApiEndpointInputSchemas,
	WorldNewsApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WorldNewsApiSchema } from './schema';

export type WorldNewsApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWorldNewsApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof worldNewsApiEndpointsNested>;
};

export type WorldNewsApiContext = CorsairPluginContext<
	typeof WorldNewsApiSchema,
	WorldNewsApiPluginOptions
>;

export type WorldNewsApiKeyBuilderContext =
	KeyBuilderContext<WorldNewsApiPluginOptions>;

export type WorldNewsApiBoundEndpoints = BindEndpoints<
	typeof worldNewsApiEndpointsNested
>;

type WorldNewsApiEndpoint<K extends keyof WorldNewsApiEndpointOutputs> =
	CorsairEndpoint<
		WorldNewsApiContext,
		WorldNewsApiEndpointInputs[K],
		WorldNewsApiEndpointOutputs[K]
	>;

export type WorldNewsApiEndpoints = {
	newsTopNews: WorldNewsApiEndpoint<'news.topNews'>;
	newsExtractNews: WorldNewsApiEndpoint<'news.extractNews'>;
	newsExtractNewsLinks: WorldNewsApiEndpoint<'news.extractNewsLinks'>;
	newsGetGeoCoordinates: WorldNewsApiEndpoint<'news.getGeoCoordinates'>;
	newsNewsWebsiteToRssFeed: WorldNewsApiEndpoint<'news.newsWebsiteToRssFeed'>;
	newsSearchNewsSources: WorldNewsApiEndpoint<'news.searchNewsSources'>;
	newsSearchNews: WorldNewsApiEndpoint<'news.searchNews'>;
};

const worldNewsApiEndpointsNested = {
	news: {
		topNews: News.topNews,
		extractNews: News.extractNews,
		extractNewsLinks: News.extractNewsLinks,
		getGeoCoordinates: News.getGeoCoordinates,
		newsWebsiteToRssFeed: News.newsWebsiteToRssFeed,
		searchNewsSources: News.searchNewsSources,
		searchNews: News.searchNews,
	},
} as const;

const worldNewsApiWebhooksNested = {} as const;

export const worldNewsApiEndpointSchemas = {
	'news.topNews': {
		input: WorldNewsApiEndpointInputSchemas['news.topNews'],
		output: WorldNewsApiEndpointOutputSchemas['news.topNews'],
	},
	'news.extractNews': {
		input: WorldNewsApiEndpointInputSchemas['news.extractNews'],
		output: WorldNewsApiEndpointOutputSchemas['news.extractNews'],
	},
	'news.extractNewsLinks': {
		input: WorldNewsApiEndpointInputSchemas['news.extractNewsLinks'],
		output: WorldNewsApiEndpointOutputSchemas['news.extractNewsLinks'],
	},
	'news.getGeoCoordinates': {
		input: WorldNewsApiEndpointInputSchemas['news.getGeoCoordinates'],
		output: WorldNewsApiEndpointOutputSchemas['news.getGeoCoordinates'],
	},
	'news.newsWebsiteToRssFeed': {
		input: WorldNewsApiEndpointInputSchemas['news.newsWebsiteToRssFeed'],
		output: WorldNewsApiEndpointOutputSchemas['news.newsWebsiteToRssFeed'],
	},
	'news.searchNewsSources': {
		input: WorldNewsApiEndpointInputSchemas['news.searchNewsSources'],
		output: WorldNewsApiEndpointOutputSchemas['news.searchNewsSources'],
	},
	'news.searchNews': {
		input: WorldNewsApiEndpointInputSchemas['news.searchNews'],
		output: WorldNewsApiEndpointOutputSchemas['news.searchNews'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof worldNewsApiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const worldNewsApiEndpointMeta = {
	'news.topNews': {
		riskLevel: 'read',
		description:
			'Get the top news from a country in a specific language for a given date. The top news are clustered from multiple sources in the specified country.',
	},
	'news.extractNews': {
		riskLevel: 'read',
		description:
			'Extract a news article from a website to a well-structured JSON object, including title, text, images, videos, publish date, authors, language, and sentiment.',
	},
	'news.extractNewsLinks': {
		riskLevel: 'read',
		description:
			'Extract news article links from a website or webpage, with optional filtering by URL prefix and subdomain inclusion.',
	},
	'news.getGeoCoordinates': {
		riskLevel: 'read',
		description:
			'Retrieve latitude and longitude of a location name to fill the location-filter parameter in news search operations.',
	},
	'news.newsWebsiteToRssFeed': {
		riskLevel: 'read',
		description:
			'Convert any news website page into an RSS feed with the latest news from that page.',
	},
	'news.searchNewsSources': {
		riskLevel: 'read',
		description:
			'Search whether a news source is being monitored by the World News API.',
	},
	'news.searchNews': {
		riskLevel: 'read',
		description:
			'Search and filter news by text, date, location, category, language, and more.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof worldNewsApiEndpointsNested
>;

export const worldNewsApiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseWorldNewsApiPlugin<T extends WorldNewsApiPluginOptions> =
	CorsairPlugin<
		'worldnewsapi',
		typeof WorldNewsApiSchema,
		typeof worldNewsApiEndpointsNested,
		typeof worldNewsApiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalWorldNewsApiPlugin =
	BaseWorldNewsApiPlugin<WorldNewsApiPluginOptions>;

export type ExternalWorldNewsApiPlugin<T extends WorldNewsApiPluginOptions> =
	BaseWorldNewsApiPlugin<T>;

export function worldnewsapi<const T extends WorldNewsApiPluginOptions>(
	incomingOptions: WorldNewsApiPluginOptions &
		T = {} as WorldNewsApiPluginOptions & T,
): ExternalWorldNewsApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'worldnewsapi',
		authConfig: worldNewsApiAuthConfig,
		schema: WorldNewsApiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: worldNewsApiEndpointsNested,
		webhooks: worldNewsApiWebhooksNested,
		endpointMeta: worldNewsApiEndpointMeta,
		endpointSchemas: worldNewsApiEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: WorldNewsApiKeyBuilderContext,
			source: 'endpoint' | 'webhook',
		) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}
			throw new AuthMissingError('worldnewsapi', 'api_key');
		},
	} satisfies InternalWorldNewsApiPlugin;
}

export type {
	ParsedRssFeed,
	ParsedRssItem,
	WorldNewsQuotaInfo,
} from './client';
export type {
	WorldNewsApiEndpointInputs,
	WorldNewsApiEndpointOutputs,
	WorldNewsArticle,
} from './endpoints/types';
