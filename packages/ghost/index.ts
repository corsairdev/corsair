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
import type { GhostAuthOptions } from './auth';
import {
	checkGhostStoredPairing,
	ghostAccountFields,
	resolveGhostTarget,
} from './auth';
import { tryGetStoredKey } from './client';
import {
	ghostEndpointMeta as generatedEndpointMeta,
	ghostEndpointSchemas,
	ghostEndpointsNested,
} from './endpoints/catalog';
import type {
	GhostEndpointInputs,
	GhostEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GhostSchema } from './schema';
import {
	ghostWebhookSchemas,
	ghostWebhooksNested,
	matchGhostWebhook,
} from './webhooks';

export type GhostPluginOptions = GhostAuthOptions & {
	authType?: PickAuth<'api_key'>;
	/** The Admin API key of a Ghost custom integration (Settings > Integrations > Add custom integration), `<id>:<secret>`. A staff access token works too, with that user's role. */
	key?: string;
	/**
	 * The signing secret of the webhook endpoint. Left out, the plugin reads
	 * the account's stored webhook_signature.
	 */
	webhookSecret?: string;
	hooks?: InternalGhostPlugin['hooks'];
	webhookHooks?: InternalGhostPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ghostEndpointsNested>;
};

/**
 * One API key per connected account. Each Ghost site has its own API and keys, at <site>/ghost/api, so the account stores it
 * beside the key (auth.ts reads it).
 */
export const ghostAuthConfig = {
	api_key: {
		account: ghostAccountFields,
	},
} as const satisfies PluginAuthConfig;

export type GhostContext = CorsairPluginContext<
	typeof GhostSchema,
	GhostPluginOptions,
	undefined,
	typeof ghostAuthConfig
>;

export type GhostKeyBuilderContext = KeyBuilderContext<
	GhostPluginOptions,
	typeof ghostAuthConfig
>;

export type GhostBoundEndpoints = BindEndpoints<typeof ghostEndpointsNested>;

export type GhostEndpoints = {
	[Id in keyof GhostEndpointOutputs]: CorsairEndpoint<
		GhostContext,
		GhostEndpointInputs[Id],
		GhostEndpointOutputs[Id]
	>;
};

export { ghostEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const ghostEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof ghostEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseGhostPlugin<T extends GhostPluginOptions> = CorsairPlugin<
	'ghost',
	typeof GhostSchema,
	typeof ghostEndpointsNested,
	typeof ghostWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof ghostAuthConfig
>;

export type InternalGhostPlugin = BaseGhostPlugin<GhostPluginOptions>;

export type ExternalGhostPlugin<T extends GhostPluginOptions> =
	BaseGhostPlugin<T>;

export function ghost<const T extends GhostPluginOptions>(
	// Safe: every GhostPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: GhostPluginOptions & T = {} as GhostPluginOptions & T,
): ExternalGhostPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ghost',
		schema: GhostSchema,
		options: options,
		hooks: options.hooks,
		endpoints: ghostEndpointsNested,
		webhooks: ghostWebhooksNested,
		webhookSchemas: ghostWebhookSchemas,
		webhookHooks: options.webhookHooks,
		authConfig: ghostAuthConfig,
		endpointMeta: ghostEndpointMeta,
		endpointSchemas: ghostEndpointSchemas,
		pluginWebhookMatcher: matchGhostWebhook,
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
		keyBuilder: async (ctx: GhostKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const secret = await tryGetStoredKey(() =>
					ctx.keys?.get_webhook_signature(),
				);
				if (!secret?.trim()) {
					throw new AuthMissingError('ghost', 'webhook_signature');
				}
				return secret;
			}
			if (options.key) {
				// Fails fast (AuthMissingError) when the site the key belongs to is not set.
				await resolveGhostTarget({ key: options.key, options, keys: ctx.keys });
				return options.key;
			}

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('ghost', 'api_key');
			// A stored key belongs to the stored site: a site option pointing
			// elsewhere would hand it to another host, so that needs its own key.
			await checkGhostStoredPairing(options, ctx.keys);
			await resolveGhostTarget({ key: storedKey, options, keys: ctx.keys });
			return storedKey;
		},
	} satisfies InternalGhostPlugin;
}

export {
	createGhostOperation,
	GHOST_OPERATION_IDS,
	getGhostInputSchema,
	getGhostOutputSchema,
} from './endpoints';
export type {
	GhostEndpointInputs,
	GhostEndpointOutputs,
	GhostJsonValue,
	GhostOperationId,
} from './endpoints/types';
export {
	GhostEndpointInputSchemas,
	GhostEndpointOutputSchemas,
} from './endpoints/types';
export type {
	GhostWebhookEvent,
	GhostWebhookEventType,
} from './webhooks';
