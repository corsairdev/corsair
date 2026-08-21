import { NextDNSProfileEntity } from './database';

export const NextDNSSchema = {
	version: '1.0.0',
	entities: {
		profiles: NextDNSProfileEntity,
	},
} as const;
