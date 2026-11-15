import { productboardEntities } from './database';

export const ProductboardSchema = {
	version: '1.0.0',
	entities: productboardEntities,
} as const;
