import {
	createDeal,
	deleteDeal,
	getDeal,
	listDeals,
	updateDeal,
} from './deals';

export const Deals = {
	list: listDeals,
	get: getDeal,
	create: createDeal,
	update: updateDeal,
	delete: deleteDeal,
};

export * from './types';
