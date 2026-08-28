import { insertRows, listDocs, listTables, whoami } from './example';

export const CodaActions = {
	whoami,
	listDocs,
	listTables,
	insertRows,
};

export * from './types';
