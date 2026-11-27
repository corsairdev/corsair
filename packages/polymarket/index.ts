import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { PolymarketCredentials } from './client';
import { serializePolymarketCredentials, tryGetStoredKey } from './client';
import {
	polymarketEndpointMeta as generatedEndpointMeta,
	polymarketEndpointSchemas,
	polymarketEndpointsNested,
} from './endpoints/catalog';
import type {
	PolymarketEndpointInputs,
	PolymarketEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PolymarketSchema } from './schema';

/** A CLOB API key set (`clob.apiKeys.create` or `derive` returns one). */
export type PolymarketClobCredentials = {
	/** POLY_API_KEY, a UUID. */
	apiKey: string;
	/** The base64url secret that signs each request (HMAC-SHA256). */
	secret: string;
	passphrase: string;
	/** The wallet address the key belongs to (POLY_ADDRESS). */
	address: string;
};

export type PolymarketPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * CLOB L2 credentials for `clob.*` and `combos.*` operations that act on
	 * your account (orders, balances, rewards, notifications). Overrides the
	 * account's stored key set. Market data needs no credentials.
	 */
	clob?: PolymarketClobCredentials;
	/** Perps proxy credentials for `perps.account.*` reads (`perps.proxy.create` returns them). */
	perps?: { proxy: string; secret: string };
	/** RFQ partner key for `rfq.trades.*` and `rfq.priceBand` (institutional partners). */
	rfq?: { keyId: string; secret: string };
	/**
	 * Relayer credentials for `relayer.transactions.submit`, `.list` and
	 * `relayer.apiKeys.list`: a relayer API key, or builder API credentials
	 * (signed per request).
	 */
	relayer?: {
		apiKey?: string;
		address?: string;
		builder?: { apiKey: string; secret: string; passphrase: string };
	};
	hooks?: InternalPolymarketPlugin['hooks'];
	webhookHooks?: InternalPolymarketPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof polymarketEndpointsNested>;
};

// The stored key is a CLOB API key; its secret, passphrase and wallet
// address are account fields. All of it is optional: public market data
// (Gamma, Data, CLOB prices and books, Perps info, Bridge) needs no key.
export const polymarketAuthConfig = {
	api_key: {
		account: ['secret', 'passphrase', 'address'] as const,
	},
} as const satisfies PluginAuthConfig;

export type PolymarketContext = CorsairPluginContext<
	typeof PolymarketSchema,
	PolymarketPluginOptions,
	undefined,
	typeof polymarketAuthConfig
>;

export type PolymarketKeyBuilderContext = KeyBuilderContext<
	PolymarketPluginOptions,
	typeof polymarketAuthConfig
>;

export type PolymarketBoundEndpoints = BindEndpoints<
	typeof polymarketEndpointsNested
>;

// Polymarket sends no webhooks (it streams over WebSockets instead).
const polymarketWebhooksNested = {} as const;

export type PolymarketBoundWebhooks = BindWebhooks<
	typeof polymarketWebhooksNested
>;

export type PolymarketEndpoints = {
	[Id in keyof PolymarketEndpointOutputs]: CorsairEndpoint<
		PolymarketContext,
		PolymarketEndpointInputs[Id],
		PolymarketEndpointOutputs[Id]
	>;
};

export { polymarketEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const polymarketEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof polymarketEndpointsNested
	>;

const polymarketWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof polymarketWebhooksNested
	>;

const defaultAuthType = 'api_key' as const;

export type BasePolymarketPlugin<T extends PolymarketPluginOptions> =
	CorsairPlugin<
		'polymarket',
		typeof PolymarketSchema,
		typeof polymarketEndpointsNested,
		typeof polymarketWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof polymarketAuthConfig
	>;

export type InternalPolymarketPlugin =
	BasePolymarketPlugin<PolymarketPluginOptions>;

export type ExternalPolymarketPlugin<T extends PolymarketPluginOptions> =
	BasePolymarketPlugin<T>;

export function polymarket<const T extends PolymarketPluginOptions>(
	// Safe: every PolymarketPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: PolymarketPluginOptions & T = {} as PolymarketPluginOptions &
		T,
): ExternalPolymarketPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'polymarket',
		authConfig: polymarketAuthConfig,
		schema: PolymarketSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: polymarketEndpointsNested,
		webhooks: polymarketWebhooksNested,
		endpointMeta: polymarketEndpointMeta,
		endpointSchemas: polymarketEndpointSchemas,
		webhookSchemas: polymarketWebhookSchemas,
		pluginWebhookMatcher: (_request) => false,
		errorHandlers: (() => {
			// Core uses the first handler whose matcher accepts the error, and
			// DEFAULT matches everything, so DEFAULT always goes last; otherwise
			// it would shadow a handler a caller adds through options.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: PolymarketKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			// Every credential set a call may need travels in the call's key;
			// the client reads them from there only.
			const credentials: PolymarketCredentials = {
				...(options.perps ? { perps: options.perps } : {}),
				...(options.rfq ? { rfq: options.rfq } : {}),
				...(options.relayer ? { relayer: options.relayer } : {}),
			};
			if (options.clob) {
				credentials.clob = options.clob;
			} else {
				const apiKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (apiKey) {
					const [secret, passphrase, address] = await Promise.all([
						tryGetStoredKey(() => ctx.keys.get_secret()),
						tryGetStoredKey(() => ctx.keys.get_passphrase()),
						tryGetStoredKey(() => ctx.keys.get_address()),
					]);
					credentials.clob = {
						apiKey,
						secret: secret ?? '',
						passphrase: passphrase ?? '',
						address: address ?? '',
					};
				}
			}
			// None set: public operations still run; account operations raise
			// AuthMissingError when they're called (see client.ts).
			return Object.keys(credentials).length > 0
				? serializePolymarketCredentials(credentials)
				: '';
		},
	} satisfies InternalPolymarketPlugin;
}

export type { PolymarketCredentials, PolymarketRequest } from './client';
export { POLYMARKET_HOSTS, polymarketHmacSignature } from './client';
export {
	createPolymarketOperation,
	getPolymarketInputSchema,
	getPolymarketOutputSchema,
	POLYMARKET_OPERATION_IDS,
} from './endpoints';
export type {
	PolymarketEndpointInputs,
	PolymarketEndpointOutputs,
	PolymarketJsonValue,
	PolymarketOperationId,
} from './endpoints/types';
export {
	PolymarketEndpointInputSchemas,
	PolymarketEndpointOutputSchemas,
} from './endpoints/types';
