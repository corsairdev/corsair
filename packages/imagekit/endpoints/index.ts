import {
	getPurgeStatus as cacheGetPurgeStatus,
	purge as cachePurge,
} from './cache';
import {
	getDetails as fileVersionsGetDetails,
	list as fileVersionsList,
	remove as fileVersionsRemove,
	restore as fileVersionsRestore,
} from './file-versions';
import {
	addTags as filesAddTags,
	bulkDelete as filesBulkDelete,
	copy as filesCopy,
	getDetails as filesGetDetails,
	list as filesList,
	move as filesMove,
	remove as filesRemove,
	removeAITags as filesRemoveAITags,
	removeTags as filesRemoveTags,
	rename as filesRename,
	updateDetails as filesUpdateDetails,
	upload as filesUpload,
} from './files';
import {
	copy as foldersCopy,
	create as foldersCreate,
	getJobStatus as foldersGetJobStatus,
	move as foldersMove,
	remove as foldersRemove,
	rename as foldersRename,
} from './folders';
import {
	getByFileId as metadataGetByFileId,
	getByUrl as metadataGetByUrl,
} from './metadata';

/** File operations. */
export const Files = {
	upload: filesUpload,
	list: filesList,
	getDetails: filesGetDetails,
	updateDetails: filesUpdateDetails,
	delete: filesRemove,
	bulkDelete: filesBulkDelete,
	copy: filesCopy,
	move: filesMove,
	rename: filesRename,
	addTags: filesAddTags,
	removeTags: filesRemoveTags,
	removeAITags: filesRemoveAITags,
};

/** File version operations. */
export const FileVersions = {
	list: fileVersionsList,
	getDetails: fileVersionsGetDetails,
	delete: fileVersionsRemove,
	restore: fileVersionsRestore,
};

/** Metadata operations. */
export const Metadata = {
	getByFileId: metadataGetByFileId,
	getByUrl: metadataGetByUrl,
};

/** Folder operations. */
export const Folders = {
	create: foldersCreate,
	delete: foldersRemove,
	copy: foldersCopy,
	move: foldersMove,
	rename: foldersRename,
	getJobStatus: foldersGetJobStatus,
};

/** CDN cache operations. */
export const Cache = {
	purge: cachePurge,
	getPurgeStatus: cacheGetPurgeStatus,
};

export * from './types';
