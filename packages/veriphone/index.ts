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
import { tryGetStoredKey } from './client';
import { Coverage, Credits, Verify } from './endpoints';
import type {
	VeriphoneEndpointInputs,
	VeriphoneEndpointOutputs,
} from './endpoints/types';
import {
	VeriphoneEndpointInputSchemas,
	VeriphoneEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { VeriphoneSchema } from './schema';

export type VeriphonePluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/**
	 * Veriphone API key (from the dashboard). Sent as
	 * `Authorization: Bearer <key>` on every request.
	 */
	key?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalVeriphonePlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Veriphone plugin. The read-only
	 * endpoints (credits, coverage) default to 'open'; verify defaults to
	 * 'allow' because `record: true` writes provider-side history.
	 */
	permissions?: PluginPermissionsConfig<typeof veriphoneEndpointsNested>;
};

export type VeriphoneContext = CorsairPluginContext<
	typeof VeriphoneSchema,
	VeriphonePluginOptions,
	undefined,
	typeof veriphoneAuthConfig
>;

export type VeriphoneKeyBuilderContext = KeyBuilderContext<
	VeriphonePluginOptions,
	typeof veriphoneAuthConfig
>;

export type VeriphoneBoundEndpoints = BindEndpoints<
	typeof veriphoneEndpointsNested
>;

type VeriphoneEndpoint<K extends keyof VeriphoneEndpointOutputs> =
	CorsairEndpoint<
		VeriphoneContext,
		VeriphoneEndpointInputs[K],
		VeriphoneEndpointOutputs[K]
	>;

export type VeriphoneEndpoints = {
	verify: VeriphoneEndpoint<'verify'>;
	credits: VeriphoneEndpoint<'credits'>;
	coverage: VeriphoneEndpoint<'coverage'>;
};

const veriphoneEndpointsNested = {
	verify: Verify.verify,
	credits: Credits.get,
	coverage: Coverage.get,
} as const;

// No webhooks — Veriphone is a pull-based validation API with no event
// delivery (https://veriphone.io/docs/v3 lists only REST endpoints).
const veriphoneWebhooksNested = {} as const;

export const veriphoneEndpointSchemas = {
	verify: {
		input: VeriphoneEndpointInputSchemas.verify,
		output: VeriphoneEndpointOutputSchemas.verify,
	},
	credits: {
		input: VeriphoneEndpointInputSchemas.credits,
		output: VeriphoneEndpointOutputSchemas.credits,
	},
	coverage: {
		input: VeriphoneEndpointInputSchemas.coverage,
		output: VeriphoneEndpointOutputSchemas.coverage,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof veriphoneEndpointsNested
>;

const veriphoneEndpointMeta = {
	verify: {
		// write: `record: true` saves the result to the provider-side
		// verification history (https://veriphone.io/docs/v3#verify).
		riskLevel: 'write',
		description:
			'Verify a phone number and retrieve carrier and country information',
	},
	credits: {
		riskLevel: 'read',
		description: 'Get the account credit balance and usage by lookup mode',
	},
	coverage: {
		riskLevel: 'read',
		description:
			'List countries where Current (mode=current) lookups are available',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof veriphoneEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const veriphoneAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseVeriphonePlugin<T extends VeriphonePluginOptions> =
	CorsairPlugin<
		'veriphone',
		typeof VeriphoneSchema,
		typeof veriphoneEndpointsNested,
		typeof veriphoneWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof veriphoneAuthConfig
	>;

export type InternalVeriphonePlugin =
	BaseVeriphonePlugin<VeriphonePluginOptions>;

export type ExternalVeriphonePlugin<T extends VeriphonePluginOptions> =
	BaseVeriphonePlugin<T>;

export function veriphone<const T extends VeriphonePluginOptions>(
	incomingOptions: VeriphonePluginOptions & T = {} as VeriphonePluginOptions &
		T,
): ExternalVeriphonePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'veriphone',
		authConfig: veriphoneAuthConfig,
		schema: VeriphoneSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: veriphoneEndpointsNested,
		webhooks: veriphoneWebhooksNested,
		endpointMeta: veriphoneEndpointMeta,
		endpointSchemas: veriphoneEndpointSchemas,
		// No webhooks — Veriphone is a pull-based API
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: VeriphoneKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!res) {
					throw new AuthMissingError('veriphone', 'api_key');
				}
				return res;
			}

			return '';
		},
	} satisfies InternalVeriphonePlugin;
}

export type {
	CoverageInput,
	CoverageResponse,
	CreditsInput,
	CreditsResponse,
	VerifyInput,
	VerifyResponse,
	VeriphoneEndpointInputs,
	VeriphoneEndpointOutputs,
} from './endpoints/types';

export {
	CoverageCountrySchema,
	CoverageInputSchema,
	CoverageResponseSchema,
	CreditsInputSchema,
	CreditsResponseSchema,
	VerifyInputSchema,
	VerifyResponseSchema,
} from './endpoints/types';
