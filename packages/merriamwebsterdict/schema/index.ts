import { MerriamWebsterDictEntryEntity } from './database';

export const MerriamWebsterDictSchema = {
	version: '1.0.0',
	entities: {
		entries: MerriamWebsterDictEntryEntity,
	},
} as const;

export type { MerriamWebsterDictEntryEntity } from './database';
