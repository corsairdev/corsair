import { checkStatus } from './account';
import { optimizeUrl, preserveMetadata, sandboxUpload } from './image';

export const Account = {
	checkStatus,
};

export const Image = {
	optimizeUrl,
	preserveMetadata,
	sandboxUpload,
};

export * from './types';
