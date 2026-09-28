import * as ApiKeys from './api-keys';
import * as Invites from './invites';
import * as Messages from './messages';
import * as Models from './models';
import * as Organization from './organization';
import * as Users from './users';
import * as WorkspaceMembers from './workspace-members';
import * as Workspaces from './workspaces';

export const OrganizationEndpoints = {
	getOrganization: Organization.getOrganization,
};

export const UsersEndpoints = {
	listUsers: Users.listUsers,
	getUser: Users.getUser,
	updateUser: Users.updateUser,
	removeUser: Users.removeUser,
};

export const InvitesEndpoints = {
	listInvites: Invites.listInvites,
	createInvite: Invites.createInvite,
	getInvite: Invites.getInvite,
	deleteInvite: Invites.deleteInvite,
};

export const WorkspacesEndpoints = {
	listWorkspaces: Workspaces.listWorkspaces,
	createWorkspace: Workspaces.createWorkspace,
	getWorkspace: Workspaces.getWorkspace,
	updateWorkspace: Workspaces.updateWorkspace,
	archiveWorkspace: Workspaces.archiveWorkspace,
};

export const WorkspaceMembersEndpoints = {
	listWorkspaceMembers: WorkspaceMembers.listWorkspaceMembers,
	createWorkspaceMember: WorkspaceMembers.createWorkspaceMember,
	getWorkspaceMember: WorkspaceMembers.getWorkspaceMember,
	updateWorkspaceMember: WorkspaceMembers.updateWorkspaceMember,
	deleteWorkspaceMember: WorkspaceMembers.deleteWorkspaceMember,
};

export const ApiKeysEndpoints = {
	listApiKeys: ApiKeys.listApiKeys,
	getApiKey: ApiKeys.getApiKey,
	updateApiKey: ApiKeys.updateApiKey,
};

export const MessagesEndpoints = Messages.MessagesEndpoints;
export const ModelsEndpoints = Models.ModelsEndpoints;

export * from './types/index';
