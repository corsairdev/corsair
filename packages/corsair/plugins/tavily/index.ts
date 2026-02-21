import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PluginAuthConfig,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import { Search } from './endpoints';
import type {
	TavilyEndpointOutputs,
	TavilySearchRequest,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TavilySchema } from './schema';

/**
 * Plugin options type - configure authentication and behavior
 *
 * AUTH CONFIGURATION:
 * - authType: The authentication method to use. Options:
 *   - 'api_key': For API key authentication (most common)
 *   - 'oauth_2': For OAuth 2.0 authentication
 *   - 'bot_token': For bot token authentication
 *   Update PickAuth<'api_key'> to include all auth types your plugin supports.
 *   Example: PickAuth<'api_key' | 'oauth_2'> for plugins that support both.
 *
 * - key: Optional API key to use directly (bypasses key manager)
 * - webhookSecret: Optional webhook secret for signature verification
 */
export type TavilyPluginOptions = {
	// TODO: Update authType to match your plugin's supported auth methods
	// Example: PickAuth<'api_key' | 'oauth_2'> if you support OAuth
	authType?: PickAuth<'api_key'>;
	// Optional: Direct API key (overrides key manager)
	key?: string;
	// Optional: Webhook secret for signature verification
	webhookSecret?: string;
	// Optional: Lifecycle hooks for endpoints
	hooks?: InternalTavilyPlugin['hooks'];
	// Optional: Lifecycle hooks for webhooks
	webhookHooks?: InternalTavilyPlugin['webhookHooks'];
	// Optional: Custom error handlers (merged with default error handlers)
	errorHandlers?: CorsairErrorHandler;
};

export type TavilyContext = CorsairPluginContext<
	typeof TavilySchema,
	TavilyPluginOptions
>;

export type TavilyKeyBuilderContext = KeyBuilderContext<TavilyPluginOptions>;

export type TavilyBoundEndpoints = BindEndpoints<typeof tavilyEndpointsNested>;

type TavilyEndpoint<
	K extends keyof TavilyEndpointOutputs,
	Input,
> = CorsairEndpoint<TavilyContext, Input, TavilyEndpointOutputs[K]>;

export type TavilyEndpoints = {
	search: TavilyEndpoint<'search', TavilySearchRequest>;
};

const tavilyEndpointsNested = {
	search: Search.search,
} as const;

const tavilyWebhooksNested = {} as const;

/**
 * Default authentication type for this plugin
 *
 * AUTH CONFIGURATION:
 * Change this to match your plugin's default auth method:
 * - 'api_key': For API key authentication
 * - 'oauth_2': For OAuth 2.0 authentication
 * - 'bot_token': For bot token authentication
 */
const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Authentication configuration
 *
 * AUTH CONFIGURATION:
 * This defines which auth types are supported and how accounts are structured.
 *
 * For 'api_key' auth:
 *   - account: ['one'] means single account per plugin instance
 *   - account: ['many'] means multiple accounts per plugin instance
 *
 * For 'oauth_2' auth:
 *   - account: ['one'] or ['many'] depending on your needs
 *   - You may also need to add 'scopes' configuration
 *
 * Example for OAuth 2.0:
 * export const tavilyAuthConfig = {
 *   oauth_2: {
 *     account: ['one'] as const,
 *     scopes: ['read', 'write'] as const,
 *   },
 * } as const satisfies PluginAuthConfig;
 *
 * Example for multiple auth types:
 * export const tavilyAuthConfig = {
 *   api_key: {
 *     account: ['one'] as const,
 *   },
 *   oauth_2: {
 *     account: ['one'] as const,
 *     scopes: ['read', 'write'] as const,
 *   },
 * } as const satisfies PluginAuthConfig;
 */
export const tavilyAuthConfig = {
	api_key: {
		// TODO: Change to ['many'] if you support multiple accounts per instance
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTavilyPlugin<T extends TavilyPluginOptions> = CorsairPlugin<
	'tavily',
	typeof TavilySchema,
	typeof tavilyEndpointsNested,
	typeof tavilyWebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalTavilyPlugin = BaseTavilyPlugin<TavilyPluginOptions>;

export type ExternalTavilyPlugin<T extends TavilyPluginOptions> =
	BaseTavilyPlugin<T>;

export function tavily<const T extends TavilyPluginOptions>(
	incomingOptions: TavilyPluginOptions & T = {} as TavilyPluginOptions & T,
): ExternalTavilyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tavily',
		schema: TavilySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: tavilyEndpointsNested,
		webhooks: tavilyWebhooksNested,
		/**
		 * Webhook matcher function - determines if an incoming request is a webhook for this plugin
		 *
		 * WEBHOOK CONFIGURATION:
		 * Update this to check for headers that identify your provider's webhooks.
		 * Common patterns:
		 * - Check for signature headers (e.g., 'x-tavily-signature')
		 * - Check for user-agent strings
		 * - Check for specific path patterns
		 *
		 * Example for multiple headers:
		 * pluginWebhookMatcher: (request) => {
		 *   const headers = request.headers;
		 *   return 'x-tavily-signature' in headers && 'x-tavily-timestamp' in headers;
		 * },
		 */
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update this to match your webhook signature headers
			const hasSignature = 'x-tavily-signature' in headers;
			return hasSignature;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		/**
		 * Key builder function - retrieves the appropriate key/secret for API calls or webhook verification
		 *
		 * AUTH CONFIGURATION:
		 * This function determines which key to use based on:
		 * - source: 'endpoint' (for API calls) or 'webhook' (for webhook verification)
		 * - ctx.authType: The authentication type being used
		 *
		 * Priority order:
		 * 1. Direct options (options.key, options.webhookSecret)
		 * 2. Key manager (ctx.keys.get_api_key(), ctx.keys.get_access_token(), etc.)
		 *
		 * For OAuth 2.0, you'll need to add:
		 * } else if (ctx.authType === 'oauth_2') {
		 *   const res = await ctx.keys.get_access_token();
		 *   if (!res) return '';
		 *   return res;
		 * }
		 *
		 * For bot_token, you'll need to add:
		 * } else if (ctx.authType === 'bot_token') {
		 *   const res = await ctx.keys.get_bot_token();
		 *   if (!res) return '';
		 *   return res;
		 * }
		 */
		keyBuilder: async (ctx: TavilyKeyBuilderContext, source) => {
			// Webhook signature verification - check direct option first
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			// Webhook signature from key manager
			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			// Endpoint API calls - check direct option first
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			// Endpoint API calls - get from key manager based on auth type
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			// TODO: Add support for other auth types if needed
			// Example for OAuth 2.0:
			// } else if (ctx.authType === 'oauth_2') {
			//   const res = await ctx.keys.get_access_token();
			//   if (!res) return '';
			//   return res;
			// }

			return '';
		},
	} satisfies InternalTavilyPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	TavilyEndpointOutputs,
	TavilyIncludeAnswerLevel,
	TavilyRawContentFormat,
	TavilySearchDepth,
	TavilySearchImage,
	TavilySearchRequest,
	TavilySearchResponse,
	TavilySearchResult,
	TavilySearchUsage,
	TavilyTimeRange,
	TavilyTopic,
} from './endpoints/types';
export {
	TAVILY_SEARCH_DEPTH,
	TAVILY_TIME_RANGE,
	TAVILY_TOPIC,
	TavilySearchRequestSchema,
	TavilySearchResponseSchema,
} from './endpoints/types';
