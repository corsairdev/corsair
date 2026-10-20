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
import { packCredentials } from './client';
import {
	Account,
	Ai,
	Amazon,
	AppStore,
	Backlinks,
	Keywords,
	Serp,
} from './endpoints';
import type {
	DataForSeoEndpointInputs,
	DataForSeoEndpointOutputs,
} from './endpoints/types';
import {
	DataForSeoEndpointInputSchemas,
	DataForSeoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DataForSeoSchema } from './schema';

export type DataForSeoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** DataForSEO API login. */
	key?: string;
	/** DataForSEO API password; falls back to the account's stored api_secret. */
	secret?: string;
	/** Send requests to sandbox.dataforseo.com, which returns sample data free of charge. */
	sandbox?: boolean;
	hooks?: InternalDataForSeoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dataforseoEndpointsNested>;
};

export type DataForSeoContext = CorsairPluginContext<
	typeof DataForSeoSchema,
	DataForSeoPluginOptions,
	undefined,
	typeof dataforseoAuthConfig
>;

export type DataForSeoKeyBuilderContext = KeyBuilderContext<
	DataForSeoPluginOptions,
	typeof dataforseoAuthConfig
>;

export type DataForSeoBoundEndpoints = BindEndpoints<
	typeof dataforseoEndpointsNested
>;

type DataForSeoEndpoint<K extends keyof DataForSeoEndpointOutputs> =
	CorsairEndpoint<
		DataForSeoContext,
		DataForSeoEndpointInputs[K],
		DataForSeoEndpointOutputs[K]
	>;

export type DataForSeoEndpoints = {
	serpGoogleOrganic: DataForSeoEndpoint<'serpGoogleOrganic'>;
	serpGoogleNews: DataForSeoEndpoint<'serpGoogleNews'>;
	serpLocations: DataForSeoEndpoint<'serpLocations'>;
	serpLanguages: DataForSeoEndpoint<'serpLanguages'>;
	keywordsSearchVolume: DataForSeoEndpoint<'keywordsSearchVolume'>;
	keywordsSuggestions: DataForSeoEndpoint<'keywordsSuggestions'>;
	keywordsIdeas: DataForSeoEndpoint<'keywordsIdeas'>;
	keywordsLocations: DataForSeoEndpoint<'keywordsLocations'>;
	backlinksSummary: DataForSeoEndpoint<'backlinksSummary'>;
	backlinksList: DataForSeoEndpoint<'backlinksList'>;
	backlinksReferringDomains: DataForSeoEndpoint<'backlinksReferringDomains'>;
	backlinksAnchors: DataForSeoEndpoint<'backlinksAnchors'>;
	backlinksCompetitors: DataForSeoEndpoint<'backlinksCompetitors'>;
	backlinksBulkRanks: DataForSeoEndpoint<'backlinksBulkRanks'>;
	aiChatgptResponse: DataForSeoEndpoint<'aiChatgptResponse'>;
	aiPerplexityResponse: DataForSeoEndpoint<'aiPerplexityResponse'>;
	aiGeminiResponse: DataForSeoEndpoint<'aiGeminiResponse'>;
	aiMentionsSearch: DataForSeoEndpoint<'aiMentionsSearch'>;
	aiMentionsTopDomains: DataForSeoEndpoint<'aiMentionsTopDomains'>;
	amazonProducts: DataForSeoEndpoint<'amazonProducts'>;
	amazonAsin: DataForSeoEndpoint<'amazonAsin'>;
	appStoreSearchTask: DataForSeoEndpoint<'appStoreSearchTask'>;
	appStoreSearchResult: DataForSeoEndpoint<'appStoreSearchResult'>;
	appStoreInfoTask: DataForSeoEndpoint<'appStoreInfoTask'>;
	appStoreInfoResult: DataForSeoEndpoint<'appStoreInfoResult'>;
	appStoreReviewsTask: DataForSeoEndpoint<'appStoreReviewsTask'>;
	appStoreReviewsResult: DataForSeoEndpoint<'appStoreReviewsResult'>;
	accountUserData: DataForSeoEndpoint<'accountUserData'>;
};

const dataforseoEndpointsNested = {
	serp: {
		googleOrganic: Serp.googleOrganic,
		googleNews: Serp.googleNews,
		locations: Serp.locations,
		languages: Serp.languages,
	},
	keywords: {
		searchVolume: Keywords.searchVolume,
		suggestions: Keywords.suggestions,
		ideas: Keywords.ideas,
		locations: Keywords.locations,
	},
	backlinks: {
		summary: Backlinks.summary,
		list: Backlinks.list,
		referringDomains: Backlinks.referringDomains,
		anchors: Backlinks.anchors,
		competitors: Backlinks.competitors,
		bulkRanks: Backlinks.bulkRanks,
	},
	ai: {
		chatgptResponse: Ai.chatgptResponse,
		perplexityResponse: Ai.perplexityResponse,
		geminiResponse: Ai.geminiResponse,
		mentionsSearch: Ai.mentionsSearch,
		mentionsTopDomains: Ai.mentionsTopDomains,
	},
	amazon: {
		products: Amazon.products,
		asin: Amazon.asin,
	},
	appStore: {
		searchTask: AppStore.searchTask,
		searchResult: AppStore.searchResult,
		infoTask: AppStore.infoTask,
		infoResult: AppStore.infoResult,
		reviewsTask: AppStore.reviewsTask,
		reviewsResult: AppStore.reviewsResult,
	},
	account: {
		userData: Account.userData,
	},
} as const;

export const dataforseoEndpointSchemas = {
	'serp.googleOrganic': {
		input: DataForSeoEndpointInputSchemas.serpGoogleOrganic,
		output: DataForSeoEndpointOutputSchemas.serpGoogleOrganic,
	},
	'serp.googleNews': {
		input: DataForSeoEndpointInputSchemas.serpGoogleNews,
		output: DataForSeoEndpointOutputSchemas.serpGoogleNews,
	},
	'serp.locations': {
		input: DataForSeoEndpointInputSchemas.serpLocations,
		output: DataForSeoEndpointOutputSchemas.serpLocations,
	},
	'serp.languages': {
		input: DataForSeoEndpointInputSchemas.serpLanguages,
		output: DataForSeoEndpointOutputSchemas.serpLanguages,
	},
	'keywords.searchVolume': {
		input: DataForSeoEndpointInputSchemas.keywordsSearchVolume,
		output: DataForSeoEndpointOutputSchemas.keywordsSearchVolume,
	},
	'keywords.suggestions': {
		input: DataForSeoEndpointInputSchemas.keywordsSuggestions,
		output: DataForSeoEndpointOutputSchemas.keywordsSuggestions,
	},
	'keywords.ideas': {
		input: DataForSeoEndpointInputSchemas.keywordsIdeas,
		output: DataForSeoEndpointOutputSchemas.keywordsIdeas,
	},
	'keywords.locations': {
		input: DataForSeoEndpointInputSchemas.keywordsLocations,
		output: DataForSeoEndpointOutputSchemas.keywordsLocations,
	},
	'backlinks.summary': {
		input: DataForSeoEndpointInputSchemas.backlinksSummary,
		output: DataForSeoEndpointOutputSchemas.backlinksSummary,
	},
	'backlinks.list': {
		input: DataForSeoEndpointInputSchemas.backlinksList,
		output: DataForSeoEndpointOutputSchemas.backlinksList,
	},
	'backlinks.referringDomains': {
		input: DataForSeoEndpointInputSchemas.backlinksReferringDomains,
		output: DataForSeoEndpointOutputSchemas.backlinksReferringDomains,
	},
	'backlinks.anchors': {
		input: DataForSeoEndpointInputSchemas.backlinksAnchors,
		output: DataForSeoEndpointOutputSchemas.backlinksAnchors,
	},
	'backlinks.competitors': {
		input: DataForSeoEndpointInputSchemas.backlinksCompetitors,
		output: DataForSeoEndpointOutputSchemas.backlinksCompetitors,
	},
	'backlinks.bulkRanks': {
		input: DataForSeoEndpointInputSchemas.backlinksBulkRanks,
		output: DataForSeoEndpointOutputSchemas.backlinksBulkRanks,
	},
	'ai.chatgptResponse': {
		input: DataForSeoEndpointInputSchemas.aiChatgptResponse,
		output: DataForSeoEndpointOutputSchemas.aiChatgptResponse,
	},
	'ai.perplexityResponse': {
		input: DataForSeoEndpointInputSchemas.aiPerplexityResponse,
		output: DataForSeoEndpointOutputSchemas.aiPerplexityResponse,
	},
	'ai.geminiResponse': {
		input: DataForSeoEndpointInputSchemas.aiGeminiResponse,
		output: DataForSeoEndpointOutputSchemas.aiGeminiResponse,
	},
	'ai.mentionsSearch': {
		input: DataForSeoEndpointInputSchemas.aiMentionsSearch,
		output: DataForSeoEndpointOutputSchemas.aiMentionsSearch,
	},
	'ai.mentionsTopDomains': {
		input: DataForSeoEndpointInputSchemas.aiMentionsTopDomains,
		output: DataForSeoEndpointOutputSchemas.aiMentionsTopDomains,
	},
	'amazon.products': {
		input: DataForSeoEndpointInputSchemas.amazonProducts,
		output: DataForSeoEndpointOutputSchemas.amazonProducts,
	},
	'amazon.asin': {
		input: DataForSeoEndpointInputSchemas.amazonAsin,
		output: DataForSeoEndpointOutputSchemas.amazonAsin,
	},
	'appStore.searchTask': {
		input: DataForSeoEndpointInputSchemas.appStoreSearchTask,
		output: DataForSeoEndpointOutputSchemas.appStoreSearchTask,
	},
	'appStore.searchResult': {
		input: DataForSeoEndpointInputSchemas.appStoreSearchResult,
		output: DataForSeoEndpointOutputSchemas.appStoreSearchResult,
	},
	'appStore.infoTask': {
		input: DataForSeoEndpointInputSchemas.appStoreInfoTask,
		output: DataForSeoEndpointOutputSchemas.appStoreInfoTask,
	},
	'appStore.infoResult': {
		input: DataForSeoEndpointInputSchemas.appStoreInfoResult,
		output: DataForSeoEndpointOutputSchemas.appStoreInfoResult,
	},
	'appStore.reviewsTask': {
		input: DataForSeoEndpointInputSchemas.appStoreReviewsTask,
		output: DataForSeoEndpointOutputSchemas.appStoreReviewsTask,
	},
	'appStore.reviewsResult': {
		input: DataForSeoEndpointInputSchemas.appStoreReviewsResult,
		output: DataForSeoEndpointOutputSchemas.appStoreReviewsResult,
	},
	'account.userData': {
		input: DataForSeoEndpointInputSchemas.accountUserData,
		output: DataForSeoEndpointOutputSchemas.accountUserData,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dataforseoEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

// Billed calls are `write` so permission modes can gate spending; lookups that
// DataForSEO does not charge for are `read`.
const dataforseoEndpointMeta = {
	'serp.googleOrganic': {
		riskLevel: 'write',
		description:
			'Get the live Google organic SERP for a keyword: organic, paid, AI Overview, People Also Ask, and other result types',
	},
	'serp.googleNews': {
		riskLevel: 'write',
		description: 'Get live Google News results for a keyword',
	},
	'serp.locations': {
		riskLevel: 'read',
		description:
			'List Google SERP location codes, optionally for one country (free)',
	},
	'serp.languages': {
		riskLevel: 'read',
		description: 'List Google SERP language codes (free)',
	},
	'keywords.searchVolume': {
		riskLevel: 'write',
		description:
			'Get Google Ads search volume, CPC, and competition for up to 1000 keywords',
	},
	'keywords.suggestions': {
		riskLevel: 'write',
		description:
			'Get keyword suggestions that contain a seed keyword, with search volume and difficulty',
	},
	'keywords.ideas': {
		riskLevel: 'write',
		description: 'Get keyword ideas related to up to 200 seed keywords',
	},
	'keywords.locations': {
		riskLevel: 'read',
		description: 'List DataForSEO Labs locations and languages (free)',
	},
	'backlinks.summary': {
		riskLevel: 'write',
		description:
			'Get a backlink profile summary for a domain, subdomain, or page',
	},
	'backlinks.list': {
		riskLevel: 'write',
		description: 'List backlinks pointing to a target',
	},
	'backlinks.referringDomains': {
		riskLevel: 'write',
		description:
			'List domains linking to a target with per-domain link metrics',
	},
	'backlinks.anchors': {
		riskLevel: 'write',
		description: 'List anchor texts used in links to a target',
	},
	'backlinks.competitors': {
		riskLevel: 'write',
		description: 'Find domains that share backlinks with a target',
	},
	'backlinks.bulkRanks': {
		riskLevel: 'write',
		description: 'Get the rank of up to 1000 domains, subdomains, or pages',
	},
	'ai.chatgptResponse': {
		riskLevel: 'write',
		description:
			'Get a ChatGPT model response to a prompt, with web sources when web search is on',
	},
	'ai.perplexityResponse': {
		riskLevel: 'write',
		description:
			'Get a Perplexity model response to a prompt, with cited sources',
	},
	'ai.geminiResponse': {
		riskLevel: 'write',
		description: 'Get a Gemini model response to a prompt',
	},
	'ai.mentionsSearch': {
		riskLevel: 'write',
		description:
			'Search AI answers (ChatGPT, Google AI) that mention a domain or keyword',
	},
	'ai.mentionsTopDomains': {
		riskLevel: 'write',
		description:
			'Rank the domains cited most in AI answers about a domain or keyword',
	},
	'amazon.products': {
		riskLevel: 'write',
		description: 'Get live Amazon search results for a keyword',
	},
	'amazon.asin': {
		riskLevel: 'write',
		description:
			'Get an Amazon product page by ASIN: price, rating, details, and top reviews',
	},
	'appStore.searchTask': {
		riskLevel: 'write',
		description:
			'Post an App Store search task; fetch it with appStore.searchResult',
	},
	'appStore.searchResult': {
		riskLevel: 'read',
		description: 'Get the results of an App Store search task by task id',
	},
	'appStore.infoTask': {
		riskLevel: 'write',
		description:
			'Post an App Store app info task; fetch it with appStore.infoResult',
	},
	'appStore.infoResult': {
		riskLevel: 'read',
		description: 'Get the results of an App Store app info task by task id',
	},
	'appStore.reviewsTask': {
		riskLevel: 'write',
		description:
			'Post an App Store reviews task; fetch it with appStore.reviewsResult',
	},
	'appStore.reviewsResult': {
		riskLevel: 'read',
		description: 'Get the results of an App Store reviews task by task id',
	},
	'account.userData': {
		riskLevel: 'read',
		description:
			'Get the account login, balance, and subscription expiry dates (free)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dataforseoEndpointsNested
>;

// HTTP Basic auth: the API key field holds the DataForSEO login and
// `api_secret` holds the API password.
export const dataforseoAuthConfig = {
	api_key: {
		account: ['tenant_external_id', 'api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDataForSeoPlugin<T extends DataForSeoPluginOptions> =
	CorsairPlugin<
		'dataforseo',
		typeof DataForSeoSchema,
		typeof dataforseoEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof dataforseoAuthConfig
	>;

export type InternalDataForSeoPlugin =
	BaseDataForSeoPlugin<DataForSeoPluginOptions>;

export type ExternalDataForSeoPlugin<T extends DataForSeoPluginOptions> =
	BaseDataForSeoPlugin<T>;

export function dataforseo<const T extends DataForSeoPluginOptions>(
	incomingOptions: DataForSeoPluginOptions & T = {} as DataForSeoPluginOptions &
		T,
): ExternalDataForSeoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dataforseo',
		authConfig: dataforseoAuthConfig,
		schema: DataForSeoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: dataforseoEndpointsNested,
		webhooks: {},
		endpointMeta: dataforseoEndpointMeta,
		endpointSchemas: dataforseoEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DataForSeoKeyBuilderContext, source) => {
			if (source !== 'endpoint' || ctx.authType !== 'api_key') {
				throw new AuthMissingError('dataforseo', 'api_key');
			}
			const login = options.key ?? (await ctx.keys.get_api_key());
			const password = options.secret ?? (await ctx.keys.get_api_secret());
			if (!login || !password) {
				throw new AuthMissingError('dataforseo', 'api_key');
			}
			return packCredentials(login, password);
		},
	} satisfies InternalDataForSeoPlugin;
}

export type {
	AmazonProduct,
	Backlink,
	DataForSeoEndpointInputs,
	DataForSeoEndpointOutputs,
	Filter,
	KeywordData,
	SerpItem,
} from './endpoints/types';
