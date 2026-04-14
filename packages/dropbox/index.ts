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
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
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

const defaultAuthType = 'api_key' as const;

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

export const dropboxAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type DropboxPluginOptions = {
	authType?: PickAuth<'api_key'>;
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
