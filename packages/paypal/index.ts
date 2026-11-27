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
import type { PaypalEnvironment } from './client';
import { resolvePaypalApp, tryGetStoredKey } from './client';
import {
	paypalEndpointMeta as generatedEndpointMeta,
	paypalEndpointSchemas,
	paypalEndpointsNested,
} from './endpoints/catalog';
import type {
	PaypalEndpointInputs,
	PaypalEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PaypalSchema } from './schema';
import {
	paypalWebhookSchemas as generatedWebhookSchemas,
	isPaypalDelivery,
	paypalWebhooksNested,
} from './webhooks';

export type PaypalPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The app's client secret (developer.paypal.com → Apps & Credentials, the
	 * sandbox or live tab).
	 */
	key?: string;
	/** The app's client id. Overrides the account's stored `client_id`. */
	clientId?: string;
	/**
	 * `live` or `sandbox`. Overrides the account's stored `environment`; with
	 * neither, live is tried first and sandbox when live doesn't know the app.
	 */
	environment?: PaypalEnvironment;
	/** The webhook's id (WH-... from webhooks.create); checks incoming deliveries. */
	webhookId?: string;
	hooks?: InternalPaypalPlugin['hooks'];
	webhookHooks?: InternalPaypalPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof paypalEndpointsNested>;
};

// A PayPal app is a client id and secret; the secret is the key, the client id
// (and, optionally, whether the app is a sandbox one) is account config.
export const paypalAuthConfig = {
	api_key: {
		account: ['client_id', 'environment'] as const,
	},
} as const satisfies PluginAuthConfig;

export type PaypalContext = CorsairPluginContext<
	typeof PaypalSchema,
	PaypalPluginOptions,
	undefined,
	typeof paypalAuthConfig
>;

export type PaypalKeyBuilderContext = KeyBuilderContext<
	PaypalPluginOptions,
	typeof paypalAuthConfig
>;

export type PaypalBoundEndpoints = BindEndpoints<typeof paypalEndpointsNested>;

export type PaypalBoundWebhooks = BindWebhooks<typeof paypalWebhooksNested>;

export type PaypalEndpoints = {
	[Id in keyof PaypalEndpointOutputs]: CorsairEndpoint<
		PaypalContext,
		PaypalEndpointInputs[Id],
		PaypalEndpointOutputs[Id]
	>;
};

export { paypalEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const paypalEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof paypalEndpointsNested
	>;

const paypalWebhookSchemas =
	generatedWebhookSchemas satisfies RequiredPluginWebhookSchemas<
		typeof paypalWebhooksNested
	>;

const defaultAuthType = 'api_key' as const;

export type BasePaypalPlugin<T extends PaypalPluginOptions> = CorsairPlugin<
	'paypal',
	typeof PaypalSchema,
	typeof paypalEndpointsNested,
	typeof paypalWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof paypalAuthConfig
>;

export type InternalPaypalPlugin = BasePaypalPlugin<PaypalPluginOptions>;

export type ExternalPaypalPlugin<T extends PaypalPluginOptions> =
	BasePaypalPlugin<T>;

export function paypal<const T extends PaypalPluginOptions>(
	// Safe: every PaypalPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: PaypalPluginOptions & T = {} as PaypalPluginOptions & T,
): ExternalPaypalPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'paypal',
		authConfig: paypalAuthConfig,
		schema: PaypalSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: paypalEndpointsNested,
		webhooks: paypalWebhooksNested,
		endpointMeta: paypalEndpointMeta,
		endpointSchemas: paypalEndpointSchemas,
		webhookSchemas: paypalWebhookSchemas,
		pluginWebhookMatcher: isPaypalDelivery,
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
		keyBuilder: async (ctx: PaypalKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookId) return options.webhookId;
				return (
					(await tryGetStoredKey(() => ctx.keys?.get_webhook_signature())) ?? ''
				);
			}
			if (source !== 'endpoint') return '';
			const key =
				options.key ?? (await tryGetStoredKey(() => ctx.keys?.get_api_key()));
			// No secret configured: AuthMissingError makes core ask the tenant to connect.
			if (!key) throw new AuthMissingError('paypal', 'api_key');
			// A secret without its client id can't get a token: this throws
			// AuthMissingError too when neither the option nor the account sets it.
			await resolvePaypalApp({ options, keys: ctx.keys });
			return key;
		},
	} satisfies InternalPaypalPlugin;
}

export type { PaypalEnvironment, PaypalRequest } from './client';
export { clearPaypalTokens, PAYPAL_HOSTS } from './client';
export {
	createPaypalOperation,
	getPaypalInputSchema,
	getPaypalOutputSchema,
	PAYPAL_OPERATION_IDS,
} from './endpoints';
export type { PaypalWebhookPayloads } from './endpoints/operation-types';
export type {
	PaypalEndpointInputs,
	PaypalEndpointOutputs,
	PaypalJsonValue,
	PaypalOperationId,
} from './endpoints/types';
export {
	PaypalEndpointInputSchemas,
	PaypalEndpointOutputSchemas,
} from './endpoints/types';
export type { PaypalWebhookId } from './webhooks';
export {
	isPaypalDelivery,
	paypalEventTypeOf,
	verifyPaypalWebhook,
} from './webhooks';
