import { DropboxFile, DropboxFolder } from './database';

export const DropboxSchema = {
	version: '1.0.0',
	entities: {
		files: DropboxFile,
		folders: DropboxFolder,
	},
} as const;
