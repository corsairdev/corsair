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
	AnchorText,
	Competitors,
	Jobs,
	LinkingDomains,
	Links,
	Locales,
	Metrics,
	Quota,
	TopPages,
} from './endpoints';
import type { MozEndpointInputs, MozEndpointOutputs } from './endpoints/types';
import {
	MozEndpointInputSchemas,
	MozEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MozSchema } from './schema';

export type MozPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The Moz API token, from the Moz API dashboard. */
	key?: string;
	hooks?: InternalMozPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mozEndpointsNested>;
};

export type MozContext = CorsairPluginContext<
	typeof MozSchema,
	MozPluginOptions,
	undefined
>;

export type MozKeyBuilderContext = KeyBuilderContext<MozPluginOptions>;

export type MozBoundEndpoints = BindEndpoints<typeof mozEndpointsNested>;

type MozEndpoint<K extends keyof MozEndpointOutputs> = CorsairEndpoint<
	MozContext,
	MozEndpointInputs[K],
	MozEndpointOutputs[K]
>;

export type MozEndpoints = {
	quotaLookup: MozEndpoint<'quotaLookup'>;
	localesList: MozEndpoint<'localesList'>;
	metricsFetch: MozEndpoint<'metricsFetch'>;
	metricsFetchMultiple: MozEndpoint<'metricsFetchMultiple'>;
	linksList: MozEndpoint<'linksList'>;
	linksIntersect: MozEndpoint<'linksIntersect'>;
	linkingDomainsList: MozEndpoint<'linkingDomainsList'>;
	anchorTextList: MozEndpoint<'anchorTextList'>;
	topPagesList: MozEndpoint<'topPagesList'>;
	competitorsFetch: MozEndpoint<'competitorsFetch'>;
	jobsLookup: MozEndpoint<'jobsLookup'>;
};

const mozEndpointsNested = {
	quota: {
		lookup: Quota.lookup,
	},
	locales: {
		list: Locales.list,
	},
	metrics: {
		fetch: Metrics.fetchMetrics,
		fetchMultiple: Metrics.fetchMultiple,
	},
	links: {
		list: Links.list,
		intersect: Links.intersect,
	},
	linkingDomains: {
		list: LinkingDomains.list,
	},
	anchorText: {
		list: AnchorText.list,
	},
	topPages: {
		list: TopPages.list,
	},
	competitors: {
		fetch: Competitors.fetchCompetitors,
	},
	jobs: {
		lookup: Jobs.lookup,
	},
} as const;

export const mozEndpointSchemas = {
	'quota.lookup': {
		input: MozEndpointInputSchemas.quotaLookup,
		output: MozEndpointOutputSchemas.quotaLookup,
	},
	'locales.list': {
		input: MozEndpointInputSchemas.localesList,
		output: MozEndpointOutputSchemas.localesList,
	},
	'metrics.fetch': {
		input: MozEndpointInputSchemas.metricsFetch,
		output: MozEndpointOutputSchemas.metricsFetch,
	},
	'metrics.fetchMultiple': {
		input: MozEndpointInputSchemas.metricsFetchMultiple,
		output: MozEndpointOutputSchemas.metricsFetchMultiple,
	},
	'links.list': {
		input: MozEndpointInputSchemas.linksList,
		output: MozEndpointOutputSchemas.linksList,
	},
	'links.intersect': {
		input: MozEndpointInputSchemas.linksIntersect,
		output: MozEndpointOutputSchemas.linksIntersect,
	},
	'linkingDomains.list': {
		input: MozEndpointInputSchemas.linkingDomainsList,
		output: MozEndpointOutputSchemas.linkingDomainsList,
	},
	'anchorText.list': {
		input: MozEndpointInputSchemas.anchorTextList,
		output: MozEndpointOutputSchemas.anchorTextList,
	},
	'topPages.list': {
		input: MozEndpointInputSchemas.topPagesList,
		output: MozEndpointOutputSchemas.topPagesList,
	},
	'competitors.fetch': {
		input: MozEndpointInputSchemas.competitorsFetch,
		output: MozEndpointOutputSchemas.competitorsFetch,
	},
	'jobs.lookup': {
		input: MozEndpointInputSchemas.jobsLookup,
		output: MozEndpointOutputSchemas.jobsLookup,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof mozEndpointsNested>;

// The competitor fetch answers with an async_call receipt. Its failures ride
// inside the completed call (async_call.error), so there is no failed status
// value: core treats done as terminal and the caller reads error from the
// same lookup.
const COMPETITOR_JOB = {
	idPath: 'async_call.id',
	status: {
		op: 'jobs.lookup',
		idArg: 'id',
		statusPath: 'async_call.status',
		done: ['complete'],
		failed: [],
	},
} as const;

const defaultAuthType = 'api_key' as const;

const mozEndpointMeta = {
	'quota.lookup': {
		riskLevel: 'read',
		description:
			'Read how much API quota is used and remaining for a billing period, and whether overages are enabled',
	},
	'locales.list': {
		riskLevel: 'read',
		description:
			'List every locale a search engine (google, bing or yahoo) supports; costs no rows',
	},
	'metrics.fetch': {
		riskLevel: 'read',
		description:
			'Read Domain Authority, Page Authority, Spam Score and link counts for one URL, subdomain, subfolder or domain',
	},
	'metrics.fetchMultiple': {
		riskLevel: 'read',
		description:
			'Read the same site metrics for several targets at once, with a per-target success or error split',
	},
	'links.list': {
		riskLevel: 'read',
		description:
			'List the links pointing at a target with source and target metrics, filters, sorting and token paging',
	},
	'links.intersect': {
		riskLevel: 'read',
		description:
			'Find sources that link to some targets but not others, a Venn diagram of link profiles (up to 6 targets)',
	},
	'linkingDomains.list': {
		riskLevel: 'read',
		description:
			'List the root domains linking to a target with authority, link propensity and per-domain link counts',
	},
	'anchorText.list': {
		riskLevel: 'read',
		description:
			'List the anchor texts used to link to a target with unique root domain and page counts',
	},
	'topPages.list': {
		riskLevel: 'read',
		description:
			"List a target's top pages sorted by page authority, linking root domains or external linking pages",
	},
	'competitors.fetch': {
		riskLevel: 'read',
		description:
			'Start the ranking-competitors lookup for a site; answers with an async_call receipt to follow with jobs.lookup. Spends mozscape quota',
		job: COMPETITOR_JOB,
	},
	'jobs.lookup': {
		riskLevel: 'read',
		description:
			'Read an async_call by id: pending or processing means poll again, complete carries the result or the error. Free',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mozEndpointsNested>;

/**
 * Moz authenticates with a single API token in the x-moz-token header,
 * generated on the Moz API dashboard.
 */
const defaultAuthConfig = {} as const;

export type BaseMozPlugin<T extends MozPluginOptions> = CorsairPlugin<
	'moz',
	typeof MozSchema,
	typeof mozEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof defaultAuthConfig
>;

export type InternalMozPlugin = BaseMozPlugin<MozPluginOptions>;

export type ExternalMozPlugin<T extends MozPluginOptions> = BaseMozPlugin<T>;

export function moz<const T extends MozPluginOptions>(
	incomingOptions: MozPluginOptions & T = {} as MozPluginOptions & T,
): ExternalMozPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'moz',
		schema: MozSchema,
		options: options,
		hooks: options.hooks,
		endpoints: mozEndpointsNested,
		webhooks: {},
		authConfig: defaultAuthConfig,
		endpointMeta: mozEndpointMeta,
		endpointSchemas: mozEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MozKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('moz', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMozPlugin;
}

export { MozAPIError } from './client';

export type {
	AnchorTextItem,
	AnchorTextListInput,
	AnchorTextListResponse,
	AsyncCall,
	CompetitorsFetchInput,
	CompetitorsFetchResponse,
	JobsLookupInput,
	JobsLookupResponse,
	LinkIntersectInput,
	LinkIntersectResponse,
	LinkingDomainListInput,
	LinkingDomainListResponse,
	LinkListInput,
	LinkListResponse,
	LocalesListInput,
	LocalesListResponse,
	MetricsFetchInput,
	MetricsFetchMultipleInput,
	MetricsFetchMultipleResponse,
	MetricsFetchResponse,
	MozEndpointInputs,
	MozEndpointOutputs,
	QuotaLookupInput,
	QuotaLookupResponse,
	TopPageListInput,
	TopPageListResponse,
} from './endpoints/types';
