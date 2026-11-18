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
import { BuiltWithEndpoints } from './endpoints';
import type {
	BuiltWithEndpointInputs,
	BuiltWithEndpointOutputs,
} from './endpoints/types';
import {
	BuiltWithEndpointInputSchemas,
	BuiltWithEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BuiltWithSchema } from './schema';

export type BuiltWithPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBuiltWithPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof builtWithEndpointsNested>;
};

export type BuiltWithContext = CorsairPluginContext<
	typeof BuiltWithSchema,
	BuiltWithPluginOptions
>;

export type BuiltWithKeyBuilderContext =
	KeyBuilderContext<BuiltWithPluginOptions>;

export type BuiltWithBoundEndpoints = BindEndpoints<
	typeof builtWithEndpointsNested
>;

type BuiltWithEndpoint<K extends keyof BuiltWithEndpointOutputs> =
	CorsairEndpoint<
		BuiltWithContext,
		BuiltWithEndpointInputs[K],
		BuiltWithEndpointOutputs[K]
	>;

export type BuiltWithEndpoints = {
	createDomainListFile: BuiltWithEndpoint<'createDomainListFile'>;
	datasetsLookup: BuiltWithEndpoint<'datasetsLookup'>;
	domainApiLookup: BuiltWithEndpoint<'domainApiLookup'>;
	financialApiLookup: BuiltWithEndpoint<'financialApiLookup'>;
	freeApiLookup: BuiltWithEndpoint<'freeApiLookup'>;
	listsApiGetList: BuiltWithEndpoint<'listsApiGetList'>;
	mcpApiLookup: BuiltWithEndpoint<'mcpApiLookup'>;
	productApiLookup: BuiltWithEndpoint<'productApiLookup'>;
	recommendationsApiLookup: BuiltWithEndpoint<'recommendationsApiLookup'>;
	redirectsApiLookup: BuiltWithEndpoint<'redirectsApiLookup'>;
	socialApiLookup: BuiltWithEndpoint<'socialApiLookup'>;
};

const builtWithEndpointsNested = {
	createDomainListFile: BuiltWithEndpoints.createDomainListFile,
	datasets: {
		lookup: BuiltWithEndpoints.datasetsLookup,
	},
	domain: {
		lookup: BuiltWithEndpoints.domainApiLookup,
	},
	financial: {
		lookup: BuiltWithEndpoints.financialApiLookup,
	},
	free: {
		lookup: BuiltWithEndpoints.freeApiLookup,
	},
	lists: {
		getList: BuiltWithEndpoints.listsApiGetList,
	},
	mcp: {
		lookup: BuiltWithEndpoints.mcpApiLookup,
	},
	product: {
		lookup: BuiltWithEndpoints.productApiLookup,
	},
	recommendations: {
		lookup: BuiltWithEndpoints.recommendationsApiLookup,
	},
	redirects: {
		lookup: BuiltWithEndpoints.redirectsApiLookup,
	},
	social: {
		lookup: BuiltWithEndpoints.socialApiLookup,
	},
} as const;

export const builtWithEndpointSchemas = {
	createDomainListFile: {
		input: BuiltWithEndpointInputSchemas.createDomainListFile,
		output: BuiltWithEndpointOutputSchemas.createDomainListFile,
	},
	'datasets.lookup': {
		input: BuiltWithEndpointInputSchemas.datasetsLookup,
		output: BuiltWithEndpointOutputSchemas.datasetsLookup,
	},
	'domain.lookup': {
		input: BuiltWithEndpointInputSchemas.domainApiLookup,
		output: BuiltWithEndpointOutputSchemas.domainApiLookup,
	},
	'financial.lookup': {
		input: BuiltWithEndpointInputSchemas.financialApiLookup,
		output: BuiltWithEndpointOutputSchemas.financialApiLookup,
	},
	'free.lookup': {
		input: BuiltWithEndpointInputSchemas.freeApiLookup,
		output: BuiltWithEndpointOutputSchemas.freeApiLookup,
	},
	'lists.getList': {
		input: BuiltWithEndpointInputSchemas.listsApiGetList,
		output: BuiltWithEndpointOutputSchemas.listsApiGetList,
	},
	'mcp.lookup': {
		input: BuiltWithEndpointInputSchemas.mcpApiLookup,
		output: BuiltWithEndpointOutputSchemas.mcpApiLookup,
	},
	'product.lookup': {
		input: BuiltWithEndpointInputSchemas.productApiLookup,
		output: BuiltWithEndpointOutputSchemas.productApiLookup,
	},
	'recommendations.lookup': {
		input: BuiltWithEndpointInputSchemas.recommendationsApiLookup,
		output: BuiltWithEndpointOutputSchemas.recommendationsApiLookup,
	},
	'redirects.lookup': {
		input: BuiltWithEndpointInputSchemas.redirectsApiLookup,
		output: BuiltWithEndpointOutputSchemas.redirectsApiLookup,
	},
	'social.lookup': {
		input: BuiltWithEndpointInputSchemas.socialApiLookup,
		output: BuiltWithEndpointOutputSchemas.socialApiLookup,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof builtWithEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const builtWithEndpointMeta = {
	createDomainListFile: {
		riskLevel: 'read',
		description:
			'Build a deduplicated TXT or ZIP domain list file locally for bulk lookups',
	},
	'datasets.lookup': {
		riskLevel: 'read',
		description:
			'Look up technology usage totals from the Trends API, optionally at a historical date',
	},
	'domain.lookup': {
		riskLevel: 'read',
		description:
			'Look up current and historical technologies for up to 16 root domains',
	},
	'financial.lookup': {
		riskLevel: 'read',
		description: 'Look up financial information for a domain',
	},
	'free.lookup': {
		riskLevel: 'read',
		description:
			'Get technology group and category counts with last-updated dates for a domain',
	},
	'lists.getList': {
		riskLevel: 'read',
		description:
			'List websites using a technology, paginated with the NextOffset token',
	},
	'mcp.lookup': {
		riskLevel: 'read',
		description:
			'Search the BuiltWith registry of remote MCP servers by keyword or category',
	},
	'product.lookup': {
		riskLevel: 'read',
		description:
			"Find eCommerce shops selling a product, or list a shop's products",
	},
	'recommendations.lookup': {
		riskLevel: 'read',
		description: 'Get technology recommendations for up to 16 domains',
	},
	'redirects.lookup': {
		riskLevel: 'read',
		description:
			'Get live and historical inbound and outbound redirects for a domain',
	},
	'social.lookup': {
		riskLevel: 'read',
		description: 'Find root domains linked to social media profile URLs',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof builtWithEndpointsNested
>;

export const builtWithAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBuiltWithPlugin<T extends BuiltWithPluginOptions> =
	CorsairPlugin<
		'builtwith',
		typeof BuiltWithSchema,
		typeof builtWithEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalBuiltWithPlugin =
	BaseBuiltWithPlugin<BuiltWithPluginOptions>;

export type ExternalBuiltWithPlugin<T extends BuiltWithPluginOptions> =
	BaseBuiltWithPlugin<T>;

export function builtwith<const T extends BuiltWithPluginOptions>(
	// Safe: every option is optional, so an empty object satisfies T.
	// A narrower type is not practical because TypeScript cannot prove that for a generic parameter.
	incomingOptions: BuiltWithPluginOptions & T = {} as BuiltWithPluginOptions &
		T,
): ExternalBuiltWithPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'builtwith',
		authConfig: builtWithAuthConfig,
		schema: BuiltWithSchema,
		options,
		hooks: options.hooks,
		webhooks: {},
		endpoints: builtWithEndpointsNested,
		endpointMeta: builtWithEndpointMeta,
		endpointSchemas: builtWithEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BuiltWithKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBuiltWithPlugin;
}

export type {
	BuiltWithEndpointInputs,
	BuiltWithEndpointOutputs,
	CreateDomainListFileInput,
	CreateDomainListFileResponse,
	DatasetsLookupInput,
	DatasetsLookupResponse,
	DomainApiLookupInput,
	DomainApiLookupResponse,
	FinancialApiLookupInput,
	FinancialApiLookupResponse,
	FreeApiLookupInput,
	FreeApiLookupResponse,
	ListsApiGetListInput,
	ListsApiGetListResponse,
	McpApiLookupInput,
	McpApiLookupResponse,
	ProductApiLookupInput,
	ProductApiLookupResponse,
	RecommendationsApiLookupInput,
	RecommendationsApiLookupResponse,
	RedirectsApiLookupInput,
	RedirectsApiLookupResponse,
	SocialApiLookupInput,
	SocialApiLookupResponse,
} from './endpoints/types';
