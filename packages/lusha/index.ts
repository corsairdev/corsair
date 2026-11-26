import type {
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, Company, Jobs, Person } from './endpoints';
import {
	LushaSpecEndpoints,
	lushaSpecEndpointSchemas,
} from './endpoints/generated/spec-endpoints';
import { LUSHA_SPEC_META } from './endpoints/generated/spec-ops';
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
import {
	LushaOptOutEventSchema,
	LushaSignalEventSchema,
	matchLushaWebhook,
	optOutReceived,
	signalReceived,
} from './webhooks';

export type LushaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Account webhook secret; otherwise the stored webhook_signature key. */
	webhookSecret?: string;
	hooks?: InternalLushaPlugin['hooks'];
	webhookHooks?: InternalLushaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lushaEndpointsNested>;
};

export type LushaContext = CorsairPluginContext<
	typeof LushaSchema,
	LushaPluginOptions
>;

export type LushaKeyBuilderContext = KeyBuilderContext<LushaPluginOptions>;

export type LushaBoundEndpoints = BindEndpoints<typeof lushaEndpointsNested>;
export type LushaBoundWebhooks = BindWebhooks<typeof lushaWebhooksNested>;

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
		...LushaSpecEndpoints.person,
	},
	company: {
		searchCompanies: Company.searchCompanies,
		enrichCompanies: Company.enrichCompanies,
		searchAndEnrichCompanies: Company.searchAndEnrichCompanies,
		...LushaSpecEndpoints.company,
	},
	contactTables: LushaSpecEndpoints.contactTables,
	companyTables: LushaSpecEndpoints.companyTables,
	icp: LushaSpecEndpoints.icp,
	subscriptions: LushaSpecEndpoints.subscriptions,
	auditLogs: LushaSpecEndpoints.auditLogs,
	conversations: LushaSpecEndpoints.conversations,
	account: {
		getAccountUsage: Account.getAccountUsage,
	},
	jobs: {
		getContactsEnrichJob: Jobs.getContactsEnrichJob,
	},
} as const;

const lushaWebhooksNested = {
	signals: { received: signalReceived },
	optOuts: { received: optOutReceived },
} as const;

const lushaWebhookSchemas = {
	'signals.received': {
		description:
			'A signal for a subscribed contact or company (promotion, company change, news, hiring, intent...). Lusha charges the credits in billing.creditsCharged for each delivery.',
		payload: LushaSignalEventSchema,
		response: LushaSignalEventSchema,
	},
	'optOuts.received': {
		description:
			'A contact opted out of Lusha data processing; remove the listed emails and phone numbers from your own systems.',
		payload: LushaOptOutEventSchema,
		response: LushaOptOutEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof lushaWebhooksNested>;

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
	...lushaSpecEndpointSchemas,
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
		riskLevel: 'destructive',
		description:
			'Look up up to 100 contacts by id, LinkedIn URL, email, or name plus company, and get previews that say which data points exist and what revealing them costs. Charges credits per matched result.',
	},
	'person.enrichContacts': {
		riskLevel: 'destructive',
		description:
			'Reveal emails and phone numbers for up to 100 contact ids from search results. Charges credits per revealed data point; a data point already revealed for the account is free to re-enrich (canReveal.credits is 0 in search). May answer status partial with a job; follow it with jobs.getContactsEnrichJob until it reports complete, expired or failed.',
		job: CONTACTS_ENRICH_JOB,
	},
	'person.searchAndEnrichContacts': {
		riskLevel: 'destructive',
		description:
			'Search up to 100 contacts by email, LinkedIn URL or name plus company and return their full enriched records in one call. Charges credits per result and per revealed field.',
	},
	'company.searchCompanies': {
		riskLevel: 'destructive',
		description:
			'Look up up to 100 companies by id, name or domain and get firmographic previews. Charges credits per matched result.',
	},
	'company.enrichCompanies': {
		riskLevel: 'destructive',
		description:
			'Reveal full firmographics for up to 100 company ids, including premium fields named in reveal (each charged separately per result). Omitting reveal returns base firmographics only. Charges credits per result via reveal_company.',
	},
	'company.searchAndEnrichCompanies': {
		riskLevel: 'destructive',
		description:
			'Search up to 100 companies by id, name or domain and return their full firmographics in one call. Charges credits per result and per reveal field.',
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
	...LUSHA_SPEC_META,
} as const satisfies RequiredPluginEndpointMeta<typeof lushaEndpointsNested>;

export type BaseLushaPlugin<T extends LushaPluginOptions> = CorsairPlugin<
	'lusha',
	typeof LushaSchema,
	typeof lushaEndpointsNested,
	typeof lushaWebhooksNested,
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
		webhookHooks: options.webhookHooks,
		endpoints: lushaEndpointsNested,
		webhooks: lushaWebhooksNested,
		endpointMeta: lushaEndpointMeta,
		endpointSchemas: lushaEndpointSchemas,
		webhookSchemas: lushaWebhookSchemas,
		pluginWebhookMatcher: matchLushaWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: LushaKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// An empty secret makes verifyLushaSignature reject the delivery.
				if (options.webhookSecret) return options.webhookSecret;
				return (await ctx.keys.get_webhook_signature()) ?? '';
			}
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
