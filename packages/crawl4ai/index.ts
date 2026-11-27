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
import { normalizeServerUrl, tryGetStoredKey } from './client';
import {
	crawl4aiEndpointSchemas,
	crawl4aiEndpointsNested,
	crawl4aiEndpointMeta as generatedEndpointMeta,
} from './endpoints/catalog';
import type {
	Crawl4aiEndpointInputs,
	Crawl4aiEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { Crawl4aiSchema } from './schema';
import {
	crawl4aiWebhooksNested,
	crawl4aiWebhookSchemas as generatedWebhookSchemas,
	isCrawl4aiDelivery,
} from './webhooks';

export type Crawl4aiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * A Crawl4AI Cloud API key (sk_live_..., crawl4ai.com → Get a key), or the
	 * CRAWL4AI_API_TOKEN of your self-hosted server.
	 */
	key?: string;
	/**
	 * Your self-hosted server (`https://crawl.example.com`, or
	 * `http://localhost:11235` on the same machine), for `server.*`
	 * operations. Overrides the account's stored `server_url`.
	 */
	serverUrl?: string;
	/** The X-Webhook-Secret your server's job webhooks carry; checks incoming deliveries. */
	webhookSecret?: string;
	hooks?: InternalCrawl4aiPlugin['hooks'];
	webhookHooks?: InternalCrawl4aiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof crawl4aiEndpointsNested>;
};

// One key: a Cloud API key, or a self-hosted server's token with the server's
// address as account config (server.* operations need it).
export const crawl4aiAuthConfig = {
	api_key: {
		account: ['server_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type Crawl4aiContext = CorsairPluginContext<
	typeof Crawl4aiSchema,
	Crawl4aiPluginOptions,
	undefined,
	typeof crawl4aiAuthConfig
>;

export type Crawl4aiKeyBuilderContext = KeyBuilderContext<
	Crawl4aiPluginOptions,
	typeof crawl4aiAuthConfig
>;

export type Crawl4aiBoundEndpoints = BindEndpoints<
	typeof crawl4aiEndpointsNested
>;

export type Crawl4aiBoundWebhooks = BindWebhooks<typeof crawl4aiWebhooksNested>;

export type Crawl4aiEndpoints = {
	[Id in keyof Crawl4aiEndpointOutputs]: CorsairEndpoint<
		Crawl4aiContext,
		Crawl4aiEndpointInputs[Id],
		Crawl4aiEndpointOutputs[Id]
	>;
};

export { crawl4aiEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const crawl4aiEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof crawl4aiEndpointsNested
	>;

const crawl4aiWebhookSchemas =
	generatedWebhookSchemas satisfies RequiredPluginWebhookSchemas<
		typeof crawl4aiWebhooksNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseCrawl4aiPlugin<T extends Crawl4aiPluginOptions> = CorsairPlugin<
	'crawl4ai',
	typeof Crawl4aiSchema,
	typeof crawl4aiEndpointsNested,
	typeof crawl4aiWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof crawl4aiAuthConfig
>;

export type InternalCrawl4aiPlugin = BaseCrawl4aiPlugin<Crawl4aiPluginOptions>;

export type ExternalCrawl4aiPlugin<T extends Crawl4aiPluginOptions> =
	BaseCrawl4aiPlugin<T>;

export function crawl4ai<const T extends Crawl4aiPluginOptions>(
	// Safe: every Crawl4aiPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: Crawl4aiPluginOptions & T = {} as Crawl4aiPluginOptions & T,
): ExternalCrawl4aiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'crawl4ai',
		authConfig: crawl4aiAuthConfig,
		schema: Crawl4aiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: crawl4aiEndpointsNested,
		webhooks: crawl4aiWebhooksNested,
		endpointMeta: crawl4aiEndpointMeta,
		endpointSchemas: crawl4aiEndpointSchemas,
		webhookSchemas: crawl4aiWebhookSchemas,
		pluginWebhookMatcher: isCrawl4aiDelivery,
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
		keyBuilder: async (ctx: Crawl4aiKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				return (
					(await tryGetStoredKey(() => ctx.keys?.get_webhook_signature())) ?? ''
				);
			}
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			const key = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			// No key configured: AuthMissingError makes core ask the tenant to connect.
			if (!key) throw new AuthMissingError('crawl4ai', 'api_key');
			if (options.serverUrl) {
				// A stored key belongs to the stored server (or the Cloud). A
				// serverUrl option pointing at another server would hand it to that
				// host, so that pairing needs its own key.
				const stored = await tryGetStoredKey(
					() => ctx.keys?.get_server_url?.() ?? Promise.resolve(null),
				);
				if (
					!stored?.trim() ||
					normalizeServerUrl(stored) !== normalizeServerUrl(options.serverUrl)
				) {
					throw new AuthMissingError(
						'crawl4ai',
						'api_key',
						'[crawl4ai] the stored key belongs to another server than the serverUrl option: pass key with serverUrl',
					);
				}
			}
			return key;
		},
	} satisfies InternalCrawl4aiPlugin;
}

export type { Crawl4aiRequest } from './client';
export { CRAWL4AI_CLOUD_URL, normalizeServerUrl } from './client';
export {
	CRAWL4AI_OPERATION_IDS,
	createCrawl4aiOperation,
	getCrawl4aiInputSchema,
	getCrawl4aiOutputSchema,
} from './endpoints';
export type { Crawl4aiWebhookPayloads } from './endpoints/operation-types';
export type {
	Crawl4aiEndpointInputs,
	Crawl4aiEndpointOutputs,
	Crawl4aiJsonValue,
	Crawl4aiOperationId,
} from './endpoints/types';
export {
	Crawl4aiEndpointInputSchemas,
	Crawl4aiEndpointOutputSchemas,
} from './endpoints/types';
export type { Crawl4aiWebhookId } from './webhooks';
export { isCrawl4aiDelivery, verifyCrawl4aiWebhook } from './webhooks';
