import {
	accepted,
	created as collaborationCreated,
	updated as collaborationUpdated,
	rejected,
	removed,
} from './collaborations';
import {
	created as commentCreated,
	deleted as commentDeleted,
	updated as commentUpdated,
} from './comments';
import {
	copied as fileCopied,
	deleted as fileDeleted,
	downloaded as fileDownloaded,
	locked as fileLocked,
	moved as fileMoved,
	previewed as filePreviewed,
	renamed as fileRenamed,
	restored as fileRestored,
	trashed as fileTrashed,
	unlocked as fileUnlocked,
	uploaded as fileUploaded,
} from './files';
import {
	copied as folderCopied,
	created as folderCreated,
	deleted as folderDeleted,
	downloaded as folderDownloaded,
	moved as folderMoved,
	renamed as folderRenamed,
	restored as folderRestored,
	trashed as folderTrashed,
} from './folders';
import {
	instanceCreated as metadataInstanceCreated,
	instanceDeleted as metadataInstanceDeleted,
	instanceUpdated as metadataInstanceUpdated,
} from './metadata';
import {
	created as sharedLinkCreated,
	deleted as sharedLinkDeleted,
	updated as sharedLinkUpdated,
} from './sharedlinks';

export const CollaborationWebhooks = {
	accepted,
	created: collaborationCreated,
	rejected,
	removed,
	updated: collaborationUpdated,
};

export const CommentWebhooks = {
	created: commentCreated,
	deleted: commentDeleted,
	updated: commentUpdated,
};

export const FileWebhooks = {
	copied: fileCopied,
	deleted: fileDeleted,
	downloaded: fileDownloaded,
	locked: fileLocked,
	moved: fileMoved,
	previewed: filePreviewed,
	renamed: fileRenamed,
	restored: fileRestored,
	trashed: fileTrashed,
	unlocked: fileUnlocked,
	uploaded: fileUploaded,
};

export const FolderWebhooks = {
	copied: folderCopied,
	created: folderCreated,
	deleted: folderDeleted,
	downloaded: folderDownloaded,
	moved: folderMoved,
	renamed: folderRenamed,
	restored: folderRestored,
	trashed: folderTrashed,
};

export const MetadataWebhooks = {
	instanceCreated: metadataInstanceCreated,
	instanceDeleted: metadataInstanceDeleted,
	instanceUpdated: metadataInstanceUpdated,
};

export const SharedLinkWebhooks = {
	created: sharedLinkCreated,
	deleted: sharedLinkDeleted,
	updated: sharedLinkUpdated,
};

export * from './types';
