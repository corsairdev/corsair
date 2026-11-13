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
import { Account, Extract, Scrape } from './endpoints';
import type {
	ScrapingAntEndpointInputs,
	ScrapingAntEndpointOutputs,
} from './endpoints/types';
import {
	ScrapingAntEndpointInputSchemas,
	ScrapingAntEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ScrapingAntSchema } from './schema';

export type ScrapingAntPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalScrapingAntPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof scrapingAntEndpointsNested>;
};

export type ScrapingAntContext = CorsairPluginContext<
	typeof ScrapingAntSchema,
	ScrapingAntPluginOptions
>;

export type ScrapingAntKeyBuilderContext =
	KeyBuilderContext<ScrapingAntPluginOptions>;

export type ScrapingAntBoundEndpoints = BindEndpoints<
	typeof scrapingAntEndpointsNested
>;

type ScrapingAntEndpoint<K extends keyof ScrapingAntEndpointOutputs> =
	CorsairEndpoint<
		ScrapingAntContext,
		ScrapingAntEndpointInputs[K],
		ScrapingAntEndpointOutputs[K]
	>;

export type ScrapingAntEndpoints = {
	scrapeHtml: ScrapingAntEndpoint<'scrapeHtml'>;
	scrapeMarkdown: ScrapingAntEndpoint<'scrapeMarkdown'>;
	scrapeExtended: ScrapingAntEndpoint<'scrapeExtended'>;
	extractData: ScrapingAntEndpoint<'extractData'>;
	accountUsage: ScrapingAntEndpoint<'accountUsage'>;
};

const scrapingAntEndpointsNested = {
	scrape: {
		html: Scrape.html,
		markdown: Scrape.markdown,
		extended: Scrape.extended,
	},
	extract: {
		data: Extract.data,
	},
	account: {
		usage: Account.usage,
	},
} as const;

export const scrapingAntEndpointSchemas = {
	'scrape.html': {
		input: ScrapingAntEndpointInputSchemas.scrapeHtml,
		output: ScrapingAntEndpointOutputSchemas.scrapeHtml,
	},
	'scrape.markdown': {
		input: ScrapingAntEndpointInputSchemas.scrapeMarkdown,
		output: ScrapingAntEndpointOutputSchemas.scrapeMarkdown,
	},
	'scrape.extended': {
		input: ScrapingAntEndpointInputSchemas.scrapeExtended,
		output: ScrapingAntEndpointOutputSchemas.scrapeExtended,
	},
	'extract.data': {
		input: ScrapingAntEndpointInputSchemas.extractData,
		output: ScrapingAntEndpointOutputSchemas.extractData,
	},
	'account.usage': {
		input: ScrapingAntEndpointInputSchemas.accountUsage,
		output: ScrapingAntEndpointOutputSchemas.accountUsage,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof scrapingAntEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

/**
 * Every operation is a read in ScrapingAnt's terms: none of them changes
 * anything at ScrapingAnt, and all of them are GETs.
 *
 * They do spend credits, which is why the descriptions say so, but spending is
 * not a provider-state change a caller has to approve: a `write` label here
 * would block a read-only caller from scraping at all. The one thing that
 * returns a credential is also not here: `scrape.extended` returns the target
 * page's cookies, which belong to the target site rather than to ScrapingAnt,
 * and a `strict` caller gets them only by asking for that operation.
 */
const scrapingAntEndpointMeta = {
	'scrape.html': {
		riskLevel: 'read',
		description:
			'Fetch a page and return its HTML, with the target page status and credit cost; spends 1 to 125 credits depending on browser and proxy',
	},
	'scrape.markdown': {
		riskLevel: 'read',
		description:
			'Fetch a page and return the whole thing as Markdown, ready for an LLM; spends 1 to 125 credits',
	},
	'scrape.extended': {
		riskLevel: 'read',
		description:
			'Fetch a page and return HTML, text, cookies, headers, status code, XHRs and iframes as JSON; spends 1 to 125 credits',
	},
	'extract.data': {
		riskLevel: 'read',
		description:
			'Fetch a page and have an AI model extract the requested properties as a JSON object; spends the scrape cost plus 1 credit per 30 characters of page and output text',
	},
	'account.usage': {
		riskLevel: 'read',
		description:
			'Read the active plan, its period and the credits left in it; costs nothing',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof scrapingAntEndpointsNested
>;

export type BaseScrapingAntPlugin<T extends ScrapingAntPluginOptions> =
	CorsairPlugin<
		'scrapingant',
		typeof ScrapingAntSchema,
		typeof scrapingAntEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalScrapingAntPlugin =
	BaseScrapingAntPlugin<ScrapingAntPluginOptions>;

export type ExternalScrapingAntPlugin<T extends ScrapingAntPluginOptions> =
	BaseScrapingAntPlugin<T>;

export function scrapingant<const T extends ScrapingAntPluginOptions>(
	incomingOptions: ScrapingAntPluginOptions &
		T = {} as ScrapingAntPluginOptions & T,
): ExternalScrapingAntPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'scrapingant',
		schema: ScrapingAntSchema,
		options: options,
		hooks: options.hooks,
		endpoints: scrapingAntEndpointsNested,
		webhooks: {},
		endpointMeta: scrapingAntEndpointMeta,
		endpointSchemas: scrapingAntEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ScrapingAntKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('scrapingant', ctx.authType ?? 'api_key');
		},
	} satisfies InternalScrapingAntPlugin;
}

export { ScrapingAntAPIError } from './client';

export type {
	AccountUsageInput,
	AccountUsageResponse,
	ExtractDataInput,
	ExtractDataResponse,
	ScrapeExtendedInput,
	ScrapeExtendedResponse,
	ScrapeHtmlInput,
	ScrapeHtmlResponse,
	ScrapeMarkdownInput,
	ScrapeMarkdownResponse,
	ScrapingAntEndpointInputs,
	ScrapingAntEndpointOutputs,
} from './endpoints/types';
