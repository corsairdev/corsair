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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';
import {
	boatEndpointSchemas,
	boatEndpointsNested,
	boatEndpointMeta as generatedEndpointMeta,
} from './endpoints/catalog';
import type {
	BoatEndpointInputs,
	BoatEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BoatSchema } from './schema';
import {
	boatWebhookSchemas,
	boatWebhooksNested,
	matchBoatWebhook,
} from './webhooks';

export type BoatPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Boat API key (`boat_...`, from `boat api-key create` or the dashboard). An organization key works on the organization's sandboxes, environments and snapshots; account settings (webhooks, API keys, credential profiles, CI, telemetry, AI proxy, secrets) need a personal account key. */
	key?: string;
	/**
	 * Another API base, such as a proxy in front of Boat. Leave it out for https://boat.dev/api/v1.
	 */
	baseUrl?: string;
	/**
	 * The signing secret of the webhook endpoint. Left out, the plugin reads
	 * the account's stored webhook_signature.
	 */
	webhookSecret?: string;
	hooks?: InternalBoatPlugin['hooks'];
	webhookHooks?: InternalBoatPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof boatEndpointsNested>;
};

/** One API key per connected account, sent in the `Authorization` header. */
export const boatAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BoatContext = CorsairPluginContext<
	typeof BoatSchema,
	BoatPluginOptions,
	undefined,
	typeof boatAuthConfig
>;

export type BoatKeyBuilderContext = KeyBuilderContext<
	BoatPluginOptions,
	typeof boatAuthConfig
>;

export type BoatBoundEndpoints = BindEndpoints<typeof boatEndpointsNested>;

export type BoatEndpoints = {
	[Id in keyof BoatEndpointOutputs]: CorsairEndpoint<
		BoatContext,
		BoatEndpointInputs[Id],
		BoatEndpointOutputs[Id]
	>;
};

export { boatEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const boatEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof boatEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseBoatPlugin<T extends BoatPluginOptions> = CorsairPlugin<
	'boat',
	typeof BoatSchema,
	typeof boatEndpointsNested,
	typeof boatWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof boatAuthConfig
>;

export type InternalBoatPlugin = BaseBoatPlugin<BoatPluginOptions>;

export type ExternalBoatPlugin<T extends BoatPluginOptions> = BaseBoatPlugin<T>;

export function boat<const T extends BoatPluginOptions>(
	// Safe: every BoatPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: BoatPluginOptions & T = {} as BoatPluginOptions & T,
): ExternalBoatPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'boat',
		schema: BoatSchema,
		options: options,
		hooks: options.hooks,
		endpoints: boatEndpointsNested,
		webhooks: boatWebhooksNested,
		webhookSchemas: boatWebhookSchemas,
		webhookHooks: options.webhookHooks,
		authConfig: boatAuthConfig,
		endpointMeta: boatEndpointMeta,
		endpointSchemas: boatEndpointSchemas,
		pluginWebhookMatcher: matchBoatWebhook,
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
		keyBuilder: async (ctx: BoatKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const secret = await tryGetStoredKey(() =>
					ctx.keys?.get_webhook_signature(),
				);
				if (!secret?.trim()) {
					throw new AuthMissingError('boat', 'webhook_signature');
				}
				return secret;
			}
			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('boat', 'api_key');
			return storedKey;
		},
	} satisfies InternalBoatPlugin;
}

export {
	BOAT_OPERATION_IDS,
	createBoatOperation,
	getBoatInputSchema,
	getBoatOutputSchema,
} from './endpoints';
export type {
	BoatEndpointInputs,
	BoatEndpointOutputs,
	BoatJsonValue,
	BoatOperationId,
} from './endpoints/types';
export {
	BoatEndpointInputSchemas,
	BoatEndpointOutputSchemas,
} from './endpoints/types';
export type {
	BoatWebhookEvent,
	BoatWebhookEventType,
} from './webhooks';
