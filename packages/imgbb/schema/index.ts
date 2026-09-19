import { ImgBBImage } from './database';

export const ImgBBSchema = {
	version: '1.0.0',
	entities: {
		images: ImgBBImage,
	},
} as const;

export * from './database';
