import { EchtpostTemplateEntity } from './database';

export const EchtpostSchema = {
	version: '1.0.0',
	entities: {
		templates: EchtpostTemplateEntity,
	},
} as const;
