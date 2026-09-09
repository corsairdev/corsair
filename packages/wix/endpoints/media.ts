import { defineOp } from './factory';

export const generateFileUploadUrl = defineOp('generateFileUploadUrl');
export const generateFilesDownloadUrl = defineOp('generateFilesDownloadUrl');
export const importFile = defineOp('importFileToMedia');

export const MediaEndpoints = {
	generateFileUploadUrl,
	generateFilesDownloadUrl,
	importFile,
} as const;
