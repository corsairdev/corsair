import {
	AltovizClassificationEntity,
	AltovizContactEntity,
	AltovizCustomerEntity,
	AltovizCustomerFamilyEntity,
	AltovizProductEntity,
	AltovizProductFamilyEntity,
	AltovizUnitEntity,
	AltovizVatEntity,
} from './database';

export const AltovizSchema = {
	version: '1.0.0',
	entities: {
		units: AltovizUnitEntity,
		vats: AltovizVatEntity,
		classifications: AltovizClassificationEntity,
		customerFamilies: AltovizCustomerFamilyEntity,
		productFamilies: AltovizProductFamilyEntity,
		products: AltovizProductEntity,
		customers: AltovizCustomerEntity,
		contacts: AltovizContactEntity,
	},
} as const;

export * from './database';
export * from './primitives';
