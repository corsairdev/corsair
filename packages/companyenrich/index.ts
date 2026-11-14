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
import {
	Account,
	Companies,
	Geo,
	Industries,
	Keywords,
	People,
	Positions,
	Technologies,
} from './endpoints';
import type {
	CompanyenrichEndpointInputs,
	CompanyenrichEndpointOutputs,
} from './endpoints/types';
import {
	CompanyenrichEndpointInputSchemas,
	CompanyenrichEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CompanyenrichSchema } from './schema';

export type CompanyenrichPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCompanyenrichPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof companyenrichEndpointsNested>;
};

export type CompanyenrichContext = CorsairPluginContext<
	typeof CompanyenrichSchema,
	CompanyenrichPluginOptions
>;

export type CompanyenrichKeyBuilderContext =
	KeyBuilderContext<CompanyenrichPluginOptions>;

export type CompanyenrichBoundEndpoints = BindEndpoints<
	typeof companyenrichEndpointsNested
>;

type CompanyenrichEndpoint<K extends keyof CompanyenrichEndpointOutputs> =
	CorsairEndpoint<
		CompanyenrichContext,
		CompanyenrichEndpointInputs[K],
		CompanyenrichEndpointOutputs[K]
	>;

export type CompanyenrichEndpoints = {
	companiesGet: CompanyenrichEndpoint<'companiesGet'>;
	companiesEnrichByDomain: CompanyenrichEndpoint<'companiesEnrichByDomain'>;
	companiesEnrichByProperties: CompanyenrichEndpoint<'companiesEnrichByProperties'>;
	companiesEnrichBatch: CompanyenrichEndpoint<'companiesEnrichBatch'>;
	companiesAutocomplete: CompanyenrichEndpoint<'companiesAutocomplete'>;
	companiesWorkforce: CompanyenrichEndpoint<'companiesWorkforce'>;
	companiesSearch: CompanyenrichEndpoint<'companiesSearch'>;
	companiesSearchCount: CompanyenrichEndpoint<'companiesSearchCount'>;
	companiesSearchPreview: CompanyenrichEndpoint<'companiesSearchPreview'>;
	peopleGet: CompanyenrichEndpoint<'peopleGet'>;
	peopleEnrich: CompanyenrichEndpoint<'peopleEnrich'>;
	peopleFindEmail: CompanyenrichEndpoint<'peopleFindEmail'>;
	peopleSearch: CompanyenrichEndpoint<'peopleSearch'>;
	peopleSearchCount: CompanyenrichEndpoint<'peopleSearchCount'>;
	peopleSearchPreview: CompanyenrichEndpoint<'peopleSearchPreview'>;
	geoRegions: CompanyenrichEndpoint<'geoRegions'>;
	geoGetCountry: CompanyenrichEndpoint<'geoGetCountry'>;
	geoSearchCountries: CompanyenrichEndpoint<'geoSearchCountries'>;
	geoSearchStates: CompanyenrichEndpoint<'geoSearchStates'>;
	geoSearchCities: CompanyenrichEndpoint<'geoSearchCities'>;
	industriesList: CompanyenrichEndpoint<'industriesList'>;
	keywordsAutocomplete: CompanyenrichEndpoint<'keywordsAutocomplete'>;
	technologiesAutocomplete: CompanyenrichEndpoint<'technologiesAutocomplete'>;
	positionsAutocomplete: CompanyenrichEndpoint<'positionsAutocomplete'>;
	accountMe: CompanyenrichEndpoint<'accountMe'>;
};

const companyenrichEndpointsNested = {
	companies: {
		get: Companies.get,
		enrichByDomain: Companies.enrichByDomain,
		enrichByProperties: Companies.enrichByProperties,
		enrichBatch: Companies.enrichBatch,
		autocomplete: Companies.autocomplete,
		workforce: Companies.workforce,
		search: Companies.search,
		searchCount: Companies.searchCount,
		searchPreview: Companies.searchPreview,
	},
	people: {
		get: People.get,
		enrich: People.enrich,
		findEmail: People.findEmail,
		search: People.search,
		searchCount: People.searchCount,
		searchPreview: People.searchPreview,
	},
	geo: {
		regions: Geo.regions,
		getCountry: Geo.getCountry,
		searchCountries: Geo.searchCountries,
		searchStates: Geo.searchStates,
		searchCities: Geo.searchCities,
	},
	industries: {
		list: Industries.list,
	},
	keywords: {
		autocomplete: Keywords.autocomplete,
	},
	technologies: {
		autocomplete: Technologies.autocomplete,
	},
	positions: {
		autocomplete: Positions.autocomplete,
	},
	account: {
		me: Account.me,
	},
} as const;

export const companyenrichEndpointSchemas = {
	'companies.get': {
		input: CompanyenrichEndpointInputSchemas.companiesGet,
		output: CompanyenrichEndpointOutputSchemas.companiesGet,
	},
	'companies.enrichByDomain': {
		input: CompanyenrichEndpointInputSchemas.companiesEnrichByDomain,
		output: CompanyenrichEndpointOutputSchemas.companiesEnrichByDomain,
	},
	'companies.enrichByProperties': {
		input: CompanyenrichEndpointInputSchemas.companiesEnrichByProperties,
		output: CompanyenrichEndpointOutputSchemas.companiesEnrichByProperties,
	},
	'companies.enrichBatch': {
		input: CompanyenrichEndpointInputSchemas.companiesEnrichBatch,
		output: CompanyenrichEndpointOutputSchemas.companiesEnrichBatch,
	},
	'companies.autocomplete': {
		input: CompanyenrichEndpointInputSchemas.companiesAutocomplete,
		output: CompanyenrichEndpointOutputSchemas.companiesAutocomplete,
	},
	'companies.workforce': {
		input: CompanyenrichEndpointInputSchemas.companiesWorkforce,
		output: CompanyenrichEndpointOutputSchemas.companiesWorkforce,
	},
	'companies.search': {
		input: CompanyenrichEndpointInputSchemas.companiesSearch,
		output: CompanyenrichEndpointOutputSchemas.companiesSearch,
	},
	'companies.searchCount': {
		input: CompanyenrichEndpointInputSchemas.companiesSearchCount,
		output: CompanyenrichEndpointOutputSchemas.companiesSearchCount,
	},
	'companies.searchPreview': {
		input: CompanyenrichEndpointInputSchemas.companiesSearchPreview,
		output: CompanyenrichEndpointOutputSchemas.companiesSearchPreview,
	},
	'people.get': {
		input: CompanyenrichEndpointInputSchemas.peopleGet,
		output: CompanyenrichEndpointOutputSchemas.peopleGet,
	},
	'people.enrich': {
		input: CompanyenrichEndpointInputSchemas.peopleEnrich,
		output: CompanyenrichEndpointOutputSchemas.peopleEnrich,
	},
	'people.findEmail': {
		input: CompanyenrichEndpointInputSchemas.peopleFindEmail,
		output: CompanyenrichEndpointOutputSchemas.peopleFindEmail,
	},
	'people.search': {
		input: CompanyenrichEndpointInputSchemas.peopleSearch,
		output: CompanyenrichEndpointOutputSchemas.peopleSearch,
	},
	'people.searchCount': {
		input: CompanyenrichEndpointInputSchemas.peopleSearchCount,
		output: CompanyenrichEndpointOutputSchemas.peopleSearchCount,
	},
	'people.searchPreview': {
		input: CompanyenrichEndpointInputSchemas.peopleSearchPreview,
		output: CompanyenrichEndpointOutputSchemas.peopleSearchPreview,
	},
	'geo.regions': {
		input: CompanyenrichEndpointInputSchemas.geoRegions,
		output: CompanyenrichEndpointOutputSchemas.geoRegions,
	},
	'geo.getCountry': {
		input: CompanyenrichEndpointInputSchemas.geoGetCountry,
		output: CompanyenrichEndpointOutputSchemas.geoGetCountry,
	},
	'geo.searchCountries': {
		input: CompanyenrichEndpointInputSchemas.geoSearchCountries,
		output: CompanyenrichEndpointOutputSchemas.geoSearchCountries,
	},
	'geo.searchStates': {
		input: CompanyenrichEndpointInputSchemas.geoSearchStates,
		output: CompanyenrichEndpointOutputSchemas.geoSearchStates,
	},
	'geo.searchCities': {
		input: CompanyenrichEndpointInputSchemas.geoSearchCities,
		output: CompanyenrichEndpointOutputSchemas.geoSearchCities,
	},
	'industries.list': {
		input: CompanyenrichEndpointInputSchemas.industriesList,
		output: CompanyenrichEndpointOutputSchemas.industriesList,
	},
	'keywords.autocomplete': {
		input: CompanyenrichEndpointInputSchemas.keywordsAutocomplete,
		output: CompanyenrichEndpointOutputSchemas.keywordsAutocomplete,
	},
	'technologies.autocomplete': {
		input: CompanyenrichEndpointInputSchemas.technologiesAutocomplete,
		output: CompanyenrichEndpointOutputSchemas.technologiesAutocomplete,
	},
	'positions.autocomplete': {
		input: CompanyenrichEndpointInputSchemas.positionsAutocomplete,
		output: CompanyenrichEndpointOutputSchemas.positionsAutocomplete,
	},
	'account.me': {
		input: CompanyenrichEndpointInputSchemas.accountMe,
		output: CompanyenrichEndpointOutputSchemas.accountMe,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof companyenrichEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const companyenrichEndpointMeta = {
	'companies.get': {
		riskLevel: 'read',
		description:
			'Get a stored company by its CompanyEnrich ID. Costs 1 credit plus 1 per expansion (financial, keywords, NAICS codes, technologies, workforce with 12 months of history).',
	},
	'companies.enrichByDomain': {
		riskLevel: 'read',
		description:
			'Enrich a company from its domain, optionally waiting for on-demand enrichment. Costs 1 credit per success.',
	},
	'companies.enrichByProperties': {
		riskLevel: 'read',
		description:
			'Enrich a company from identifying properties such as name or social URLs. Costs 1 credit when a company is returned.',
	},
	'companies.enrichBatch': {
		riskLevel: 'read',
		description:
			'Enrich up to 50 company domains in one request. Costs 1 credit per unique company found.',
	},
	'companies.autocomplete': {
		riskLevel: 'read',
		description:
			'Suggest up to 10 companies whose domain starts with the query. Free.',
	},
	'companies.workforce': {
		riskLevel: 'read',
		description:
			'Get observed headcount and department breakdowns for one company by ID or domain, 12 months of history per page. Costs 1 credit per page.',
	},
	'companies.search': {
		riskLevel: 'read',
		description:
			'Search companies by filters, a semantic query or lookalike seed domains, with cursor pagination. Costs 1 credit per company (2 semantic, 5 lookalike).',
	},
	'companies.searchCount': {
		riskLevel: 'read',
		description:
			'Count companies matching the same filters, semantic query or lookalike seeds as search. Free.',
	},
	'companies.searchPreview': {
		riskLevel: 'read',
		description:
			'Preview up to 25 matching companies with the search ranking. Free, needs a plan with previews.',
	},
	'people.get': {
		riskLevel: 'read',
		description:
			'Get a stored person by their CompanyEnrich ID. Costs 2 credits, plus 1 for the education expansion and 1 per unique company for the company expansion.',
	},
	'people.enrich': {
		riskLevel: 'read',
		description:
			'Enrich a person from their email address. Costs 5 credits when a person is returned.',
	},
	'people.findEmail': {
		riskLevel: 'read',
		description:
			'Find the work email of a person on a company domain (BETA). Costs 10 credits for a previously unseen email.',
	},
	'people.search': {
		riskLevel: 'read',
		description:
			'Search people by person filters, a natural-language query and an optional company query, with cursor pagination. Costs 2 credits per person.',
	},
	'people.searchCount': {
		riskLevel: 'read',
		description:
			'Count people matching the same person filters, natural-language query and company query as search. Free.',
	},
	'people.searchPreview': {
		riskLevel: 'read',
		description:
			'Preview up to 10 masked person summaries with the search ranking. Free, needs a plan with previews.',
	},
	'geo.regions': {
		riskLevel: 'read',
		description:
			'List geographic regions and the country codes they cover. Free.',
	},
	'geo.getCountry': {
		riskLevel: 'read',
		description: 'Get one country by its two-letter ISO code. Free.',
	},
	'geo.searchCountries': {
		riskLevel: 'read',
		description:
			'Search countries by a literal name substring, with cursor pagination. Free.',
	},
	'geo.searchStates': {
		riskLevel: 'read',
		description:
			'Search states or provinces by name substring, optionally by country, with cursor pagination. Free.',
	},
	'geo.searchCities': {
		riskLevel: 'read',
		description:
			'Search cities by name substring, state or country, with cursor pagination. Free.',
	},
	'industries.list': {
		riskLevel: 'read',
		description:
			'List industries with the NAICS code prefixes accepted by company search. Free.',
	},
	'keywords.autocomplete': {
		riskLevel: 'read',
		description:
			'Suggest up to 10 keywords by popularity, for company search keyword filters. Free.',
	},
	'technologies.autocomplete': {
		riskLevel: 'read',
		description:
			'Suggest up to 10 technologies by popularity, for company search technology filters. Free.',
	},
	'positions.autocomplete': {
		riskLevel: 'read',
		description:
			'Suggest up to 10 position or job titles by popularity, for people search position filters. Free.',
	},
	'account.me': {
		riskLevel: 'read',
		description:
			'Get the authenticated user, credit balance and plan capabilities. Free.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof companyenrichEndpointsNested
>;

export const companyenrichAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseCompanyenrichPlugin<T extends CompanyenrichPluginOptions> =
	CorsairPlugin<
		'companyenrich',
		typeof CompanyenrichSchema,
		typeof companyenrichEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalCompanyenrichPlugin =
	BaseCompanyenrichPlugin<CompanyenrichPluginOptions>;

export type ExternalCompanyenrichPlugin<T extends CompanyenrichPluginOptions> =
	BaseCompanyenrichPlugin<T>;

export function companyenrich<const T extends CompanyenrichPluginOptions>(
	incomingOptions: CompanyenrichPluginOptions &
		T = {} as CompanyenrichPluginOptions & T,
): ExternalCompanyenrichPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtInErrorHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerErrorHandlers } =
		options.errorHandlers ?? {};
	// Put caller handlers first for first-match dispatch, then re-apply their
	// values so handlers with built-in names remain caller overrides.
	const orderedErrorHandlers = {
		...callerErrorHandlers,
		...builtInErrorHandlers,
		...callerErrorHandlers,
		// DEFAULT matches everything, so keep the selected fallback last.
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'companyenrich',
		authConfig: companyenrichAuthConfig,
		schema: CompanyenrichSchema,
		options,
		hooks: options.hooks,
		endpoints: companyenrichEndpointsNested,
		// The v2 reference exposes request/response endpoints only. Its older
		// async job callbacks are outside this v2-only plugin scope; no inbound
		// webhook receiver is implemented.
		webhooks: {},
		endpointMeta: companyenrichEndpointMeta,
		endpointSchemas: companyenrichEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		// Every v2 route requires the API token; raise here so Corsair can attach
		// the supported first-use connect guidance before the endpoint is called.
		keyBuilder: async (ctx: CompanyenrichKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				if (!apiKey) {
					throw new AuthMissingError('companyenrich', 'api_key');
				}
				return apiKey;
			}

			return '';
		},
	} satisfies InternalCompanyenrichPlugin;
}

export type {
	AccountMeInput,
	AccountMeResponse,
	CompaniesAutocompleteInput,
	CompaniesAutocompleteResponse,
	CompaniesEnrichBatchInput,
	CompaniesEnrichBatchResponse,
	CompaniesEnrichByDomainInput,
	CompaniesEnrichByPropertiesInput,
	CompaniesGetInput,
	CompaniesSearchCountInput,
	CompaniesSearchCountResponse,
	CompaniesSearchInput,
	CompaniesSearchPreviewInput,
	CompaniesSearchPreviewResponse,
	CompaniesSearchResponse,
	CompaniesWorkforceInput,
	CompaniesWorkforceResponse,
	CompanyAutocompleteResponse,
	CompanyExpand,
	CompanyenrichEndpointInputs,
	CompanyenrichEndpointOutputs,
	CompanyResponse,
	CompanySearchFilter,
	CompanySearchQuery,
	GeoCity,
	GeoCountry,
	GeoRegionsInput,
	GeoRegionsResponse,
	GeoSearchCitiesInput,
	GeoSearchCitiesResponse,
	GeoSearchCountriesInput,
	GeoSearchCountriesResponse,
	GeoSearchStatesInput,
	GeoSearchStatesResponse,
	GeoState,
	IndustriesListInput,
	IndustriesListResponse,
	KeywordsAutocompleteInput,
	KeywordsAutocompleteResponse,
	PeopleEnrichInput,
	PeopleFindEmailInput,
	PeopleFindEmailResponse,
	PeopleGetInput,
	PeopleSearchCountInput,
	PeopleSearchCountResponse,
	PeopleSearchInput,
	PeopleSearchPreviewInput,
	PeopleSearchPreviewResponse,
	PeopleSearchResponse,
	PersonExpand,
	PersonResponse,
	PersonSearchFilter,
	PositionsAutocompleteInput,
	PositionsAutocompleteResponse,
	TechnologiesAutocompleteInput,
	TechnologiesAutocompleteResponse,
} from './endpoints/types';
