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
import {
	capabilities,
	errorCatalog,
	gender,
	genderBatch,
	phoneValidate,
	usage,
} from './endpoints';
import type {
	GenderApiIoEndpointInputs,
	GenderApiIoEndpointOutputs,
} from './endpoints/types';
import {
	GenderApiIoEndpointInputSchemas,
	GenderApiIoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GenderAPIioSchema } from './schema';

export type GenderApiIoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The 24-character API key. Optional: without one the API serves an
	 * IP-scoped trial and reports `ip_trial` in `meta.access.mode`.
	 */
	key?: string;
	hooks?: InternalGenderApiIoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof genderApiIoEndpointsNested>;
};

export type GenderApiIoContext = CorsairPluginContext<
	typeof GenderAPIioSchema,
	GenderApiIoPluginOptions
>;

export type GenderApiIoKeyBuilderContext =
	KeyBuilderContext<GenderApiIoPluginOptions>;

export type GenderApiIoBoundEndpoints = BindEndpoints<
	typeof genderApiIoEndpointsNested
>;

type GenderApiIoEndpoint<K extends keyof GenderApiIoEndpointOutputs> =
	CorsairEndpoint<
		GenderApiIoContext,
		GenderApiIoEndpointInputs[K],
		GenderApiIoEndpointOutputs[K]
	>;

export type GenderApiIoEndpoints = {
	gender: {
		infer: GenderApiIoEndpoint<'gender'>;
		batch: GenderApiIoEndpoint<'genderBatch'>;
	};
	phone: {
		validate: GenderApiIoEndpoint<'phoneValidate'>;
	};
	account: {
		usage: GenderApiIoEndpoint<'usage'>;
		capabilities: GenderApiIoEndpoint<'capabilities'>;
		errorCatalog: GenderApiIoEndpoint<'errorCatalog'>;
	};
};

const genderApiIoEndpointsNested = {
	gender: {
		infer: gender,
		batch: genderBatch,
	},
	phone: {
		validate: phoneValidate,
	},
	account: {
		usage,
		capabilities,
		errorCatalog,
	},
} as const;

export const genderApiIoEndpointSchemas = {
	'gender.infer': {
		input: GenderApiIoEndpointInputSchemas.gender,
		output: GenderApiIoEndpointOutputSchemas.gender,
	},
	'gender.batch': {
		input: GenderApiIoEndpointInputSchemas.genderBatch,
		output: GenderApiIoEndpointOutputSchemas.genderBatch,
	},
	'phone.validate': {
		input: GenderApiIoEndpointInputSchemas.phoneValidate,
		output: GenderApiIoEndpointOutputSchemas.phoneValidate,
	},
	'account.usage': {
		input: GenderApiIoEndpointInputSchemas.usage,
		output: GenderApiIoEndpointOutputSchemas.usage,
	},
	'account.capabilities': {
		input: GenderApiIoEndpointInputSchemas.capabilities,
		output: GenderApiIoEndpointOutputSchemas.capabilities,
	},
	'account.errorCatalog': {
		input: GenderApiIoEndpointInputSchemas.errorCatalog,
		output: GenderApiIoEndpointOutputSchemas.errorCatalog,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof genderApiIoEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const genderApiIoEndpointMeta = {
	'gender.infer': {
		riskLevel: 'read',
		description:
			'Infer gender from a name, an email address or a username, with a confidence, the source that answered (dataset or AI) and the credits it cost',
	},
	'gender.batch': {
		riskLevel: 'read',
		description:
			'Infer gender for up to 50 names, emails or usernames in one request. An item can fail on its own, and only successful items are billed',
	},
	'phone.validate': {
		riskLevel: 'read',
		description:
			'Validate and format a phone number, returning its E.164 form, country and calling code',
	},
	'account.usage': {
		riskLevel: 'read',
		description:
			'Read the shared balance, the trial reset time and whether this call used a key or the IP trial. This route is free',
	},
	'account.capabilities': {
		riskLevel: 'read',
		description:
			'Read the deployment version, the AI availability and the batch limit. This route is free',
	},
	'account.errorCatalog': {
		riskLevel: 'read',
		description:
			'Read every error code with the statuses it uses and what a caller should do about it. This route is free',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof genderApiIoEndpointsNested
>;

/**
 * GenderAPI.io authenticates with a bearer token, but a missing key is not an
 * error: the API falls back to an IP-scoped trial, which is why the key builder
 * returns an empty string instead of refusing.
 */
export const genderApiIoAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseGenderApiIoPlugin<T extends GenderApiIoPluginOptions> =
	CorsairPlugin<
		'genderapiio',
		typeof GenderAPIioSchema,
		typeof genderApiIoEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof genderApiIoAuthConfig
	>;

export type InternalGenderApiIoPlugin =
	BaseGenderApiIoPlugin<GenderApiIoPluginOptions>;

export type ExternalGenderApiIoPlugin<T extends GenderApiIoPluginOptions> =
	BaseGenderApiIoPlugin<T>;

export function genderapiio<const T extends GenderApiIoPluginOptions>(
	incomingOptions: GenderApiIoPluginOptions &
		T = {} as GenderApiIoPluginOptions & T,
): ExternalGenderApiIoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'genderapiio',
		schema: GenderAPIioSchema,
		options,
		hooks: options.hooks,
		endpoints: genderApiIoEndpointsNested,
		webhooks: {},
		authConfig: genderApiIoAuthConfig,
		endpointMeta: genderApiIoEndpointMeta,
		endpointSchemas: genderApiIoEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GenderApiIoKeyBuilderContext, source) => {
			// There are no webhooks, so only an endpoint asks for a key, and an absent
			// one is valid: the API falls back to its IP-scoped trial.
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalGenderApiIoPlugin;
}

export {
	GENDERAPIIO_ERROR_CODES,
	GenderApiIoAPIError,
	genderApiIoErrorInfo,
} from './client';

export type {
	GenderApiIoAccess,
	GenderApiIoBatchItem,
	GenderApiIoCapabilitiesResponse,
	GenderApiIoEndpointInputs,
	GenderApiIoEndpointOutputs,
	GenderApiIoErrorCatalogResponse,
	GenderApiIoGenderBatchInput,
	GenderApiIoGenderBatchResponse,
	GenderApiIoGenderInput,
	GenderApiIoGenderResponse,
	GenderApiIoPhoneInput,
	GenderApiIoPhoneResponse,
	GenderApiIoPrediction,
	GenderApiIoUsage,
	GenderApiIoUsageResponse,
} from './endpoints/types';
