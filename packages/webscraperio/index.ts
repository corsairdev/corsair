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
import { Sitemaps } from './endpoints';
import type {
	WebscraperioEndpointInputs,
	WebscraperioEndpointOutputs,
} from './endpoints/types';
import {
	WebscraperioEndpointInputSchemas,
	WebscraperioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { WebscraperioSchema } from './schema';

export type WebscraperioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWebscraperioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof webscraperioEndpointsNested>;
};

export type WebscraperioContext = CorsairPluginContext<
	typeof WebscraperioSchema,
	WebscraperioPluginOptions
>;

export type WebscraperioKeyBuilderContext =
	KeyBuilderContext<WebscraperioPluginOptions>;

export type WebscraperioBoundEndpoints = BindEndpoints<
	typeof webscraperioEndpointsNested
>;

type WebscraperioEndpoint<K extends keyof WebscraperioEndpointOutputs> =
	CorsairEndpoint<
		WebscraperioContext,
		WebscraperioEndpointInputs[K],
		WebscraperioEndpointOutputs[K]
	>;

export type WebscraperioEndpoints = {
	sitemapsList: WebscraperioEndpoint<'sitemapsList'>;
	sitemapsGet: WebscraperioEndpoint<'sitemapsGet'>;
	sitemapsCreate: WebscraperioEndpoint<'sitemapsCreate'>;
	accountGet: WebscraperioEndpoint<'accountGet'>;
};

const webscraperioEndpointsNested = {
	sitemaps: {
		list: Sitemaps.list,
		get: Sitemaps.get,
		create: Sitemaps.create,
	},
	account: {
		get: Sitemaps.account,
	},
} as const;

export const webscraperioEndpointSchemas = {
	'sitemaps.list': {
		input: WebscraperioEndpointInputSchemas.sitemapsList,
		output: WebscraperioEndpointOutputSchemas.sitemapsList,
	},
	'sitemaps.get': {
		input: WebscraperioEndpointInputSchemas.sitemapsGet,
		output: WebscraperioEndpointOutputSchemas.sitemapsGet,
	},
	'sitemaps.create': {
		input: WebscraperioEndpointInputSchemas.sitemapsCreate,
		output: WebscraperioEndpointOutputSchemas.sitemapsCreate,
	},
	'account.get': {
		input: WebscraperioEndpointInputSchemas.accountGet,
		output: WebscraperioEndpointOutputSchemas.accountGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof webscraperioEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const webscraperioEndpointMeta = {
	'sitemaps.list': {
		riskLevel: 'read',
		description:
			'List the sitemaps on the account (id and name), a page at a time, optionally filtered by tag',
	},
	'sitemaps.get': {
		riskLevel: 'read',
		description:
			'Read one sitemap: its id, name and definition (start URLs and selectors) as a JSON string',
	},
	'sitemaps.create': {
		riskLevel: 'write',
		description:
			'Create a sitemap from the definition the browser extension exports, selectors included',
	},
	'account.get': {
		riskLevel: 'read',
		description:
			'Read the account user and the page credits left; the cheapest way to check a token',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof webscraperioEndpointsNested
>;

export type BaseWebscraperioPlugin<T extends WebscraperioPluginOptions> =
	CorsairPlugin<
		'webscraperio',
		typeof WebscraperioSchema,
		typeof webscraperioEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalWebscraperioPlugin =
	BaseWebscraperioPlugin<WebscraperioPluginOptions>;

export type ExternalWebscraperioPlugin<T extends WebscraperioPluginOptions> =
	BaseWebscraperioPlugin<T>;

export function webscraperio<const T extends WebscraperioPluginOptions>(
	incomingOptions: WebscraperioPluginOptions &
		T = {} as WebscraperioPluginOptions & T,
): ExternalWebscraperioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'webscraperio',
		schema: WebscraperioSchema,
		options: options,
		hooks: options.hooks,
		endpoints: webscraperioEndpointsNested,
		webhooks: {},
		endpointMeta: webscraperioEndpointMeta,
		endpointSchemas: webscraperioEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: WebscraperioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('webscraperio', ctx.authType ?? 'api_key');
		},
	} satisfies InternalWebscraperioPlugin;
}

export {
	isWebscraperioFailure,
	segment,
	WEBSCRAPERIO_API_BASE,
	WebscraperioAPIError,
} from './client';

export type {
	AccountGetInput,
	AccountResponse,
	SitemapResponse,
	SitemapsCreateInput,
	SitemapsGetInput,
	SitemapsListInput,
	SitemapsListResponse,
	WebscraperioAccount,
	WebscraperioEndpointInputs,
	WebscraperioEndpointOutputs,
	WebscraperioSitemap,
} from './endpoints/types';
