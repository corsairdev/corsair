import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { Blocks, DatabasePages, Databases, Pages, Users } from './endpoints';
import type {
	NotionEndpointInputs,
	NotionEndpointOutputs,
} from './endpoints/types';
import {
	NotionEndpointInputSchemas,
	NotionEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NotionSchema } from './schema';
import { NotionWebhooks } from './webhooks';
import type {
	NotionWebhookOutputs,
	PageCreatedEvent,
	PageUpdatedEvent,
	VerificationEvent,
} from './webhooks/types';
import {
	NotionVerificationPayloadSchema,
	PageCreatedEventSchema,
	PageUpdatedEventSchema,
	VerificationEventSchema,
} from './webhooks/types';

export type NotionPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalNotionPlugin['hooks'];
	webhookHooks?: InternalNotionPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Notion plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Notion endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof notionEndpointsNested>;
};

export type NotionContext = CorsairPluginContext<
	typeof NotionSchema,
	NotionPluginOptions,
	undefined,
	typeof notionAuthConfig
>;

export type NotionKeyBuilderContext = KeyBuilderContext<
	NotionPluginOptions,
	typeof notionAuthConfig
>;

export type NotionBoundEndpoints = BindEndpoints<typeof notionEndpointsNested>;

type NotionEndpoint<K extends keyof NotionEndpointOutputs> = CorsairEndpoint<
	NotionContext,
	NotionEndpointInputs[K],
	NotionEndpointOutputs[K]
>;

export type NotionEndpoints = {
	blocksAppendBlock: NotionEndpoint<'blocksAppendBlock'>;
	blocksGetManyChildBlocks: NotionEndpoint<'blocksGetManyChildBlocks'>;
	databasesGetDatabase: NotionEndpoint<'databasesGetDatabase'>;
	databasesGetManyDatabases: NotionEndpoint<'databasesGetManyDatabases'>;
	databasesSearchDatabase: NotionEndpoint<'databasesSearchDatabase'>;
	databasePagesCreateDatabasePage: NotionEndpoint<'databasePagesCreateDatabasePage'>;
	databasePagesGetDatabasePage: NotionEndpoint<'databasePagesGetDatabasePage'>;
	databasePagesGetManyDatabasePages: NotionEndpoint<'databasePagesGetManyDatabasePages'>;
	databasePagesUpdateDatabasePage: NotionEndpoint<'databasePagesUpdateDatabasePage'>;
	pagesArchivePage: NotionEndpoint<'pagesArchivePage'>;
	pagesCreatePage: NotionEndpoint<'pagesCreatePage'>;
	pagesSearchPage: NotionEndpoint<'pagesSearchPage'>;
	usersGetUser: NotionEndpoint<'usersGetUser'>;
	usersGetManyUsers: NotionEndpoint<'usersGetManyUsers'>;
};

type NotionWebhook<
	K extends keyof NotionWebhookOutputs,
	TEvent,
> = CorsairWebhook<NotionContext, TEvent, NotionWebhookOutputs[K]>;

export type NotionWebhooks = {
	verification: NotionWebhook<'verification', VerificationEvent>;
	pageCreated: NotionWebhook<'pageCreated', PageCreatedEvent>;
	pageUpdated: NotionWebhook<'pageUpdated', PageUpdatedEvent>;
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

/**
 * Risk-level metadata for each Notion endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const notionEndpointMeta = {
	'blocks.appendBlock': {
		riskLevel: 'write',
		description: 'Append new blocks to a block or page',
	},
	'blocks.getManyChildBlocks': {
		riskLevel: 'read',
		description: 'Retrieve child blocks of a block or page',
	},
	'databases.getDatabase': {
		riskLevel: 'read',
		description: 'Get info about a database',
	},
	'databases.getManyDatabases': {
		riskLevel: 'read',
		description: 'List databases accessible to the integration',
	},
	'databases.searchDatabase': {
		riskLevel: 'read',
		description: 'Search and filter databases',
	},
	'databasePages.createDatabasePage': {
		riskLevel: 'write',
		description: 'Create a new page in a database',
	},
	'databasePages.getDatabasePage': {
		riskLevel: 'read',
		description: 'Get a page from a database',
	},
	'databasePages.getManyDatabasePages': {
		riskLevel: 'read',
		description: 'List and filter pages in a database',
	},
	'databasePages.updateDatabasePage': {
		riskLevel: 'write',
		description: 'Update properties of a database page',
	},
	'pages.archivePage': {
		riskLevel: 'destructive',
		description: 'Archive (trash) a page [DESTRUCTIVE]',
	},
	'pages.createPage': {
		riskLevel: 'write',
		description: 'Create a new page',
	},
	'pages.searchPage': {
		riskLevel: 'read',
		description: 'Search pages and databases by title',
	},
	'users.getUser': {
		riskLevel: 'read',
		description: 'Get info about a user',
	},
	'users.getManyUsers': {
		riskLevel: 'read',
		description: 'List all users in the workspace',
	},
} satisfies RequiredPluginEndpointMeta<typeof notionEndpointsNested>;

const notionEndpointSchemas = {
	'blocks.appendBlock': {
		input: NotionEndpointInputSchemas.blocksAppendBlock,
		output: NotionEndpointOutputSchemas.blocksAppendBlock,
	},
	'blocks.getManyChildBlocks': {
		input: NotionEndpointInputSchemas.blocksGetManyChildBlocks,
		output: NotionEndpointOutputSchemas.blocksGetManyChildBlocks,
	},
	'databases.getDatabase': {
		input: NotionEndpointInputSchemas.databasesGetDatabase,
		output: NotionEndpointOutputSchemas.databasesGetDatabase,
	},
	'databases.getManyDatabases': {
		input: NotionEndpointInputSchemas.databasesGetManyDatabases,
		output: NotionEndpointOutputSchemas.databasesGetManyDatabases,
	},
	'databases.searchDatabase': {
		input: NotionEndpointInputSchemas.databasesSearchDatabase,
		output: NotionEndpointOutputSchemas.databasesSearchDatabase,
	},
	'databasePages.createDatabasePage': {
		input: NotionEndpointInputSchemas.databasePagesCreateDatabasePage,
		output: NotionEndpointOutputSchemas.databasePagesCreateDatabasePage,
	},
	'databasePages.getDatabasePage': {
		input: NotionEndpointInputSchemas.databasePagesGetDatabasePage,
		output: NotionEndpointOutputSchemas.databasePagesGetDatabasePage,
	},
	'databasePages.getManyDatabasePages': {
		input: NotionEndpointInputSchemas.databasePagesGetManyDatabasePages,
		output: NotionEndpointOutputSchemas.databasePagesGetManyDatabasePages,
	},
	'databasePages.updateDatabasePage': {
		input: NotionEndpointInputSchemas.databasePagesUpdateDatabasePage,
		output: NotionEndpointOutputSchemas.databasePagesUpdateDatabasePage,
	},
	'pages.archivePage': {
		input: NotionEndpointInputSchemas.pagesArchivePage,
		output: NotionEndpointOutputSchemas.pagesArchivePage,
	},
	'pages.createPage': {
		input: NotionEndpointInputSchemas.pagesCreatePage,
		output: NotionEndpointOutputSchemas.pagesCreatePage,
	},
	'pages.searchPage': {
		input: NotionEndpointInputSchemas.pagesSearchPage,
		output: NotionEndpointOutputSchemas.pagesSearchPage,
	},
	'users.getUser': {
		input: NotionEndpointInputSchemas.usersGetUser,
		output: NotionEndpointOutputSchemas.usersGetUser,
	},
	'users.getManyUsers': {
		input: NotionEndpointInputSchemas.usersGetManyUsers,
		output: NotionEndpointOutputSchemas.usersGetManyUsers,
	},
} as const;

const notionWebhookSchemas = {
	verification: {
		description:
			'Notion URL verification — respond to confirm the webhook endpoint',
		payload: NotionVerificationPayloadSchema,
		response: VerificationEventSchema,
	},
	'databasePages.pageCreated': {
		description: 'A page was created in a database',
		payload: PageCreatedEventSchema,
		response: PageCreatedEventSchema,
	},
	'databasePages.pageUpdated': {
		description: 'A page was updated in a database',
		payload: PageUpdatedEventSchema,
		response: PageUpdatedEventSchema,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const notionAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type BaseNotionPlugin<T extends NotionPluginOptions> = CorsairPlugin<
	'notion',
	typeof NotionSchema,
	typeof notionEndpointsNested,
	typeof notionWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof notionAuthConfig
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
	// Default to an empty object cast to the expected options type because all fields
	// in NotionPluginOptions are optional, making {} a valid runtime value even though
	// TypeScript cannot narrow the generic T from an untyped literal
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
		authConfig: notionAuthConfig,
		endpointMeta: notionEndpointMeta,
		endpointSchemas: notionEndpointSchemas,
		webhookSchemas: notionWebhookSchemas,
		oauthConfig: {
			providerName: 'Notion',
			authUrl: 'https://api.notion.com/v1/oauth/authorize',
			tokenUrl: 'https://api.notion.com/v1/oauth/token',
			scopes: [], // Notion OAuth does not use traditional OAuth scopes; access level is determined by workspace permissions
			tokenAuthMethod: 'basic',
			requiresRegisteredRedirect: true,
		},
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

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const accessToken = await ctx.keys.get_access_token();

				if (!accessToken) {
					return '';
				}

				return accessToken;
			}

			return '';
		},
	} satisfies InternalNotionPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	NotionWebhookOutputs,
	PageCreatedEvent,
	PageUpdatedEvent,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	NotionEndpointInputs,
	NotionEndpointOutputs,
} from './endpoints/types';
