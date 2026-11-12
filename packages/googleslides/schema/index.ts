import { GoogleSlidesPresentation } from './database';

export const GoogleSlidesSchema = {
	version: '1.0.0',
	entities: {
		presentations: GoogleSlidesPresentation,
	},
} as const;
