import { ApipieImageEntity, ApipieModelEntity } from './database';

export const ApipieSchema = {
	version: '1.0.0',
	entities: {
		models: ApipieModelEntity,
		images: ApipieImageEntity,
	},
} as const;
