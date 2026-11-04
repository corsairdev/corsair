import type {
	AuthTypes,
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
import { Company, Industry, News } from './endpoints';
import type {
	AktaEndpointInputs,
	AktaEndpointOutputs,
} from './endpoints/types';
import {
	AktaEndpointInputSchemas,
	AktaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AktaSchema } from './schema';

export type AktaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAktaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof aktaEndpointsNested>;
};

export type AktaContext = CorsairPluginContext<
	typeof AktaSchema,
	AktaPluginOptions
>;

export type AktaKeyBuilderContext = KeyBuilderContext<AktaPluginOptions>;

export type AktaBoundEndpoints = BindEndpoints<typeof aktaEndpointsNested>;

type AktaEndpoint<K extends keyof AktaEndpointOutputs> = CorsairEndpoint<
	AktaContext,
	AktaEndpointInputs[K],
	AktaEndpointOutputs[K]
>;

export type AktaEndpoints = {
	companySearch: AktaEndpoint<'companySearch'>;
	companyEnrich: AktaEndpoint<'companyEnrich'>;
	companyEmployeeReviews: AktaEndpoint<'companyEmployeeReviews'>;
	companyProductReviews: AktaEndpoint<'companyProductReviews'>;
	industrySearch: AktaEndpoint<'industrySearch'>;
	newsList: AktaEndpoint<'newsList'>;
};

const aktaEndpointsNested = {
	company: {
		search: Company.search,
		enrich: Company.enrich,
		employeeReviews: Company.employeeReviews,
		productReviews: Company.productReviews,
	},
	industry: {
		search: Industry.search,
	},
	news: {
		list: News.list,
	},
} as const;

export const aktaEndpointSchemas = {
	'company.search': {
		input: AktaEndpointInputSchemas.companySearch,
		output: AktaEndpointOutputSchemas.companySearch,
	},
	'company.enrich': {
		input: AktaEndpointInputSchemas.companyEnrich,
		output: AktaEndpointOutputSchemas.companyEnrich,
	},
	'company.employeeReviews': {
		input: AktaEndpointInputSchemas.companyEmployeeReviews,
		output: AktaEndpointOutputSchemas.companyEmployeeReviews,
	},
	'company.productReviews': {
		input: AktaEndpointInputSchemas.companyProductReviews,
		output: AktaEndpointOutputSchemas.companyProductReviews,
	},
	'industry.search': {
		input: AktaEndpointInputSchemas.industrySearch,
		output: AktaEndpointOutputSchemas.industrySearch,
	},
	'news.list': {
		input: AktaEndpointInputSchemas.newsList,
		output: AktaEndpointOutputSchemas.newsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof aktaEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const aktaEndpointMeta = {
	'company.search': {
		riskLevel: 'read',
		description:
			'Resolve a company name or website to its Akta uuid (free, no credits)',
	},
	'company.enrich': {
		riskLevel: 'read',
		description:
			'Get structured company data by section: firmographics, business model, funding, and more',
	},
	'company.employeeReviews': {
		riskLevel: 'read',
		description:
			'Get employee review ratings and individual reviews for a company',
	},
	'company.productReviews': {
		riskLevel: 'read',
		description:
			"Get a company's product catalog with ratings, pricing, and reviews",
	},
	'industry.search': {
		riskLevel: 'read',
		description:
			'Resolve a free-text industry to Akta industry codes (free, no credits)',
	},
	'news.list': {
		riskLevel: 'read',
		description:
			'List enriched news articles filtered by company, industry, topic, or date',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof aktaEndpointsNested>;

export type BaseAktaPlugin<T extends AktaPluginOptions> = CorsairPlugin<
	'akta',
	typeof AktaSchema,
	typeof aktaEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalAktaPlugin = BaseAktaPlugin<AktaPluginOptions>;

export type ExternalAktaPlugin<T extends AktaPluginOptions> = BaseAktaPlugin<T>;

export function akta<const T extends AktaPluginOptions>(
	incomingOptions: AktaPluginOptions & T = {} as AktaPluginOptions & T,
): ExternalAktaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'akta',
		schema: AktaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: aktaEndpointsNested,
		webhooks: {},
		endpointMeta: aktaEndpointMeta,
		endpointSchemas: aktaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AktaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('akta', 'api_key');
		},
	} satisfies InternalAktaPlugin;
}

export type {
	AktaEndpointInputs,
	AktaEndpointOutputs,
	CompanyEmployeeReviewsInput,
	CompanyEmployeeReviewsResponse,
	CompanyEnrichInput,
	CompanyEnrichment,
	CompanyEnrichResponse,
	CompanyProductReviewsInput,
	CompanyProductReviewsResponse,
	CompanySearchInput,
	CompanySearchResponse,
	CompanySearchResult,
	EnrichmentSection,
	IndustrySearchInput,
	IndustrySearchResponse,
	NewsArticle,
	NewsListInput,
	NewsListResponse,
} from './endpoints/types';
