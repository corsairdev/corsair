import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	EndpointJob,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, Company, Jobs, Person } from './endpoints';
import type {
	LushaEndpointInputs,
	LushaEndpointOutputs,
} from './endpoints/types';
import {
	LushaEndpointInputSchemas,
	LushaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { LushaSchema } from './schema';

export type LushaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLushaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lushaEndpointsNested>;
};

export type LushaContext = CorsairPluginContext<
	typeof LushaSchema,
	LushaPluginOptions
>;

export type LushaKeyBuilderContext = KeyBuilderContext<LushaPluginOptions>;

export type LushaBoundEndpoints = BindEndpoints<typeof lushaEndpointsNested>;

type LushaEndpoint<K extends keyof LushaEndpointOutputs> = CorsairEndpoint<
	LushaContext,
	LushaEndpointInputs[K],
	LushaEndpointOutputs[K]
>;

export type LushaEndpoints = {
	personSearchContacts: LushaEndpoint<'personSearchContacts'>;
	personEnrichContacts: LushaEndpoint<'personEnrichContacts'>;
	personSearchAndEnrichContacts: LushaEndpoint<'personSearchAndEnrichContacts'>;
	companySearchCompanies: LushaEndpoint<'companySearchCompanies'>;
	companyEnrichCompanies: LushaEndpoint<'companyEnrichCompanies'>;
	companySearchAndEnrichCompanies: LushaEndpoint<'companySearchAndEnrichCompanies'>;
	accountGetAccountUsage: LushaEndpoint<'accountGetAccountUsage'>;
	jobsGetContactsEnrichJob: LushaEndpoint<'jobsGetContactsEnrichJob'>;
};

const lushaEndpointsNested = {
	person: {
		searchContacts: Person.searchContacts,
		enrichContacts: Person.enrichContacts,
		searchAndEnrichContacts: Person.searchAndEnrichContacts,
	},
	company: {
		searchCompanies: Company.searchCompanies,
		enrichCompanies: Company.enrichCompanies,
		searchAndEnrichCompanies: Company.searchAndEnrichCompanies,
	},
	account: {
		getAccountUsage: Account.getAccountUsage,
	},
	jobs: {
		getContactsEnrichJob: Jobs.getContactsEnrichJob,
	},
} as const;

export const lushaEndpointSchemas = {
	'person.searchContacts': {
		input: LushaEndpointInputSchemas.personSearchContacts,
		output: LushaEndpointOutputSchemas.personSearchContacts,
	},
	'person.enrichContacts': {
		input: LushaEndpointInputSchemas.personEnrichContacts,
		output: LushaEndpointOutputSchemas.personEnrichContacts,
	},
	'person.searchAndEnrichContacts': {
		input: LushaEndpointInputSchemas.personSearchAndEnrichContacts,
		output: LushaEndpointOutputSchemas.personSearchAndEnrichContacts,
	},
	'company.searchCompanies': {
		input: LushaEndpointInputSchemas.companySearchCompanies,
		output: LushaEndpointOutputSchemas.companySearchCompanies,
	},
	'company.enrichCompanies': {
		input: LushaEndpointInputSchemas.companyEnrichCompanies,
		output: LushaEndpointOutputSchemas.companyEnrichCompanies,
	},
	'company.searchAndEnrichCompanies': {
		input: LushaEndpointInputSchemas.companySearchAndEnrichCompanies,
		output: LushaEndpointOutputSchemas.companySearchAndEnrichCompanies,
	},
	'account.getAccountUsage': {
		input: LushaEndpointInputSchemas.accountGetAccountUsage,
		output: LushaEndpointOutputSchemas.accountGetAccountUsage,
	},
	'jobs.getContactsEnrichJob': {
		input: LushaEndpointInputSchemas.jobsGetContactsEnrichJob,
		output: LushaEndpointOutputSchemas.jobsGetContactsEnrichJob,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof lushaEndpointsNested>;

// enrichContacts can answer 200 with status 'partial' and a job: poll
// jobs.getContactsEnrichJob with job.id until status is 'complete' (merge its
// contacts into the results by id), 'expired' or 'failed'. jobs.test.ts keeps
// every status value in step with LUSHA_JOB_STATUSES.
const CONTACTS_ENRICH_JOB = {
	idPath: 'job.id',
	status: {
		op: 'jobs.getContactsEnrichJob',
		idArg: 'jobId',
		statusPath: 'status',
		done: ['complete'],
		failed: ['expired', 'failed'],
	},
} as const satisfies EndpointJob;

const lushaEndpointMeta = {
	'person.searchContacts': {
		riskLevel: 'read',
		description:
			'Look up up to 100 contacts by id, LinkedIn URL, email, or name plus company, and get previews that say which data points exist and what revealing them costs. Metered: Lusha charges credits per matched result.',
	},
	'person.enrichContacts': {
		riskLevel: 'read',
		description:
			'Reveal emails and phone numbers for up to 100 contact ids from search results. Metered: charged per revealed data point, and every call re-charges. May answer status partial with a job; follow it with jobs.getContactsEnrichJob until it reports complete, expired or failed.',
		job: CONTACTS_ENRICH_JOB,
	},
	'person.searchAndEnrichContacts': {
		riskLevel: 'read',
		description:
			'Search up to 100 contacts by email, LinkedIn URL or name plus company and return their full enriched records in one call. Metered: charged per result and per revealed field.',
	},
	'company.searchCompanies': {
		riskLevel: 'read',
		description:
			'Look up up to 100 companies by id, name or domain and get firmographic previews. Metered: Lusha charges credits per matched result.',
	},
	'company.enrichCompanies': {
		riskLevel: 'read',
		description:
			'Reveal full firmographics for up to 100 company ids, including premium fields named in reveal (each charged separately per result). Omitting reveal returns base firmographics only. Metered, and every call re-charges.',
	},
	'company.searchAndEnrichCompanies': {
		riskLevel: 'read',
		description:
			'Search up to 100 companies by id, name or domain and return their full firmographics in one call. Metered: charged per result and per reveal field.',
	},
	'account.getAccountUsage': {
		riskLevel: 'read',
		description:
			'Read the account credit balance, rate-limit windows, plan and per-action pricing map. Free, but Lusha caps it at 5 requests per minute.',
	},
	'jobs.getContactsEnrichJob': {
		riskLevel: 'read',
		description:
			'Where a partial contacts enrich job stands: processing (poll again after retryAfter seconds), complete (contacts to merge by id plus creditsCharged), or the terminal expired and failed. Free.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof lushaEndpointsNested>;

export type BaseLushaPlugin<T extends LushaPluginOptions> = CorsairPlugin<
	'lusha',
	typeof LushaSchema,
	typeof lushaEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalLushaPlugin = BaseLushaPlugin<LushaPluginOptions>;

export type ExternalLushaPlugin<T extends LushaPluginOptions> =
	BaseLushaPlugin<T>;

const defaultAuthType = 'api_key' as const;

export function lusha<const T extends LushaPluginOptions>(
	incomingOptions: LushaPluginOptions & T = {} as LushaPluginOptions & T,
): ExternalLushaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'lusha',
		schema: LushaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: lushaEndpointsNested,
		webhooks: {},
		endpointMeta: lushaEndpointMeta,
		endpointSchemas: lushaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: LushaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('lusha', ctx.authType ?? 'api_key');
		},
	} satisfies InternalLushaPlugin;
}

export { LushaAPIError } from './client';

export type {
	AccountGetAccountUsageInput,
	AccountGetAccountUsageResponse,
	CompanyEnrichCompaniesInput,
	CompanyEnrichCompaniesResponse,
	CompanySearchAndEnrichCompaniesInput,
	CompanySearchAndEnrichCompaniesResponse,
	CompanySearchCompaniesInput,
	CompanySearchCompaniesResponse,
	JobsGetContactsEnrichJobInput,
	JobsGetContactsEnrichJobResponse,
	LushaContactSearchItem,
	LushaEndpointInputs,
	LushaEndpointOutputs,
	PersonEnrichContactsInput,
	PersonEnrichContactsResponse,
	PersonSearchAndEnrichContactsInput,
	PersonSearchAndEnrichContactsResponse,
	PersonSearchContactsInput,
	PersonSearchContactsResponse,
} from './endpoints/types';
