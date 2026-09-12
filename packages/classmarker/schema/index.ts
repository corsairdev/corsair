import { ClassmarkerResult } from './database';

export const ClassmarkerSchema = {
	version: '1.0.0',
	entities: {
		results: ClassmarkerResult,
	},
} as const;
