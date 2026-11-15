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
import { batch, predict } from './endpoints';
import type {
	GenderizeEndpointInputs,
	GenderizeEndpointOutputs,
} from './endpoints/types';
import {
	GenderizeEndpointInputSchemas,
	GenderizeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GenderizeSchema } from './schema';

export type GenderizePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The account's `apikey`. Optional: without one Genderize serves an
	 * IP-scoped allowance, which is why the key builder never refuses a call.
	 */
	key?: string;
	hooks?: InternalGenderizePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof genderizeEndpointsNested>;
};

export type GenderizeContext = CorsairPluginContext<
	typeof GenderizeSchema,
	GenderizePluginOptions
>;

export type GenderizeKeyBuilderContext =
	KeyBuilderContext<GenderizePluginOptions>;

export type GenderizeBoundEndpoints = BindEndpoints<
	typeof genderizeEndpointsNested
>;

type GenderizeEndpoint<K extends keyof GenderizeEndpointOutputs> =
	CorsairEndpoint<
		GenderizeContext,
		GenderizeEndpointInputs[K],
		GenderizeEndpointOutputs[K]
	>;

export type GenderizeEndpoints = {
	name: {
		predict: GenderizeEndpoint<'predict'>;
	};
	batch: {
		names: GenderizeEndpoint<'batch'>;
	};
};

const genderizeEndpointsNested = {
	name: {
		predict,
	},
	batch: {
		names: batch,
	},
} as const;

export const genderizeEndpointSchemas = {
	'name.predict': {
		input: GenderizeEndpointInputSchemas.predict,
		output: GenderizeEndpointOutputSchemas.predict,
	},
	'batch.names': {
		input: GenderizeEndpointInputSchemas.batch,
		output: GenderizeEndpointOutputSchemas.batch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof genderizeEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const genderizeEndpointMeta = {
	'name.predict': {
		riskLevel: 'read',
		description:
			'Predict the gender behind a first or full name, with a confidence score and the number of records behind it. Scoping by country changes the answer for names such as Kim or Andrea',
	},
	'batch.names': {
		riskLevel: 'read',
		description:
			'Predict gender for several names at once, answered in the same order. A batch counts each name against the monthly quota, and `country_id` applies to every name in it',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof genderizeEndpointsNested
>;

/**
 * Genderize takes its key as an `apikey` query parameter, so the key builder
 * returns the stored value and the client puts it in the query string. An
 * empty key is passed through rather than refused: the API then uses its IP
 * allowance. Endpoints take no key in their input, so it never reaches tool
 * input, logs or events.
 */
export const genderizeAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseGenderizePlugin<T extends GenderizePluginOptions> =
	CorsairPlugin<
		'genderize',
		typeof GenderizeSchema,
		typeof genderizeEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof genderizeAuthConfig
	>;

export type InternalGenderizePlugin =
	BaseGenderizePlugin<GenderizePluginOptions>;

export type ExternalGenderizePlugin<T extends GenderizePluginOptions> =
	BaseGenderizePlugin<T>;

export function genderize<const T extends GenderizePluginOptions>(
	incomingOptions: GenderizePluginOptions & T = {} as GenderizePluginOptions &
		T,
): ExternalGenderizePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'genderize',
		schema: GenderizeSchema,
		options,
		hooks: options.hooks,
		endpoints: genderizeEndpointsNested,
		webhooks: {},
		authConfig: genderizeAuthConfig,
		endpointMeta: genderizeEndpointMeta,
		endpointSchemas: genderizeEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GenderizeKeyBuilderContext, source) => {
			// Webhooks do not exist, so only an endpoint asks for a key, and an absent
			// one is valid: Genderize falls back to its IP-scoped allowance.
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalGenderizePlugin;
}

export type { GenderizeErrorInfo } from './client';
export { GenderizeAPIError, genderizeErrorInfo } from './client';

export type {
	GenderizeBatchInput,
	GenderizeBatchResponse,
	GenderizeEndpointInputs,
	GenderizeEndpointOutputs,
	GenderizePredictInput,
	GenderizePrediction,
	GenderizePredictResponse,
} from './endpoints/types';
