import type {
	AuthTypes,
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
	inkboxEndpointMeta as generatedEndpointMeta,
	inkboxEndpointSchemas,
	inkboxEndpointsNested,
} from './endpoints/catalog';
import type {
	InkboxEndpointInputs,
	InkboxEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { InkboxSchema } from './schema';
import {
	inkboxWebhookSchemas as generatedWebhookSchemas,
	inkboxWebhooksNested,
	isInkboxDelivery,
} from './webhooks';

export type InkboxPluginOptions = {
	/**
	 * `api_key`: an Inkbox API key from inkbox.ai/console → API keys. An
	 * organization admin key reaches every identity, mailbox and number; a key
	 * scoped to one agent identity reaches only what that identity can see.
	 */
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The agent identity's webhook signing key (`whsec_…`), returned once by
	 * identities.signingKey.createOrRotate or by the first
	 * webhooks.subscriptions.create for that identity. Checks incoming events.
	 */
	webhookSecret?: string;
	hooks?: InternalInkboxPlugin['hooks'];
	webhookHooks?: InternalInkboxPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof inkboxEndpointsNested>;
};

export type InkboxContext = CorsairPluginContext<
	typeof InkboxSchema,
	InkboxPluginOptions
>;

export type InkboxKeyBuilderContext = KeyBuilderContext<InkboxPluginOptions>;

export type InkboxBoundEndpoints = BindEndpoints<typeof inkboxEndpointsNested>;

export type InkboxBoundWebhooks = BindWebhooks<typeof inkboxWebhooksNested>;

export type InkboxEndpoints = {
	[Id in keyof InkboxEndpointOutputs]: CorsairEndpoint<
		InkboxContext,
		InkboxEndpointInputs[Id],
		InkboxEndpointOutputs[Id]
	>;
};

export { inkboxEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const inkboxEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof inkboxEndpointsNested
	>;

const inkboxWebhookSchemas =
	generatedWebhookSchemas satisfies RequiredPluginWebhookSchemas<
		typeof inkboxWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const inkboxAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseInkboxPlugin<T extends InkboxPluginOptions> = CorsairPlugin<
	'inkbox',
	typeof InkboxSchema,
	typeof inkboxEndpointsNested,
	typeof inkboxWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalInkboxPlugin = BaseInkboxPlugin<InkboxPluginOptions>;

export type ExternalInkboxPlugin<T extends InkboxPluginOptions> =
	BaseInkboxPlugin<T>;

export function inkbox<const T extends InkboxPluginOptions>(
	// Safe: every InkboxPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: InkboxPluginOptions & T = {} as InkboxPluginOptions & T,
): ExternalInkboxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'inkbox',
		authConfig: inkboxAuthConfig,
		schema: InkboxSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: inkboxEndpointsNested,
		webhooks: inkboxWebhooksNested,
		endpointMeta: inkboxEndpointMeta,
		endpointSchemas: inkboxEndpointSchemas,
		webhookSchemas: inkboxWebhookSchemas,
		pluginWebhookMatcher: isInkboxDelivery,
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
		keyBuilder: async (ctx: InkboxKeyBuilderContext, source) => {
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
			if (!storedKey) throw new AuthMissingError('inkbox', 'api_key');
			return storedKey;
		},
	} satisfies InternalInkboxPlugin;
}

export {
	createInkboxOperation,
	getInkboxInputSchema,
	getInkboxOutputSchema,
	INKBOX_OPERATION_IDS,
} from './endpoints';
export type { InkboxWebhookPayloads } from './endpoints/operation-types';
export type {
	InkboxEndpointInputs,
	InkboxEndpointOutputs,
	InkboxJsonValue,
	InkboxOperationId,
} from './endpoints/types';
export {
	InkboxEndpointInputSchemas,
	InkboxEndpointOutputSchemas,
} from './endpoints/types';
export type { InkboxWebhookId } from './webhooks';
export {
	INKBOX_WEBHOOK_TOLERANCE_SECONDS,
	verifyInkboxWebhook,
} from './webhooks';
