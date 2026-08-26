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
import { tryGetStoredKey } from './client';
import {
	BrandsEndpoints,
	GraphqlEndpoints,
	LogosEndpoints,
	TaxonomyEndpoints,
	TransactionsEndpoints,
	WebhooksEndpoints,
} from './endpoints';
import type {
	BrandfetchEndpointInputs,
	BrandfetchEndpointOutputs,
} from './endpoints/types';
import {
	BrandfetchEndpointInputSchemas,
	BrandfetchEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BrandfetchSchema } from './schema';

export type BrandfetchPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Client ID for Brand Search and Logo CDN (`?c=`). */
	clientId?: string;
	hooks?: InternalBrandfetchPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof brandfetchEndpointsNested>;
};

export const brandfetchAuthConfig = {
	api_key: {
		account: ['client_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BrandfetchContext = CorsairPluginContext<
	typeof BrandfetchSchema,
	BrandfetchPluginOptions,
	undefined,
	typeof brandfetchAuthConfig
>;

export type BrandfetchKeyBuilderContext = KeyBuilderContext<
	BrandfetchPluginOptions,
	typeof brandfetchAuthConfig
>;

export type BrandfetchBoundEndpoints = BindEndpoints<
	typeof brandfetchEndpointsNested
>;

type BrandfetchEndpoint<K extends keyof BrandfetchEndpointOutputs> =
	CorsairEndpoint<
		BrandfetchContext,
		BrandfetchEndpointInputs[K],
		BrandfetchEndpointOutputs[K]
	>;

export type BrandfetchEndpoints = {
	getBrandInfo: BrandfetchEndpoint<'getBrandInfo'>;
	searchBrands: BrandfetchEndpoint<'searchBrands'>;
	getCdnLogo: BrandfetchEndpoint<'getCdnLogo'>;
	getCompanyInfo: BrandfetchEndpoint<'getCompanyInfo'>;
	getTransactionInfo: BrandfetchEndpoint<'getTransactionInfo'>;
	getTaxonomy: BrandfetchEndpoint<'getTaxonomy'>;
	getGraphqlVersion: BrandfetchEndpoint<'getGraphqlVersion'>;
	listSubscribableEvents: BrandfetchEndpoint<'listSubscribableEvents'>;
	listWebhooks: BrandfetchEndpoint<'listWebhooks'>;
};

const brandfetchEndpointsNested = {
	brands: BrandsEndpoints,
	logos: LogosEndpoints,
	transactions: TransactionsEndpoints,
	taxonomy: TaxonomyEndpoints,
	graphql: GraphqlEndpoints,
	webhooks: WebhooksEndpoints,
} as const;

const brandfetchWebhooksNested = {} as const;

export const brandfetchEndpointSchemas = {
	'brands.get': {
		input: BrandfetchEndpointInputSchemas.getBrandInfo,
		output: BrandfetchEndpointOutputSchemas.getBrandInfo,
	},
	'brands.search': {
		input: BrandfetchEndpointInputSchemas.searchBrands,
		output: BrandfetchEndpointOutputSchemas.searchBrands,
	},
	'brands.getCompany': {
		input: BrandfetchEndpointInputSchemas.getCompanyInfo,
		output: BrandfetchEndpointOutputSchemas.getCompanyInfo,
	},
	'logos.get': {
		input: BrandfetchEndpointInputSchemas.getCdnLogo,
		output: BrandfetchEndpointOutputSchemas.getCdnLogo,
	},
	'transactions.get': {
		input: BrandfetchEndpointInputSchemas.getTransactionInfo,
		output: BrandfetchEndpointOutputSchemas.getTransactionInfo,
	},
	'taxonomy.get': {
		input: BrandfetchEndpointInputSchemas.getTaxonomy,
		output: BrandfetchEndpointOutputSchemas.getTaxonomy,
	},
	'graphql.getVersion': {
		input: BrandfetchEndpointInputSchemas.getGraphqlVersion,
		output: BrandfetchEndpointOutputSchemas.getGraphqlVersion,
	},
	'webhooks.list': {
		input: BrandfetchEndpointInputSchemas.listWebhooks,
		output: BrandfetchEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.listEvents': {
		input: BrandfetchEndpointInputSchemas.listSubscribableEvents,
		output: BrandfetchEndpointOutputSchemas.listSubscribableEvents,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof brandfetchEndpointsNested
>;

const brandfetchEndpointMeta = {
	'brands.get': {
		riskLevel: 'read',
		description:
			'Get brand logos, colors, fonts, and company details by domain, ticker, ISIN, crypto symbol, or Brand ID',
	},
	'brands.search': {
		riskLevel: 'read',
		description: 'Search brands by name for autocomplete (requires client ID)',
	},
	'brands.getCompany': {
		riskLevel: 'read',
		description: 'Get firmographic company data for a brand identifier',
	},
	'logos.get': {
		riskLevel: 'read',
		description: 'Build a Brandfetch Logo CDN URL (requires client ID)',
	},
	'transactions.get': {
		riskLevel: 'read',
		description: 'Match a payment descriptor to merchant brand data',
	},
	'taxonomy.get': {
		riskLevel: 'read',
		description: 'Get Brandfetch industries, countries, and geographic regions',
	},
	'graphql.getVersion': {
		riskLevel: 'read',
		description: 'Get the Brandfetch GraphQL API version',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List registered Brandfetch webhooks',
	},
	'webhooks.listEvents': {
		riskLevel: 'read',
		description: 'List webhook event types that can be subscribed to',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof brandfetchEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseBrandfetchPlugin<T extends BrandfetchPluginOptions> =
	CorsairPlugin<
		'brandfetch',
		typeof BrandfetchSchema,
		typeof brandfetchEndpointsNested,
		typeof brandfetchWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof brandfetchAuthConfig
	>;

export type InternalBrandfetchPlugin =
	BaseBrandfetchPlugin<BrandfetchPluginOptions>;

export type ExternalBrandfetchPlugin<T extends BrandfetchPluginOptions> =
	BaseBrandfetchPlugin<T>;

export function brandfetch<const T extends BrandfetchPluginOptions>(
	incomingOptions: BrandfetchPluginOptions & T = {} as BrandfetchPluginOptions &
		T,
): ExternalBrandfetchPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'brandfetch',
		authConfig: brandfetchAuthConfig,
		schema: BrandfetchSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: brandfetchEndpointsNested,
		webhooks: brandfetchWebhooksNested,
		endpointMeta: brandfetchEndpointMeta,
		endpointSchemas: brandfetchEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BrandfetchKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint') {
				const res = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				return res ?? '';
			}
			return '';
		},
	} satisfies InternalBrandfetchPlugin;
}

export type {
	BrandfetchEndpointInputs,
	BrandfetchEndpointOutputs,
	GetBrandInfoInput,
	GetBrandInfoResponse,
	GetCdnLogoInput,
	GetCdnLogoResponse,
	GetCompanyInfoInput,
	GetCompanyInfoResponse,
	GetGraphqlVersionResponse,
	GetTaxonomyResponse,
	GetTransactionInfoInput,
	GetTransactionInfoResponse,
	ListSubscribableEventsResponse,
	ListWebhooksInput,
	ListWebhooksResponse,
	SearchBrandsInput,
	SearchBrandsResponse,
} from './endpoints/types';
