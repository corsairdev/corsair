import {
	ApaleoPropertyEntity,
	ApaleoUnitAttributeEntity,
	ApaleoUnitEntity,
	ApaleoUnitGroupEntity,
} from './database';

export const ApaleoSchema = {
	version: '1.0.0',
	entities: {
		properties: ApaleoPropertyEntity,
		units: ApaleoUnitEntity,
		unitGroups: ApaleoUnitGroupEntity,
		unitAttributes: ApaleoUnitAttributeEntity,
	},
} as const;

export * from './database';
export * from './primitives';
