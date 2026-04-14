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
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type { TavilyEndpointInputs, TavilyEndpointOutputs } from './endpoints/types';
import { TavilyEndpointInputSchemas, TavilyEndpointOutputSchemas } from './endpoints/types';
import { Search, Extract, Crawl, Map } from './endpoints';
import { TavilySchema } from './schema';
import { errorHandlers } from './error-handlers';

export type TavilyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTavilyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tavilyEndpointsNested>;
};

export type TavilyContext = CorsairPluginContext<
	typeof TavilySchema,
	TavilyPluginOptions
>;

export type TavilyKeyBuilderContext = KeyBuilderContext<TavilyPluginOptions>;

export type TavilyBoundEndpoints = BindEndpoints<typeof tavilyEndpointsNested>;

type TavilyEndpoint<
	K extends keyof TavilyEndpointOutputs,
	Input,
> = CorsairEndpoint<TavilyContext, Input, TavilyEndpointOutputs[K]>;

export type TavilyEndpoints = {
	search: TavilyEndpoint<'search', TavilyEndpointInputs['search']>;
	extract: TavilyEndpoint<'extract', TavilyEndpointInputs['extract']>;
	crawl: TavilyEndpoint<'crawl', TavilyEndpointInputs['crawl']>;
	map: TavilyEndpoint<'map', TavilyEndpointInputs['map']>;
};

const tavilyEndpointsNested = {
	search: {
		search: Search.search,
	},
	extract: {
		extract: Extract.extract,
	},
	crawl: {
		crawl: Crawl.crawl,
	},
	map: {
		map: Map.map,
	},
} as const;

export const tavilyEndpointSchemas = {
	'search.search': {
		input: TavilyEndpointInputSchemas.search,
		output: TavilyEndpointOutputSchemas.search,
	},
	'extract.extract': {
		input: TavilyEndpointInputSchemas.extract,
		output: TavilyEndpointOutputSchemas.extract,
	},
	'crawl.crawl': {
		input: TavilyEndpointInputSchemas.crawl,
		output: TavilyEndpointOutputSchemas.crawl,
	},
	'map.map': {
		input: TavilyEndpointInputSchemas.map,
		output: TavilyEndpointOutputSchemas.map,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof tavilyEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const tavilyEndpointMeta = {
	'search.search': {
		riskLevel: 'read',
		description: 'Search the web using Tavily',
	},
	'extract.extract': {
		riskLevel: 'read',
		description: 'Extract content from one or more URLs',
	},
	'crawl.crawl': {
		riskLevel: 'read',
		description: 'Crawl a website starting from a root URL',
	},
	'map.map': {
		riskLevel: 'read',
		description: 'Map all URLs on a website starting from a root URL',
	},
} as const;

export type BaseTavilyPlugin<T extends TavilyPluginOptions> = CorsairPlugin<
	'tavily',
	typeof TavilySchema,
	typeof tavilyEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTavilyPlugin = BaseTavilyPlugin<TavilyPluginOptions>;

export type ExternalTavilyPlugin<T extends TavilyPluginOptions> =
	BaseTavilyPlugin<T>;

export function tavily<const T extends TavilyPluginOptions>(
	incomingOptions: TavilyPluginOptions & T = {} as TavilyPluginOptions & T,
): ExternalTavilyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tavily',
		schema: TavilySchema,
		options: options,
		hooks: options.hooks,
		endpoints: tavilyEndpointsNested,
		webhooks: {},
		endpointMeta: tavilyEndpointMeta,
		endpointSchemas: tavilyEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TavilyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalTavilyPlugin;
}

export type {
	TavilyEndpointInputs,
	TavilyEndpointOutputs,
	TavilySearchRequest,
	TavilySearchResponse,
	TavilyExtractRequest,
	TavilyExtractResponse,
	TavilyCrawlRequest,
	TavilyCrawlResponse,
	TavilyMapRequest,
	TavilyMapResponse,
} from './endpoints/types';
