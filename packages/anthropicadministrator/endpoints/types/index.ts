import type { z } from 'zod';
import {
	ApiKeySchema,
	InviteSchema,
	MessageSchema,
	ModelSchema,
	OrganizationSchema,
	UserSchema,
	WorkspaceMemberSchema,
	WorkspaceSchema,
} from './entities';
import * as inputs from './inputs';
import * as responses from './responses';

export const AnthropicAdministratorEndpointInputSchemas = {
	getOrganization: inputs.GetOrganizationInputSchema,
	listUsers: inputs.ListUsersInputSchema,
	getUser: inputs.GetUserInputSchema,
	updateUser: inputs.UpdateUserInputSchema,
	removeUser: inputs.RemoveUserInputSchema,
	listInvites: inputs.ListInvitesInputSchema,
	createInvite: inputs.CreateInviteInputSchema,
	getInvite: inputs.GetInviteInputSchema,
	deleteInvite: inputs.DeleteInviteInputSchema,
	listWorkspaces: inputs.ListWorkspacesInputSchema,
	createWorkspace: inputs.CreateWorkspaceInputSchema,
	getWorkspace: inputs.GetWorkspaceInputSchema,
	updateWorkspace: inputs.UpdateWorkspaceInputSchema,
	archiveWorkspace: inputs.ArchiveWorkspaceInputSchema,
	listWorkspaceMembers: inputs.ListWorkspaceMembersInputSchema,
	createWorkspaceMember: inputs.CreateWorkspaceMemberInputSchema,
	getWorkspaceMember: inputs.GetWorkspaceMemberInputSchema,
	updateWorkspaceMember: inputs.UpdateWorkspaceMemberInputSchema,
	deleteWorkspaceMember: inputs.DeleteWorkspaceMemberInputSchema,
	listApiKeys: inputs.ListApiKeysInputSchema,
	getApiKey: inputs.GetApiKeyInputSchema,
	updateApiKey: inputs.UpdateApiKeyInputSchema,
	createMessage: inputs.CreateMessageInputSchema,
	getModel: inputs.GetModelInputSchema,
	listModels: inputs.ListModelsInputSchema,
} as const;

export const AnthropicAdministratorEndpointOutputSchemas = {
	getOrganization: OrganizationSchema,
	listUsers: responses.ListUsersResponseSchema,
	getUser: UserSchema,
	updateUser: UserSchema,
	removeUser: inputs.RemoveUserResponseSchema,
	listInvites: responses.ListInvitesResponseSchema,
	createInvite: InviteSchema,
	getInvite: InviteSchema,
	deleteInvite: inputs.DeleteInviteResponseSchema,
	listWorkspaces: responses.ListWorkspacesResponseSchema,
	createWorkspace: WorkspaceSchema,
	getWorkspace: WorkspaceSchema,
	updateWorkspace: WorkspaceSchema,
	archiveWorkspace: WorkspaceSchema,
	listWorkspaceMembers: responses.ListWorkspaceMembersResponseSchema,
	createWorkspaceMember: WorkspaceMemberSchema,
	getWorkspaceMember: WorkspaceMemberSchema,
	updateWorkspaceMember: WorkspaceMemberSchema,
	deleteWorkspaceMember: inputs.DeleteWorkspaceMemberResponseSchema,
	listApiKeys: responses.ListApiKeysResponseSchema,
	getApiKey: ApiKeySchema,
	updateApiKey: ApiKeySchema,
	createMessage: MessageSchema,
	getModel: ModelSchema,
	listModels: responses.ListModelsResponseSchema,
} as const;

export type AnthropicAdministratorEndpointInputs = {
	[K in keyof typeof AnthropicAdministratorEndpointInputSchemas]: z.infer<
		(typeof AnthropicAdministratorEndpointInputSchemas)[K]
	>;
};

export type AnthropicAdministratorEndpointOutputs = {
	[K in keyof typeof AnthropicAdministratorEndpointOutputSchemas]: z.infer<
		(typeof AnthropicAdministratorEndpointOutputSchemas)[K]
	>;
};

export type Organization = z.infer<typeof OrganizationSchema>;
export type User = z.infer<typeof UserSchema>;
export type Invite = z.infer<typeof InviteSchema>;
export type Workspace = z.infer<typeof WorkspaceSchema>;
export type WorkspaceMember = z.infer<typeof WorkspaceMemberSchema>;
export type ApiKey = z.infer<typeof ApiKeySchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Model = z.infer<typeof ModelSchema>;

export * from './entities';
export * from './inputs';
export * from './responses';
export * from './shared';
