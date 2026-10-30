import { BoloformsDocument } from './database';

export const BoloformsSchema = {
	version: '1.0.0',
	entities: {
		documents: BoloformsDocument,
	},
} as const;

export * from './database';
