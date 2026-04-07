import {
	copy,
	deleteFile,
	download,
	get,
	search,
	share,
	upload,
} from './files';
import {
	create,
	deleteFolder,
	get as folderGet,
	search as folderSearch,
	share as folderShare,
	update,
} from './folders';

export const Files = {
	get,
	copy,
	delete: deleteFile,
	download,
	search,
	share,
	upload,
};

export const Folders = {
	get: folderGet,
	create,
	delete: deleteFolder,
	search: folderSearch,
	share: folderShare,
	update,
};

export * from './types';
