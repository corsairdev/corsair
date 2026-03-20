import { BoxFile, BoxFolder } from './database';

export const BoxSchema = {
	version: '1.0.0',
	entities: {
		files: BoxFile,
		folders: BoxFolder,
	},
} as const;
