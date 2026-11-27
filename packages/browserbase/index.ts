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
	browserbaseEndpointSchemas,
	browserbaseEndpointsNested,
	browserbaseEndpointMeta as generatedEndpointMeta,
} from './endpoints/catalog';
import type {
	BrowserbaseEndpointInputs,
	BrowserbaseEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BrowserbaseSchema } from './schema';
import {
	browserbaseWebhookSchemas,
	browserbaseWebhooksNested,
	matchBrowserbaseWebhook,
} from './webhooks';

export type BrowserbasePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Browserbase API key (browserbase.com/settings). It acts on its project. */
	key?: string;
	/**
	 * Another API base, such as a proxy in front of Browserbase. Leave it out for https://api.browserbase.com.
	 */
	baseUrl?: string;
	/**
	 * The signing secret of the webhook endpoint. Left out, the plugin reads
	 * the account's stored webhook_signature.
	 */
	webhookSecret?: string;
	hooks?: InternalBrowserbasePlugin['hooks'];
	webhookHooks?: InternalBrowserbasePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof browserbaseEndpointsNested>;
};

/** One API key per connected account, sent in the `X-BB-API-Key` header. */
export const browserbaseAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BrowserbaseContext = CorsairPluginContext<
	typeof BrowserbaseSchema,
	BrowserbasePluginOptions,
	undefined,
	typeof browserbaseAuthConfig
>;

export type BrowserbaseKeyBuilderContext = KeyBuilderContext<
	BrowserbasePluginOptions,
	typeof browserbaseAuthConfig
>;

export type BrowserbaseBoundEndpoints = BindEndpoints<
	typeof browserbaseEndpointsNested
>;

export type BrowserbaseEndpoints = {
	[Id in keyof BrowserbaseEndpointOutputs]: CorsairEndpoint<
		BrowserbaseContext,
		BrowserbaseEndpointInputs[Id],
		BrowserbaseEndpointOutputs[Id]
	>;
};

export { browserbaseEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const browserbaseEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof browserbaseEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseBrowserbasePlugin<T extends BrowserbasePluginOptions> =
	CorsairPlugin<
		'browserbase',
		typeof BrowserbaseSchema,
		typeof browserbaseEndpointsNested,
		typeof browserbaseWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof browserbaseAuthConfig
	>;

export type InternalBrowserbasePlugin =
	BaseBrowserbasePlugin<BrowserbasePluginOptions>;

export type ExternalBrowserbasePlugin<T extends BrowserbasePluginOptions> =
	BaseBrowserbasePlugin<T>;

export function browserbase<const T extends BrowserbasePluginOptions>(
	// Safe: every BrowserbasePluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: BrowserbasePluginOptions &
		T = {} as BrowserbasePluginOptions & T,
): ExternalBrowserbasePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'browserbase',
		schema: BrowserbaseSchema,
		options: options,
		hooks: options.hooks,
		endpoints: browserbaseEndpointsNested,
		webhooks: browserbaseWebhooksNested,
		webhookSchemas: browserbaseWebhookSchemas,
		webhookHooks: options.webhookHooks,
		authConfig: browserbaseAuthConfig,
		endpointMeta: browserbaseEndpointMeta,
		endpointSchemas: browserbaseEndpointSchemas,
		pluginWebhookMatcher: matchBrowserbaseWebhook,
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
		keyBuilder: async (ctx: BrowserbaseKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const secret = await tryGetStoredKey(() =>
					ctx.keys?.get_webhook_signature(),
				);
				if (!secret?.trim()) {
					throw new AuthMissingError('browserbase', 'webhook_signature');
				}
				return secret;
			}
			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('browserbase', 'api_key');
			return storedKey;
		},
	} satisfies InternalBrowserbasePlugin;
}

export {
	BROWSERBASE_OPERATION_IDS,
	createBrowserbaseOperation,
	getBrowserbaseInputSchema,
	getBrowserbaseOutputSchema,
} from './endpoints';
export type {
	BrowserbaseEndpointInputs,
	BrowserbaseEndpointOutputs,
	BrowserbaseJsonValue,
	BrowserbaseOperationId,
} from './endpoints/types';
export {
	BrowserbaseEndpointInputSchemas,
	BrowserbaseEndpointOutputSchemas,
} from './endpoints/types';
export type { BrowserbaseWebhookEvent } from './webhooks';
