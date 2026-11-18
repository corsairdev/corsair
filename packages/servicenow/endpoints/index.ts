import * as Records from './records';
import * as Tables from './tables';

export const RecordsEndpoints = {
	list: Records.list,
	get: Records.get,
	create: Records.create,
	update: Records.update,
	delete: Records.remove,
};

export const TablesEndpoints = {
	list: Tables.list,
};

export * from './types';
