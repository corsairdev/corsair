import { CarboneCategory, CarboneTag, CarboneTemplate } from './database';

export const CarboneSchema = {
	version: '1.0.0',
	entities: {
		templates: CarboneTemplate,
		categories: CarboneCategory,
		tags: CarboneTag,
	},
} as const;

export * from './database';
