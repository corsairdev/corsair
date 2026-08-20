import { AeroLeadsProfile } from './database';

export const AeroLeadsSchema = {
	version: '1.0.0',
	entities: {
		profiles: AeroLeadsProfile,
	},
} as const;
