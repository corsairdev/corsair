import { createDatabase, deleteDatabase, listDatabases } from './example';

export const Databases = {
	list: listDatabases,
	create: createDatabase,
	delete: deleteDatabase,
};

export * from './types';
