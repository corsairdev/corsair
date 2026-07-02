import { get as vaultsGet, list as vaultsList } from './vaults';
import {
	get as itemsGet,
	list as itemsList,
	create as itemsCreate,
	update as itemsUpdate,
	deleteItem as itemsDelete,
} from './items';

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
