import { EcologiImpactEntity, EcologiTotalEntity } from './database';

export const EcologiSchema = {
	version: '1.0.0',
	entities: {
		trees: EcologiTotalEntity,
		carbonOffsets: EcologiTotalEntity,
		carbonRemovals: EcologiTotalEntity,
		habitats: EcologiTotalEntity,
		impacts: EcologiImpactEntity,
	},
} as const;
