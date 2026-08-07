import { AltTextAiImageRecord } from './database';

export const AltTextAiSchema = {
	version: '1.0.0',
	entities: {
		images: AltTextAiImageRecord,
	},
} as const;
