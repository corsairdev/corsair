import { z } from 'zod';

/**
 * Schemas mirror the Anthropic Admin API reference
 * (platform.claude.com/docs/en/api/admin). Field names match the wire format
 * (snake_case) so requests and cached rows are faithful to the API.
 *
 * Object schemas are `.loose()` because Anthropic adds fields over time and a
 * response must not fail validation for being newer than this plugin.
 */

// ── Shared ───────────────────────────────────────────────────────────────────

/** Organization roles accepted across users and invites. */
export const OrganizationRoleSchema = z.enum([
	'admin',
	'billing',
	'claude_code_user',
	'developer',
	'managed',
	'membership_admin',
	'owner',
	'primary_owner',
	'user',
]);

/** Roles assignable when updating a user or creating an invite. */
export const AssignableOrganizationRoleSchema = z.enum([
	'billing',
	'claude_code_user',
	'developer',
	'user',
	'admin',
]);

export const WorkspaceRoleSchema = z.enum([
	'workspace_admin',
	'workspace_billing',
	'workspace_developer',
	'workspace_restricted_developer',
	'workspace_user',
]);

/** Cursor pagination shared by every Admin API list endpoint. */
const paginationFields = {
	after_id: z
		.string()
		.optional()
		.describe('Cursor: return the page immediately after this object ID'),
	before_id: z
		.string()
		.optional()
		.describe('Cursor: return the page immediately before this object ID'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Items per page (1-1000, default 20)'),
};

/** Envelope returned by every list endpoint. */
function listResponse<T extends z.ZodTypeAny>(item: T) {
	return z
		.object({
			data: z.array(item),
			first_id: z.string().nullable(),
			has_more: z.boolean(),
			last_id: z.string().nullable(),
		})
		.loose();
}

// ── Entities ─────────────────────────────────────────────────────────────────

export const OrganizationSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.literal('organization'),
	})
	.loose();

export const UserSchema = z
	.object({
		id: z.string(),
		added_at: z.string(),
		email: z.string(),
		name: z.string(),
		role: OrganizationRoleSchema,
		type: z.literal('user'),
	})
	.loose();

export const InviteSchema = z
	.object({
		id: z.string(),
		accepted_at: z.string().nullable(),
		email: z.string(),
		expires_at: z.string(),
		invited_at: z.string(),
		rbac_group_ids: z.array(z.string()).optional(),
		role: OrganizationRoleSchema,
		status: z.enum(['accepted', 'deleted', 'expired', 'pending']),
		type: z.literal('invite'),
	})
	.loose();

export const WorkspaceSchema = z
	.object({
		id: z.string(),
		archived_at: z.string().nullable(),
		compartment_id: z.string().optional(),
		created_at: z.string(),
		// Nested shape varies by organization plan; kept open.
		data_residency: z.record(z.string(), z.unknown()).nullable().optional(),
		display_color: z.string().optional(),
		external_key_id: z.string().nullable().optional(),
		name: z.string(),
		tags: z.record(z.string(), z.string()).nullable().optional(),
		type: z.literal('workspace'),
	})
	.loose();

export const WorkspaceMemberSchema = z
	.object({
		type: z.literal('workspace_member'),
		user_id: z.string(),
		workspace_id: z.string(),
		workspace_role: WorkspaceRoleSchema,
	})
	.loose();

/** `{ id, type }` reference used by APIKey.created_by / APIKey.principal. */
const ActorRefSchema = z
	.object({ id: z.string(), type: z.string() })
	.loose()
	.nullable();

export const ApiKeySchema = z
	.object({
		id: z.string(),
		created_at: z.string(),
		created_by: ActorRefSchema.optional(),
		expires_at: z.string().nullable().optional(),
		name: z.string(),
		partial_key_hint: z.string().nullable().optional(),
		principal: ActorRefSchema.optional(),
		status: z.enum(['active', 'archived', 'expired', 'inactive']),
		type: z.literal('api_key'),
		workspace_id: z.string().nullable().optional(),
	})
	.loose();

// ── organization ─────────────────────────────────────────────────────────────

export const GetOrganizationInputSchema = z.object({});

// ── users ────────────────────────────────────────────────────────────────────

export const ListUsersInputSchema = z.object({
	...paginationFields,
	email: z.string().optional().describe('Filter by user email'),
	roles: z
		.array(OrganizationRoleSchema)
		.optional()
		.describe('Filter to users whose role matches any supplied value'),
});

export const GetUserInputSchema = z.object({
	user_id: z.string().min(1).max(256),
});

export const UpdateUserInputSchema = z.object({
	user_id: z.string().min(1).max(256),
	role: AssignableOrganizationRoleSchema.describe('New organization role'),
});

export const RemoveUserInputSchema = z.object({
	user_id: z.string().min(1).max(256),
});

export const RemoveUserResponseSchema = z
	.object({ id: z.string(), type: z.literal('user_deleted') })
	.loose();

// ── invites ──────────────────────────────────────────────────────────────────

export const ListInvitesInputSchema = z.object({
	...paginationFields,
	email: z.string().optional(),
	roles: z.array(OrganizationRoleSchema).optional(),
	statuses: z.array(z.enum(['accepted', 'expired', 'pending'])).optional(),
});

export const CreateInviteInputSchema = z.object({
	email: z.string().min(1).describe('Email address to invite'),
	role: AssignableOrganizationRoleSchema,
	rbac_group_ids: z.array(z.string()).optional(),
});

export const GetInviteInputSchema = z.object({
	invite_id: z.string().min(1).max(256),
});

export const DeleteInviteInputSchema = z.object({
	invite_id: z.string().min(1).max(256),
});

export const DeleteInviteResponseSchema = z
	.object({ id: z.string(), type: z.literal('invite_deleted') })
	.loose();

// ── workspaces ───────────────────────────────────────────────────────────────

export const ListWorkspacesInputSchema = z.object({
	...paginationFields,
	include_archived: z
		.boolean()
		.optional()
		.describe('Include archived workspaces in the results'),
});

export const CreateWorkspaceInputSchema = z.object({
	name: z.string().min(1).describe('Workspace name'),
	data_residency: z.record(z.string(), z.unknown()).nullable().optional(),
	external_key_id: z.string().nullable().optional(),
	tags: z.record(z.string(), z.string()).nullable().optional(),
});

export const GetWorkspaceInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
});

export const UpdateWorkspaceInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	name: z.string().optional(),
	data_residency: z.record(z.string(), z.unknown()).nullable().optional(),
	external_key_id: z.string().optional(),
	tags: z.record(z.string(), z.string()).nullable().optional(),
});

export const ArchiveWorkspaceInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
});

// ── workspace members ────────────────────────────────────────────────────────

export const ListWorkspaceMembersInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	...paginationFields,
});

export const CreateWorkspaceMemberInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	user_id: z.string().min(1).max(256),
	workspace_role: z.enum([
		'workspace_admin',
		'workspace_developer',
		'workspace_restricted_developer',
		'workspace_user',
	]),
});

export const GetWorkspaceMemberInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	user_id: z.string().min(1).max(256),
});

export const UpdateWorkspaceMemberInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	user_id: z.string().min(1).max(256),
	workspace_role: WorkspaceRoleSchema,
});

export const DeleteWorkspaceMemberInputSchema = z.object({
	workspace_id: z.string().min(1).max(256),
	user_id: z.string().min(1).max(256),
});

export const DeleteWorkspaceMemberResponseSchema = z
	.object({
		type: z.literal('workspace_member_deleted'),
		user_id: z.string(),
		workspace_id: z.string(),
	})
	.loose();

// ── api keys ─────────────────────────────────────────────────────────────────

export const ListApiKeysInputSchema = z.object({
	...paginationFields,
	created_by_user_id: z.string().optional(),
	status: z.enum(['active', 'archived', 'expired', 'inactive']).optional(),
	workspace_id: z.string().optional(),
});

export const GetApiKeyInputSchema = z.object({
	api_key_id: z.string().min(1).max(256),
});

export const UpdateApiKeyInputSchema = z.object({
	api_key_id: z.string().min(1).max(256),
	name: z.string().nullable().optional(),
	status: z.enum(['active', 'archived', 'inactive']).nullable().optional(),
});

// ── list response schemas ────────────────────────────────────────────────────

export const ListUsersResponseSchema = listResponse(UserSchema);
export const ListInvitesResponseSchema = listResponse(InviteSchema);
export const ListWorkspacesResponseSchema = listResponse(WorkspaceSchema);
export const ListWorkspaceMembersResponseSchema = listResponse(
	WorkspaceMemberSchema,
);
export const ListApiKeysResponseSchema = listResponse(ApiKeySchema);

// ── input / output maps ──────────────────────────────────────────────────────

export const AnthropicAdministratorEndpointInputSchemas = {
	getOrganization: GetOrganizationInputSchema,
	listUsers: ListUsersInputSchema,
	getUser: GetUserInputSchema,
	updateUser: UpdateUserInputSchema,
	removeUser: RemoveUserInputSchema,
	listInvites: ListInvitesInputSchema,
	createInvite: CreateInviteInputSchema,
	getInvite: GetInviteInputSchema,
	deleteInvite: DeleteInviteInputSchema,
	listWorkspaces: ListWorkspacesInputSchema,
	createWorkspace: CreateWorkspaceInputSchema,
	getWorkspace: GetWorkspaceInputSchema,
	updateWorkspace: UpdateWorkspaceInputSchema,
	archiveWorkspace: ArchiveWorkspaceInputSchema,
	listWorkspaceMembers: ListWorkspaceMembersInputSchema,
	createWorkspaceMember: CreateWorkspaceMemberInputSchema,
	getWorkspaceMember: GetWorkspaceMemberInputSchema,
	updateWorkspaceMember: UpdateWorkspaceMemberInputSchema,
	deleteWorkspaceMember: DeleteWorkspaceMemberInputSchema,
	listApiKeys: ListApiKeysInputSchema,
	getApiKey: GetApiKeyInputSchema,
	updateApiKey: UpdateApiKeyInputSchema,
} as const;

export const AnthropicAdministratorEndpointOutputSchemas = {
	getOrganization: OrganizationSchema,
	listUsers: ListUsersResponseSchema,
	getUser: UserSchema,
	updateUser: UserSchema,
	removeUser: RemoveUserResponseSchema,
	listInvites: ListInvitesResponseSchema,
	createInvite: InviteSchema,
	getInvite: InviteSchema,
	deleteInvite: DeleteInviteResponseSchema,
	listWorkspaces: ListWorkspacesResponseSchema,
	createWorkspace: WorkspaceSchema,
	getWorkspace: WorkspaceSchema,
	updateWorkspace: WorkspaceSchema,
	archiveWorkspace: WorkspaceSchema,
	listWorkspaceMembers: ListWorkspaceMembersResponseSchema,
	createWorkspaceMember: WorkspaceMemberSchema,
	getWorkspaceMember: WorkspaceMemberSchema,
	updateWorkspaceMember: WorkspaceMemberSchema,
	deleteWorkspaceMember: DeleteWorkspaceMemberResponseSchema,
	listApiKeys: ListApiKeysResponseSchema,
	getApiKey: ApiKeySchema,
	updateApiKey: ApiKeySchema,
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
