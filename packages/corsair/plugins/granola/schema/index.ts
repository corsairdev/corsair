import { GranolaNote } from './database';

export const GranolaSchema = {
	version: '1.0.0',
	entities: {
		notes: GranolaNote,
	},
} as const;
