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
import type { DiscourseAuthOptions } from './auth';
import {
	checkDiscourseStoredPairing,
	discourseAccountFields,
	resolveDiscourseTarget,
} from './auth';
import { tryGetStoredKey } from './client';
import {
	discourseEndpointSchemas,
	discourseEndpointsNested,
	discourseEndpointMeta as generatedEndpointMeta,
} from './endpoints/catalog';
import type {
	DiscourseEndpointInputs,
	DiscourseEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DiscourseSchema } from './schema';
import {
	discourseWebhookSchemas,
	discourseWebhooksNested,
	matchDiscourseWebhook,
} from './webhooks';

export type DiscoursePluginOptions = DiscourseAuthOptions & {
	authType?: PickAuth<'api_key'>;
	/** A Discourse API key (Admin > Advanced > API keys). An "All users" key acts as the username given with it; a single-user key always acts as its user. */
	key?: string;
	/**
	 * The signing secret of the webhook endpoint. Left out, the plugin reads
	 * the account's stored webhook_signature.
	 */
	webhookSecret?: string;
	hooks?: InternalDiscoursePlugin['hooks'];
	webhookHooks?: InternalDiscoursePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof discourseEndpointsNested>;
};

/**
 * One API key per connected account. Each Discourse forum has its own API and keys, at the forum's own URL, so the account stores it
 * beside the key (auth.ts reads it).
 */
export const discourseAuthConfig = {
	api_key: {
		account: discourseAccountFields,
	},
} as const satisfies PluginAuthConfig;

export type DiscourseContext = CorsairPluginContext<
	typeof DiscourseSchema,
	DiscoursePluginOptions,
	undefined,
	typeof discourseAuthConfig
>;

export type DiscourseKeyBuilderContext = KeyBuilderContext<
	DiscoursePluginOptions,
	typeof discourseAuthConfig
>;

export type DiscourseBoundEndpoints = BindEndpoints<
	typeof discourseEndpointsNested
>;

export type DiscourseEndpoints = {
	[Id in keyof DiscourseEndpointOutputs]: CorsairEndpoint<
		DiscourseContext,
		DiscourseEndpointInputs[Id],
		DiscourseEndpointOutputs[Id]
	>;
};

export { discourseEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const discourseEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof discourseEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseDiscoursePlugin<T extends DiscoursePluginOptions> =
	CorsairPlugin<
		'discourse',
		typeof DiscourseSchema,
		typeof discourseEndpointsNested,
		typeof discourseWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof discourseAuthConfig
	>;

export type InternalDiscoursePlugin =
	BaseDiscoursePlugin<DiscoursePluginOptions>;

export type ExternalDiscoursePlugin<T extends DiscoursePluginOptions> =
	BaseDiscoursePlugin<T>;

export function discourse<const T extends DiscoursePluginOptions>(
	// Safe: every DiscoursePluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: DiscoursePluginOptions & T = {} as DiscoursePluginOptions &
		T,
): ExternalDiscoursePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'discourse',
		schema: DiscourseSchema,
		options: options,
		hooks: options.hooks,
		endpoints: discourseEndpointsNested,
		webhooks: discourseWebhooksNested,
		webhookSchemas: discourseWebhookSchemas,
		webhookHooks: options.webhookHooks,
		authConfig: discourseAuthConfig,
		endpointMeta: discourseEndpointMeta,
		endpointSchemas: discourseEndpointSchemas,
		pluginWebhookMatcher: matchDiscourseWebhook,
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
		keyBuilder: async (ctx: DiscourseKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const secret = await tryGetStoredKey(() =>
					ctx.keys?.get_webhook_signature(),
				);
				if (!secret?.trim()) {
					throw new AuthMissingError('discourse', 'webhook_signature');
				}
				return secret;
			}
			if (options.key) {
				// Fails fast (AuthMissingError) when the site the key belongs to is not set.
				await resolveDiscourseTarget({
					key: options.key,
					options,
					keys: ctx.keys,
				});
				return options.key;
			}

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('discourse', 'api_key');
			// A stored key belongs to the stored site: a site option pointing
			// elsewhere would hand it to another host, so that needs its own key.
			await checkDiscourseStoredPairing(options, ctx.keys);
			await resolveDiscourseTarget({ key: storedKey, options, keys: ctx.keys });
			return storedKey;
		},
	} satisfies InternalDiscoursePlugin;
}

export {
	createDiscourseOperation,
	DISCOURSE_OPERATION_IDS,
	getDiscourseInputSchema,
	getDiscourseOutputSchema,
} from './endpoints';
export type {
	DiscourseEndpointInputs,
	DiscourseEndpointOutputs,
	DiscourseJsonValue,
	DiscourseOperationId,
} from './endpoints/types';
export {
	DiscourseEndpointInputSchemas,
	DiscourseEndpointOutputSchemas,
} from './endpoints/types';
export type {
	DiscourseWebhookEvent,
	DiscourseWebhookEventName,
} from './webhooks';
