import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PluginAuthConfig,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import type { DiscordEndpointOutputs } from './endpoints/types';
import type {
	DiscordWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { Example } from './endpoints';
import { DiscordSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

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
export type DiscordPluginOptions = {
	// TODO: Update authType to match your plugin's supported auth methods
	// Example: PickAuth<'api_key' | 'oauth_2'> if you support OAuth
	authType?: PickAuth<'api_key'>;
	// Optional: Direct API key (overrides key manager)
	key?: string;
	// Optional: Webhook secret for signature verification
	webhookSecret?: string;
	// Optional: Lifecycle hooks for endpoints
	hooks?: InternalDiscordPlugin['hooks'];
	// Optional: Lifecycle hooks for webhooks
	webhookHooks?: InternalDiscordPlugin['webhookHooks'];
	// Optional: Custom error handlers (merged with default error handlers)
	errorHandlers?: CorsairErrorHandler;
};

export type DiscordContext = CorsairPluginContext<
	typeof DiscordSchema,
	DiscordPluginOptions
>;

export type DiscordKeyBuilderContext = KeyBuilderContext<DiscordPluginOptions>;

export type DiscordBoundEndpoints = BindEndpoints<typeof discordEndpointsNested>;

type DiscordEndpoint<
	K extends keyof DiscordEndpointOutputs,
	Input,
> = CorsairEndpoint<DiscordContext, Input, DiscordEndpointOutputs[K]>;

export type DiscordEndpoints = {
	exampleGet: DiscordEndpoint<'exampleGet', { id: string }>;
};

type DiscordWebhook<
	K extends keyof DiscordWebhookOutputs,
	TEvent,
> = CorsairWebhook<DiscordContext, TEvent, DiscordWebhookOutputs[K]>;

export type DiscordWebhooks = {
	example: DiscordWebhook<'example', ExampleEvent>;
};

export type DiscordBoundWebhooks = BindWebhooks<DiscordWebhooks>;

const discordEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const discordWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

/**
 * Default authentication type for this plugin
 * 
 * AUTH CONFIGURATION:
 * Change this to match your plugin's default auth method:
 * - 'api_key': For API key authentication
 * - 'oauth_2': For OAuth 2.0 authentication  
 * - 'bot_token': For bot token authentication
 */
const defaultAuthType: AuthTypes = 'api_key';

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
 * export const discordAuthConfig = {
 *   oauth_2: {
 *     account: ['one'] as const,
 *     scopes: ['read', 'write'] as const,
 *   },
 * } as const satisfies PluginAuthConfig;
 * 
 * Example for multiple auth types:
 * export const discordAuthConfig = {
 *   api_key: {
 *     account: ['one'] as const,
 *   },
 *   oauth_2: {
 *     account: ['one'] as const,
 *     scopes: ['read', 'write'] as const,
 *   },
 * } as const satisfies PluginAuthConfig;
 */
export const discordAuthConfig = {
	api_key: {
		// TODO: Change to ['many'] if you support multiple accounts per instance
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDiscordPlugin<T extends DiscordPluginOptions> = CorsairPlugin<
	'discord',
	typeof DiscordSchema,
	typeof discordEndpointsNested,
	typeof discordWebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalDiscordPlugin = BaseDiscordPlugin<DiscordPluginOptions>;

export type ExternalDiscordPlugin<T extends DiscordPluginOptions> =
	BaseDiscordPlugin<T>;

export function discord<const T extends DiscordPluginOptions>(
	incomingOptions: DiscordPluginOptions & T = {} as DiscordPluginOptions & T,
): ExternalDiscordPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'discord',
		schema: DiscordSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: discordEndpointsNested,
		webhooks: discordWebhooksNested,
		/**
		 * Webhook matcher function - determines if an incoming request is a webhook for this plugin
		 * 
		 * WEBHOOK CONFIGURATION:
		 * Update this to check for headers that identify your provider's webhooks.
		 * Common patterns:
		 * - Check for signature headers (e.g., 'x-discord-signature')
		 * - Check for user-agent strings
		 * - Check for specific path patterns
		 * 
		 * Example for multiple headers:
		 * pluginWebhookMatcher: (request) => {
		 *   const headers = request.headers;
		 *   return 'x-discord-signature' in headers && 'x-discord-timestamp' in headers;
		 * },
		 */
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update this to match your webhook signature headers
			const hasSignature = 'x-discord-signature' in headers;
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
		keyBuilder: async (ctx: DiscordKeyBuilderContext, source) => {
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
	} satisfies InternalDiscordPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ExampleEvent,
	DiscordWebhookOutputs,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	DiscordEndpointOutputs,
	ExampleGetResponse,
} from './endpoints/types';
