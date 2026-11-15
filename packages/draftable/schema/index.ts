import { DraftableComparisonEntity } from './database';

export const DraftableSchema = {
	version: '1.0.0',
	entities: {
		comparisons: DraftableComparisonEntity,
	},
} as const;
