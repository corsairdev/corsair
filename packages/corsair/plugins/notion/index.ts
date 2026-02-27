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
	PageCreatedEvent,
	PageUpdatedEvent,
	VerificationEvent,
} from './webhooks/types';
import {
	Blocks,
	Databases,
	DatabasePages,
	Pages,
	Users,
} from './endpoints';
import { NotionSchema } from './schema';
import { NotionWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

export type NotionPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalNotionPlugin['hooks'];
	webhookHooks?: InternalNotionPlugin['webhookHooks'];
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
	verification: NotionWebhook<
		'verification',
		VerificationEvent
	>;
	pageCreated: NotionWebhook<
		'pageCreated',
		PageCreatedEvent
	>;
	pageUpdated: NotionWebhook<
		'pageUpdated',
		PageUpdatedEvent
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
		pageCreated: NotionWebhooks.pageCreated,
		pageUpdated: NotionWebhooks.pageUpdated,
	},
	verification: NotionWebhooks.verification,
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const notionAuthConfig = {
	api_key: {
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
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasSignature = 'x-notion-signature' in headers;
			return hasSignature;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: NotionKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalNotionPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	PageCreatedEvent,
	PageUpdatedEvent,
	NotionWebhookOutputs,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type { NotionEndpointOutputs } from './endpoints/types';
