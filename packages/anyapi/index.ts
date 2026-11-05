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
import {
	createManagedPricingCredentialCache,
	resolveManagedPricingApiKey,
} from 'corsair/hub';
import {
	Account,
	Apis,
	Google,
	Instagram,
	LinkedIn,
	Maps,
	Reddit,
	Requests,
	Results,
	Twitter,
	Web,
} from './endpoints';
import type {
	AnyApiEndpointInputs,
	AnyApiEndpointOutputs,
} from './endpoints/types';
import {
	AnyApiEndpointInputSchemas,
	AnyApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AnyApiSchema } from './schema';

export type AnyApiPluginOptions = {
	authType?: PickAuth<'api_key' | 'managed_pricing'>;
	key?: string;
	hooks?: InternalAnyApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof anyApiEndpointsNested>;
};

export type AnyApiContext = CorsairPluginContext<
	typeof AnyApiSchema,
	AnyApiPluginOptions
>;

export type AnyApiKeyBuilderContext = KeyBuilderContext<AnyApiPluginOptions>;

export type AnyApiBoundEndpoints = BindEndpoints<typeof anyApiEndpointsNested>;

type AnyApiEndpoint<K extends keyof AnyApiEndpointOutputs> = CorsairEndpoint<
	AnyApiContext,
	AnyApiEndpointInputs[K],
	AnyApiEndpointOutputs[K]
>;

export type AnyApiEndpoints = {
	apisSearch: AnyApiEndpoint<'apisSearch'>;
	apisList: AnyApiEndpoint<'apisList'>;
	apisGet: AnyApiEndpoint<'apisGet'>;
	apisQuote: AnyApiEndpoint<'apisQuote'>;
	apisRun: AnyApiEndpoint<'apisRun'>;
	resultsGet: AnyApiEndpoint<'resultsGet'>;
	requestsGet: AnyApiEndpoint<'requestsGet'>;
	accountGetBalance: AnyApiEndpoint<'accountGetBalance'>;
	googleSearch: AnyApiEndpoint<'googleSearch'>;
	webScrape: AnyApiEndpoint<'webScrape'>;
	linkedinGetProfile: AnyApiEndpoint<'linkedinGetProfile'>;
	linkedinGetCompany: AnyApiEndpoint<'linkedinGetCompany'>;
	twitterSearch: AnyApiEndpoint<'twitterSearch'>;
	redditSearch: AnyApiEndpoint<'redditSearch'>;
	instagramGetProfile: AnyApiEndpoint<'instagramGetProfile'>;
	mapsSearch: AnyApiEndpoint<'mapsSearch'>;
};

const anyApiEndpointsNested = {
	apis: {
		search: Apis.search,
		list: Apis.list,
		get: Apis.get,
		quote: Apis.quote,
		run: Apis.run,
	},
	results: {
		get: Results.get,
	},
	requests: {
		get: Requests.get,
	},
	account: {
		getBalance: Account.getBalance,
	},
	google: {
		search: Google.search,
	},
	web: {
		scrape: Web.scrape,
	},
	linkedin: {
		getProfile: LinkedIn.getProfile,
		getCompany: LinkedIn.getCompany,
	},
	twitter: {
		search: Twitter.search,
	},
	reddit: {
		search: Reddit.search,
	},
	instagram: {
		getProfile: Instagram.getProfile,
	},
	maps: {
		search: Maps.search,
	},
} as const;

export const anyApiEndpointSchemas = {
	'apis.search': {
		input: AnyApiEndpointInputSchemas.apisSearch,
		output: AnyApiEndpointOutputSchemas.apisSearch,
	},
	'apis.list': {
		input: AnyApiEndpointInputSchemas.apisList,
		output: AnyApiEndpointOutputSchemas.apisList,
	},
	'apis.get': {
		input: AnyApiEndpointInputSchemas.apisGet,
		output: AnyApiEndpointOutputSchemas.apisGet,
	},
	'apis.quote': {
		input: AnyApiEndpointInputSchemas.apisQuote,
		output: AnyApiEndpointOutputSchemas.apisQuote,
	},
	'apis.run': {
		input: AnyApiEndpointInputSchemas.apisRun,
		output: AnyApiEndpointOutputSchemas.apisRun,
	},
	'results.get': {
		input: AnyApiEndpointInputSchemas.resultsGet,
		output: AnyApiEndpointOutputSchemas.resultsGet,
	},
	'requests.get': {
		input: AnyApiEndpointInputSchemas.requestsGet,
		output: AnyApiEndpointOutputSchemas.requestsGet,
	},
	'account.getBalance': {
		input: AnyApiEndpointInputSchemas.accountGetBalance,
		output: AnyApiEndpointOutputSchemas.accountGetBalance,
	},
	'google.search': {
		input: AnyApiEndpointInputSchemas.googleSearch,
		output: AnyApiEndpointOutputSchemas.googleSearch,
	},
	'web.scrape': {
		input: AnyApiEndpointInputSchemas.webScrape,
		output: AnyApiEndpointOutputSchemas.webScrape,
	},
	'linkedin.getProfile': {
		input: AnyApiEndpointInputSchemas.linkedinGetProfile,
		output: AnyApiEndpointOutputSchemas.linkedinGetProfile,
	},
	'linkedin.getCompany': {
		input: AnyApiEndpointInputSchemas.linkedinGetCompany,
		output: AnyApiEndpointOutputSchemas.linkedinGetCompany,
	},
	'twitter.search': {
		input: AnyApiEndpointInputSchemas.twitterSearch,
		output: AnyApiEndpointOutputSchemas.twitterSearch,
	},
	'reddit.search': {
		input: AnyApiEndpointInputSchemas.redditSearch,
		output: AnyApiEndpointOutputSchemas.redditSearch,
	},
	'instagram.getProfile': {
		input: AnyApiEndpointInputSchemas.instagramGetProfile,
		output: AnyApiEndpointOutputSchemas.instagramGetProfile,
	},
	'maps.search': {
		input: AnyApiEndpointInputSchemas.mapsSearch,
		output: AnyApiEndpointOutputSchemas.mapsSearch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof anyApiEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const anyApiManagedPricingCache = createManagedPricingCredentialCache();

const anyApiEndpointMeta = {
	'apis.search': {
		riskLevel: 'read',
		description:
			'Search the AnyAPI catalog of 470+ data endpoints by what you need, such as linkedin company employees; returns SKUs with prices',
	},
	'apis.list': {
		riskLevel: 'read',
		description:
			'List AnyAPI endpoints, optionally in one category, with their SKUs and prices',
	},
	'apis.get': {
		riskLevel: 'read',
		description:
			'Get one AnyAPI endpoint by SKU: its input and output JSON Schema, price and recent latency',
	},
	'apis.quote': {
		riskLevel: 'read',
		description:
			'Price an AnyAPI run for an exact input and validate the input, without running or charging anything',
	},
	'apis.run': {
		riskLevel: 'read',
		description:
			'Run any AnyAPI endpoint by SKU with its input (read the schema with apis.get first); returns the result, its USD cost and a resultId',
	},
	'results.get': {
		riskLevel: 'read',
		description:
			'Re-read and re-shape a run result for free (fields, maxItems, summary, jq) within about 15 minutes of the run',
	},
	'requests.get': {
		riskLevel: 'read',
		description:
			'Get the status and, once finished, the result of a durable AnyAPI run that answered queued or running',
	},
	'account.getBalance': {
		riskLevel: 'read',
		description: 'Get the AnyAPI wallet balance in USD',
	},
	'google.search': {
		riskLevel: 'read',
		description:
			'Search Google and get organic results (title, link, snippet), with country, language, location and time filters',
	},
	'web.scrape': {
		riskLevel: 'read',
		description:
			'Scrape any web page, including ones that block bots, as clean markdown and/or HTML',
	},
	'linkedin.getProfile': {
		riskLevel: 'read',
		description:
			'Get a LinkedIn profile by URL: headline, about, location, followers, experience, education and skills',
	},
	'linkedin.getCompany': {
		riskLevel: 'read',
		description:
			'Get a LinkedIn company page by URL: description, industry, website, employee and follower counts, locations',
	},
	'twitter.search': {
		riskLevel: 'read',
		description:
			'Search X (Twitter) posts with advanced-search syntax, Latest or Top, with paging',
	},
	'reddit.search': {
		riskLevel: 'read',
		description:
			'Search Reddit posts across all subreddits, with sort and time filters',
	},
	'instagram.getProfile': {
		riskLevel: 'read',
		description:
			'Get an Instagram profile by handle: bio, follower, following and post counts, verified and business flags',
	},
	'maps.search': {
		riskLevel: 'read',
		description:
			'Search Google Maps places in a location: name, address, phone, website, rating and review count',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof anyApiEndpointsNested>;

export type BaseAnyApiPlugin<T extends AnyApiPluginOptions> = CorsairPlugin<
	'anyapi',
	typeof AnyApiSchema,
	typeof anyApiEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalAnyApiPlugin = BaseAnyApiPlugin<AnyApiPluginOptions>;

export type ExternalAnyApiPlugin<T extends AnyApiPluginOptions> =
	BaseAnyApiPlugin<T>;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}

export function anyapi<const T extends AnyApiPluginOptions>(
	incomingOptions: AnyApiPluginOptions & T = {} as AnyApiPluginOptions & T,
): ExternalAnyApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'anyapi',
		schema: AnyApiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: anyApiEndpointsNested,
		webhooks: {},
		endpointMeta: anyApiEndpointMeta,
		endpointSchemas: anyApiEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: AnyApiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			if (source === 'endpoint' && ctx.authType === 'managed_pricing') {
				return resolveManagedPricingApiKey(ctx, {
					plugin: 'anyapi',
					cache: anyApiManagedPricingCache,
					operation: ctx.meteredOperationId,
				});
			}

			throw new AuthMissingError('anyapi', ctx.authType ?? 'api_key');
		},
	} satisfies InternalAnyApiPlugin;
}

export type {
	AnyApiEndpointInputs,
	AnyApiEndpointOutputs,
	AnyApiOperation,
	ApisRunInput,
	ApisRunResponse,
	RequestSnapshot,
} from './endpoints/types';
