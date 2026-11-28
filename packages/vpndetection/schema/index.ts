import { VpndetectionLookupEntity } from './database';

export const VpndetectionSchema = {
	version: '1.0.0',
	entities: {
		lookups: VpndetectionLookupEntity,
	},
} as const;
