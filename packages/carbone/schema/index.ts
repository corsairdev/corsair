import { CarboneTemplate } from './database';

export const CarboneSchema = {
	version: '1.0.0',
	entities: {
		templates: CarboneTemplate,
	},
} as const;

export * from './database';
