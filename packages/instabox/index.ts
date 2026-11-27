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
	instaboxEndpointMeta as generatedEndpointMeta,
	instaboxEndpointSchemas,
	instaboxEndpointsNested,
} from './endpoints/catalog';
import type {
	InstaboxEndpointInputs,
	InstaboxEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { InstaboxSchema } from './schema';
import {
	instaboxWebhooksNested,
	isInstaboxDelivery,
	instaboxWebhookSchemas as webhookSchemas,
} from './webhooks';

export type InstaboxPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * An InstaBox API key (`ibk_...`) from the dashboard's API keys page or
	 * `instabox keys create`, sent as `Authorization: Bearer`. Its scopes decide
	 * which operations work. A signed-in user's access token works too and is
	 * the only credential the sign-in-only routes (keys, Vault, billing
	 * changes, workspaces, sessions) accept.
	 */
	key?: string;
	/**
	 * The signing secret (`whsec_...`) of a webhook endpoint
	 * (orgs.webhooks.create or orgs.webhooks.rotate); checks incoming
	 * deliveries. InstaBox shows it once.
	 */
	webhookSecret?: string;
	hooks?: InternalInstaboxPlugin['hooks'];
	webhookHooks?: InternalInstaboxPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof instaboxEndpointsNested>;
};

/** The key travels in the Authorization header; nothing else is account config. */
export const instaboxAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type InstaboxContext = CorsairPluginContext<
	typeof InstaboxSchema,
	InstaboxPluginOptions,
	undefined,
	typeof instaboxAuthConfig
>;

export type InstaboxKeyBuilderContext = KeyBuilderContext<
	InstaboxPluginOptions,
	typeof instaboxAuthConfig
>;

export type InstaboxBoundEndpoints = BindEndpoints<
	typeof instaboxEndpointsNested
>;

export type InstaboxBoundWebhooks = BindWebhooks<typeof instaboxWebhooksNested>;

export type InstaboxEndpoints = {
	[Id in keyof InstaboxEndpointOutputs]: CorsairEndpoint<
		InstaboxContext,
		InstaboxEndpointInputs[Id],
		InstaboxEndpointOutputs[Id]
	>;
};

export { instaboxEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const instaboxEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof instaboxEndpointsNested
	>;

const instaboxWebhookSchemas =
	webhookSchemas satisfies RequiredPluginWebhookSchemas<
		typeof instaboxWebhooksNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseInstaboxPlugin<T extends InstaboxPluginOptions> = CorsairPlugin<
	'instabox',
	typeof InstaboxSchema,
	typeof instaboxEndpointsNested,
	typeof instaboxWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof instaboxAuthConfig
>;

export type InternalInstaboxPlugin = BaseInstaboxPlugin<InstaboxPluginOptions>;

export type ExternalInstaboxPlugin<T extends InstaboxPluginOptions> =
	BaseInstaboxPlugin<T>;

export function instabox<const T extends InstaboxPluginOptions>(
	// Safe: every InstaboxPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: InstaboxPluginOptions & T = {} as InstaboxPluginOptions & T,
): ExternalInstaboxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'instabox',
		schema: InstaboxSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: instaboxEndpointsNested,
		webhooks: instaboxWebhooksNested,
		authConfig: instaboxAuthConfig,
		endpointMeta: instaboxEndpointMeta,
		endpointSchemas: instaboxEndpointSchemas,
		webhookSchemas: instaboxWebhookSchemas,
		pluginWebhookMatcher: isInstaboxDelivery,
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
		keyBuilder: async (ctx: InstaboxKeyBuilderContext, source) => {
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
			if (!storedKey) throw new AuthMissingError('instabox', 'api_key');
			return storedKey;
		},
	} satisfies InternalInstaboxPlugin;
}

export {
	createInstaboxOperation,
	getInstaboxInputSchema,
	getInstaboxOutputSchema,
	INSTABOX_OPERATION_IDS,
} from './endpoints';
export type {
	InstaboxEndpointInputs,
	InstaboxEndpointOutputs,
	InstaboxJsonValue,
	InstaboxOperationId,
} from './endpoints/types';
export {
	InstaboxEndpointInputSchemas,
	InstaboxEndpointOutputSchemas,
} from './endpoints/types';
export type { InstaboxEvent, InstaboxEventType } from './webhooks';
export {
	instaboxEventTypeOf,
	isInstaboxDelivery,
	verifyInstaboxWebhook,
} from './webhooks';
