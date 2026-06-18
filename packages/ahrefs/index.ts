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
	KeywordsExplorer,
	RankTracker,
	SerpOverview,
	SiteExplorer,
	SubscriptionInfo,
} from './endpoints';
import type {
	AhrefsEndpointInputs,
	AhrefsEndpointOutputs,
} from './endpoints/types';
import {
	AhrefsEndpointInputSchemas,
	AhrefsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AhrefsSchema } from './schema';

export type AhrefsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAhrefsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ahrefsEndpointsNested>;
};

export type AhrefsContext = CorsairPluginContext<
	typeof AhrefsSchema,
	AhrefsPluginOptions
>;

export type AhrefsKeyBuilderContext = KeyBuilderContext<AhrefsPluginOptions>;

export type AhrefsBoundEndpoints = BindEndpoints<typeof ahrefsEndpointsNested>;

type AhrefsEndpoint<K extends keyof AhrefsEndpointOutputs> = CorsairEndpoint<
	AhrefsContext,
	AhrefsEndpointInputs[K],
	AhrefsEndpointOutputs[K]
>;

export type AhrefsEndpoints = {
	getDomainRating: AhrefsEndpoint<'getDomainRating'>;
	backlinksStats: AhrefsEndpoint<'backlinksStats'>;
	organicKeywords: AhrefsEndpoint<'organicKeywords'>;
	refdomains: AhrefsEndpoint<'refdomains'>;
	topPages: AhrefsEndpoint<'topPages'>;
	keywordsOverview: AhrefsEndpoint<'keywordsOverview'>;
	rankTrackerOverview: AhrefsEndpoint<'rankTrackerOverview'>;
	serpOverview: AhrefsEndpoint<'serpOverview'>;
	limitsAndUsage: AhrefsEndpoint<'limitsAndUsage'>;
};

const ahrefsEndpointsNested = {
	siteExplorer: {
		getDomainRating: SiteExplorer.getDomainRating,
		backlinksStats: SiteExplorer.backlinksStats,
		organicKeywords: SiteExplorer.organicKeywords,
		refdomains: SiteExplorer.refdomains,
		topPages: SiteExplorer.topPages,
	},
	keywordsExplorer: {
		overview: KeywordsExplorer.overview,
	},
	rankTracker: {
		overview: RankTracker.overview,
	},
	serp: {
		overview: SerpOverview.overview,
	},
	subscriptionInfo: {
		limitsAndUsage: SubscriptionInfo.limitsAndUsage,
	},
} as const;



export const ahrefsEndpointSchemas = {
	'siteExplorer.getDomainRating': {
		input: AhrefsEndpointInputSchemas.getDomainRating,
		output: AhrefsEndpointOutputSchemas.getDomainRating,
	},
	'siteExplorer.backlinksStats': {
		input: AhrefsEndpointInputSchemas.backlinksStats,
		output: AhrefsEndpointOutputSchemas.backlinksStats,
	},
	'siteExplorer.organicKeywords': {
		input: AhrefsEndpointInputSchemas.organicKeywords,
		output: AhrefsEndpointOutputSchemas.organicKeywords,
	},
	'siteExplorer.refdomains': {
		input: AhrefsEndpointInputSchemas.refdomains,
		output: AhrefsEndpointOutputSchemas.refdomains,
	},
	'siteExplorer.topPages': {
		input: AhrefsEndpointInputSchemas.topPages,
		output: AhrefsEndpointOutputSchemas.topPages,
	},
	'keywordsExplorer.overview': {
		input: AhrefsEndpointInputSchemas.keywordsOverview,
		output: AhrefsEndpointOutputSchemas.keywordsOverview,
	},
	'rankTracker.overview': {
		input: AhrefsEndpointInputSchemas.rankTrackerOverview,
		output: AhrefsEndpointOutputSchemas.rankTrackerOverview,
	},
	'serp.overview': {
		input: AhrefsEndpointInputSchemas.serpOverview,
		output: AhrefsEndpointOutputSchemas.serpOverview,
	},
	'subscriptionInfo.limitsAndUsage': {
		input: AhrefsEndpointInputSchemas.limitsAndUsage,
		output: AhrefsEndpointOutputSchemas.limitsAndUsage,
	},
} satisfies RequiredPluginEndpointSchemas<typeof ahrefsEndpointsNested>;

const ahrefsEndpointMeta = {
	'siteExplorer.getDomainRating': {
		riskLevel: 'read',
		description: 'Get Ahrefs Domain Rating and Ahrefs Rank for a target',
	},
	'siteExplorer.backlinksStats': {
		riskLevel: 'read',
		description:
			'Get live and all-time backlink and referring-domain counts for a target',
	},
	'siteExplorer.organicKeywords': {
		riskLevel: 'read',
		description:
			'List organic keywords a target ranks for, including positions and traffic metrics',
	},
	'siteExplorer.refdomains': {
		riskLevel: 'read',
		description: 'List referring domains linking to a target',
	},
	'siteExplorer.topPages': {
		riskLevel: 'read',
		description:
			'List top organic pages for a target with traffic, keyword, and link metrics',
	},
	'keywordsExplorer.overview': {
		riskLevel: 'read',
		description:
			'Get keyword metrics such as volume, difficulty, CPC, clicks, and traffic potential',
	},
	'rankTracker.overview': {
		riskLevel: 'read',
		description:
			'Get Rank Tracker keyword overview data for a project and device',
	},
	'serp.overview': {
		riskLevel: 'read',
		description:
			'Get SERP positions for a keyword and country, including ranking page metrics',
	},
	'subscriptionInfo.limitsAndUsage': {
		riskLevel: 'read',
		description: 'Get Ahrefs subscription limits and API unit usage',
	},
} satisfies RequiredPluginEndpointMeta<typeof ahrefsEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const ahrefsAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAhrefsPlugin<T extends AhrefsPluginOptions> = CorsairPlugin<
	'ahrefs',
	typeof AhrefsSchema,
	typeof ahrefsEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof ahrefsAuthConfig
>;

export type InternalAhrefsPlugin = BaseAhrefsPlugin<AhrefsPluginOptions>;

export type ExternalAhrefsPlugin<T extends AhrefsPluginOptions> =
	BaseAhrefsPlugin<T>;

// The assertion is safe: AhrefsPluginOptions has no required fields (all are
// optional), so an empty object satisfies the constraint at runtime even
// though TypeScript cannot verify it without the assertion.
export function ahrefs<const T extends AhrefsPluginOptions>(
	incomingOptions: AhrefsPluginOptions & T = {} as AhrefsPluginOptions & T,
): ExternalAhrefsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'ahrefs',
		schema: AhrefsSchema,
		options,
		hooks: options.hooks,
		endpoints: ahrefsEndpointsNested,
		webhooks: {},
		endpointMeta: ahrefsEndpointMeta,
		endpointSchemas: ahrefsEndpointSchemas,
		authConfig: ahrefsAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AhrefsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('ahrefs', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('ahrefs', 'api_key');
		},
	} satisfies InternalAhrefsPlugin;
}

export type {
	AhrefsEndpointInputs,
	AhrefsEndpointOutputs,
	BacklinksStatsInput,
	BacklinksStatsResponse,
	DomainRatingInput,
	DomainRatingResponse,
	KeywordOverview,
	KeywordsOverviewInput,
	KeywordsOverviewResponse,
	LimitsAndUsage,
	LimitsAndUsageInput,
	LimitsAndUsageResponse,
	OrganicKeyword,
	OrganicKeywordsInput,
	OrganicKeywordsResponse,
	RankTrackerOverviewInput,
	RankTrackerOverviewItem,
	RankTrackerOverviewResponse,
	Refdomain,
	RefdomainsInput,
	RefdomainsResponse,
	SerpOverviewInput,
	SerpOverviewResponse,
	SerpPosition,
	TopPage,
	TopPagesInput,
	TopPagesResponse,
} from './endpoints/types';

export {
	AhrefsEndpointInputSchemas,
	AhrefsEndpointOutputSchemas,
	BacklinksStatsInputSchema,
	BacklinksStatsResponseSchema,
	DomainRatingInputSchema,
	DomainRatingResponseSchema,
	KeywordsOverviewInputSchema,
	KeywordsOverviewResponseSchema,
	LimitsAndUsageInputSchema,
	LimitsAndUsageResponseSchema,
	OrganicKeywordsInputSchema,
	OrganicKeywordsResponseSchema,
	RankTrackerOverviewInputSchema,
	RankTrackerOverviewResponseSchema,
	RefdomainsInputSchema,
	RefdomainsResponseSchema,
	SerpOverviewInputSchema,
	SerpOverviewResponseSchema,
	TopPagesInputSchema,
	TopPagesResponseSchema,
} from './endpoints/types';
