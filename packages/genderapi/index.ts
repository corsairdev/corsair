import type {
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
	countryOfOrigin,
	email,
	fullName,
	multi,
	name,
	stats,
} from './endpoints';
import type {
	GenderApiEndpointInputs,
	GenderApiEndpointOutputs,
} from './endpoints/types';
import {
	GenderApiEndpointInputSchemas,
	GenderApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GenderAPISchema } from './schema';

export type GenderApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The server key from the Gender API account. */
	key?: string;
	hooks?: InternalGenderApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof genderApiEndpointsNested>;
};

export type GenderApiContext = CorsairPluginContext<
	typeof GenderAPISchema,
	GenderApiPluginOptions
>;

export type GenderApiKeyBuilderContext =
	KeyBuilderContext<GenderApiPluginOptions>;

export type GenderApiBoundEndpoints = BindEndpoints<
	typeof genderApiEndpointsNested
>;

type GenderApiEndpoint<K extends keyof GenderApiEndpointOutputs> =
	CorsairEndpoint<
		GenderApiContext,
		GenderApiEndpointInputs[K],
		GenderApiEndpointOutputs[K]
	>;

export type GenderApiEndpoints = {
	lookup: {
		name: GenderApiEndpoint<'name'>;
		multi: GenderApiEndpoint<'multi'>;
	};
	email: {
		lookup: GenderApiEndpoint<'email'>;
	};
	fullName: {
		split: GenderApiEndpoint<'fullName'>;
	};
	countryOfOrigin: {
		get: GenderApiEndpoint<'countryOfOrigin'>;
	};
	account: {
		stats: GenderApiEndpoint<'stats'>;
	};
};

const genderApiEndpointsNested = {
	lookup: {
		name,
		multi,
	},
	email: {
		lookup: email,
	},
	fullName: {
		split: fullName,
	},
	countryOfOrigin: {
		get: countryOfOrigin,
	},
	account: {
		stats,
	},
} as const;

export const genderapiEndpointSchemas = {
	'lookup.name': {
		input: GenderApiEndpointInputSchemas.name,
		output: GenderApiEndpointOutputSchemas.name,
	},
	'lookup.multi': {
		input: GenderApiEndpointInputSchemas.multi,
		output: GenderApiEndpointOutputSchemas.multi,
	},
	'email.lookup': {
		input: GenderApiEndpointInputSchemas.email,
		output: GenderApiEndpointOutputSchemas.email,
	},
	'fullName.split': {
		input: GenderApiEndpointInputSchemas.fullName,
		output: GenderApiEndpointOutputSchemas.fullName,
	},
	'countryOfOrigin.get': {
		input: GenderApiEndpointInputSchemas.countryOfOrigin,
		output: GenderApiEndpointOutputSchemas.countryOfOrigin,
	},
	'account.stats': {
		input: GenderApiEndpointInputSchemas.stats,
		output: GenderApiEndpointOutputSchemas.stats,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof genderApiEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const genderApiEndpointMeta = {
	'lookup.name': {
		riskLevel: 'read',
		description:
			'Look up the gender behind one first name, with the sample count and the accuracy behind the answer. A country, locale or IP localizes it, which changes the answer for names such as Andrea',
	},
	'lookup.multi': {
		riskLevel: 'read',
		description:
			'Look up up to 100 names in one request, answered in the same order, with an optional country per name',
	},
	'email.lookup': {
		riskLevel: 'read',
		description:
			'Extract the first and last name from an email address and look up the gender behind the first name',
	},
	'fullName.split': {
		riskLevel: 'read',
		description:
			'Split a full name into first and last name, then look up the gender behind the first name',
	},
	'countryOfOrigin.get': {
		riskLevel: 'read',
		description:
			'Find the countries a first name most likely comes from, each with a probability score',
	},
	'account.stats': {
		riskLevel: 'read',
		description:
			'Read the remaining request count and whether the monthly limit is used up',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof genderApiEndpointsNested
>;

/**
 * Gender API takes its key as a `key` query parameter. The simple v1 surface
 * documented at https://gender-api.com/en/api-docs is what this plugin covers,
 * and it needs nothing beyond that single server key.
 */
export const genderApiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseGenderApiPlugin<T extends GenderApiPluginOptions> =
	CorsairPlugin<
		'genderapi',
		typeof GenderAPISchema,
		typeof genderApiEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof genderApiAuthConfig
	>;

export type InternalGenderApiPlugin =
	BaseGenderApiPlugin<GenderApiPluginOptions>;

export type ExternalGenderApiPlugin<T extends GenderApiPluginOptions> =
	BaseGenderApiPlugin<T>;

export function genderapi<const T extends GenderApiPluginOptions>(
	incomingOptions: GenderApiPluginOptions & T = {} as GenderApiPluginOptions &
		T,
): ExternalGenderApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'genderapi',
		schema: GenderAPISchema,
		options,
		hooks: options.hooks,
		endpoints: genderApiEndpointsNested,
		webhooks: {},
		authConfig: genderApiAuthConfig,
		endpointMeta: genderApiEndpointMeta,
		endpointSchemas: genderapiEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GenderApiKeyBuilderContext, source) => {
			// There are no webhooks, so only an endpoint asks for a key, and Gender API
			// has no keyless mode: without one it answers errno 40.
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('genderapi', ctx.authType ?? 'api_key');
		},
	} satisfies InternalGenderApiPlugin;
}

export type { GenderApiErrorInfo } from './client';
export {
	GENDER_API_ERRNO,
	GenderApiAPIError,
	genderApiErrorInfo,
} from './client';

export type {
	GenderApiCountryOfOriginEntry,
	GenderApiCountryOfOriginInput,
	GenderApiCountryOfOriginResponse,
	GenderApiEmailInput,
	GenderApiEmailResponse,
	GenderApiEndpointInputs,
	GenderApiEndpointOutputs,
	GenderApiFullNameInput,
	GenderApiFullNameResponse,
	GenderApiMultiInput,
	GenderApiMultiResponse,
	GenderApiNameInput,
	GenderApiNameResponse,
	GenderApiStatsInput,
	GenderApiStatsResponse,
} from './endpoints/types';
