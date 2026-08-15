import { AsinDataApiCollection, AsinDataApiResultSet } from './database';

export const AsinDataApiSchema = {
	version: '1.0.0',
	entities: {
		collections: AsinDataApiCollection,
		resultSets: AsinDataApiResultSet,
	},
} as const;
