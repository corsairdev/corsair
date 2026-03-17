import { fileAdded, fileChanged, fileDeleted } from './files';
import { folderCreated, folderDeleted } from './folders';
import { shareLinkCreated } from './sharing';

export const FileWebhooks = {
	added: fileAdded,
	changed: fileChanged,
	deleted: fileDeleted,
};

export const FolderWebhooks = {
	created: folderCreated,
	deleted: folderDeleted,
};

export const SharingWebhooks = {
	linkCreated: shareLinkCreated,
};

export * from './types';
