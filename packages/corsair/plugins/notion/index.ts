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
import type { NotionEndpointOutputs } from './endpoints/types';
import type {
	NotionWebhookOutputs,
	PageAddedToDatabaseEvent,
	PageUpdatedInDatabaseEvent,
} from './webhooks/types';
import {
	Blocks,
	Databases,
	DatabasePages,
	Pages,
	Users,
} from './endpoints';
import { NotionSchema } from './schema';
import { DatabasePagesWebhooks } from './webhooks';
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
export type NotionPluginOptions = {
	// TODO: Update authType to match your plugin's supported auth methods
	// Example: PickAuth<'api_key' | 'oauth_2'> if you support OAuth
	authType?: PickAuth<'api_key'>;
	// Optional: Direct API key (overrides key manager)
	key?: string;
	// Optional: Webhook secret for signature verification
	webhookSecret?: string;
	// Optional: Lifecycle hooks for endpoints
	hooks?: InternalNotionPlugin['hooks'];
	// Optional: Lifecycle hooks for webhooks
	webhookHooks?: InternalNotionPlugin['webhookHooks'];
	// Optional: Custom error handlers (merged with default error handlers)
	errorHandlers?: CorsairErrorHandler;
};

export type NotionContext = CorsairPluginContext<
	typeof NotionSchema,
	NotionPluginOptions
>;

export type NotionKeyBuilderContext = KeyBuilderContext<NotionPluginOptions>;

export type NotionBoundEndpoints = BindEndpoints<typeof notionEndpointsNested>;

type NotionEndpoint<
	K extends keyof NotionEndpointOutputs,
	Input,
> = CorsairEndpoint<NotionContext, Input, NotionEndpointOutputs[K]>;

export type NotionEndpoints = {
	blocksAppendBlock: NotionEndpoint<
		'blocksAppendBlock',
		{ block_id: string; children: unknown[] }
	>;
	blocksGetManyChildBlocks: NotionEndpoint<
		'blocksGetManyChildBlocks',
		{ block_id: string; start_cursor?: string; page_size?: number }
	>;
	databasesGetDatabase: NotionEndpoint<
		'databasesGetDatabase',
		{ database_id: string }
	>;
	databasesGetManyDatabases: NotionEndpoint<
		'databasesGetManyDatabases',
		{ start_cursor?: string; page_size?: number }
	>;
	databasesSearchDatabase: NotionEndpoint<
		'databasesSearchDatabase',
		{
			query?: string;
			sort?: unknown;
			filter?: unknown;
			start_cursor?: string;
			page_size?: number;
		}
	>;
	databasePagesCreateDatabasePage: NotionEndpoint<
		'databasePagesCreateDatabasePage',
		{ database_id: string; properties: Record<string, unknown> }
	>;
	databasePagesGetDatabasePage: NotionEndpoint<
		'databasePagesGetDatabasePage',
		{ page_id: string }
	>;
	databasePagesGetManyDatabasePages: NotionEndpoint<
		'databasePagesGetManyDatabasePages',
		{
			database_id: string;
			filter?: unknown;
			sorts?: unknown[];
			start_cursor?: string;
			page_size?: number;
		}
	>;
	databasePagesUpdateDatabasePage: NotionEndpoint<
		'databasePagesUpdateDatabasePage',
		{
			page_id: string;
			properties?: Record<string, unknown>;
			archived?: boolean;
		}
	>;
	pagesArchivePage: NotionEndpoint<'pagesArchivePage', { page_id: string }>;
	pagesCreatePage: NotionEndpoint<
		'pagesCreatePage',
		{
			parent: unknown;
			properties?: Record<string, unknown>;
			children?: unknown[];
		}
	>;
	pagesSearchPage: NotionEndpoint<
		'pagesSearchPage',
		{
			query?: string;
			sort?: unknown;
			filter?: unknown;
			start_cursor?: string;
			page_size?: number;
		}
	>;
	usersGetUser: NotionEndpoint<'usersGetUser', { user_id: string }>;
	usersGetManyUsers: NotionEndpoint<
		'usersGetManyUsers',
		{ start_cursor?: string; page_size?: number }
	>;
};

type NotionWebhook<
	K extends keyof NotionWebhookOutputs,
	TEvent,
> = CorsairWebhook<NotionContext, TEvent, NotionWebhookOutputs[K]>;

export type NotionWebhooks = {
	pageAddedToDatabase: NotionWebhook<
		'pageAddedToDatabase',
		PageAddedToDatabaseEvent
	>;
	pageUpdatedInDatabase: NotionWebhook<
		'pageUpdatedInDatabase',
		PageUpdatedInDatabaseEvent
	>;
};

export type NotionBoundWebhooks = BindWebhooks<NotionWebhooks>;

const notionEndpointsNested = {
	blocks: {
		appendBlock: Blocks.appendBlock,
		getManyChildBlocks: Blocks.getManyChildBlocks,
	},
	databases: {
		getDatabase: Databases.getDatabase,
		getManyDatabases: Databases.getManyDatabases,
		searchDatabase: Databases.searchDatabase,
	},
	databasePages: {
		createDatabasePage: DatabasePages.createDatabasePage,
		getDatabasePage: DatabasePages.getDatabasePage,
		getManyDatabasePages: DatabasePages.getManyDatabasePages,
		updateDatabasePage: DatabasePages.updateDatabasePage,
	},
	pages: {
		archivePage: Pages.archivePage,
		createPage: Pages.createPage,
		searchPage: Pages.searchPage,
	},
	users: {
		getUser: Users.getUser,
		getManyUsers: Users.getManyUsers,
	},
} as const;

const notionWebhooksNested = {
	databasePages: {
		pageAddedToDatabase: DatabasePagesWebhooks.pageAddedToDatabase,
		pageUpdatedInDatabase: DatabasePagesWebhooks.pageUpdatedInDatabase,
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
 * export const notionAuthConfig = {
 *   oauth_2: {
 *     account: ['one'] as const,
 *     scopes: ['read', 'write'] as const,
 *   },
 * } as const satisfies PluginAuthConfig;
 * 
 * Example for multiple auth types:
 * export const notionAuthConfig = {
 *   api_key: {
 *     account: ['one'] as const,
 *   },
 *   oauth_2: {
 *     account: ['one'] as const,
 *     scopes: ['read', 'write'] as const,
 *   },
 * } as const satisfies PluginAuthConfig;
 */
export const notionAuthConfig = {
	api_key: {
		// TODO: Change to ['many'] if you support multiple accounts per instance
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseNotionPlugin<T extends NotionPluginOptions> = CorsairPlugin<
	'notion',
	typeof NotionSchema,
	typeof notionEndpointsNested,
	typeof notionWebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalNotionPlugin = BaseNotionPlugin<NotionPluginOptions>;

export type ExternalNotionPlugin<T extends NotionPluginOptions> =
	BaseNotionPlugin<T>;

export function notion<const T extends NotionPluginOptions>(
	incomingOptions: NotionPluginOptions & T = {} as NotionPluginOptions & T,
): ExternalNotionPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'notion',
		schema: NotionSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: notionEndpointsNested,
		webhooks: notionWebhooksNested,
		/**
		 * Webhook matcher function - determines if an incoming request is a webhook for this plugin
		 * 
		 * WEBHOOK CONFIGURATION:
		 * Update this to check for headers that identify your provider's webhooks.
		 * Common patterns:
		 * - Check for signature headers (e.g., 'x-notion-signature')
		 * - Check for user-agent strings
		 * - Check for specific path patterns
		 * 
		 * Example for multiple headers:
		 * pluginWebhookMatcher: (request) => {
		 *   const headers = request.headers;
		 *   return 'x-notion-signature' in headers && 'x-notion-timestamp' in headers;
		 * },
		 */
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update this to match your webhook signature headers
			const hasSignature = 'x-notion-signature' in headers;
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
		keyBuilder: async (ctx: NotionKeyBuilderContext, source) => {
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
	} satisfies InternalNotionPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	PageAddedToDatabaseEvent,
	PageUpdatedInDatabaseEvent,
	NotionWebhookOutputs,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type { NotionEndpointOutputs } from './endpoints/types';
