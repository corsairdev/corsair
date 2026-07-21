import * as Account from './account';
import * as Campaigns from './campaigns';
import * as Interests from './interests';
import * as Lists from './lists';
import * as Members from './members';
import * as MergeFields from './merge-fields';
import * as Segments from './segments';
import * as Webhooks from './webhooks';

export const AccountEndpoints = {
	ping: Account.ping,
	root: Account.root,
};

export const ListsEndpoints = {
	list: Lists.list,
	get: Lists.get,
	create: Lists.create,
	update: Lists.update,
	remove: Lists.remove,
};

export const MembersEndpoints = {
	list: Members.list,
	get: Members.get,
	upsert: Members.upsert,
	add: Members.add,
	update: Members.update,
	archive: Members.archive,
	remove: Members.remove,
	search: Members.search,
	listTags: Members.listTags,
	updateTags: Members.updateTags,
};

export const SegmentsEndpoints = {
	list: Segments.list,
	get: Segments.get,
	create: Segments.create,
	update: Segments.update,
	remove: Segments.remove,
	listMembers: Segments.listMembers,
	addMember: Segments.addMember,
	removeMember: Segments.removeMember,
};

export const MergeFieldsEndpoints = {
	list: MergeFields.list,
	get: MergeFields.get,
	create: MergeFields.create,
	update: MergeFields.update,
	remove: MergeFields.remove,
};

export const InterestCategoriesEndpoints = {
	list: Interests.categoriesList,
	get: Interests.categoriesGet,
	create: Interests.categoriesCreate,
	update: Interests.categoriesUpdate,
	remove: Interests.categoriesRemove,
};

export const InterestsEndpoints = {
	list: Interests.interestsList,
	get: Interests.interestsGet,
	create: Interests.interestsCreate,
	update: Interests.interestsUpdate,
	remove: Interests.interestsRemove,
};

export const CampaignsEndpoints = {
	list: Campaigns.list,
	get: Campaigns.get,
	create: Campaigns.create,
	update: Campaigns.update,
	remove: Campaigns.remove,
	getContent: Campaigns.getContent,
	setContent: Campaigns.setContent,
	sendTest: Campaigns.sendTest,
	schedule: Campaigns.schedule,
	unschedule: Campaigns.unschedule,
	send: Campaigns.send,
};

export const WebhooksEndpoints = {
	list: Webhooks.list,
	get: Webhooks.get,
	create: Webhooks.create,
	update: Webhooks.update,
	remove: Webhooks.remove,
};

export * from './types';
