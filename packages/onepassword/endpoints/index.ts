import {
	create as itemsCreate,
	deleteItem as itemsDelete,
	get as itemsGet,
	list as itemsList,
	update as itemsUpdate,
} from './items';
import { get as vaultsGet, list as vaultsList } from './vaults';

export const Vaults = {
	get: vaultsGet,
	list: vaultsList,
};

export const Items = {
	get: itemsGet,
	list: itemsList,
	create: itemsCreate,
	update: itemsUpdate,
	delete: itemsDelete,
};

export * from './types';
