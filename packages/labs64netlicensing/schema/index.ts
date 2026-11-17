import {
	NetLicensingLicenseEntity,
	NetLicensingProductEntity,
} from './database';

export const NetLicensingSchema = {
	version: '1.0.0',
	entities: {
		licenses: NetLicensingLicenseEntity,
		products: NetLicensingProductEntity,
	},
} as const;
