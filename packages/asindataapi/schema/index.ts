import {
	AsinDataApiCollection,
	AsinDataApiCollectionRequest,
	AsinDataApiDestination,
	AsinDataApiResultSet,
} from './database';

export const AsinDataApiSchema = {
	version: '1.0.0',
	entities: {
		collections: AsinDataApiCollection,
		destinations: AsinDataApiDestination,
		requests: AsinDataApiCollectionRequest,
		resultSets: AsinDataApiResultSet,
	},
} as const;
