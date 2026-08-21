import {
	ApipieImageEntity,
	ApipieModelDetailEntity,
	ApipieModelEntity,
} from './database';

export const ApipieSchema = {
	version: '1.0.0',
	entities: {
		models: ApipieModelEntity,
		modelDetails: ApipieModelDetailEntity,
		images: ApipieImageEntity,
	},
} as const;
