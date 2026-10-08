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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Account,
	Batches,
	Metadata,
	Search,
	Shopping,
	Trends,
} from './endpoints';
import type {
	ZenserpEndpointInputs,
	ZenserpEndpointOutputs,
} from './endpoints/types';
import {
	ZenserpEndpointInputSchemas,
	ZenserpEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ZenserpSchema } from './schema';

export type ZenserpPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalZenserpPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zenserpEndpointsNested>;
};

export type ZenserpContext = CorsairPluginContext<
	typeof ZenserpSchema,
	ZenserpPluginOptions
>;
export type ZenserpKeyBuilderContext = KeyBuilderContext<ZenserpPluginOptions>;
export type ZenserpBoundEndpoints = BindEndpoints<
	typeof zenserpEndpointsNested
>;

type ZenserpEndpoint<K extends keyof ZenserpEndpointOutputs> = CorsairEndpoint<
	ZenserpContext,
	ZenserpEndpointInputs[K],
	ZenserpEndpointOutputs[K]
>;

export type ZenserpEndpoints = {
	searchGoogle: ZenserpEndpoint<'searchGoogle'>;
	searchBing: ZenserpEndpoint<'searchBing'>;
	searchYandex: ZenserpEndpoint<'searchYandex'>;
	searchReverseImage: ZenserpEndpoint<'searchReverseImage'>;
	shoppingGetProduct: ZenserpEndpoint<'shoppingGetProduct'>;
	trendsGet: ZenserpEndpoint<'trendsGet'>;
	accountGetStatus: ZenserpEndpoint<'accountGetStatus'>;
	batchesList: ZenserpEndpoint<'batchesList'>;
	metadataListCountries: ZenserpEndpoint<'metadataListCountries'>;
	metadataListLocations: ZenserpEndpoint<'metadataListLocations'>;
	metadataListSearchEngines: ZenserpEndpoint<'metadataListSearchEngines'>;
	metadataListLanguages: ZenserpEndpoint<'metadataListLanguages'>;
};

const zenserpEndpointsNested = {
	search: {
		google: Search.google,
		bing: Search.bing,
		yandex: Search.yandex,
		reverseImage: Search.reverseImage,
	},
	shopping: { getProduct: Shopping.getProduct },
	trends: { get: Trends.get },
	account: { getStatus: Account.getStatus },
	batches: { list: Batches.list },
	metadata: {
		listCountries: Metadata.listCountries,
		listLocations: Metadata.listLocations,
		listSearchEngines: Metadata.listSearchEngines,
		listLanguages: Metadata.listLanguages,
	},
} as const;

const zenserpWebhooksNested = {} as const;

export const zenserpEndpointSchemas = {
	'search.google': {
		input: ZenserpEndpointInputSchemas.searchGoogle,
		output: ZenserpEndpointOutputSchemas.searchGoogle,
	},
	'search.bing': {
		input: ZenserpEndpointInputSchemas.searchBing,
		output: ZenserpEndpointOutputSchemas.searchBing,
	},
	'search.yandex': {
		input: ZenserpEndpointInputSchemas.searchYandex,
		output: ZenserpEndpointOutputSchemas.searchYandex,
	},
	'search.reverseImage': {
		input: ZenserpEndpointInputSchemas.searchReverseImage,
		output: ZenserpEndpointOutputSchemas.searchReverseImage,
	},
	'shopping.getProduct': {
		input: ZenserpEndpointInputSchemas.shoppingGetProduct,
		output: ZenserpEndpointOutputSchemas.shoppingGetProduct,
	},
	'trends.get': {
		input: ZenserpEndpointInputSchemas.trendsGet,
		output: ZenserpEndpointOutputSchemas.trendsGet,
	},
	'account.getStatus': {
		input: ZenserpEndpointInputSchemas.accountGetStatus,
		output: ZenserpEndpointOutputSchemas.accountGetStatus,
	},
	'batches.list': {
		input: ZenserpEndpointInputSchemas.batchesList,
		output: ZenserpEndpointOutputSchemas.batchesList,
	},
	'metadata.listCountries': {
		input: ZenserpEndpointInputSchemas.metadataListCountries,
		output: ZenserpEndpointOutputSchemas.metadataListCountries,
	},
	'metadata.listLocations': {
		input: ZenserpEndpointInputSchemas.metadataListLocations,
		output: ZenserpEndpointOutputSchemas.metadataListLocations,
	},
	'metadata.listSearchEngines': {
		input: ZenserpEndpointInputSchemas.metadataListSearchEngines,
		output: ZenserpEndpointOutputSchemas.metadataListSearchEngines,
	},
	'metadata.listLanguages': {
		input: ZenserpEndpointInputSchemas.metadataListLanguages,
		output: ZenserpEndpointOutputSchemas.metadataListLanguages,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof zenserpEndpointsNested
>;

const zenserpWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof zenserpWebhooksNested
	>;

const zenserpEndpointMeta = {
	'search.google': {
		riskLevel: 'read',
		description: 'Search Google and return structured SERP data',
	},
	'search.bing': {
		riskLevel: 'read',
		description: 'Search Bing and return structured SERP data',
	},
	'search.yandex': {
		riskLevel: 'read',
		description: 'Search Yandex and return structured SERP data',
	},
	'search.reverseImage': {
		riskLevel: 'read',
		description: 'Run a Google reverse-image search for a public image URL',
	},
	'shopping.getProduct': {
		riskLevel: 'read',
		description: 'Retrieve Google Shopping product details',
	},
	'trends.get': {
		riskLevel: 'read',
		description: 'Retrieve Google Trends data for one or more keywords',
	},
	'account.getStatus': {
		riskLevel: 'read',
		description: 'Return the remaining request quota for the API key',
	},
	'batches.list': {
		riskLevel: 'read',
		description: 'List submitted Zenserp batches',
	},
	'metadata.listCountries': {
		riskLevel: 'read',
		description: 'List supported Google country parameters',
	},
	'metadata.listLocations': {
		riskLevel: 'read',
		description: 'List supported geolocation targets',
	},
	'metadata.listSearchEngines': {
		riskLevel: 'read',
		description: 'List supported search-engine domains',
	},
	'metadata.listLanguages': {
		riskLevel: 'read',
		description: 'List supported Google interface languages',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof zenserpEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';

export const zenserpAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseZenserpPlugin<T extends ZenserpPluginOptions> = CorsairPlugin<
	'zenserp',
	typeof ZenserpSchema,
	typeof zenserpEndpointsNested,
	typeof zenserpWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalZenserpPlugin = BaseZenserpPlugin<ZenserpPluginOptions>;
export type ExternalZenserpPlugin<T extends ZenserpPluginOptions> =
	BaseZenserpPlugin<T>;

export function zenserp<const T extends ZenserpPluginOptions>(
	incomingOptions: ZenserpPluginOptions & T = {} as ZenserpPluginOptions & T,
): ExternalZenserpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zenserp',
		authConfig: zenserpAuthConfig,
		schema: ZenserpSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: zenserpEndpointsNested,
		webhooks: zenserpWebhooksNested,
		endpointMeta: zenserpEndpointMeta,
		endpointSchemas: zenserpEndpointSchemas,
		webhookSchemas: zenserpWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: ZenserpKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('zenserp', 'api_key');
		},
	} satisfies InternalZenserpPlugin;
}

export * from './endpoints/types';
export { ZenserpSchema } from './schema';
