import * as Campaigns from './campaigns';
import * as Fields from './fields';
import * as Groups from './groups';
import * as Subscribers from './subscribers';

export { Campaigns, Fields, Groups, Subscribers };

export const SubscribersEndpoints = {
	list: Subscribers.list,
	get: Subscribers.get,
	upsert: Subscribers.upsert,
	update: Subscribers.update,
	delete: Subscribers.remove,
	addToGroup: Subscribers.addToGroup,
	removeFromGroup: Subscribers.removeFromGroup,
};

export const GroupsEndpoints = {
	list: Groups.list,
	create: Groups.create,
	delete: Groups.remove,
};

export const FieldsEndpoints = {
	list: Fields.list,
};

export const CampaignsEndpoints = {
	list: Campaigns.list,
	create: Campaigns.create,
	schedule: Campaigns.schedule,
	cancel: Campaigns.cancel,
	activity: Campaigns.activity,
};

export * from './types';
