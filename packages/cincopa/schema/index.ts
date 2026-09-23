import {
	CincopaAccount,
	CincopaAsset,
	CincopaGallery,
	CincopaUploadStatus,
} from './database';

export const CincopaSchema = {
	version: '1.0.0',
	entities: {
		galleries: CincopaGallery,
		assets: CincopaAsset,
		uploadStatus: CincopaUploadStatus,
		account: CincopaAccount,
	},
} as const;

export * from './database';
