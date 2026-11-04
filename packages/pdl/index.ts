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
	Autocomplete,
	Company,
	Ip,
	Job,
	Location,
	Person,
	School,
} from './endpoints';
import type { PdlEndpointInputs, PdlEndpointOutputs } from './endpoints/types';
import {
	PdlEndpointInputSchemas,
	PdlEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PdlSchema } from './schema';

export type PdlPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Override for the API host. Points at the PDL sandbox
	 * (https://sandbox.api.peopledatalabs.com, same /v5/ paths) for tests
	 * and dry runs; production keeps the default.
	 */
	baseUrl?: string;
	hooks?: InternalPdlPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pdlEndpointsNested>;
};

export type PdlContext = CorsairPluginContext<
	typeof PdlSchema,
	PdlPluginOptions
>;

export type PdlKeyBuilderContext = KeyBuilderContext<PdlPluginOptions>;

export type PdlBoundEndpoints = BindEndpoints<typeof pdlEndpointsNested>;

type PdlEndpoint<K extends keyof PdlEndpointOutputs> = CorsairEndpoint<
	PdlContext,
	PdlEndpointInputs[K],
	PdlEndpointOutputs[K]
>;

export type PdlEndpoints = {
	personEnrich: PdlEndpoint<'personEnrich'>;
	personSearch: PdlEndpoint<'personSearch'>;
	personIdentify: PdlEndpoint<'personIdentify'>;
	personBulk: PdlEndpoint<'personBulk'>;
	companyEnrich: PdlEndpoint<'companyEnrich'>;
	companySearch: PdlEndpoint<'companySearch'>;
	companyClean: PdlEndpoint<'companyClean'>;
	schoolClean: PdlEndpoint<'schoolClean'>;
	locationClean: PdlEndpoint<'locationClean'>;
	ipEnrich: PdlEndpoint<'ipEnrich'>;
	jobSearch: PdlEndpoint<'jobSearch'>;
	autocomplete: PdlEndpoint<'autocomplete'>;
};

const pdlEndpointsNested = {
	person: {
		enrich: Person.enrich,
		search: Person.search,
		identify: Person.identify,
		bulk: Person.bulk,
	},
	company: {
		enrich: Company.enrich,
		search: Company.search,
		clean: Company.clean,
	},
	school: {
		clean: School.clean,
	},
	location: {
		clean: Location.clean,
	},
	ip: {
		enrich: Ip.enrich,
	},
	job: {
		search: Job.search,
	},
	autocomplete: {
		suggest: Autocomplete.suggest,
	},
} as const;

export const pdlEndpointSchemas = {
	'person.enrich': {
		input: PdlEndpointInputSchemas.personEnrich,
		output: PdlEndpointOutputSchemas.personEnrich,
	},
	'person.search': {
		input: PdlEndpointInputSchemas.personSearch,
		output: PdlEndpointOutputSchemas.personSearch,
	},
	'person.identify': {
		input: PdlEndpointInputSchemas.personIdentify,
		output: PdlEndpointOutputSchemas.personIdentify,
	},
	'person.bulk': {
		input: PdlEndpointInputSchemas.personBulk,
		output: PdlEndpointOutputSchemas.personBulk,
	},
	'company.enrich': {
		input: PdlEndpointInputSchemas.companyEnrich,
		output: PdlEndpointOutputSchemas.companyEnrich,
	},
	'company.search': {
		input: PdlEndpointInputSchemas.companySearch,
		output: PdlEndpointOutputSchemas.companySearch,
	},
	'company.clean': {
		input: PdlEndpointInputSchemas.companyClean,
		output: PdlEndpointOutputSchemas.companyClean,
	},
	'school.clean': {
		input: PdlEndpointInputSchemas.schoolClean,
		output: PdlEndpointOutputSchemas.schoolClean,
	},
	'location.clean': {
		input: PdlEndpointInputSchemas.locationClean,
		output: PdlEndpointOutputSchemas.locationClean,
	},
	'ip.enrich': {
		input: PdlEndpointInputSchemas.ipEnrich,
		output: PdlEndpointOutputSchemas.ipEnrich,
	},
	'job.search': {
		input: PdlEndpointInputSchemas.jobSearch,
		output: PdlEndpointOutputSchemas.jobSearch,
	},
	'autocomplete.suggest': {
		input: PdlEndpointInputSchemas.autocomplete,
		output: PdlEndpointOutputSchemas.autocomplete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof pdlEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const pdlEndpointMeta = {
	'person.enrich': {
		riskLevel: 'read',
		description: 'Enrich one person record (billed per match)',
	},
	'person.search': {
		riskLevel: 'read',
		description: 'Search the person dataset with an Elasticsearch query or SQL',
	},
	'person.identify': {
		riskLevel: 'read',
		description:
			'Find candidate person profiles matching the given identity inputs (billed per call)',
	},
	'person.bulk': {
		riskLevel: 'read',
		description: 'Enrich up to 100 people in one request, billed per match',
	},
	'company.enrich': {
		riskLevel: 'read',
		description: 'Enrich one company record (billed per match)',
	},
	'company.search': {
		riskLevel: 'read',
		description:
			'Search the company dataset with an Elasticsearch query or SQL',
	},
	'company.clean': {
		riskLevel: 'read',
		description: 'Normalize a company name or website (free)',
	},
	'school.clean': {
		riskLevel: 'read',
		description: 'Normalize a school name or website (free)',
	},
	'location.clean': {
		riskLevel: 'read',
		description: 'Normalize and geocode a location string (free)',
	},
	'ip.enrich': {
		riskLevel: 'read',
		description: 'Look up company and person data behind an IP address',
	},
	'job.search': {
		riskLevel: 'read',
		description:
			'Search job postings with structured filters or an Elasticsearch query (Beta)',
	},
	'autocomplete.suggest': {
		riskLevel: 'read',
		description: 'Get value suggestions for a PDL field prefix',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof pdlEndpointsNested>;

export const pdlAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BasePdlPlugin<T extends PdlPluginOptions> = CorsairPlugin<
	'pdl',
	typeof PdlSchema,
	typeof pdlEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalPdlPlugin = BasePdlPlugin<PdlPluginOptions>;

export type ExternalPdlPlugin<T extends PdlPluginOptions> = BasePdlPlugin<T>;

export function pdl<const T extends PdlPluginOptions>(
	// T is chosen by the caller, so the empty default has no value of
	// type PdlPluginOptions & T without this assertion.
	incomingOptions: PdlPluginOptions & T = {} as PdlPluginOptions & T,
): ExternalPdlPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pdl',
		authConfig: pdlAuthConfig,
		schema: PdlSchema,
		options,
		hooks: options.hooks,
		endpoints: pdlEndpointsNested,
		webhooks: {},
		endpointMeta: pdlEndpointMeta,
		endpointSchemas: pdlEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PdlKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) {
					return key;
				}
			}
			throw new AuthMissingError('pdl', 'api_key');
		},
	} satisfies InternalPdlPlugin;
}

export {
	PDL_API_BASE_URL,
	PDL_SANDBOX_BASE_URL,
	PdlAPIError,
} from './client';
export type {
	AutocompleteInput,
	AutocompleteOutput,
	BulkPersonEnrichInput,
	BulkPersonEnrichOutput,
	CompanyCleanInput,
	CompanyCleanOutput,
	CompanyEnrichInput,
	CompanyEnrichOutput,
	CompanySearchInput,
	CompanySearchOutput,
	IdentifyMatch,
	IpEnrichInput,
	IpEnrichOutput,
	JobSearchInput,
	JobSearchOutput,
	LocationCleanInput,
	LocationCleanOutput,
	PdlEndpointInputs,
	PdlEndpointOutputs,
	PersonEnrichInput,
	PersonEnrichOutput,
	PersonIdentifyInput,
	PersonIdentifyOutput,
	PersonSearchInput,
	PersonSearchOutput,
	SchoolCleanInput,
	SchoolCleanOutput,
} from './endpoints/types';
export { PdlCompany, PdlPerson } from './schema/database';
