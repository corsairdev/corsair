import { PlateRecognizerUsageEntity } from './database';

export const PlateRecognizerSchema = {
	version: '1.0.0',
	entities: {
		usage: PlateRecognizerUsageEntity,
	},
} as const;
