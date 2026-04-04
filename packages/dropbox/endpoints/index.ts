import { copy as filesCopy, deleteFile, download, move as filesMove, upload } from './files';
import {
	copy as foldersCopy,
	create,
	deleteFolder,
	list,
	listContinue,
	move as foldersMove,
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
