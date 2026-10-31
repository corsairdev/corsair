import {
	GoogleDriveFile,
	GoogleDriveFileContents,
	GoogleDriveFolder,
	GoogleDriveSharedDrive,
} from './database';

export const GoogleDriveSchema = {
	version: '1.0.0',
	entities: {
		files: GoogleDriveFile,
		fileContents: GoogleDriveFileContents,
		folders: GoogleDriveFolder,
		sharedDrives: GoogleDriveSharedDrive,
	},
} as const;
