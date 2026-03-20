import { fileSystemChanged } from './filesystem';

export const FileSystemWebhooks = {
	changed: fileSystemChanged,
};

export * from './types';
