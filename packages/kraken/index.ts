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
import { Account, Image } from './endpoints';
import type {
	KrakenEndpointInputs,
	KrakenEndpointOutputs,
} from './endpoints/types';
import {
	KrakenEndpointInputSchemas,
	KrakenEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { KrakenSchema } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type KrakenPluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/** Kraken.io account API key, from https://kraken.io/account/api-credentials. */
	key?: string;
	/** Kraken.io account API secret, from https://kraken.io/account/api-credentials. */
	apiSecret?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalKrakenPlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Kraken plugin. Controls what the AI
	 * agent is allowed to do.
	 */
	permissions?: PluginPermissionsConfig<typeof krakenEndpointsNested>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Auth Configuration
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

/**
 * Kraken.io authenticates with a key *pair* (api_key + api_secret), unlike
 * most api_key plugins that only need one secret. `api_secret` is declared
 * as an extra account field so `ctx.keys.get_api_secret()` is available in
 * keyBuilder below.
 */
export const krakenAuthConfig = {
	api_key: {
		account: ['api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type KrakenKeyBuilderContext = KeyBuilderContext<
	KrakenPluginOptions,
	typeof krakenAuthConfig
>;

export type KrakenContext = CorsairPluginContext<
	typeof KrakenSchema,
	KrakenPluginOptions,
	undefined,
	typeof krakenAuthConfig
>;

export type KrakenBoundEndpoints = BindEndpoints<typeof krakenEndpointsNested>;

type KrakenEndpoint<K extends keyof KrakenEndpointOutputs> = CorsairEndpoint<
	KrakenContext,
	KrakenEndpointInputs[K],
	KrakenEndpointOutputs[K]
>;

export type KrakenEndpoints = {
	accountCheckStatus: KrakenEndpoint<'accountCheckStatus'>;
	imageOptimizeUrl: KrakenEndpoint<'imageOptimizeUrl'>;
	imagePreserveMetadata: KrakenEndpoint<'imagePreserveMetadata'>;
	imageSandboxUpload: KrakenEndpoint<'imageSandboxUpload'>;
};

const krakenEndpointsNested = {
	account: {
		checkStatus: Account.checkStatus,
	},
	image: {
		optimizeUrl: Image.optimizeUrl,
		preserveMetadata: Image.preserveMetadata,
		sandboxUpload: Image.sandboxUpload,
	},
} as const;

// No webhooks — Kraken.io's API is a pull-based optimize/status API with no
// event delivery (an optional per-request `callback_url` is not a
// subscribable webhook).
const krakenWebhooksNested = {} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Schemas (for get_schema / agent introspection)
// ─────────────────────────────────────────────────────────────────────────────

export const krakenEndpointSchemas = {
	'account.checkStatus': {
		input: KrakenEndpointInputSchemas.accountCheckStatus,
		output: KrakenEndpointOutputSchemas.accountCheckStatus,
	},
	'image.optimizeUrl': {
		input: KrakenEndpointInputSchemas.imageOptimizeUrl,
		output: KrakenEndpointOutputSchemas.imageOptimizeUrl,
	},
	'image.preserveMetadata': {
		input: KrakenEndpointInputSchemas.imagePreserveMetadata,
		output: KrakenEndpointOutputSchemas.imagePreserveMetadata,
	},
	'image.sandboxUpload': {
		input: KrakenEndpointInputSchemas.imageSandboxUpload,
		output: KrakenEndpointOutputSchemas.imageSandboxUpload,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof krakenEndpointsNested
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Meta (risk levels for permission system)
// ─────────────────────────────────────────────────────────────────────────────

const krakenEndpointMeta = {
	'account.checkStatus': {
		riskLevel: 'read',
		description:
			'Retrieve current Kraken.io account status and quota usage in bytes',
	},
	'image.optimizeUrl': {
		riskLevel: 'write',
		description:
			'Optimize/compress an image from a public URL, consuming account quota',
	},
	'image.preserveMetadata': {
		riskLevel: 'write',
		description:
			'Optimize an image from a public URL while preserving selected EXIF/ICC/GPS metadata',
	},
	'image.sandboxUpload': {
		riskLevel: 'write',
		description:
			'Optimize an image from a public URL in sandbox (dev) mode without consuming quota; returns randomized results',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof krakenEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseKrakenPlugin<T extends KrakenPluginOptions> = CorsairPlugin<
	'kraken',
	typeof KrakenSchema,
	typeof krakenEndpointsNested,
	typeof krakenWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof krakenAuthConfig
>;

export type InternalKrakenPlugin = BaseKrakenPlugin<KrakenPluginOptions>;

export type ExternalKrakenPlugin<T extends KrakenPluginOptions> =
	BaseKrakenPlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function kraken<const T extends KrakenPluginOptions>(
	incomingOptions: KrakenPluginOptions & T = {} as KrakenPluginOptions & T,
): ExternalKrakenPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kraken',
		authConfig: krakenAuthConfig,
		schema: KrakenSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: krakenEndpointsNested,
		webhooks: krakenWebhooksNested,
		endpointMeta: krakenEndpointMeta,
		endpointSchemas: krakenEndpointSchemas,
		// No webhooks — Kraken.io never delivers events to us.
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: KrakenKeyBuilderContext, source) => {
			if (source === 'endpoint') {
				const apiKey = options.key ?? (await ctx.keys.get_api_key());
				const apiSecret =
					options.apiSecret ?? (await ctx.keys.get_api_secret());

				if (!apiKey || !apiSecret) {
					throw new AuthMissingError('kraken', 'api_key');
				}

				return `${apiKey}:${apiSecret}`;
			}

			throw new AuthMissingError('kraken', ctx.authType);
		},
	} satisfies InternalKrakenPlugin;
}

export { KrakenAPIError } from './client';
export type {
	KrakenEndpointInputs,
	KrakenEndpointOutputs,
} from './endpoints/types';
export { KrakenMetadataFields } from './endpoints/types';
