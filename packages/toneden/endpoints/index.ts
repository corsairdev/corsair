import * as Attachments from './attachments';
import * as Campaigns from './campaigns';
import * as Links from './links';
import * as Playbooks from './playbooks';
import * as Users from './users';

export const LinksEndpoints = {
	list: Links.list,
	listForUser: Links.listForUser,
	get: Links.get,
	create: Links.create,
	update: Links.update,
	delete: Links.remove,
	expand: Links.expand,
	validPath: Links.validPath,
	insights: Links.insights,
	insightsOverview: Links.insightsOverview,
};

export const AttachmentsEndpoints = {
	list: Attachments.list,
	listForUser: Attachments.listForUser,
	get: Attachments.get,
	create: Attachments.create,
	update: Attachments.update,
	delete: Attachments.remove,
	entries: Attachments.entries,
	entriesTotals: Attachments.entriesTotals,
	unlocks: Attachments.unlocks,
	unlocksTotals: Attachments.unlocksTotals,
	unlockPlatforms: Attachments.unlockPlatforms,
};

export const CampaignsEndpoints = {
	list: Campaigns.list,
	get: Campaigns.get,
	create: Campaigns.create,
	update: Campaigns.update,
	delete: Campaigns.remove,
	insights: Campaigns.insights,
	creativeInsights: Campaigns.creativeInsights,
};

export const UserListsEndpoints = {
	list: Campaigns.listUserLists,
	create: Campaigns.createUserList,
	updateContacts: Campaigns.updateUserListContacts,
};

export const OfflineConversionsEndpoints = {
	upload: Campaigns.offlineConversions,
};

export const PlaybooksEndpoints = {
	get: Playbooks.get,
	create: Playbooks.create,
	update: Playbooks.update,
	delete: Playbooks.remove,
};

export const UsersEndpoints = {
	get: Users.get,
	update: Users.update,
};

export * from './types';
