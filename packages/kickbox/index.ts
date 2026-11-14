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
import { Verify } from './endpoints';
import type {
	KickboxEndpointInputs,
	KickboxEndpointOutputs,
} from './endpoints/types';
import {
	KickboxEndpointInputSchemas,
	KickboxEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KickboxSchema } from './schema';

export type KickboxPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * `eu` sends verification to `api.eu.kickbox.com`, which is where an EU-only
	 * account is served. Defaults to the standard host.
	 */
	region?: 'us' | 'eu';
	hooks?: InternalKickboxPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kickboxEndpointsNested>;
};

export type KickboxContext = CorsairPluginContext<
	typeof KickboxSchema,
	KickboxPluginOptions
>;

export type KickboxKeyBuilderContext = KeyBuilderContext<KickboxPluginOptions>;

export type KickboxBoundEndpoints = BindEndpoints<
	typeof kickboxEndpointsNested
>;

type KickboxEndpoint<K extends keyof KickboxEndpointOutputs> = CorsairEndpoint<
	KickboxContext,
	KickboxEndpointInputs[K],
	KickboxEndpointOutputs[K]
>;

export type KickboxEndpoints = {
	verify: KickboxEndpoint<'verify'>;
	disposable: KickboxEndpoint<'disposable'>;
};

const kickboxEndpointsNested = {
	verify: {
		verify: Verify.verify,
		disposable: Verify.disposable,
	},
} as const;

export const kickboxEndpointSchemas = {
	'verify.verify': {
		input: KickboxEndpointInputSchemas.verify,
		output: KickboxEndpointOutputSchemas.verify,
	},
	'verify.disposable': {
		input: KickboxEndpointInputSchemas.disposable,
		output: KickboxEndpointOutputSchemas.disposable,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof kickboxEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const kickboxEndpointMeta = {
	'verify.verify': {
		// A lookup that only returns data. It uses a verification credit, but
		// metered reads stay `read` (as in the Ahrefs plugin).
		riskLevel: 'read',
		description:
			'Verify one address and get its verdict (deliverable, undeliverable, risky, unknown), the reason, role and free flags, a typo suggestion and a Sendex quality score. Spends one verification credit',
	},
	'verify.disposable': {
		riskLevel: 'read',
		description:
			'Check whether an address or domain is a known disposable one. Free, and answered by Kickbox’s open service',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof kickboxEndpointsNested>;

export type BaseKickboxPlugin<T extends KickboxPluginOptions> = CorsairPlugin<
	'kickbox',
	typeof KickboxSchema,
	typeof kickboxEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalKickboxPlugin = BaseKickboxPlugin<KickboxPluginOptions>;

export type ExternalKickboxPlugin<T extends KickboxPluginOptions> =
	BaseKickboxPlugin<T>;

export function kickbox<const T extends KickboxPluginOptions>(
	incomingOptions: KickboxPluginOptions & T = {} as KickboxPluginOptions & T,
): ExternalKickboxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kickbox',
		schema: KickboxSchema,
		options,
		hooks: options.hooks,
		endpoints: kickboxEndpointsNested,
		webhooks: {},
		endpointMeta: kickboxEndpointMeta,
		endpointSchemas: kickboxEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KickboxKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('kickbox', ctx.authType ?? 'api_key');
		},
	} satisfies InternalKickboxPlugin;
}

export {
	isKickboxAuthError,
	isKickboxQuotaError,
	isPaidKickboxRequest,
	KickboxAPIError,
	kickboxErrorCode,
	kickboxErrorStatus,
} from './client';

export type {
	DisposableInput,
	DisposableResponse,
	KickboxEndpointInputs,
	KickboxEndpointOutputs,
	VerifyInput,
	VerifyResponse,
} from './endpoints/types';
