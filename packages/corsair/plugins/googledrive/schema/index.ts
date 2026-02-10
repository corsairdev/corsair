import {
	GoogleDriveFile,
	GoogleDriveFolder,
	GoogleDriveSharedDrive,
} from './database';

export const GoogleDriveSchema = {
	version: '1.0.0',
	entities: {
		files: GoogleDriveFile,
		folders: GoogleDriveFolder,
		sharedDrives: GoogleDriveSharedDrive,
	},
} as const;
