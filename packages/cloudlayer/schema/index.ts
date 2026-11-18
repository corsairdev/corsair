import { cloudlayerEntities } from './database';

export const CloudlayerSchema = {
	version: '1.0.0',
	entities: cloudlayerEntities,
} as const;
