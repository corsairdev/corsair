import type {
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
import { Account, Company, Email, Person } from './endpoints';
import type {
	RocketReachEndpointInputs,
	RocketReachEndpointOutputs,
} from './endpoints/types';
import {
	RocketReachEndpointInputSchemas,
	RocketReachEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RocketReachSchema } from './schema';

export type RocketReachPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRocketReachPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof rocketReachEndpointsNested>;
};

export type RocketReachContext = CorsairPluginContext<
	typeof RocketReachSchema,
	RocketReachPluginOptions
>;

export type RocketReachKeyBuilderContext =
	KeyBuilderContext<RocketReachPluginOptions>;

export type RocketReachBoundEndpoints = BindEndpoints<
	typeof rocketReachEndpointsNested
>;

type RocketReachEndpoint<K extends keyof RocketReachEndpointOutputs> =
	CorsairEndpoint<
		RocketReachContext,
		RocketReachEndpointInputs[K],
		RocketReachEndpointOutputs[K]
	>;

export type RocketReachEndpoints = {
	accountGet: RocketReachEndpoint<'accountGet'>;
	accountUniversal: RocketReachEndpoint<'accountUniversal'>;
	personLookup: RocketReachEndpoint<'personLookup'>;
	personBulkLookup: RocketReachEndpoint<'personBulkLookup'>;
	personCheckStatus: RocketReachEndpoint<'personCheckStatus'>;
	personSearch: RocketReachEndpoint<'personSearch'>;
	companyLookup: RocketReachEndpoint<'companyLookup'>;
	companySearch: RocketReachEndpoint<'companySearch'>;
	emailVerify: RocketReachEndpoint<'emailVerify'>;
};

const rocketReachEndpointsNested = {
	account: {
		get: Account.get,
		universal: Account.universal,
	},
	person: {
		lookup: Person.lookup,
		bulkLookup: Person.bulkLookup,
		checkStatus: Person.checkStatus,
		search: Person.search,
	},
	company: {
		lookup: Company.lookup,
		search: Company.search,
	},
	email: {
		verify: Email.verify,
	},
} as const;

export const rocketReachEndpointSchemas = {
	'account.get': {
		input: RocketReachEndpointInputSchemas.accountGet,
		output: RocketReachEndpointOutputSchemas.accountGet,
	},
	'account.universal': {
		input: RocketReachEndpointInputSchemas.accountUniversal,
		output: RocketReachEndpointOutputSchemas.accountUniversal,
	},
	'person.lookup': {
		input: RocketReachEndpointInputSchemas.personLookup,
		output: RocketReachEndpointOutputSchemas.personLookup,
	},
	'person.bulkLookup': {
		input: RocketReachEndpointInputSchemas.personBulkLookup,
		output: RocketReachEndpointOutputSchemas.personBulkLookup,
	},
	'person.checkStatus': {
		input: RocketReachEndpointInputSchemas.personCheckStatus,
		output: RocketReachEndpointOutputSchemas.personCheckStatus,
	},
	'person.search': {
		input: RocketReachEndpointInputSchemas.personSearch,
		output: RocketReachEndpointOutputSchemas.personSearch,
	},
	'company.lookup': {
		input: RocketReachEndpointInputSchemas.companyLookup,
		output: RocketReachEndpointOutputSchemas.companyLookup,
	},
	'company.search': {
		input: RocketReachEndpointInputSchemas.companySearch,
		output: RocketReachEndpointOutputSchemas.companySearch,
	},
	'email.verify': {
		input: RocketReachEndpointInputSchemas.emailVerify,
		output: RocketReachEndpointOutputSchemas.emailVerify,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof rocketReachEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const rocketReachEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description:
			'Read the account state, credit usage per pool and the current rate limits',
	},
	'account.universal': {
		riskLevel: 'read',
		description:
			'Read the universal-credits account: plan, daily call count and limit, credit usage by action and rate limits. The key RocketReach echoes back is stripped',
	},
	'person.lookup': {
		riskLevel: 'write',
		description:
			'Look up one person by email, LinkedIn URL, ID, phone, NPI number or name and employer, spending a lookup credit; a status other than complete means poll person.checkStatus',
	},
	'person.bulkLookup': {
		riskLevel: 'write',
		description:
			'Start a bulk lookup of up to 100 people and return the RR-Request-ID to poll with person.checkStatus',
	},
	'person.checkStatus': {
		riskLevel: 'read',
		description:
			'Read the current state of one or more profile lookups by profile ID or RR-Request-ID',
	},
	'person.search': {
		riskLevel: 'write',
		description:
			'Search people by title, employer, skills, school and other filters, returning summaries without contact details',
	},
	'company.lookup': {
		riskLevel: 'write',
		description:
			'Look up one company by domain, name, LinkedIn URL, ID or ticker, spending a lookup credit',
	},
	'company.search': {
		riskLevel: 'write',
		description:
			'Search companies by name, domain, industry, size, revenue and other filters',
	},
	'email.verify': {
		riskLevel: 'write',
		description:
			'Verify whether one address can receive mail, with per-check detail; charges a verification credit, refunded when the answer is unknown or the address is malformed',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof rocketReachEndpointsNested
>;

export type BaseRocketReachPlugin<T extends RocketReachPluginOptions> =
	CorsairPlugin<
		'rocketreach',
		typeof RocketReachSchema,
		typeof rocketReachEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalRocketReachPlugin =
	BaseRocketReachPlugin<RocketReachPluginOptions>;

export type ExternalRocketReachPlugin<T extends RocketReachPluginOptions> =
	BaseRocketReachPlugin<T>;

export function rocketreach<const T extends RocketReachPluginOptions>(
	incomingOptions: RocketReachPluginOptions &
		T = {} as RocketReachPluginOptions & T,
): ExternalRocketReachPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'rocketreach',
		schema: RocketReachSchema,
		options: options,
		hooks: options.hooks,
		endpoints: rocketReachEndpointsNested,
		webhooks: {},
		endpointMeta: rocketReachEndpointMeta,
		endpointSchemas: rocketReachEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RocketReachKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('rocketreach', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRocketReachPlugin;
}

export { RocketReachAPIError } from './client';

export type {
	AccountGetResponse,
	AccountUniversalResponse,
	CompanyLookupInput,
	CompanyLookupResponse,
	CompanySearchInput,
	CompanySearchResponse,
	EmailVerifyInput,
	EmailVerifyResponse,
	PersonBulkLookupInput,
	PersonBulkLookupResponse,
	PersonCheckStatusInput,
	PersonCheckStatusResponse,
	PersonLookupInput,
	PersonLookupResponse,
	PersonSearchInput,
	PersonSearchResponse,
	RocketReachCompany,
	RocketReachEmail,
	RocketReachEndpointInputs,
	RocketReachEndpointOutputs,
	RocketReachPersonQuery,
	RocketReachProfile,
	RocketReachProfileSearchRow,
} from './endpoints/types';
