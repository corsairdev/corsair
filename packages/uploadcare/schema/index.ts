import { UploadcareFile, UploadcareGroup } from './database';

export const UploadcareSchema = {
	version: '1.0.0',
	entities: {
		UploadcareFile,
		UploadcareGroup,
	},
} as const;
