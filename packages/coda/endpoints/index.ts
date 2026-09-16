import { insertRows, listDocs, listTables, whoami } from './handlers';

export const CodaActions = {
	whoami,
	listDocs,
	listTables,
	insertRows,
};

export * from './types';
