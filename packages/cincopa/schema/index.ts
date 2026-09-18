import { CincopaGallery } from './database';

export const CincopaSchema = {
	version: '1.0.0',
	entities: {
		galleries: CincopaGallery,
	},
} as const;

export * from './database';
