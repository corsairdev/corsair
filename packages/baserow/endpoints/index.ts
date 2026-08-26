import { create, get, list, remove, update } from './rows';

export const Rows = {
	list,
	get,
	create,
	update,
	delete: remove,
};

export * from './types';
