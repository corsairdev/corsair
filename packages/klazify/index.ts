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
import { klazifyEndpoints } from './endpoints';
import type {
	KlazifyEndpointInputs,
	KlazifyEndpointOutputs,
} from './endpoints/types';
import {
	KlazifyEndpointInputSchemas,
	KlazifyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KlazifySchema } from './schema';

export type KlazifyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The Bearer token, mainly for tests. */
	key?: string;
	hooks?: InternalKlazifyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof klazifyEndpoints>;
};

export type KlazifyContext = CorsairPluginContext<
	typeof KlazifySchema,
	KlazifyPluginOptions,
	undefined,
	typeof klazifyAuthConfig
>;

export type KlazifyKeyBuilderContext = KeyBuilderContext<
	KlazifyPluginOptions,
	typeof klazifyAuthConfig
>;

export type KlazifyBoundEndpoints = BindEndpoints<typeof klazifyEndpoints>;

type KlazifyEndpoint<K extends keyof KlazifyEndpointOutputs> = CorsairEndpoint<
	KlazifyContext,
	KlazifyEndpointInputs[K],
	KlazifyEndpointOutputs[K]
>;

export type KlazifyEndpoints = {
	[K in keyof KlazifyEndpointOutputs]: KlazifyEndpoint<K>;
};

const klazifyWebhooksNested = {} as const;

export const klazifyEndpointSchemas = {
	'categorize.all': {
		input: KlazifyEndpointInputSchemas.categorizeAll,
		output: KlazifyEndpointOutputSchemas.categorizeAll,
	},
	'categorize.realtime': {
		input: KlazifyEndpointInputSchemas.categorizeRealtime,
		output: KlazifyEndpointOutputSchemas.categorizeRealtime,
	},
	'categories.iab': {
		input: KlazifyEndpointInputSchemas.categoriesIab,
		output: KlazifyEndpointOutputSchemas.categoriesIab,
	},
	'company.get': {
		input: KlazifyEndpointInputSchemas.companyGet,
		output: KlazifyEndpointOutputSchemas.companyGet,
	},
	'tech.get': {
		input: KlazifyEndpointInputSchemas.techGet,
		output: KlazifyEndpointOutputSchemas.techGet,
	},
	'logo.get': {
		input: KlazifyEndpointInputSchemas.logoGet,
		output: KlazifyEndpointOutputSchemas.logoGet,
	},
	'domain.get': {
		input: KlazifyEndpointInputSchemas.domainGet,
		output: KlazifyEndpointOutputSchemas.domainGet,
	},
	'similarDomains.get': {
		input: KlazifyEndpointInputSchemas.similarDomainsGet,
		output: KlazifyEndpointOutputSchemas.similarDomainsGet,
	},
	'traffic.get': {
		input: KlazifyEndpointInputSchemas.trafficGet,
		output: KlazifyEndpointOutputSchemas.trafficGet,
	},
	'categories.listV1': {
		input: KlazifyEndpointInputSchemas.categoriesListV1,
		output: KlazifyEndpointOutputSchemas.categoriesListV1,
	},
	'categories.listV2': {
		input: KlazifyEndpointInputSchemas.categoriesListV2,
		output: KlazifyEndpointOutputSchemas.categoriesListV2,
	},
	'discovery.search': {
		input: KlazifyEndpointInputSchemas.discoverySearch,
		output: KlazifyEndpointOutputSchemas.discoverySearch,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof klazifyEndpoints>;

const klazifyEndpointMeta = {
	'categorize.all': {
		riskLevel: 'read',
		description:
			'Classify a URL or email and return categories, logo, social profiles, company data and tech stack in one answer',
	},
	'categorize.realtime': {
		riskLevel: 'read',
		description: 'Classify a URL or email into Klazify categories, re-crawled',
	},
	'categories.iab': {
		riskLevel: 'read',
		description: 'Classify a URL into IAB v1 and v3 taxonomy categories',
	},
	'company.get': {
		riskLevel: 'read',
		description:
			'Read company name, location, headcount, revenue, funding and tags for a URL',
	},
	'tech.get': {
		riskLevel: 'read',
		description: 'Detect the technologies a website uses',
	},
	'logo.get': {
		riskLevel: 'read',
		description: "Fetch a website's logo URL from Klazify's CDN",
	},
	'domain.get': {
		riskLevel: 'read',
		description: 'Read domain registration and expiration dates',
	},
	'similarDomains.get': {
		riskLevel: 'read',
		description: 'List up to 10 domains in the same category',
	},
	'traffic.get': {
		riskLevel: 'read',
		description:
			'Read traffic rank, monthly visits, engagement and traffic sources for a domain',
	},
	'categories.listV1': {
		riskLevel: 'read',
		description: 'List the 620 categories in the Klazify v1 taxonomy',
	},
	'categories.listV2': {
		riskLevel: 'read',
		description: 'List the 1,091 categories in the Klazify v2 taxonomy',
	},
	'discovery.search': {
		riskLevel: 'read',
		description:
			"Search Klazify's domain database by rank, category, country, technology and company size",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof klazifyEndpoints>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const klazifyAuthConfig = {
	api_key: {
		// One Bearer token authenticates every call, so the base `api_key` field
		// is the whole credential and no extra account field is needed.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseKlazifyPlugin<T extends KlazifyPluginOptions> = CorsairPlugin<
	'klazify',
	typeof KlazifySchema,
	typeof klazifyEndpoints,
	typeof klazifyWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof klazifyAuthConfig
>;

export type InternalKlazifyPlugin = BaseKlazifyPlugin<KlazifyPluginOptions>;

export type ExternalKlazifyPlugin<T extends KlazifyPluginOptions> =
	BaseKlazifyPlugin<T>;

export function klazify<const T extends KlazifyPluginOptions>(
	incomingOptions: KlazifyPluginOptions & T = {} as KlazifyPluginOptions & T,
): ExternalKlazifyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'klazify',
		authConfig: klazifyAuthConfig,
		schema: KlazifySchema,
		options,
		hooks: options.hooks,
		endpoints: klazifyEndpoints,
		// Klazify sends no inbound webhooks; the API is pull-only.
		webhooks: klazifyWebhooksNested,
		endpointMeta: klazifyEndpointMeta,
		endpointSchemas: klazifyEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KlazifyKeyBuilderContext) => {
			if (options.key) return options.key;

			if (ctx.authType !== 'api_key') {
				throw new AuthMissingError('klazify', 'api_key');
			}

			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('klazify', 'api_key');
			return apiKey;
		},
	} satisfies InternalKlazifyPlugin;
}

export type { KlazifyCredentials } from './client';
export { KlazifyAPIError } from './client';
export type {
	KlazifyCategorizeResponse,
	KlazifyCategory,
	KlazifyCategoryListResponse,
	KlazifyCompany,
	KlazifyCompanyResponse,
	KlazifyDiscoveryInput,
	KlazifyDiscoveryResponse,
	KlazifyDomainResponse,
	KlazifyEndpointInputs,
	KlazifyEndpointOutputs,
	KlazifyIabResponse,
	KlazifyLogoResponse,
	KlazifyRealtimeResponse,
	KlazifySimilarDomainsResponse,
	KlazifyTarget,
	KlazifyTechResponse,
	KlazifyTrafficResponse,
} from './endpoints/types';
export { mergeErrorHandlers } from './error-handlers';
