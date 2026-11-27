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
import { tryGetStoredKey } from './client';
import {
	maritimeEndpointMeta as generatedEndpointMeta,
	maritimeEndpointSchemas,
	maritimeEndpointsNested,
} from './endpoints/catalog';
import type {
	MaritimeEndpointInputs,
	MaritimeEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MaritimeSchema } from './schema';
import {
	isMaritimeDelivery,
	maritimeWebhooksNested,
	maritimeWebhookSchemas as webhookSchemas,
} from './webhooks';

export type MaritimePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * A Maritime API key (`mk_...`) from `maritime keys create` or the
	 * dashboard's Settings → API keys. Its scopes (provision, deploy, secrets,
	 * manage, sandboxes) decide which operations work.
	 */
	key?: string;
	/**
	 * The signing secret of a webhook subscription (webhooks.create) or a
	 * virtual machine endpoint (sandboxWebhooks.create); checks incoming
	 * deliveries. Maritime shows it once, when it is created.
	 */
	webhookSecret?: string;
	hooks?: InternalMaritimePlugin['hooks'];
	webhookHooks?: InternalMaritimePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof maritimeEndpointsNested>;
};

/** The key travels in the Authorization header; nothing else is account config. */
export const maritimeAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type MaritimeContext = CorsairPluginContext<
	typeof MaritimeSchema,
	MaritimePluginOptions,
	undefined,
	typeof maritimeAuthConfig
>;

export type MaritimeKeyBuilderContext = KeyBuilderContext<
	MaritimePluginOptions,
	typeof maritimeAuthConfig
>;

export type MaritimeBoundEndpoints = BindEndpoints<
	typeof maritimeEndpointsNested
>;

export type MaritimeBoundWebhooks = BindWebhooks<typeof maritimeWebhooksNested>;

export type MaritimeEndpoints = {
	[Id in keyof MaritimeEndpointOutputs]: CorsairEndpoint<
		MaritimeContext,
		MaritimeEndpointInputs[Id],
		MaritimeEndpointOutputs[Id]
	>;
};

export { maritimeEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const maritimeEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof maritimeEndpointsNested
	>;

const maritimeWebhookSchemas =
	webhookSchemas satisfies RequiredPluginWebhookSchemas<
		typeof maritimeWebhooksNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseMaritimePlugin<T extends MaritimePluginOptions> = CorsairPlugin<
	'maritime',
	typeof MaritimeSchema,
	typeof maritimeEndpointsNested,
	typeof maritimeWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof maritimeAuthConfig
>;

export type InternalMaritimePlugin = BaseMaritimePlugin<MaritimePluginOptions>;

export type ExternalMaritimePlugin<T extends MaritimePluginOptions> =
	BaseMaritimePlugin<T>;

export function maritime<const T extends MaritimePluginOptions>(
	// Safe: every MaritimePluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: MaritimePluginOptions & T = {} as MaritimePluginOptions & T,
): ExternalMaritimePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'maritime',
		schema: MaritimeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: maritimeEndpointsNested,
		webhooks: maritimeWebhooksNested,
		authConfig: maritimeAuthConfig,
		endpointMeta: maritimeEndpointMeta,
		endpointSchemas: maritimeEndpointSchemas,
		webhookSchemas: maritimeWebhookSchemas,
		pluginWebhookMatcher: isMaritimeDelivery,
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
		keyBuilder: async (ctx: MaritimeKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				return (
					(await tryGetStoredKey(() => ctx.keys?.get_webhook_signature())) ?? ''
				);
			}
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('maritime', 'api_key');
			return storedKey;
		},
	} satisfies InternalMaritimePlugin;
}

export {
	createMaritimeOperation,
	getMaritimeInputSchema,
	getMaritimeOutputSchema,
	MARITIME_OPERATION_IDS,
} from './endpoints';
export type {
	MaritimeEndpointInputs,
	MaritimeEndpointOutputs,
	MaritimeJsonValue,
	MaritimeOperationId,
} from './endpoints/types';
export {
	MaritimeEndpointInputSchemas,
	MaritimeEndpointOutputSchemas,
} from './endpoints/types';
export type {
	MaritimeAccountEvent,
	MaritimeEventType,
	MaritimeSandboxEvent,
} from './webhooks';
export {
	isMaritimeDelivery,
	maritimeEventTypeOf,
	verifyMaritimeWebhook,
} from './webhooks';
