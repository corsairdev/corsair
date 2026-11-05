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
import { tryGetStoredKey } from './client';
import { Account, Analytics, Results, Scrape, Scrapers } from './endpoints';
import type {
	MrscraperEndpointInputs,
	MrscraperEndpointOutputs,
} from './endpoints/types';
import {
	MrscraperEndpointInputSchemas,
	MrscraperEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MrscraperSchema } from './schema';

export type MrscraperPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMrscraperPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mrscraperEndpointsNested>;
};

export type MrscraperContext = CorsairPluginContext<
	typeof MrscraperSchema,
	MrscraperPluginOptions
>;

export type MrscraperKeyBuilderContext =
	KeyBuilderContext<MrscraperPluginOptions>;

export type MrscraperBoundEndpoints = BindEndpoints<
	typeof mrscraperEndpointsNested
>;

type MrscraperEndpoint<K extends keyof MrscraperEndpointOutputs> =
	CorsairEndpoint<
		MrscraperContext,
		MrscraperEndpointInputs[K],
		MrscraperEndpointOutputs[K]
	>;

export type MrscraperEndpoints = {
	[K in keyof MrscraperEndpointOutputs]: MrscraperEndpoint<K>;
};

const mrscraperEndpointsNested = {
	account: {
		get: Account.get,
	},
	scrapers: {
		aiInit: Scrapers.aiInit,
		aiRerun: Scrapers.aiRerun,
		aiRerunBulk: Scrapers.aiRerunBulk,
		manualRerun: Scrapers.manualRerun,
		manualRerunBulk: Scrapers.manualRerunBulk,
		manualHeal: Scrapers.manualHeal,
		cancelBulkByScraper: Scrapers.cancelBulkByScraper,
		cancelBulkByResult: Scrapers.cancelBulkByResult,
	},
	results: {
		list: Results.list,
		get: Results.get,
	},
	analytics: {
		statuses: Analytics.statuses,
		proxyBandwidth: Analytics.proxyBandwidth,
	},
	scrape: {
		fetch: Scrape.fetch,
		markdown: Scrape.markdown,
		json: Scrape.json,
		screenshot: Scrape.screenshot,
		listing: Scrape.listing,
		sitemap: Scrape.sitemap,
	},
} as const;

export const mrscraperEndpointSchemas = {
	'account.get': {
		input: MrscraperEndpointInputSchemas.accountGet,
		output: MrscraperEndpointOutputSchemas.accountGet,
	},
	'scrapers.aiInit': {
		input: MrscraperEndpointInputSchemas.scrapersAiInit,
		output: MrscraperEndpointOutputSchemas.scrapersAiInit,
	},
	'scrapers.aiRerun': {
		input: MrscraperEndpointInputSchemas.scrapersAiRerun,
		output: MrscraperEndpointOutputSchemas.scrapersAiRerun,
	},
	'scrapers.aiRerunBulk': {
		input: MrscraperEndpointInputSchemas.scrapersAiRerunBulk,
		output: MrscraperEndpointOutputSchemas.scrapersAiRerunBulk,
	},
	'scrapers.manualRerun': {
		input: MrscraperEndpointInputSchemas.scrapersManualRerun,
		output: MrscraperEndpointOutputSchemas.scrapersManualRerun,
	},
	'scrapers.manualRerunBulk': {
		input: MrscraperEndpointInputSchemas.scrapersManualRerunBulk,
		output: MrscraperEndpointOutputSchemas.scrapersManualRerunBulk,
	},
	'scrapers.manualHeal': {
		input: MrscraperEndpointInputSchemas.scrapersManualHeal,
		output: MrscraperEndpointOutputSchemas.scrapersManualHeal,
	},
	'scrapers.cancelBulkByScraper': {
		input: MrscraperEndpointInputSchemas.scrapersCancelBulkByScraper,
		output: MrscraperEndpointOutputSchemas.scrapersCancelBulkByScraper,
	},
	'scrapers.cancelBulkByResult': {
		input: MrscraperEndpointInputSchemas.scrapersCancelBulkByResult,
		output: MrscraperEndpointOutputSchemas.scrapersCancelBulkByResult,
	},
	'results.list': {
		input: MrscraperEndpointInputSchemas.resultsList,
		output: MrscraperEndpointOutputSchemas.resultsList,
	},
	'results.get': {
		input: MrscraperEndpointInputSchemas.resultsGet,
		output: MrscraperEndpointOutputSchemas.resultsGet,
	},
	'analytics.statuses': {
		input: MrscraperEndpointInputSchemas.analyticsStatuses,
		output: MrscraperEndpointOutputSchemas.analyticsStatuses,
	},
	'analytics.proxyBandwidth': {
		input: MrscraperEndpointInputSchemas.analyticsProxyBandwidth,
		output: MrscraperEndpointOutputSchemas.analyticsProxyBandwidth,
	},
	'scrape.fetch': {
		input: MrscraperEndpointInputSchemas.scrapeFetch,
		output: MrscraperEndpointOutputSchemas.scrapeFetch,
	},
	'scrape.markdown': {
		input: MrscraperEndpointInputSchemas.scrapeMarkdown,
		output: MrscraperEndpointOutputSchemas.scrapeMarkdown,
	},
	'scrape.json': {
		input: MrscraperEndpointInputSchemas.scrapeJson,
		output: MrscraperEndpointOutputSchemas.scrapeJson,
	},
	'scrape.screenshot': {
		input: MrscraperEndpointInputSchemas.scrapeScreenshot,
		output: MrscraperEndpointOutputSchemas.scrapeScreenshot,
	},
	'scrape.listing': {
		input: MrscraperEndpointInputSchemas.scrapeListing,
		output: MrscraperEndpointOutputSchemas.scrapeListing,
	},
	'scrape.sitemap': {
		input: MrscraperEndpointInputSchemas.scrapeSitemap,
		output: MrscraperEndpointOutputSchemas.scrapeSitemap,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mrscraperEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const mrscraperEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Get the subscription account and token usage',
	},
	'scrapers.aiInit': {
		riskLevel: 'write',
		description: 'Start an AI scraper chat and return starter scrape code',
	},
	'scrapers.aiRerun': {
		riskLevel: 'write',
		description: 'Re-run an AI scraper against a URL',
	},
	'scrapers.aiRerunBulk': {
		riskLevel: 'write',
		description: 'Re-run an AI scraper against multiple URLs',
	},
	'scrapers.manualRerun': {
		riskLevel: 'write',
		description: 'Re-run a manual scraper against a URL',
	},
	'scrapers.manualRerunBulk': {
		riskLevel: 'write',
		description: 'Re-run a manual scraper against multiple URLs',
	},
	'scrapers.manualHeal': {
		riskLevel: 'write',
		description: 'Heal a broken manual scraper workflow',
	},
	'scrapers.cancelBulkByScraper': {
		riskLevel: 'write',
		description: 'Cancel every queued bulk URL for a scraper',
	},
	'scrapers.cancelBulkByResult': {
		riskLevel: 'write',
		description: 'Cancel a queued bulk run by its result id',
	},
	'results.list': {
		riskLevel: 'read',
		description: 'List scrape results with pagination and filters',
	},
	'results.get': {
		riskLevel: 'read',
		description: 'Get a scrape result by id',
	},
	'analytics.statuses': {
		riskLevel: 'read',
		description: 'Get per-domain request status analytics',
	},
	'analytics.proxyBandwidth': {
		riskLevel: 'read',
		description: 'Get proxy bandwidth usage for the account',
	},
	'scrape.fetch': {
		riskLevel: 'read',
		description: 'Fetch a page and return its rendered HTML',
	},
	'scrape.markdown': {
		riskLevel: 'read',
		description: 'Scrape a page and return its content as Markdown',
	},
	'scrape.json': {
		riskLevel: 'read',
		description: 'Scrape a page and extract structured JSON with an agent',
	},
	'scrape.screenshot': {
		riskLevel: 'read',
		description: 'Scrape a page and capture a screenshot',
	},
	'scrape.listing': {
		riskLevel: 'read',
		description: 'Scrape paginated listing pages and extract their items',
	},
	'scrape.sitemap': {
		riskLevel: 'read',
		description: 'Discover a site sitemap and map its URLs',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof mrscraperEndpointsNested
>;

export const mrscraperAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseMrscraperPlugin<T extends MrscraperPluginOptions> =
	CorsairPlugin<
		'mrscraper',
		typeof MrscraperSchema,
		typeof mrscraperEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalMrscraperPlugin =
	BaseMrscraperPlugin<MrscraperPluginOptions>;

export type ExternalMrscraperPlugin<T extends MrscraperPluginOptions> =
	BaseMrscraperPlugin<T>;

export function mrscraper<const T extends MrscraperPluginOptions>(
	incomingOptions: MrscraperPluginOptions & T = {} as MrscraperPluginOptions &
		T,
): ExternalMrscraperPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'mrscraper',
		authConfig: mrscraperAuthConfig,
		schema: MrscraperSchema,
		options,
		hooks: options.hooks,
		endpoints: mrscraperEndpointsNested,
		// MrScraper delivers results to a user-configured outbound webhook but
		// publishes no inbound signature/verification spec to handle here.
		webhooks: {},
		endpointMeta: mrscraperEndpointMeta,
		endpointSchemas: mrscraperEndpointSchemas,
		errorHandlers: (() => {
			// Core selects the first handler whose matcher accepts the error
			// (`Object.keys(...).find`), and DEFAULT matches everything, so
			// DEFAULT must always be evaluated last - otherwise it shadows any
			// custom handler a caller contributes through options. The caller's
			// DEFAULT is destructured out as well: spreading it in place would
			// keep its original key position, ahead of their other handlers.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		// A missing stored key throws AuthMissingError from the key builder so
		// Corsair creates the account-connect link; the request client keeps its
		// fast-fail guard for keys that resolve empty by any other route.
		keyBuilder: async (ctx: MrscraperKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!storedKey) {
					throw new AuthMissingError('mrscraper', 'api_key');
				}
				return storedKey;
			}

			return '';
		},
	} satisfies InternalMrscraperPlugin;
}

export type {
	MrscraperEndpointInputs,
	MrscraperEndpointOutputs,
} from './endpoints/types';
