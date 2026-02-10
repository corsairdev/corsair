import * as Files from './files';
import * as Folders from './folders';
import * as Search from './search';
import * as SharedDrives from './sharedDrives';

export const FilesEndpoints = {
	list: Files.list,
	get: Files.get,
	createFromText: Files.createFromText,
	upload: Files.upload,
	update: Files.update,
	delete: Files.deleteFile,
	copy: Files.copy,
	move: Files.move,
	download: Files.download,
	share: Files.share,
};

export const FoldersEndpoints = {
	create: Folders.create,
	get: Folders.get,
	list: Folders.list,
	delete: Folders.deleteFolder,
	share: Folders.share,
};

export const SharedDrivesEndpoints = {
	create: SharedDrives.create,
	get: SharedDrives.get,
	list: SharedDrives.list,
	update: SharedDrives.update,
	delete: SharedDrives.deleteSharedDrive,
};

export const SearchEndpoints = {
	filesAndFolders: Search.filesAndFolders,
};

export * from './types';
