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
import { Files, Folders } from './endpoints';
import type { BoxEndpointInputs, BoxEndpointOutputs } from './endpoints/types';
import {
	BoxEndpointInputSchemas,
	BoxEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BoxSchema } from './schema';
import {
	CollaborationWebhooks,
	CommentWebhooks,
	FileWebhooks,
	FolderWebhooks,
	MetadataWebhooks,
	SharedLinkWebhooks,
} from './webhooks';
import type { BoxWebhookOutputs, BoxWebhookPayload } from './webhooks/types';
import {
	CollaborationAcceptedPayloadSchema,
	CollaborationCreatedPayloadSchema,
	CollaborationRejectedPayloadSchema,
	CollaborationRemovedPayloadSchema,
	CollaborationUpdatedPayloadSchema,
	CommentCreatedPayloadSchema,
	CommentDeletedPayloadSchema,
	CommentUpdatedPayloadSchema,
	FileCopiedPayloadSchema,
	FileDeletedPayloadSchema,
	FileDownloadedPayloadSchema,
	FileLockedPayloadSchema,
	FileMovedPayloadSchema,
	FilePreviewedPayloadSchema,
	FileRenamedPayloadSchema,
	FileRestoredPayloadSchema,
	FileTrashedPayloadSchema,
	FileUnlockedPayloadSchema,
	FileUploadedPayloadSchema,
	FolderCopiedPayloadSchema,
	FolderCreatedPayloadSchema,
	FolderDeletedPayloadSchema,
	FolderDownloadedPayloadSchema,
	FolderMovedPayloadSchema,
	FolderRenamedPayloadSchema,
	FolderRestoredPayloadSchema,
	FolderTrashedPayloadSchema,
	MetadataInstanceCreatedPayloadSchema,
	MetadataInstanceDeletedPayloadSchema,
	MetadataInstanceUpdatedPayloadSchema,
	SharedLinkCreatedPayloadSchema,
	SharedLinkDeletedPayloadSchema,
	SharedLinkUpdatedPayloadSchema,
} from './webhooks/types';

export type BoxPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBoxPlugin['hooks'];
	webhookHooks?: InternalBoxPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Box plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Box endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof boxEndpointsNested>;
};

export type BoxContext = CorsairPluginContext<
	typeof BoxSchema,
	BoxPluginOptions
>;

export type BoxKeyBuilderContext = KeyBuilderContext<BoxPluginOptions>;

export type BoxBoundEndpoints = BindEndpoints<typeof boxEndpointsNested>;

type BoxEndpoint<K extends keyof BoxEndpointOutputs> = CorsairEndpoint<
	BoxContext,
	BoxEndpointInputs[K],
	BoxEndpointOutputs[K]
>;

export type BoxEndpoints = {
	filesGet: BoxEndpoint<'filesGet'>;
	filesCopy: BoxEndpoint<'filesCopy'>;
	filesDelete: BoxEndpoint<'filesDelete'>;
	filesDownload: BoxEndpoint<'filesDownload'>;
	filesSearch: BoxEndpoint<'filesSearch'>;
	filesShare: BoxEndpoint<'filesShare'>;
	filesUpload: BoxEndpoint<'filesUpload'>;
	foldersGet: BoxEndpoint<'foldersGet'>;
	foldersCreate: BoxEndpoint<'foldersCreate'>;
	foldersDelete: BoxEndpoint<'foldersDelete'>;
	foldersSearch: BoxEndpoint<'foldersSearch'>;
	foldersShare: BoxEndpoint<'foldersShare'>;
	foldersUpdate: BoxEndpoint<'foldersUpdate'>;
};

type BoxWebhook<K extends keyof BoxWebhookOutputs> = CorsairWebhook<
	BoxContext,
	BoxWebhookPayload,
	BoxWebhookOutputs[K]
>;

export type BoxWebhooks = {
	collaborationAccepted: BoxWebhook<'collaborationAccepted'>;
	collaborationCreated: BoxWebhook<'collaborationCreated'>;
	collaborationRejected: BoxWebhook<'collaborationRejected'>;
	collaborationRemoved: BoxWebhook<'collaborationRemoved'>;
	collaborationUpdated: BoxWebhook<'collaborationUpdated'>;
	commentCreated: BoxWebhook<'commentCreated'>;
	commentDeleted: BoxWebhook<'commentDeleted'>;
	commentUpdated: BoxWebhook<'commentUpdated'>;
	fileCopied: BoxWebhook<'fileCopied'>;
	fileDeleted: BoxWebhook<'fileDeleted'>;
	fileDownloaded: BoxWebhook<'fileDownloaded'>;
	fileLocked: BoxWebhook<'fileLocked'>;
	fileMoved: BoxWebhook<'fileMoved'>;
	filePreviewed: BoxWebhook<'filePreviewed'>;
	fileRenamed: BoxWebhook<'fileRenamed'>;
	fileRestored: BoxWebhook<'fileRestored'>;
	fileTrashed: BoxWebhook<'fileTrashed'>;
	fileUnlocked: BoxWebhook<'fileUnlocked'>;
	fileUploaded: BoxWebhook<'fileUploaded'>;
	folderCopied: BoxWebhook<'folderCopied'>;
	folderCreated: BoxWebhook<'folderCreated'>;
	folderDeleted: BoxWebhook<'folderDeleted'>;
	folderDownloaded: BoxWebhook<'folderDownloaded'>;
	folderMoved: BoxWebhook<'folderMoved'>;
	folderRenamed: BoxWebhook<'folderRenamed'>;
	folderRestored: BoxWebhook<'folderRestored'>;
	folderTrashed: BoxWebhook<'folderTrashed'>;
	metadataInstanceCreated: BoxWebhook<'metadataInstanceCreated'>;
	metadataInstanceDeleted: BoxWebhook<'metadataInstanceDeleted'>;
	metadataInstanceUpdated: BoxWebhook<'metadataInstanceUpdated'>;
	sharedLinkCreated: BoxWebhook<'sharedLinkCreated'>;
	sharedLinkDeleted: BoxWebhook<'sharedLinkDeleted'>;
	sharedLinkUpdated: BoxWebhook<'sharedLinkUpdated'>;
};

export type BoxBoundWebhooks = BindWebhooks<BoxWebhooks>;

const boxEndpointsNested = {
	files: {
		get: Files.get,
		copy: Files.copy,
		delete: Files.delete,
		download: Files.download,
		search: Files.search,
		share: Files.share,
		upload: Files.upload,
	},
	folders: {
		get: Folders.get,
		create: Folders.create,
		delete: Folders.delete,
		search: Folders.search,
		share: Folders.share,
		update: Folders.update,
	},
} as const;

const boxWebhooksNested = {
	collaborations: {
		accepted: CollaborationWebhooks.accepted,
		created: CollaborationWebhooks.created,
		rejected: CollaborationWebhooks.rejected,
		removed: CollaborationWebhooks.removed,
		updated: CollaborationWebhooks.updated,
	},
	comments: {
		created: CommentWebhooks.created,
		deleted: CommentWebhooks.deleted,
		updated: CommentWebhooks.updated,
	},
	files: {
		copied: FileWebhooks.copied,
		deleted: FileWebhooks.deleted,
		downloaded: FileWebhooks.downloaded,
		locked: FileWebhooks.locked,
		moved: FileWebhooks.moved,
		previewed: FileWebhooks.previewed,
		renamed: FileWebhooks.renamed,
		restored: FileWebhooks.restored,
		trashed: FileWebhooks.trashed,
		unlocked: FileWebhooks.unlocked,
		uploaded: FileWebhooks.uploaded,
	},
	folders: {
		copied: FolderWebhooks.copied,
		created: FolderWebhooks.created,
		deleted: FolderWebhooks.deleted,
		downloaded: FolderWebhooks.downloaded,
		moved: FolderWebhooks.moved,
		renamed: FolderWebhooks.renamed,
		restored: FolderWebhooks.restored,
		trashed: FolderWebhooks.trashed,
	},
	metadata: {
		instanceCreated: MetadataWebhooks.instanceCreated,
		instanceDeleted: MetadataWebhooks.instanceDeleted,
		instanceUpdated: MetadataWebhooks.instanceUpdated,
	},
	sharedLinks: {
		created: SharedLinkWebhooks.created,
		deleted: SharedLinkWebhooks.deleted,
		updated: SharedLinkWebhooks.updated,
	},
} as const;

export const boxEndpointSchemas = {
	'files.get': {
		input: BoxEndpointInputSchemas.filesGet,
		output: BoxEndpointOutputSchemas.filesGet,
	},
	'files.copy': {
		input: BoxEndpointInputSchemas.filesCopy,
		output: BoxEndpointOutputSchemas.filesCopy,
	},
	'files.delete': {
		input: BoxEndpointInputSchemas.filesDelete,
		output: BoxEndpointOutputSchemas.filesDelete,
	},
	'files.download': {
		input: BoxEndpointInputSchemas.filesDownload,
		output: BoxEndpointOutputSchemas.filesDownload,
	},
	'files.search': {
		input: BoxEndpointInputSchemas.filesSearch,
		output: BoxEndpointOutputSchemas.filesSearch,
	},
	'files.share': {
		input: BoxEndpointInputSchemas.filesShare,
		output: BoxEndpointOutputSchemas.filesShare,
	},
	'files.upload': {
		input: BoxEndpointInputSchemas.filesUpload,
		output: BoxEndpointOutputSchemas.filesUpload,
	},
	'folders.get': {
		input: BoxEndpointInputSchemas.foldersGet,
		output: BoxEndpointOutputSchemas.foldersGet,
	},
	'folders.create': {
		input: BoxEndpointInputSchemas.foldersCreate,
		output: BoxEndpointOutputSchemas.foldersCreate,
	},
	'folders.delete': {
		input: BoxEndpointInputSchemas.foldersDelete,
		output: BoxEndpointOutputSchemas.foldersDelete,
	},
	'folders.search': {
		input: BoxEndpointInputSchemas.foldersSearch,
		output: BoxEndpointOutputSchemas.foldersSearch,
	},
	'folders.share': {
		input: BoxEndpointInputSchemas.foldersShare,
		output: BoxEndpointOutputSchemas.foldersShare,
	},
	'folders.update': {
		input: BoxEndpointInputSchemas.foldersUpdate,
		output: BoxEndpointOutputSchemas.foldersUpdate,
	},
} as const;

const boxEndpointMeta = {
	'files.get': {
		riskLevel: 'read',
		description: 'Get metadata for a Box file by ID',
	},
	'files.copy': {
		riskLevel: 'write',
		description: 'Copy a Box file to a destination folder',
	},
	'files.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Box file [DESTRUCTIVE]',
	},
	'files.download': {
		riskLevel: 'read',
		description: 'Download the content of a Box file',
	},
	'files.search': {
		riskLevel: 'read',
		description: 'Search for files in Box',
	},
	'files.share': {
		riskLevel: 'write',
		description: 'Create or update a shared link for a Box file',
	},
	'files.upload': {
		riskLevel: 'write',
		description: 'Upload a new file to Box',
	},
	'folders.get': {
		riskLevel: 'read',
		description: 'Get metadata for a Box folder by ID',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a new folder in Box',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Box folder [DESTRUCTIVE]',
	},
	'folders.search': {
		riskLevel: 'read',
		description: 'Search for folders in Box',
	},
	'folders.share': {
		riskLevel: 'write',
		description: 'Create or update a shared link for a Box folder',
	},
	'folders.update': {
		riskLevel: 'write',
		description: 'Update properties of a Box folder',
	},
} satisfies RequiredPluginEndpointMeta<typeof boxEndpointsNested>;

const boxWebhookSchemas = {
	'collaborations.accepted': {
		description: 'A collaboration invitation was accepted',
		payload: CollaborationAcceptedPayloadSchema,
		response: CollaborationAcceptedPayloadSchema,
	},
	'collaborations.created': {
		description: 'A new collaboration was created',
		payload: CollaborationCreatedPayloadSchema,
		response: CollaborationCreatedPayloadSchema,
	},
	'collaborations.rejected': {
		description: 'A collaboration invitation was rejected',
		payload: CollaborationRejectedPayloadSchema,
		response: CollaborationRejectedPayloadSchema,
	},
	'collaborations.removed': {
		description: 'A collaboration was removed',
		payload: CollaborationRemovedPayloadSchema,
		response: CollaborationRemovedPayloadSchema,
	},
	'collaborations.updated': {
		description: 'A collaboration was updated',
		payload: CollaborationUpdatedPayloadSchema,
		response: CollaborationUpdatedPayloadSchema,
	},
	'comments.created': {
		description: 'A comment was created on a file',
		payload: CommentCreatedPayloadSchema,
		response: CommentCreatedPayloadSchema,
	},
	'comments.deleted': {
		description: 'A comment was deleted',
		payload: CommentDeletedPayloadSchema,
		response: CommentDeletedPayloadSchema,
	},
	'comments.updated': {
		description: 'A comment was updated',
		payload: CommentUpdatedPayloadSchema,
		response: CommentUpdatedPayloadSchema,
	},
	'files.copied': {
		description: 'A file was copied to another location',
		payload: FileCopiedPayloadSchema,
		response: FileCopiedPayloadSchema,
	},
	'files.deleted': {
		description: 'A file was permanently deleted',
		payload: FileDeletedPayloadSchema,
		response: FileDeletedPayloadSchema,
	},
	'files.downloaded': {
		description: 'A file was downloaded',
		payload: FileDownloadedPayloadSchema,
		response: FileDownloadedPayloadSchema,
	},
	'files.locked': {
		description: 'A file was locked',
		payload: FileLockedPayloadSchema,
		response: FileLockedPayloadSchema,
	},
	'files.moved': {
		description: 'A file was moved to another folder',
		payload: FileMovedPayloadSchema,
		response: FileMovedPayloadSchema,
	},
	'files.previewed': {
		description: 'A file was previewed',
		payload: FilePreviewedPayloadSchema,
		response: FilePreviewedPayloadSchema,
	},
	'files.renamed': {
		description: 'A file was renamed',
		payload: FileRenamedPayloadSchema,
		response: FileRenamedPayloadSchema,
	},
	'files.restored': {
		description: 'A file was restored from trash',
		payload: FileRestoredPayloadSchema,
		response: FileRestoredPayloadSchema,
	},
	'files.trashed': {
		description: 'A file was moved to trash',
		payload: FileTrashedPayloadSchema,
		response: FileTrashedPayloadSchema,
	},
	'files.unlocked': {
		description: 'A file lock was removed',
		payload: FileUnlockedPayloadSchema,
		response: FileUnlockedPayloadSchema,
	},
	'files.uploaded': {
		description: 'A new file was uploaded',
		payload: FileUploadedPayloadSchema,
		response: FileUploadedPayloadSchema,
	},
	'folders.copied': {
		description: 'A folder was copied to another location',
		payload: FolderCopiedPayloadSchema,
		response: FolderCopiedPayloadSchema,
	},
	'folders.created': {
		description: 'A new folder was created',
		payload: FolderCreatedPayloadSchema,
		response: FolderCreatedPayloadSchema,
	},
	'folders.deleted': {
		description: 'A folder was permanently deleted',
		payload: FolderDeletedPayloadSchema,
		response: FolderDeletedPayloadSchema,
	},
	'folders.downloaded': {
		description: 'A folder was downloaded',
		payload: FolderDownloadedPayloadSchema,
		response: FolderDownloadedPayloadSchema,
	},
	'folders.moved': {
		description: 'A folder was moved to another location',
		payload: FolderMovedPayloadSchema,
		response: FolderMovedPayloadSchema,
	},
	'folders.renamed': {
		description: 'A folder was renamed',
		payload: FolderRenamedPayloadSchema,
		response: FolderRenamedPayloadSchema,
	},
	'folders.restored': {
		description: 'A folder was restored from trash',
		payload: FolderRestoredPayloadSchema,
		response: FolderRestoredPayloadSchema,
	},
	'folders.trashed': {
		description: 'A folder was moved to trash',
		payload: FolderTrashedPayloadSchema,
		response: FolderTrashedPayloadSchema,
	},
	'metadata.instanceCreated': {
		description: 'A metadata instance was created on a file or folder',
		payload: MetadataInstanceCreatedPayloadSchema,
		response: MetadataInstanceCreatedPayloadSchema,
	},
	'metadata.instanceDeleted': {
		description: 'A metadata instance was deleted',
		payload: MetadataInstanceDeletedPayloadSchema,
		response: MetadataInstanceDeletedPayloadSchema,
	},
	'metadata.instanceUpdated': {
		description: 'A metadata instance was updated',
		payload: MetadataInstanceUpdatedPayloadSchema,
		response: MetadataInstanceUpdatedPayloadSchema,
	},
	'sharedLinks.created': {
		description: 'A shared link was created for a file or folder',
		payload: SharedLinkCreatedPayloadSchema,
		response: SharedLinkCreatedPayloadSchema,
	},
	'sharedLinks.deleted': {
		description: 'A shared link was removed',
		payload: SharedLinkDeletedPayloadSchema,
		response: SharedLinkDeletedPayloadSchema,
	},
	'sharedLinks.updated': {
		description: 'A shared link settings were updated',
		payload: SharedLinkUpdatedPayloadSchema,
		response: SharedLinkUpdatedPayloadSchema,
	},
} as const;

const defaultAuthType = 'oauth_2' as const;

export const boxAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBoxPlugin<T extends BoxPluginOptions> = CorsairPlugin<
	'box',
	typeof BoxSchema,
	typeof boxEndpointsNested,
	typeof boxWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBoxPlugin = BaseBoxPlugin<BoxPluginOptions>;

export type ExternalBoxPlugin<T extends BoxPluginOptions> = BaseBoxPlugin<T>;

export function box<const T extends BoxPluginOptions>(
	incomingOptions: BoxPluginOptions & T = {} as BoxPluginOptions & T,
): ExternalBoxPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'box',
		schema: BoxSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: boxEndpointsNested,
		webhooks: boxWebhooksNested,
		endpointMeta: boxEndpointMeta,
		endpointSchemas: boxEndpointSchemas,
		webhookSchemas: boxWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasTimestamp = 'box-delivery-timestamp' in headers;
			return hasTimestamp;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BoxKeyBuilderContext, source) => {
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

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					return '';
				}
				return res;
			}

			return '';
		},
	} satisfies InternalBoxPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	BoxWebhookOutputs,
	BoxWebhookPayload,
	CollaborationAcceptedEvent,
	CollaborationCreatedEvent,
	CollaborationRejectedEvent,
	CollaborationRemovedEvent,
	CollaborationUpdatedEvent,
	CommentCreatedEvent,
	CommentDeletedEvent,
	CommentUpdatedEvent,
	FileCopiedEvent,
	FileDeletedEvent,
	FileDownloadedEvent,
	FileLockedEvent,
	FileMovedEvent,
	FilePreviewedEvent,
	FileRenamedEvent,
	FileRestoredEvent,
	FileTrashedEvent,
	FileUnlockedEvent,
	FileUploadedEvent,
	FolderCopiedEvent,
	FolderCreatedEvent,
	FolderDeletedEvent,
	FolderDownloadedEvent,
	FolderMovedEvent,
	FolderRenamedEvent,
	FolderRestoredEvent,
	FolderTrashedEvent,
	MetadataInstanceCreatedEvent,
	MetadataInstanceDeletedEvent,
	MetadataInstanceUpdatedEvent,
	SharedLinkCreatedEvent,
	SharedLinkDeletedEvent,
	SharedLinkUpdatedEvent,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	BoxEndpointInputs,
	BoxEndpointOutputs,
	FilesCopyInput,
	FilesCopyResponse,
	FilesDeleteInput,
	FilesDeleteResponse,
	FilesDownloadInput,
	FilesDownloadResponse,
	FilesGetInput,
	FilesGetResponse,
	FilesSearchInput,
	FilesSearchResponse,
	FilesShareInput,
	FilesShareResponse,
	FilesUploadInput,
	FilesUploadResponse,
	FoldersCreateInput,
	FoldersCreateResponse,
	FoldersDeleteInput,
	FoldersDeleteResponse,
	FoldersGetInput,
	FoldersGetResponse,
	FoldersSearchInput,
	FoldersSearchResponse,
	FoldersShareInput,
	FoldersShareResponse,
	FoldersUpdateInput,
	FoldersUpdateResponse,
} from './endpoints/types';
