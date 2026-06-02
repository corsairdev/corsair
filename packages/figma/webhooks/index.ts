import { fileComment } from './fileComment';
import { fileDelete } from './fileDelete';
import { fileUpdate } from './fileUpdate';
import { fileVersionUpdate } from './fileVersionUpdate';
import { libraryPublish } from './libraryPublish';
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
