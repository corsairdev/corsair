import { RetailedProductSchema } from './database';

export const RetailedSchema = {
	version: '1.0.0',
	entities: {
		product: RetailedProductSchema,
	},
} as const;

export * from './database';
