import { fileComment } from './file-comment';
import { fileDelete } from './file-delete';
import { fileUpdate } from './file-update';
import { fileVersionUpdate } from './file-version-update';
import { libraryPublish } from './library-publish';
import { ping } from './ping';

export const FileCommentWebhooks = {
	fileComment,
};

export const FileUpdateWebhooks = {
	fileUpdate,
};

export const FileDeleteWebhooks = {
	fileDelete,
};

export const FileVersionUpdateWebhooks = {
	fileVersionUpdate,
};

export const LibraryPublishWebhooks = {
	libraryPublish,
};

export const PingWebhooks = {
	ping,
};

export * from './types';
