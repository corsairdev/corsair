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
import { Tavily } from './endpoints';
import type {
	TavilyMcpEndpointInputs,
	TavilyMcpEndpointOutputs,
} from './endpoints/types';
import {
	TavilyMcpEndpointInputSchemas,
	TavilyMcpEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TavilyMcpSchema } from './schema';

export type TavilyMcpPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTavilyMcpPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tavilyMcpEndpointsNested>;
};

export type TavilyMcpContext = CorsairPluginContext<
	typeof TavilyMcpSchema,
	TavilyMcpPluginOptions
>;

export type TavilyMcpKeyBuilderContext =
	KeyBuilderContext<TavilyMcpPluginOptions>;

export type TavilyMcpBoundEndpoints = BindEndpoints<
	typeof tavilyMcpEndpointsNested
>;

type TavilyMcpEndpoint<K extends keyof TavilyMcpEndpointOutputs> =
	CorsairEndpoint<
		TavilyMcpContext,
		TavilyMcpEndpointInputs[K],
		TavilyMcpEndpointOutputs[K]
	>;

export type TavilyMcpEndpoints = {
	search: TavilyMcpEndpoint<'search'>;
	extract: TavilyMcpEndpoint<'extract'>;
	crawl: TavilyMcpEndpoint<'crawl'>;
	map: TavilyMcpEndpoint<'map'>;
	research: TavilyMcpEndpoint<'research'>;
};

const tavilyMcpEndpointsNested = {
	tavily: {
		search: Tavily.search,
		extract: Tavily.extract,
		crawl: Tavily.crawl,
		map: Tavily.map,
		research: Tavily.research,
	},
} as const;

export const tavilyMcpEndpointSchemas = {
	'tavily.search': {
		input: TavilyMcpEndpointInputSchemas.search,
		output: TavilyMcpEndpointOutputSchemas.search,
	},
	'tavily.extract': {
		input: TavilyMcpEndpointInputSchemas.extract,
		output: TavilyMcpEndpointOutputSchemas.extract,
	},
	'tavily.crawl': {
		input: TavilyMcpEndpointInputSchemas.crawl,
		output: TavilyMcpEndpointOutputSchemas.crawl,
	},
	'tavily.map': {
		input: TavilyMcpEndpointInputSchemas.map,
		output: TavilyMcpEndpointOutputSchemas.map,
	},
	'tavily.research': {
		input: TavilyMcpEndpointInputSchemas.research,
		output: TavilyMcpEndpointOutputSchemas.research,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tavilyMcpEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const tavilyMcpEndpointMeta = {
	'tavily.search': {
		riskLevel: 'read',
		description:
			'Search the web with Tavily and return ranked snippets with source URLs',
	},
	'tavily.extract': {
		riskLevel: 'read',
		description:
			'Extract page content from one or more URLs as markdown or plain text',
	},
	'tavily.crawl': {
		riskLevel: 'read',
		description:
			'Crawl a site from a start URL with configurable depth and breadth',
	},
	'tavily.map': {
		riskLevel: 'read',
		description: "Map a site's structure from a start URL and return its URLs",
	},
	'tavily.research': {
		riskLevel: 'read',
		description:
			'Run comprehensive multi-source research on a topic and return a cited report',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof tavilyMcpEndpointsNested
>;

export const tavilyMcpAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTavilyMcpPlugin<T extends TavilyMcpPluginOptions> =
	CorsairPlugin<
		'tavilymcp',
		typeof TavilyMcpSchema,
		typeof tavilyMcpEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalTavilyMcpPlugin =
	BaseTavilyMcpPlugin<TavilyMcpPluginOptions>;

export type ExternalTavilyMcpPlugin<T extends TavilyMcpPluginOptions> =
	BaseTavilyMcpPlugin<T>;

export function tavilymcp<const T extends TavilyMcpPluginOptions>(
	incomingOptions: TavilyMcpPluginOptions & T = {} as TavilyMcpPluginOptions &
		T,
): ExternalTavilyMcpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tavilymcp',
		authConfig: tavilyMcpAuthConfig,
		schema: TavilyMcpSchema,
		options: options,
		hooks: options.hooks,
		endpoints: tavilyMcpEndpointsNested,
		webhooks: {},
		endpointMeta: tavilyMcpEndpointMeta,
		endpointSchemas: tavilyMcpEndpointSchemas,
		// Tavily has no outgoing webhooks.
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TavilyMcpKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('tavilymcp', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('tavilymcp', 'api_key');
		},
	} satisfies InternalTavilyMcpPlugin;
}

export type {
	TavilyCrawlRequest,
	TavilyCrawlResponse,
	TavilyExtractRequest,
	TavilyExtractResponse,
	TavilyMapRequest,
	TavilyMapResponse,
	TavilyMcpEndpointInputs,
	TavilyMcpEndpointOutputs,
	TavilyResearchRequest,
	TavilyResearchResponse,
	TavilySearchRequest,
	TavilySearchResponse,
} from './endpoints/types';
