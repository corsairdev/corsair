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
import { Crawls, Extract, Fetch } from './endpoints';
import type {
	ZenRowsEndpointInputs,
	ZenRowsEndpointOutputs,
} from './endpoints/types';
import {
	ZenRowsEndpointInputSchemas,
	ZenRowsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ZenRowsSchema } from './schema';

export type ZenRowsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalZenRowsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zenRowsEndpointsNested>;
};

export type ZenRowsContext = CorsairPluginContext<
	typeof ZenRowsSchema,
	ZenRowsPluginOptions
>;

export type ZenRowsKeyBuilderContext = KeyBuilderContext<ZenRowsPluginOptions>;

export type ZenRowsBoundEndpoints = BindEndpoints<
	typeof zenRowsEndpointsNested
>;

type ZenRowsEndpoint<K extends keyof ZenRowsEndpointOutputs> = CorsairEndpoint<
	ZenRowsContext,
	ZenRowsEndpointInputs[K],
	ZenRowsEndpointOutputs[K]
>;

export type ZenRowsEndpoints = {
	fetchPage: ZenRowsEndpoint<'fetchPage'>;
	fetchBrowse: ZenRowsEndpoint<'fetchBrowse'>;
	fetchExtract: ZenRowsEndpoint<'fetchExtract'>;
	fetchCssExtract: ZenRowsEndpoint<'fetchCssExtract'>;
	fetchOutputs: ZenRowsEndpoint<'fetchOutputs'>;
	fetchJsonResponse: ZenRowsEndpoint<'fetchJsonResponse'>;
	fetchPost: ZenRowsEndpoint<'fetchPost'>;
	fetchPut: ZenRowsEndpoint<'fetchPut'>;
	crawlStart: ZenRowsEndpoint<'crawlStart'>;
	crawlList: ZenRowsEndpoint<'crawlList'>;
	crawlGet: ZenRowsEndpoint<'crawlGet'>;
	crawlGetContent: ZenRowsEndpoint<'crawlGetContent'>;
	crawlStop: ZenRowsEndpoint<'crawlStop'>;
	extractDomains: ZenRowsEndpoint<'extractDomains'>;
	extractPrepareDomain: ZenRowsEndpoint<'extractPrepareDomain'>;
	extractGetDomainStatus: ZenRowsEndpoint<'extractGetDomainStatus'>;
	extractListPreparedDomains: ZenRowsEndpoint<'extractListPreparedDomains'>;
	extractAllowance: ZenRowsEndpoint<'extractAllowance'>;
	accountSubscription: ZenRowsEndpoint<'accountSubscription'>;
};

const zenRowsEndpointsNested = {
	fetch: {
		page: Fetch.fetchPage,
		browse: Fetch.fetchBrowse,
		extract: Fetch.fetchExtract,
		cssExtract: Fetch.fetchCssExtract,
		outputs: Fetch.fetchOutputs,
		jsonResponse: Fetch.fetchJsonResponse,
		post: Fetch.fetchPost,
		put: Fetch.fetchPut,
	},
	crawl: {
		start: Crawls.start,
		list: Crawls.list,
		get: Crawls.get,
		getContent: Crawls.getContent,
		stop: Crawls.stop,
	},
	extract: {
		domains: Extract.domains,
		prepareDomain: Extract.prepareDomain,
		getDomainStatus: Extract.getDomainStatus,
		listPreparedDomains: Extract.listPreparedDomains,
		allowance: Extract.allowance,
	},
	account: {
		subscription: Extract.subscription,
	},
} as const;

export const zenRowsEndpointSchemas = {
	'fetch.page': {
		input: ZenRowsEndpointInputSchemas.fetchPage,
		output: ZenRowsEndpointOutputSchemas.fetchPage,
	},
	'fetch.browse': {
		input: ZenRowsEndpointInputSchemas.fetchBrowse,
		output: ZenRowsEndpointOutputSchemas.fetchBrowse,
	},
	'fetch.extract': {
		input: ZenRowsEndpointInputSchemas.fetchExtract,
		output: ZenRowsEndpointOutputSchemas.fetchExtract,
	},
	'fetch.cssExtract': {
		input: ZenRowsEndpointInputSchemas.fetchCssExtract,
		output: ZenRowsEndpointOutputSchemas.fetchCssExtract,
	},
	'fetch.outputs': {
		input: ZenRowsEndpointInputSchemas.fetchOutputs,
		output: ZenRowsEndpointOutputSchemas.fetchOutputs,
	},
	'fetch.jsonResponse': {
		input: ZenRowsEndpointInputSchemas.fetchJsonResponse,
		output: ZenRowsEndpointOutputSchemas.fetchJsonResponse,
	},
	'fetch.post': {
		input: ZenRowsEndpointInputSchemas.fetchPost,
		output: ZenRowsEndpointOutputSchemas.fetchPost,
	},
	'fetch.put': {
		input: ZenRowsEndpointInputSchemas.fetchPut,
		output: ZenRowsEndpointOutputSchemas.fetchPut,
	},
	'crawl.start': {
		input: ZenRowsEndpointInputSchemas.crawlStart,
		output: ZenRowsEndpointOutputSchemas.crawlStart,
	},
	'crawl.list': {
		input: ZenRowsEndpointInputSchemas.crawlList,
		output: ZenRowsEndpointOutputSchemas.crawlList,
	},
	'crawl.get': {
		input: ZenRowsEndpointInputSchemas.crawlGet,
		output: ZenRowsEndpointOutputSchemas.crawlGet,
	},
	'crawl.getContent': {
		input: ZenRowsEndpointInputSchemas.crawlGetContent,
		output: ZenRowsEndpointOutputSchemas.crawlGetContent,
	},
	'crawl.stop': {
		input: ZenRowsEndpointInputSchemas.crawlStop,
		output: ZenRowsEndpointOutputSchemas.crawlStop,
	},
	'extract.domains': {
		input: ZenRowsEndpointInputSchemas.extractDomains,
		output: ZenRowsEndpointOutputSchemas.extractDomains,
	},
	'extract.prepareDomain': {
		input: ZenRowsEndpointInputSchemas.extractPrepareDomain,
		output: ZenRowsEndpointOutputSchemas.extractPrepareDomain,
	},
	'extract.getDomainStatus': {
		input: ZenRowsEndpointInputSchemas.extractGetDomainStatus,
		output: ZenRowsEndpointOutputSchemas.extractGetDomainStatus,
	},
	'extract.listPreparedDomains': {
		input: ZenRowsEndpointInputSchemas.extractListPreparedDomains,
		output: ZenRowsEndpointOutputSchemas.extractListPreparedDomains,
	},
	'extract.allowance': {
		input: ZenRowsEndpointInputSchemas.extractAllowance,
		output: ZenRowsEndpointOutputSchemas.extractAllowance,
	},
	'account.subscription': {
		input: ZenRowsEndpointInputSchemas.accountSubscription,
		output: ZenRowsEndpointOutputSchemas.accountSubscription,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof zenRowsEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

/**
 * A crawl is a job: `crawl.start` returns a `crawl_id`, and `crawl.get` reads
 * its `status` back. A crawl also ends `stopped` when the account runs out of
 * credits, so `stopped` is grouped with `failed` rather than with `completed`.
 */
const CRAWL_JOB = {
	idPath: 'crawl_id',
	status: {
		op: 'crawl.get',
		idArg: 'crawlId',
		statusPath: 'status',
		done: ['completed'],
		failed: ['failed', 'stopped'],
	},
	cancel: { op: 'crawl.stop', idArg: 'crawlId' },
} as const;

const zenRowsEndpointMeta = {
	'fetch.page': {
		riskLevel: 'read',
		description:
			'Fetch one page through Zenrows: HTML by default, or Markdown and plaintext, with optional browser rendering, residential proxies, geolocation and resource blocking',
	},
	'fetch.browse': {
		// Browser actions reach the target: filling a field, clicking submit and
		// running `evaluate` all change the site, so this is a write, not a read.
		riskLevel: 'write',
		description:
			'Render a page and act on it before capture: fill fields, click, check, scroll or run JavaScript. Reaches the site, so it can change its state',
	},
	'fetch.extract': {
		riskLevel: 'read',
		description:
			"Turn a page into structured JSON with Extract: the site's own field names, or a canonical Real Estate schema, on a domain prepared for it",
	},
	'fetch.cssExtract': {
		riskLevel: 'read',
		description:
			'Extract named fields from a page with your own CSS or XPath selectors, such as a title, a price and every link, on any site with no preparation',
	},
	'fetch.outputs': {
		riskLevel: 'read',
		description:
			'Pull typed data out of a page without parsing it: emails, phone numbers, links, headings, tables, metadata and more',
	},
	'fetch.jsonResponse': {
		riskLevel: 'read',
		description:
			'Capture the page and the XHR and fetch calls it made, as a JSON envelope, from a rendered page',
	},
	'fetch.post': {
		riskLevel: 'write',
		description:
			"Send a POST to the target through Zenrows and return its answer. Reaches the site with the caller's body, so the site's state can change",
	},
	'fetch.put': {
		riskLevel: 'write',
		description:
			"Send a PUT to the target through Zenrows and return its answer. Reaches the site with the caller's body, so the site's state can change",
	},
	'crawl.start': {
		riskLevel: 'write',
		description:
			'Start a crawl from one URL: each page it opens is a billed Fetch request, and a crawl runs until its page limits stop it',
		job: CRAWL_JOB,
	},
	'crawl.list': {
		riskLevel: 'read',
		description: 'List crawls, newest first, without their results',
	},
	'crawl.get': {
		riskLevel: 'read',
		description:
			'Read a crawl with its coverage and one page of results; poll it with the same cursor to collect new URLs',
	},
	'crawl.getContent': {
		riskLevel: 'read',
		description: "Read one kept page of a crawl, in the crawl's output format",
	},
	'crawl.stop': {
		riskLevel: 'write',
		description:
			'Stop a running crawl. Pages already being fetched finish and are billed',
	},
	'extract.domains': {
		riskLevel: 'read',
		description:
			'List the sites Extract can handle today, with their verticals',
	},
	'extract.prepareDomain': {
		riskLevel: 'write',
		description:
			'Ask Zenrows to prepare a domain for Extract, which takes minutes and one slot of the monthly allowance; preparation is free and shared across accounts',
	},
	'extract.getDomainStatus': {
		riskLevel: 'read',
		description:
			'Read how far a domain preparation has got: preparing, ready or failed',
	},
	'extract.listPreparedDomains': {
		riskLevel: 'read',
		description:
			'List the domains this account submitted for preparation, with the monthly allowance',
	},
	'extract.allowance': {
		riskLevel: 'read',
		description:
			'Read how many domain preparations this account has left this month',
	},
	'account.subscription': {
		riskLevel: 'read',
		description:
			'Read the plan behind the key: credits used and allowed, period end, per-product usage and the concurrency limit',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof zenRowsEndpointsNested>;

export type BaseZenRowsPlugin<T extends ZenRowsPluginOptions> = CorsairPlugin<
	'zenrows',
	typeof ZenRowsSchema,
	typeof zenRowsEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalZenRowsPlugin = BaseZenRowsPlugin<ZenRowsPluginOptions>;

export type ExternalZenRowsPlugin<T extends ZenRowsPluginOptions> =
	BaseZenRowsPlugin<T>;

export function zenrows<const T extends ZenRowsPluginOptions>(
	incomingOptions: ZenRowsPluginOptions & T = {} as ZenRowsPluginOptions & T,
): ExternalZenRowsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zenrows',
		schema: ZenRowsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: zenRowsEndpointsNested,
		// Zenrows sends crawl events, but a crawl's webhook is set per crawl at
		// start and there is no account-level delivery to route here.
		webhooks: {},
		endpointMeta: zenRowsEndpointMeta,
		endpointSchemas: zenRowsEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ZenRowsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('zenrows', ctx.authType ?? 'api_key');
		},
	} satisfies InternalZenRowsPlugin;
}

export { ZenRowsAPIError } from './client';

export type {
	FetchBrowseInput,
	FetchCssExtractInput,
	FetchExtractInput,
	FetchJsonResponseInput,
	FetchOutputsInput,
	FetchPageInput,
	FetchPostInput,
	FetchPutInput,
	GetCrawlContentInput,
	GetCrawlInput,
	GetExtractAllowanceInput,
	GetExtractDomainStatusInput,
	GetSubscriptionInput,
	ListCrawlsInput,
	ListExtractDomainsInput,
	ListExtractPreparedDomainsInput,
	PrepareExtractDomainInput,
	StartCrawlInput,
	StopCrawlInput,
	ZenRowsEndpointInputs,
	ZenRowsEndpointOutputs,
	ZenrowsBrowseResponse,
	ZenrowsCrawl,
	ZenrowsCrawlResult,
	ZenrowsCrawlWithResults,
	ZenrowsCssExtractResponse,
	ZenrowsExtractDomain,
	ZenrowsExtractPreparation,
	ZenrowsExtractResponse,
	ZenrowsForwardedResponse,
	ZenrowsJsonResponse,
	ZenrowsOutputsResponse,
	ZenrowsProblem,
	ZenrowsSubscription,
	ZenrowsTextResponse,
} from './endpoints/types';
