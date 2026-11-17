import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, Apps, Categories, Websites } from './endpoints';
import type {
	SimilarwebEndpointInputs,
	SimilarwebEndpointOutputs,
} from './endpoints/types';
import {
	SimilarwebEndpointInputSchemas,
	SimilarwebEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SimilarwebSchema } from './schema';

export type SimilarwebPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSimilarwebPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof similarwebEndpointsNested>;
};

export type SimilarwebContext = CorsairPluginContext<
	typeof SimilarwebSchema,
	SimilarwebPluginOptions,
	// The endpoints are not passed here: they reference this context through
	// SimilarwebEndpoint, and passing them back would make the type circular.
	undefined
>;

export type SimilarwebKeyBuilderContext =
	KeyBuilderContext<SimilarwebPluginOptions>;

export type SimilarwebBoundEndpoints = BindEndpoints<
	typeof similarwebEndpointsNested
>;

type SimilarwebEndpoint<K extends keyof SimilarwebEndpointOutputs> =
	CorsairEndpoint<
		SimilarwebContext,
		SimilarwebEndpointInputs[K],
		SimilarwebEndpointOutputs[K]
	>;

export type SimilarwebEndpoints = {
	websitesGlobalRank: SimilarwebEndpoint<'websitesGlobalRank'>;
	websitesCountryRank: SimilarwebEndpoint<'websitesCountryRank'>;
	websitesIndustryRank: SimilarwebEndpoint<'websitesIndustryRank'>;
	websitesTopSites: SimilarwebEndpoint<'websitesTopSites'>;
	appsRank: SimilarwebEndpoint<'appsRank'>;
	appsDescribe: SimilarwebEndpoint<'appsDescribe'>;
	categoriesList: SimilarwebEndpoint<'categoriesList'>;
	capabilitiesGet: SimilarwebEndpoint<'capabilitiesGet'>;
	usageGet: SimilarwebEndpoint<'usageGet'>;
};

const similarwebEndpointsNested = {
	websites: {
		globalRank: Websites.globalRank,
		countryRank: Websites.countryRank,
		industryRank: Websites.industryRank,
		topSites: Websites.topSites,
	},
	apps: {
		rank: Apps.rank,
		describe: Apps.describe,
	},
	categories: {
		list: Categories.list,
	},
	capabilities: {
		get: Account.get,
	},
	usage: {
		get: Account.usage,
	},
} as const;

export const similarwebEndpointSchemas = {
	'websites.globalRank': {
		input: SimilarwebEndpointInputSchemas.websitesGlobalRank,
		output: SimilarwebEndpointOutputSchemas.websitesGlobalRank,
	},
	'websites.countryRank': {
		input: SimilarwebEndpointInputSchemas.websitesCountryRank,
		output: SimilarwebEndpointOutputSchemas.websitesCountryRank,
	},
	'websites.industryRank': {
		input: SimilarwebEndpointInputSchemas.websitesIndustryRank,
		output: SimilarwebEndpointOutputSchemas.websitesIndustryRank,
	},
	'websites.topSites': {
		input: SimilarwebEndpointInputSchemas.websitesTopSites,
		output: SimilarwebEndpointOutputSchemas.websitesTopSites,
	},
	'apps.rank': {
		input: SimilarwebEndpointInputSchemas.appsRank,
		output: SimilarwebEndpointOutputSchemas.appsRank,
	},
	'apps.describe': {
		input: SimilarwebEndpointInputSchemas.appsDescribe,
		output: SimilarwebEndpointOutputSchemas.appsDescribe,
	},
	'categories.list': {
		input: SimilarwebEndpointInputSchemas.categoriesList,
		output: SimilarwebEndpointOutputSchemas.categoriesList,
	},
	'capabilities.get': {
		input: SimilarwebEndpointInputSchemas.capabilitiesGet,
		output: SimilarwebEndpointOutputSchemas.capabilitiesGet,
	},
	'usage.get': {
		input: SimilarwebEndpointInputSchemas.usageGet,
		output: SimilarwebEndpointOutputSchemas.usageGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof similarwebEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const similarwebEndpointMeta = {
	'websites.globalRank': {
		riskLevel: 'read',
		description:
			"Read a domain's global rank month by month, based on estimated unique visitors and page views across desktop and mobile",
	},
	'websites.countryRank': {
		riskLevel: 'read',
		description:
			"Read a domain's rank within one country month by month, for a country code the subscription includes",
	},
	'websites.industryRank': {
		riskLevel: 'read',
		description:
			"Read a domain's industry and its rank within that industry worldwide, as the current reading rather than a series",
	},
	'websites.topSites': {
		riskLevel: 'read',
		description:
			'Read the highest-ranked domains worldwide across desktop and mobile, up to 5000 of them',
	},
	'apps.rank': {
		riskLevel: 'read',
		description:
			"Read an app's store rank day by day for one country and chart, from the App Store or Google Play",
	},
	'apps.describe': {
		riskLevel: 'read',
		description:
			'Read the countries, stores, modes and devices the app rank operation accepts, which is the only way to know a valid mode',
	},
	'categories.list': {
		riskLevel: 'read',
		description:
			'Read the website category tree, with each child mapping to the Parent~Child slug the rank routes accept',
	},
	'capabilities.get': {
		riskLevel: 'read',
		description:
			'Read what the subscription entitles this account to, keyed by capability name',
	},
	'usage.get': {
		riskLevel: 'read',
		description:
			'Read the data credit allowance and how many this user has left; costs no credits',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof similarwebEndpointsNested
>;

export type BaseSimilarwebPlugin<T extends SimilarwebPluginOptions> =
	CorsairPlugin<
		'similarweb',
		typeof SimilarwebSchema,
		typeof similarwebEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalSimilarwebPlugin =
	BaseSimilarwebPlugin<SimilarwebPluginOptions>;

export type ExternalSimilarwebPlugin<T extends SimilarwebPluginOptions> =
	BaseSimilarwebPlugin<T>;

export function similarweb<const T extends SimilarwebPluginOptions>(
	incomingOptions: SimilarwebPluginOptions & T = {} as SimilarwebPluginOptions &
		T,
): ExternalSimilarwebPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'similarweb',
		schema: SimilarwebSchema,
		options: options,
		hooks: options.hooks,
		endpoints: similarwebEndpointsNested,
		webhooks: {},
		endpointMeta: similarwebEndpointMeta,
		endpointSchemas: similarwebEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SimilarwebKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('similarweb', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSimilarwebPlugin;
}

export { isSimilarwebDataNotFound, similarwebErrorText } from './client';

export type {
	AppDescribeResponse,
	AppRankInput,
	AppRankResponse,
	CapabilitiesResponse,
	CategoriesListResponse,
	CountryRankInput,
	CountryRankResponse,
	GlobalRankInput,
	GlobalRankResponse,
	IndustryRankInput,
	IndustryRankResponse,
	SimilarwebEndpointInputs,
	SimilarwebEndpointOutputs,
	TopSitesInput,
	TopSitesResponse,
	UsageResponse,
} from './endpoints/types';
