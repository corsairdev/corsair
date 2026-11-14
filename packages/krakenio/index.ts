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
import { Kraken } from './endpoints';
import type {
	KrakenEndpointInputs,
	KrakenEndpointOutputs,
} from './endpoints/types';
import {
	KrakenEndpointInputSchemas,
	KrakenEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KrakenioSchema } from './schema';

export type KrakenPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The API key. Falls back to the stored `api_key` credential. */
	key?: string;
	/** The API secret, which Kraken needs beside the key in every body. */
	apiSecret?: string;
	/** The API key, when it is set as an option rather than stored. */
	apiKey?: string;
	hooks?: InternalKrakenPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof krakenioEndpointsNested>;
};

/**
 * Kraken authenticates with a **pair**, and both go in the JSON body. The secret
 * is an account-level field beside the key, because `get_integration_credentials`
 * is only installed for `oauth_2`; reading the pair through a structural context
 * keeps that explicit.
 */
export const krakenioAuthConfig = {
	api_key: {
		account: ['api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type KrakenContext = CorsairPluginContext<
	typeof KrakenioSchema,
	KrakenPluginOptions,
	undefined,
	typeof krakenioAuthConfig
>;

export type KrakenKeyBuilderContext = KeyBuilderContext<
	KrakenPluginOptions,
	typeof krakenioAuthConfig
>;

export type KrakenBoundEndpoints = BindEndpoints<
	typeof krakenioEndpointsNested
>;

type KrakenEndpoint<K extends keyof KrakenEndpointOutputs> = CorsairEndpoint<
	KrakenContext,
	KrakenEndpointInputs[K],
	KrakenEndpointOutputs[K]
>;

export type KrakenEndpoints = {
	urlOptimize: KrakenEndpoint<'urlOptimize'>;
	uploadOptimize: KrakenEndpoint<'uploadOptimize'>;
	accountStatus: KrakenEndpoint<'accountStatus'>;
};

const krakenioEndpointsNested = {
	url: {
		optimize: Kraken.url,
	},
	upload: {
		optimize: Kraken.upload,
	},
	account: {
		status: Kraken.account,
	},
} as const;

export const krakenioEndpointSchemas = {
	'url.optimize': {
		input: KrakenEndpointInputSchemas.urlOptimize,
		output: KrakenEndpointOutputSchemas.urlOptimize,
	},
	'upload.optimize': {
		input: KrakenEndpointInputSchemas.uploadOptimize,
		output: KrakenEndpointOutputSchemas.uploadOptimize,
	},
	'account.status': {
		input: KrakenEndpointInputSchemas.accountStatus,
		output: KrakenEndpointOutputSchemas.accountStatus,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof krakenioEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const krakenEndpointMeta = {
	// Each optimization spends quota, so under R8 it is destructive.
	'url.optimize': {
		riskLevel: 'destructive',
		description:
			'Fetch an image or PDF from a URL and optimize it, optionally resizing, converting, keeping metadata or setting the quality. Spends quota',
	},
	'upload.optimize': {
		riskLevel: 'destructive',
		description:
			'Optimize a file passed as base64, which the plugin uploads to Kraken as multipart, with the same resize and conversion options. Spends quota',
	},
	'account.status': {
		riskLevel: 'read',
		description:
			'The plan, whether the account is active, and the quota total, used and remaining, all in bytes',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof krakenioEndpointsNested>;

export type BaseKrakenPlugin<T extends KrakenPluginOptions> = CorsairPlugin<
	'krakenio',
	typeof KrakenioSchema,
	typeof krakenioEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof krakenioAuthConfig
>;

export type InternalKrakenPlugin = BaseKrakenPlugin<KrakenPluginOptions>;

export type ExternalKrakenPlugin<T extends KrakenPluginOptions> =
	BaseKrakenPlugin<T>;

export function krakenio<const T extends KrakenPluginOptions>(
	incomingOptions: KrakenPluginOptions & T = {} as KrakenPluginOptions & T,
): ExternalKrakenPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'krakenio',
		schema: KrakenioSchema,
		options,
		hooks: options.hooks,
		endpoints: krakenioEndpointsNested,
		webhooks: {},
		authConfig: krakenioAuthConfig,
		endpointMeta: krakenEndpointMeta,
		endpointSchemas: krakenioEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KrakenKeyBuilderContext, source) => {
			// An inline key (either option name) wins over storage, the same rule
			// resolveCredentials applies to the secret.
			const inlineKey = options.apiKey ?? options.key;
			if (source === 'endpoint' && inlineKey) {
				return inlineKey;
			}

			// ctx.keys exists only with a database and a kek; without it there is
			// nothing stored, and the missing-credentials error below applies.
			if (source === 'endpoint' && ctx.authType === 'api_key' && ctx.keys) {
				const [apiKey, storedSecret] = await Promise.all([
					ctx.keys.get_api_key(),
					options.apiSecret ? undefined : ctx.keys.get_api_secret(),
				]);
				// Kraken refuses a key without its secret, so a key with no secret
				// (inline or stored) is treated as no credentials, which lets
				// Corsair offer a connect link.
				if (apiKey && (options.apiSecret ?? storedSecret)) return apiKey;
			}

			throw new AuthMissingError('krakenio', ctx.authType ?? 'api_key');
		},
	} satisfies InternalKrakenPlugin;
}

export { isKrakenAuthFailure, KrakenAPIError } from './client';

export type {
	AccountStatusInput,
	AccountStatusResponse,
	KrakenEndpointInputs,
	KrakenEndpointOutputs,
	KrakenResult,
	OptimizeResponse,
	UploadOptimizeInput,
	UrlOptimizeInput,
} from './endpoints/types';
