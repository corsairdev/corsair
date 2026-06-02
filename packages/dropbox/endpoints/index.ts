import {
	deleteFile,
	download,
	copy as filesCopy,
	move as filesMove,
	upload,
} from './files';
import {
	create,
	deleteFolder,
	copy as foldersCopy,
	move as foldersMove,
	list,
	listContinue,
} from './folders';
import { query } from './search';

export const Files = {
	copy: filesCopy,
	delete: deleteFile,
	download,
	move: filesMove,
	upload,
};

export const Folders = {
	copy: foldersCopy,
	create,
	delete: deleteFolder,
	list,
	listContinue,
	move: foldersMove,
};

export const Search = {
	query,
};

export * from './types';
