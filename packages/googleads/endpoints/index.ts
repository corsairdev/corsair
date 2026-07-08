import * as Campaigns from './campaigns';
import * as CustomerLists from './customer-lists';

export const CampaignsEndpoints = {
	getById: Campaigns.getById,
	getByName: Campaigns.getByName,
};

export const CustomerListsEndpoints = {
	getMany: CustomerLists.getMany,
	create: CustomerLists.create,
	addOrRemove: CustomerLists.addOrRemove,
};

export * from './types';
