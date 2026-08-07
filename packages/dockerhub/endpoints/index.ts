import * as Images from './images';
import * as Organizations from './organizations';
import * as Repositories from './repositories';
import * as Tags from './tags';
import * as Teams from './teams';
import * as Webhooks from './webhooks';

export const RepositoriesEndpoints = {
	list: Repositories.list,
	get: Repositories.get,
	create: Repositories.create,
	delete: Repositories.deleteRepository,
} as const;

export const TagsEndpoints = {
	list: Tags.list,
	get: Tags.get,
	delete: Tags.deleteTag,
} as const;

export const ImagesEndpoints = {
	list: Images.list,
	get: Images.get,
	delete: Images.deleteImages,
} as const;

export const OrganizationsEndpoints = {
	list: Organizations.list,
	create: Organizations.create,
	delete: Organizations.deleteOrganization,
	listMembers: Organizations.listMembers,
	addMember: Organizations.addMember,
	removeMember: Organizations.removeMember,
	listAccessTokens: Organizations.listAccessTokens,
} as const;

export const TeamsEndpoints = {
	list: Teams.list,
	get: Teams.get,
	delete: Teams.deleteTeam,
	listMembers: Teams.listMembers,
	removeMember: Teams.removeMember,
} as const;

export const WebhooksEndpoints = {
	list: Webhooks.list,
	get: Webhooks.get,
	create: Webhooks.create,
	delete: Webhooks.deleteWebhook,
} as const;
