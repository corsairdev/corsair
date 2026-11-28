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
import type { SegmentAuthOptions } from './auth';
import {
	checkSegmentStoredPairing,
	resolveSegmentTarget,
	segmentAccountFields,
} from './auth';
import { tryGetStoredKey } from './client';
import {
	segmentEndpointMeta as generatedEndpointMeta,
	segmentEndpointSchemas,
	segmentEndpointsNested,
} from './endpoints/catalog';
import type {
	SegmentEndpointInputs,
	SegmentEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SegmentSchema } from './schema';
import {
	matchSegmentWebhook,
	segmentWebhookSchemas,
	segmentWebhooksNested,
} from './webhooks';

export type SegmentPluginOptions = SegmentAuthOptions & {
	authType?: PickAuth<'api_key'>;
	/** A Segment Public API token (Settings > Workspace settings > Access Management > Tokens; Team and Business plans). On the Free plan, a source write key works for the tracking operations only. */
	key?: string;
	/**
	 * The signing secret of the webhook endpoint. Left out, the plugin reads
	 * the account's stored webhook_signature.
	 */
	webhookSecret?: string;
	hooks?: InternalSegmentPlugin['hooks'];
	webhookHooks?: InternalSegmentPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof segmentEndpointsNested>;
};

/**
 * One API key per connected account. A workspace lives in one region (US or EU), with its own API hosts, so the account stores it
 * beside the key (auth.ts reads it).
 */
export const segmentAuthConfig = {
	api_key: {
		account: segmentAccountFields,
	},
} as const satisfies PluginAuthConfig;

export type SegmentContext = CorsairPluginContext<
	typeof SegmentSchema,
	SegmentPluginOptions,
	undefined,
	typeof segmentAuthConfig
>;

export type SegmentKeyBuilderContext = KeyBuilderContext<
	SegmentPluginOptions,
	typeof segmentAuthConfig
>;

export type SegmentBoundEndpoints = BindEndpoints<
	typeof segmentEndpointsNested
>;

export type SegmentEndpoints = {
	[Id in keyof SegmentEndpointOutputs]: CorsairEndpoint<
		SegmentContext,
		SegmentEndpointInputs[Id],
		SegmentEndpointOutputs[Id]
	>;
};

export { segmentEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const segmentEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof segmentEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseSegmentPlugin<T extends SegmentPluginOptions> = CorsairPlugin<
	'segment',
	typeof SegmentSchema,
	typeof segmentEndpointsNested,
	typeof segmentWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof segmentAuthConfig
>;

export type InternalSegmentPlugin = BaseSegmentPlugin<SegmentPluginOptions>;

export type ExternalSegmentPlugin<T extends SegmentPluginOptions> =
	BaseSegmentPlugin<T>;

export function segment<const T extends SegmentPluginOptions>(
	// Safe: every SegmentPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: SegmentPluginOptions & T = {} as SegmentPluginOptions & T,
): ExternalSegmentPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'segment',
		schema: SegmentSchema,
		options: options,
		hooks: options.hooks,
		endpoints: segmentEndpointsNested,
		webhooks: segmentWebhooksNested,
		webhookSchemas: segmentWebhookSchemas,
		webhookHooks: options.webhookHooks,
		authConfig: segmentAuthConfig,
		endpointMeta: segmentEndpointMeta,
		endpointSchemas: segmentEndpointSchemas,
		pluginWebhookMatcher: matchSegmentWebhook,
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
		keyBuilder: async (ctx: SegmentKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const secret = await tryGetStoredKey(() =>
					ctx.keys?.get_webhook_signature(),
				);
				if (!secret?.trim()) {
					throw new AuthMissingError('segment', 'webhook_signature');
				}
				return secret;
			}
			if (options.key) {
				// Fails fast (AuthMissingError) when the site the key belongs to is not set.
				await resolveSegmentTarget({
					key: options.key,
					options,
					keys: ctx.keys,
				});
				return options.key;
			}

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('segment', 'api_key');
			// A stored key belongs to the stored site: a site option pointing
			// elsewhere would hand it to another host, so that needs its own key.
			await checkSegmentStoredPairing(options, ctx.keys);
			await resolveSegmentTarget({ key: storedKey, options, keys: ctx.keys });
			return storedKey;
		},
	} satisfies InternalSegmentPlugin;
}

export {
	createSegmentOperation,
	getSegmentInputSchema,
	getSegmentOutputSchema,
	SEGMENT_OPERATION_IDS,
} from './endpoints';
export type {
	SegmentEndpointInputs,
	SegmentEndpointOutputs,
	SegmentJsonValue,
	SegmentOperationId,
} from './endpoints/types';
export {
	SegmentEndpointInputSchemas,
	SegmentEndpointOutputSchemas,
} from './endpoints/types';
export type {
	SegmentWebhookEvent,
	SegmentWebhookEventName,
} from './webhooks';
