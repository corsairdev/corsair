import { AlgoliaIndex, AlgoliaRecord, AlgoliaTask } from './database';

export const AlgoliaSchema = {
	version: '1.0.0',
	entities: {
		indices: AlgoliaIndex,
		records: AlgoliaRecord,
		tasks: AlgoliaTask,
	},
} as const;
