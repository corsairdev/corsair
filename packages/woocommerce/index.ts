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
import { AuthMissingError } from 'corsair/core';
import {
	normalizeSiteUrl,
	resolveWoocommerceStore,
	tryGetStoredKey,
} from './client';
import {
	woocommerceEndpointMeta as generatedEndpointMeta,
	woocommerceEndpointSchemas,
	woocommerceEndpointsNested,
} from './endpoints/catalog';
import type {
	WoocommerceEndpointInputs,
	WoocommerceEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WoocommerceSchema } from './schema';
import {
	woocommerceWebhookSchemas as generatedWebhookSchemas,
	isWoocommerceDelivery,
	woocommerceWebhooksNested,
} from './webhooks';

export type WoocommercePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The REST API consumer secret (`cs_...`, WooCommerce → Settings →
	 * Advanced → REST API), or a WordPress application password.
	 */
	key?: string;
	/**
	 * The store's WordPress address (`https://shop.example.com`), with or
	 * without `/wp-json`. Overrides the account's stored `site_url`.
	 */
	siteUrl?: string;
	/**
	 * The consumer key (`ck_...`) that goes with the secret, or the WordPress
	 * username of an application password. Overrides the account's stored
	 * `consumer_key`.
	 */
	consumerKey?: string;
	/** The secret set on the WooCommerce webhook; checks incoming deliveries. */
	webhookSecret?: string;
	hooks?: InternalWoocommercePlugin['hooks'];
	webhookHooks?: InternalWoocommercePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof woocommerceEndpointsNested>;
};

// A store is self-hosted: its key pair belongs to one site, so the site
// address and the consumer key are account config beside the secret.
export const woocommerceAuthConfig = {
	api_key: {
		account: ['site_url', 'consumer_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type WoocommerceContext = CorsairPluginContext<
	typeof WoocommerceSchema,
	WoocommercePluginOptions,
	undefined,
	typeof woocommerceAuthConfig
>;

export type WoocommerceKeyBuilderContext = KeyBuilderContext<
	WoocommercePluginOptions,
	typeof woocommerceAuthConfig
>;

export type WoocommerceBoundEndpoints = BindEndpoints<
	typeof woocommerceEndpointsNested
>;

export type WoocommerceBoundWebhooks = BindWebhooks<
	typeof woocommerceWebhooksNested
>;

export type WoocommerceEndpoints = {
	[Id in keyof WoocommerceEndpointOutputs]: CorsairEndpoint<
		WoocommerceContext,
		WoocommerceEndpointInputs[Id],
		WoocommerceEndpointOutputs[Id]
	>;
};

export { woocommerceEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const woocommerceEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof woocommerceEndpointsNested
	>;

const woocommerceWebhookSchemas =
	generatedWebhookSchemas satisfies RequiredPluginWebhookSchemas<
		typeof woocommerceWebhooksNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseWoocommercePlugin<T extends WoocommercePluginOptions> =
	CorsairPlugin<
		'woocommerce',
		typeof WoocommerceSchema,
		typeof woocommerceEndpointsNested,
		typeof woocommerceWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof woocommerceAuthConfig
	>;

export type InternalWoocommercePlugin =
	BaseWoocommercePlugin<WoocommercePluginOptions>;

export type ExternalWoocommercePlugin<T extends WoocommercePluginOptions> =
	BaseWoocommercePlugin<T>;

export function woocommerce<const T extends WoocommercePluginOptions>(
	// Safe: every WoocommercePluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: WoocommercePluginOptions &
		T = {} as WoocommercePluginOptions & T,
): ExternalWoocommercePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'woocommerce',
		authConfig: woocommerceAuthConfig,
		schema: WoocommerceSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: woocommerceEndpointsNested,
		webhooks: woocommerceWebhooksNested,
		endpointMeta: woocommerceEndpointMeta,
		endpointSchemas: woocommerceEndpointSchemas,
		webhookSchemas: woocommerceWebhookSchemas,
		pluginWebhookMatcher: isWoocommerceDelivery,
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
		keyBuilder: async (ctx: WoocommerceKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				return (
					(await tryGetStoredKey(() => ctx.keys?.get_webhook_signature())) ?? ''
				);
			}
			if (source !== 'endpoint') return '';

			if (options.key) {
				await resolveWoocommerceStore({ options, keys: ctx.keys });
				return options.key;
			}
			const key = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			// No key configured: AuthMissingError makes core ask the tenant to connect.
			if (!key) throw new AuthMissingError('woocommerce', 'api_key');
			if (options.siteUrl) {
				// The stored secret belongs to the stored store. A siteUrl option
				// pointing elsewhere would hand it to another host, so that pairing
				// needs its own key.
				const stored = await tryGetStoredKey(
					() => ctx.keys?.get_site_url?.() ?? Promise.resolve(null),
				);
				if (
					!stored?.trim() ||
					normalizeSiteUrl(stored) !== normalizeSiteUrl(options.siteUrl)
				) {
					throw new AuthMissingError(
						'woocommerce',
						'api_key',
						'[woocommerce] the stored secret belongs to another store than the siteUrl option: pass key with siteUrl, or connect an account for that store',
					);
				}
			}
			// A secret without its store or consumer key has nowhere to go: this
			// throws AuthMissingError too when neither the option nor the account sets them.
			await resolveWoocommerceStore({ options, keys: ctx.keys });
			return key;
		},
	} satisfies InternalWoocommercePlugin;
}

export type { WoocommerceRequest } from './client';
export { normalizeSiteUrl } from './client';
export {
	createWoocommerceOperation,
	getWoocommerceInputSchema,
	getWoocommerceOutputSchema,
	WOOCOMMERCE_OPERATION_IDS,
} from './endpoints';
export type { WoocommerceWebhookPayloads } from './endpoints/operation-types';
export type {
	WoocommerceEndpointInputs,
	WoocommerceEndpointOutputs,
	WoocommerceJsonValue,
	WoocommerceOperationId,
} from './endpoints/types';
export {
	WoocommerceEndpointInputSchemas,
	WoocommerceEndpointOutputSchemas,
} from './endpoints/types';
export type { WoocommerceWebhookId } from './webhooks';
export {
	isWoocommerceDelivery,
	verifyWoocommerceWebhook,
	woocommerceTopicOf,
} from './webhooks';
