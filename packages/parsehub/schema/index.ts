import { ParsehubProjectEntity } from './database';

export const ParsehubSchema = {
	version: '1.0.0',
	entities: {
		projects: ParsehubProjectEntity,
	},
} as const;
