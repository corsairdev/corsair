import { FixerRateSnapshotEntity } from './database';

export const FixerSchema = {
	version: '1.0.0',
	entities: {
		rates: FixerRateSnapshotEntity,
	},
} as const;

export type { FixerRateSnapshotEntity } from './database';
