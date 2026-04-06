import { OnedriveDriveItem, OnedriveDrive } from './database';

export const OnedriveSchema = {
	version: '1.0.0',
	entities: {
		driveItems: OnedriveDriveItem,
		drives: OnedriveDrive,
	},
} as const;
