import { SnapchatActionEntity } from './database';

export const SnapchatSchema = {
	version: '1.0.0',
	entities: {
		actions: SnapchatActionEntity,
	},
} as const;
