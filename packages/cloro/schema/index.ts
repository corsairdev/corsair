import { CloroSnapshot } from './database';

export const CloroSchema = {
	version: '1.0.0',
	entities: {
		snapshots: CloroSnapshot,
	},
} as const;

export type { CloroSnapshot } from './database';
