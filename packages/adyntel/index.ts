import type {
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
import { Google, Keywords, LinkedIn, Meta, TikTok } from './endpoints';
import type {
	AdyntelEndpointInputs,
	AdyntelEndpointOutputs,
} from './endpoints/types';
import {
	AdyntelEndpointInputSchemas,
	AdyntelEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { AdyntelSchema } from './schema';

export type AdyntelPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * Adyntel API key. Optional: when omitted it is read from the account's
	 * stored `api_key`.
	 */
	key?: string;
	/**
	 * The Adyntel account email. Every call needs it in the body next to the
	 * key, and a key without it is a 401. Optional: when omitted it is read
	 * from the account's stored `email`.
	 */
	email?: string;
	hooks?: InternalAdyntelPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof adyntelEndpointsNested>;
};

/**
 * Adyntel authenticates with two account fields, not a header: the key and the
 * email of the account that owns it. Both are sent in the JSON body of every
 * request.
 */
export const adyntelAuthConfig = {
	api_key: {
		account: ['email'] as const,
	},
} as const satisfies PluginAuthConfig;

export type AdyntelContext = CorsairPluginContext<
	typeof AdyntelSchema,
	AdyntelPluginOptions,
	undefined,
	typeof adyntelAuthConfig
>;

export type AdyntelKeyBuilderContext = KeyBuilderContext<
	AdyntelPluginOptions,
	typeof adyntelAuthConfig
>;

export type AdyntelBoundEndpoints = BindEndpoints<
	typeof adyntelEndpointsNested
>;

type AdyntelEndpoint<K extends keyof AdyntelEndpointOutputs> = CorsairEndpoint<
	AdyntelContext,
	AdyntelEndpointInputs[K],
	AdyntelEndpointOutputs[K]
>;

export type AdyntelEndpoints = {
	metaAds: AdyntelEndpoint<'metaAds'>;
	metaAdSearch: AdyntelEndpoint<'metaAdSearch'>;
	googleAds: AdyntelEndpoint<'googleAds'>;
	googleShopping: AdyntelEndpoint<'googleShopping'>;
	googleShoppingStatus: AdyntelEndpoint<'googleShoppingStatus'>;
	linkedinAds: AdyntelEndpoint<'linkedinAds'>;
	linkedinKeywordSearch: AdyntelEndpoint<'linkedinKeywordSearch'>;
	tiktokAds: AdyntelEndpoint<'tiktokAds'>;
	tiktokKeywordSearch: AdyntelEndpoint<'tiktokKeywordSearch'>;
	tiktokAdDetails: AdyntelEndpoint<'tiktokAdDetails'>;
	paidVsOrganic: AdyntelEndpoint<'paidVsOrganic'>;
};

const adyntelEndpointsNested = {
	meta: {
		ads: Meta.ads,
		adSearch: Meta.adSearch,
	},
	google: {
		ads: Google.ads,
		shopping: Google.shopping,
		shoppingStatus: Google.shoppingStatus,
	},
	linkedin: {
		ads: LinkedIn.ads,
		keywordSearch: LinkedIn.keywordSearch,
	},
	tiktok: {
		ads: TikTok.ads,
		keywordSearch: TikTok.keywordSearch,
		adDetails: TikTok.adDetails,
	},
	keywords: {
		paidVsOrganic: Keywords.paidVsOrganic,
	},
} as const;

export const adyntelEndpointSchemas = {
	'meta.ads': {
		input: AdyntelEndpointInputSchemas.metaAds,
		output: AdyntelEndpointOutputSchemas.metaAds,
	},
	'meta.adSearch': {
		input: AdyntelEndpointInputSchemas.metaAdSearch,
		output: AdyntelEndpointOutputSchemas.metaAdSearch,
	},
	'google.ads': {
		input: AdyntelEndpointInputSchemas.googleAds,
		output: AdyntelEndpointOutputSchemas.googleAds,
	},
	'google.shopping': {
		input: AdyntelEndpointInputSchemas.googleShopping,
		output: AdyntelEndpointOutputSchemas.googleShopping,
	},
	'google.shoppingStatus': {
		input: AdyntelEndpointInputSchemas.googleShoppingStatus,
		output: AdyntelEndpointOutputSchemas.googleShoppingStatus,
	},
	'linkedin.ads': {
		input: AdyntelEndpointInputSchemas.linkedinAds,
		output: AdyntelEndpointOutputSchemas.linkedinAds,
	},
	'linkedin.keywordSearch': {
		input: AdyntelEndpointInputSchemas.linkedinKeywordSearch,
		output: AdyntelEndpointOutputSchemas.linkedinKeywordSearch,
	},
	'tiktok.ads': {
		input: AdyntelEndpointInputSchemas.tiktokAds,
		output: AdyntelEndpointOutputSchemas.tiktokAds,
	},
	'tiktok.keywordSearch': {
		input: AdyntelEndpointInputSchemas.tiktokKeywordSearch,
		output: AdyntelEndpointOutputSchemas.tiktokKeywordSearch,
	},
	'tiktok.adDetails': {
		input: AdyntelEndpointInputSchemas.tiktokAdDetails,
		output: AdyntelEndpointOutputSchemas.tiktokAdDetails,
	},
	'keywords.paidVsOrganic': {
		input: AdyntelEndpointInputSchemas.paidVsOrganic,
		output: AdyntelEndpointOutputSchemas.paidVsOrganic,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof adyntelEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const adyntelEndpointMeta = {
	'meta.ads': {
		riskLevel: 'read',
		description:
			"List a company's Facebook and Instagram ads from Meta's Ad Library, by Facebook page or domain, with country, language, media-type and ad-category filters and a continuation token per page",
	},
	'meta.adSearch': {
		riskLevel: 'read',
		description:
			'Search the whole Meta ad library for a keyword, optionally limited to one country, with a continuation token per page',
	},
	'google.ads': {
		riskLevel: 'read',
		description:
			"List a company's Google ads from Google's Ad Transparency report by domain, filtered by media type and country, with a continuation token per page",
	},
	'google.shopping': {
		riskLevel: 'read',
		description:
			'Start a Google Shopping ad lookup for a domain: synchronous ads when `shopping` is true, otherwise a task ID to poll with `google.shoppingStatus`',
	},
	'google.shoppingStatus': {
		riskLevel: 'read',
		description:
			'Read the ads of a Google Shopping lookup started by `google.shopping`; free, and the only way to collect an async task',
	},
	'linkedin.ads': {
		riskLevel: 'read',
		description:
			"List a company's LinkedIn ads by domain or page ID, with optional date filtering, EU impression data and creative text extraction, each of which costs an extra credit",
	},
	'linkedin.keywordSearch': {
		riskLevel: 'read',
		description:
			'Search the LinkedIn Ad Library for a keyword, filtered by country and date range, with a continuation token per page',
	},
	'tiktok.ads': {
		riskLevel: 'read',
		description:
			"List a company's TikTok ads by domain, optionally including the influencers posting sponsored content for the brand, with continuation tokens",
	},
	'tiktok.keywordSearch': {
		riskLevel: 'read',
		description:
			'Search the TikTok ad library for a keyword, limited to European countries or worldwide, with a search ID for the next page',
	},
	'tiktok.adDetails': {
		riskLevel: 'read',
		description:
			'Read one TikTok ad in full, including its advertiser and its targeting, from an ad ID returned by `tiktok.keywordSearch`',
	},
	'keywords.paidVsOrganic': {
		riskLevel: 'read',
		description:
			'Read paid and organic keyword counts for a domain, with position breakdowns, estimated traffic, ad budget and average CPC',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof adyntelEndpointsNested>;

export type BaseAdyntelPlugin<T extends AdyntelPluginOptions> = CorsairPlugin<
	'adyntel',
	typeof AdyntelSchema,
	typeof adyntelEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof adyntelAuthConfig
>;

export type InternalAdyntelPlugin = BaseAdyntelPlugin<AdyntelPluginOptions>;

export type ExternalAdyntelPlugin<T extends AdyntelPluginOptions> =
	BaseAdyntelPlugin<T>;

export function adyntel<const T extends AdyntelPluginOptions>(
	incomingOptions: AdyntelPluginOptions & T = {} as AdyntelPluginOptions & T,
): ExternalAdyntelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'adyntel',
		authConfig: adyntelAuthConfig,
		schema: AdyntelSchema,
		options: options,
		hooks: options.hooks,
		endpoints: adyntelEndpointsNested,
		webhooks: {},
		endpointMeta: adyntelEndpointMeta,
		endpointSchemas: adyntelEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: AdyntelKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('adyntel', ctx.authType ?? 'api_key');
		},
	} satisfies InternalAdyntelPlugin;
}

export { AdyntelAPIError } from './client';

export type {
	AdyntelEndpointInputs,
	AdyntelEndpointOutputs,
	GoogleAdsInput,
	GoogleAdsResponse,
	GoogleShoppingInput,
	GoogleShoppingResponse,
	GoogleShoppingStatusInput,
	GoogleShoppingStatusResponse,
	LinkedInAdsInput,
	LinkedInAdsResponse,
	LinkedInKeywordSearchInput,
	LinkedInKeywordSearchResponse,
	MetaAdSearchInput,
	MetaAdSearchResponse,
	MetaAdsInput,
	MetaAdsResponse,
	PaidVsOrganicInput,
	PaidVsOrganicResponse,
	TikTokAdDetailsInput,
	TikTokAdDetailsResponse,
	TikTokAdsInput,
	TikTokAdsResponse,
	TikTokKeywordSearchInput,
	TikTokKeywordSearchResponse,
} from './endpoints/types';
