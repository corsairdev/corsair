import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { getValidAccessToken } from './client';
import { Files, Folders, Search } from './endpoints';
import type {
	DropboxEndpointInputs,
	DropboxEndpointOutputs,
} from './endpoints/types';
import {
	DropboxEndpointInputSchemas,
	DropboxEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DropboxSchema } from './schema';
import { FileSystemWebhooks } from './webhooks';
import type {
	DropboxFileSystemChangedEvent,
	DropboxWebhookOutputs,
} from './webhooks/types';
import { DropboxFileSystemChangedEventSchema } from './webhooks/types';

export type DropboxEndpoints = {
	filesCopy: DropboxEndpoint<'filesCopy'>;
	filesDelete: DropboxEndpoint<'filesDelete'>;
	filesDownload: DropboxEndpoint<'filesDownload'>;
	filesMove: DropboxEndpoint<'filesMove'>;
	filesUpload: DropboxEndpoint<'filesUpload'>;
	foldersCopy: DropboxEndpoint<'foldersCopy'>;
	foldersCreate: DropboxEndpoint<'foldersCreate'>;
	foldersDelete: DropboxEndpoint<'foldersDelete'>;
	foldersList: DropboxEndpoint<'foldersList'>;
	foldersListContinue: DropboxEndpoint<'foldersListContinue'>;
	foldersMove: DropboxEndpoint<'foldersMove'>;
	searchQuery: DropboxEndpoint<'searchQuery'>;
};

const dropboxEndpointsNested = {
	files: {
		copy: Files.copy,
		delete: Files.delete,
		download: Files.download,
		move: Files.move,
		upload: Files.upload,
	},
	folders: {
		copy: Folders.copy,
		create: Folders.create,
		delete: Folders.delete,
		list: Folders.list,
		listContinue: Folders.listContinue,
		move: Folders.move,
	},
	search: {
		query: Search.query,
	},
} as const;

export type DropboxWebhooks = {
	fileSystemChanged: DropboxWebhook<
		'fileSystemChanged',
		DropboxFileSystemChangedEvent
	>;
};

const dropboxWebhooksNested = {
	filesystem: {
		changed: FileSystemWebhooks.changed,
	},
} as const;

export const dropboxEndpointSchemas = {
	'files.copy': {
		input: DropboxEndpointInputSchemas.filesCopy,
		output: DropboxEndpointOutputSchemas.filesCopy,
	},
	'files.delete': {
		input: DropboxEndpointInputSchemas.filesDelete,
		output: DropboxEndpointOutputSchemas.filesDelete,
	},
	'files.download': {
		input: DropboxEndpointInputSchemas.filesDownload,
		output: DropboxEndpointOutputSchemas.filesDownload,
	},
	'files.move': {
		input: DropboxEndpointInputSchemas.filesMove,
		output: DropboxEndpointOutputSchemas.filesMove,
	},
	'files.upload': {
		input: DropboxEndpointInputSchemas.filesUpload,
		output: DropboxEndpointOutputSchemas.filesUpload,
	},
	'folders.copy': {
		input: DropboxEndpointInputSchemas.foldersCopy,
		output: DropboxEndpointOutputSchemas.foldersCopy,
	},
	'folders.create': {
		input: DropboxEndpointInputSchemas.foldersCreate,
		output: DropboxEndpointOutputSchemas.foldersCreate,
	},
	'folders.delete': {
		input: DropboxEndpointInputSchemas.foldersDelete,
		output: DropboxEndpointOutputSchemas.foldersDelete,
	},
	'folders.list': {
		input: DropboxEndpointInputSchemas.foldersList,
		output: DropboxEndpointOutputSchemas.foldersList,
	},
	'folders.listContinue': {
		input: DropboxEndpointInputSchemas.foldersListContinue,
		output: DropboxEndpointOutputSchemas.foldersListContinue,
	},
	'folders.move': {
		input: DropboxEndpointInputSchemas.foldersMove,
		output: DropboxEndpointOutputSchemas.foldersMove,
	},
	'search.query': {
		input: DropboxEndpointInputSchemas.searchQuery,
		output: DropboxEndpointOutputSchemas.searchQuery,
	},
} as const;

const dropboxWebhookSchemas = {
	'filesystem.changed': {
		description:
			'A file or folder was added, modified, deleted, or a share link was created',
		payload: DropboxFileSystemChangedEventSchema,
		response: DropboxFileSystemChangedEventSchema,
	},
} as const;

const defaultAuthType = 'oauth_2' as const;

const dropboxEndpointMeta = {
	'files.copy': {
		riskLevel: 'write',
		description: 'Copy a file to a new location',
	},
	'files.delete': {
		riskLevel: 'destructive',
		description: 'Delete a file [DESTRUCTIVE]',
	},
	'files.download': { riskLevel: 'read', description: 'Download a file' },
	'files.move': {
		riskLevel: 'write',
		description: 'Move a file to a new location',
	},
	'files.upload': { riskLevel: 'write', description: 'Upload a file' },
	'folders.copy': {
		riskLevel: 'write',
		description: 'Copy a folder to a new location',
	},
	'folders.create': { riskLevel: 'write', description: 'Create a new folder' },
	'folders.delete': {
		riskLevel: 'destructive',
		description: 'Delete a folder and all its contents [DESTRUCTIVE]',
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'List files and folders within a folder',
	},
	'folders.listContinue': {
		riskLevel: 'read',
		description: 'Continue listing from a cursor returned by folders.list',
	},
	'folders.move': {
		riskLevel: 'write',
		description: 'Move a folder to a new location',
	},
	'search.query': {
		riskLevel: 'read',
		description: 'Search for files and folders by name or content',
	},
} satisfies RequiredPluginEndpointMeta<typeof dropboxEndpointsNested>;

export type DropboxPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalDropboxPlugin['hooks'];
	webhookHooks?: InternalDropboxPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Dropbox plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Dropbox endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof dropboxEndpointsNested>;
};

export type DropboxContext = CorsairPluginContext<
	typeof DropboxSchema,
	DropboxPluginOptions
>;

export type DropboxKeyBuilderContext = KeyBuilderContext<DropboxPluginOptions>;

export type DropboxBoundEndpoints = BindEndpoints<
	typeof dropboxEndpointsNested
>;

type DropboxEndpoint<K extends keyof DropboxEndpointOutputs> = CorsairEndpoint<
	DropboxContext,
	DropboxEndpointInputs[K],
	DropboxEndpointOutputs[K]
>;

type DropboxWebhook<
	K extends keyof DropboxWebhookOutputs,
	TEvent,
> = CorsairWebhook<DropboxContext, TEvent, DropboxWebhookOutputs[K]>;

export type DropboxBoundWebhooks = BindWebhooks<DropboxWebhooks>;

export type BaseDropboxPlugin<T extends DropboxPluginOptions> = CorsairPlugin<
	'dropbox',
	typeof DropboxSchema,
	typeof dropboxEndpointsNested,
	typeof dropboxWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDropboxPlugin = BaseDropboxPlugin<DropboxPluginOptions>;

export type ExternalDropboxPlugin<T extends DropboxPluginOptions> =
	BaseDropboxPlugin<T>;

export function dropbox<const T extends DropboxPluginOptions>(
	incomingOptions: DropboxPluginOptions & T = {} as DropboxPluginOptions & T,
): ExternalDropboxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dropbox',
		schema: DropboxSchema,
		options: options,
		// https://developers.dropbox.com/oauth-guide — authorize & token endpoints.
		// `token_access_type=offline` is required for Dropbox to return a refresh
		// token (this is the Dropbox-specific equivalent of Google's `access_type=offline`).
		oauthConfig: {
			providerName: 'Dropbox',
			authUrl: 'https://www.dropbox.com/oauth2/authorize',
			tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
			scopes: [
				'files.metadata.read',
				'files.metadata.write',
				'files.content.read',
				'files.content.write',
			],
			authParams: { token_access_type: 'offline' },
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: dropboxEndpointsNested,
		webhooks: dropboxWebhooksNested,
		endpointMeta: dropboxEndpointMeta,
		endpointSchemas: dropboxEndpointSchemas,
		webhookSchemas: dropboxWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-dropbox-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DropboxKeyBuilderContext, source) => {
			// Webhook signing uses the Dropbox app secret (= OAuth client_secret).
			// See https://www.dropbox.com/developers/reference/webhooks
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const creds = await ctx.keys.get_integration_credentials();
				return creds.client_secret ?? '';
			}

			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);

				if (!refreshToken) {
					throw new Error(
						'[corsair:dropbox] No refresh token found. Run `corsair auth --plugin=dropbox` to re-authenticate.',
					);
				}

				const creds = await ctx.keys.get_integration_credentials();
				if (!creds.client_id || !creds.client_secret) {
					throw new Error(
						'[corsair:dropbox] Missing client_id or client_secret. Run `corsair setup --dropbox` to configure credentials.',
					);
				}

				let result: Awaited<ReturnType<typeof getValidAccessToken>>;
				try {
					result = await getValidAccessToken({
						accessToken,
						expiresAt,
						refreshToken,
						clientId: creds.client_id,
						clientSecret: creds.client_secret,
					});
				} catch (error) {
					throw new Error(
						`[corsair:dropbox] Failed to obtain valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}

				if (result.refreshed) {
					try {
						await Promise.all([
							ctx.keys.set_access_token(result.accessToken),
							ctx.keys.set_expires_at(String(result.expiresAt)),
						]);
					} catch (error) {
						throw new Error(
							`[corsair:dropbox] Token was refreshed but failed to persist new credentials: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
				}

				// Expose a force-refresh function on the context so endpoints can
				// retry on 401 without waiting for `expires_at` to lapse.
				(ctx as Record<string, unknown>)._refreshAuth = async () => {
					const freshResult = await getValidAccessToken({
						accessToken: null,
						expiresAt: null,
						refreshToken,
						clientId: creds.client_id!,
						clientSecret: creds.client_secret!,
						forceRefresh: true,
					});
					await ctx.keys.set_access_token(freshResult.accessToken);
					await ctx.keys.set_expires_at(String(freshResult.expiresAt));
					return freshResult.accessToken;
				};

				return result.accessToken;
			}

			return '';
		},
	} satisfies InternalDropboxPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	DropboxFileSystemChangedEvent,
	DropboxWebhookOutputs,
	DropboxWebhookPayload,
} from './webhooks/types';

export { createDropboxEventMatch } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	DropboxEndpointInputs,
	DropboxEndpointOutputs,
} from './endpoints/types';
